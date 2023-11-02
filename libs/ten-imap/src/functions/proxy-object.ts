function isFunction(value: any): value is (...args: any) => any {
  return typeof value === 'function'
}

function getReturnValue(this: any, fn: (...args: any) => any, ...args: Parameters<typeof fn>) {
  let returnValue = fn.call(this, ...args)
  const isPromise = returnValue && typeof returnValue.then === 'function' && returnValue[Symbol.toStringTag] === 'Promise'

  return {
    returnValue,
    isPromise,
  } as {
    returnValue: ReturnType<typeof fn>
    isPromise: false
  } | {
    returnValue: Promise<Awaited<ReturnType<typeof fn>>>
    isPromise: true
  }
}

function createProxyPromiseFunction(fn: () => Promise<any>): any {
  return new Proxy(fn, {
    apply(_fn, thisArg, argArray: any[]) {
      // @ts-ignore
      return createProxyPromise(_fn.call(thisArg, ...argArray))
    }
  })
}

function createProxyPromise(promise: Promise<any>): any {
  return new Proxy(promise, {
    get(_promise, chainPropName) {
      if (chainPropName === 'then') return _promise[chainPropName].bind(_promise)

      const fn = async function(...args: any[]) {
        const awaited = await _promise
        const prop = awaited[chainPropName]
        if (!isFunction(prop)) return prop

        const result = getReturnValue.call(awaited, prop, ...args)
        return result.isPromise ? createProxyPromise(result.returnValue) : result.returnValue
      }

      return createProxyPromiseFunction(fn)
    }
  })
}

export function createProxyObject(instance: object) {
  return new Proxy(instance, {
    get(target, propName: keyof typeof instance): any {
      const prop = target[propName]
      if (!isFunction(prop)) return prop

      return (...args: Parameters<typeof prop>[]) => {
        const result = getReturnValue.call(target, prop, ...args)
        return result.isPromise ? createProxyPromise(result.returnValue) : result.returnValue
      }
    },
  })
}
