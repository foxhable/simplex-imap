import { createProxyObject } from './proxy-object.js'

const { describe, expect, test, afterEach } = require('@jest/globals')

const innerValue = 'Hello'
const initPrivateField = 'Private Hello'

class SomeClassWithAsyncMethods {
  name
  age

  constructor({ name, age }: { name: string, age: number }) {
    this.name = name
    this.age = age
  }

  _privateField = initPrivateField

  get privateField() {
    return this._privateField
  }

  set privateField(value) {
    this._privateField = value
  }

  async login() {
    return this
  }

  async list() {
    const list = this.name.split('')

    return {
      innerValue,
      _innerPrivateField: initPrivateField,
      get innerPrivateField() {
        return this._innerPrivateField
      },
      set innerPrivateField(value) {
        this._innerPrivateField = value
      },
      async get(index: number) {
        return list[index]
      },
    }
  }
}

const name = 'Vasily', age = 23
const _instance = new SomeClassWithAsyncMethods({ name, age })
const instance = createProxyObject(_instance) as any

describe('Proxy object', () => {
  describe('login method', () => {
    test('Should return fn', () => {
      const fn = instance.login
      expect(fn).toBeInstanceOf(Function)
    })

    test('Should call fn', () => {
      const fn = jest.fn(instance.login)
      fn()
      expect(fn).toBeCalled()
    })

    test('Should return Promise', () => {
      const value = instance.login()
      expect(value).toBeInstanceOf(Promise)
    })

    test('Should return "SomeClassWithAsyncMethods" from promise', async () => {
      const value = await instance.login()
      expect(value).toBeInstanceOf(SomeClassWithAsyncMethods)
    })
  })

  describe('login().list method', () => {
    test('Should return fn', async () => {
      const fn = instance.login().list
      expect(fn).toBeInstanceOf(Function)
    })

    test('Should call fn', async () => {
      const fn = jest.fn(instance.login().list)
      fn()
      expect(fn).toBeCalled()
    })

    test('Should return Promise', () => {
      const value = instance.login().list()
      expect(value).toBeInstanceOf(Promise)
    })

    test('Should contain "get" method in object from Promise', async () => {
      const value = await instance.login().list()
      expect(value).toHaveProperty('get')
    })
  })

  describe('login().list().get method', () => {
    test('Should return fn', async () => {
      const fn = instance.login().list().get
      expect(fn).toBeInstanceOf(Function)
    })

    test('Should call fn', async () => {
      const fn = jest.fn(instance.login().list().get)
      fn()
      expect(fn).toBeCalled()
    })

    test('Should return Promise', () => {
      const value = instance.login().list().get()
      expect(value).toBeInstanceOf(Promise)
    })

    test('Should return second letter of field "name"', async () => {
      const value = await instance.login().list().get(1)
      expect(value).toBe(name[1])
    })
  })

  describe('Object fields', () => {
    test('Should return value of field "name"', () => {
      const value = instance.name
      expect(value).toBe(name)
    })

    test('Should return value of field "age"', () => {
      const value = instance.age
      expect(value).toBe(age)
    })

    test('Should return Promise after calling "login().name"', () => {
      const value = instance.login().name
      expect(value).toBeInstanceOf(Promise)
    })

    test('Should return value of field "login().name" from Promise', async () => {
      const value = await instance.login().name
      expect(value).toBe(name)
    })

    test('Should return value of field "login().list().innerValue"', async () => {
      const value = await instance.login().list.innerValue
      expect(value).toBe(innerValue)
    })
  })

  describe('Getters and Setters', () => {
    test('Should get init value of field "_privateField" by getter', () => {
      const value = instance.privateField
      expect(value).toBe(initPrivateField)
    })

    test('Should return init value by getter "login().privateField"', async () => {
      const value = await instance.login().privateField
      expect(value).toBe(initPrivateField)
    })


    test('Should set value of field "_privateField" by setter', () => {
      const newValue = 'New private value'
      instance.privateField = newValue
      expect(instance.privateField).toBe(newValue)
    })

    test('Should set value of field by setter "login().privateField"', async () => {
      const newValue = 'New private value'
      const object = await instance.login()
      object.privateField = newValue
      expect(await instance.login().privateField).toBe(newValue)
      expect(instance.privateField).toBe(newValue)
    })

    test('Should return init value of field by getter "login().list().innerPrivateField"', async () => {
      const value = await instance.login().list().innerPrivateField
      expect(value).toBe(initPrivateField)
    })

    test('Should set value of field by setter "login().list().innerPrivateField"', async () => {
      const newValue = 'New private value'
      const list = await instance.login().list()
      list.innerPrivateField = newValue
      expect(await instance.login().list().innerPrivateField).toBe(newValue)
    })
  })
})