type IMAPMethodAnyState = 'CAPABILITY' | 'NOOP' | 'LOGOUT'
type IMAPMethodWithoutAuthState = 'STARTTLS' | 'AUTHENTICATE' | 'LOGIN'
type IMAPMethodWithAuthState =
  | 'SELECT'
  | 'EXAMINE'
  | 'CREATE'
  | 'DELETE'
  | 'RENAME'
  | 'SUBSCRIBE'
  | 'UNSUBSCRIBE'
  | 'LIST'
  | 'LSUB'
  | 'STATUS'

type IMAPMethodSelectedState = 'CHECK' | 'CLOSE' | 'EXPUNGE' | 'SEARCH' | 'FETCH' | 'STORE' | 'COPY' | 'UID'

export type IMAPMethod =
  | IMAPMethodAnyState
  | IMAPMethodWithoutAuthState
  | IMAPMethodWithAuthState
  | IMAPMethodSelectedState

type MethodArguments = {
  [index: string]: string
}

type CreateMethod<TMethod extends IMAPMethod, TArgs extends MethodArguments | null = null> = {
  method: TMethod
  args: TArgs
}

type MethodsMap = [
  CreateMethod<'CAPABILITY'>,
  CreateMethod<'NOOP'>,
  CreateMethod<'LOGOUT'>,
  CreateMethod<'STARTTLS'>,
  CreateMethod<'AUTHENTICATE', { authMethod: string }>,
  CreateMethod<'LOGIN', { username: string, password: string }>,
  CreateMethod<'SELECT', { mailbox: string }>,
  CreateMethod<'EXAMINE', { mailbox: string }>,
  CreateMethod<'DELETE', { mailbox: string }>,
  CreateMethod<'DELETE', { mailbox: string }>,
  CreateMethod<'RENAME', { mailbox: string, newName: string }>,
  CreateMethod<'SUBSCRIBE', { mailbox: string }>,
  CreateMethod<'UNSUBSCRIBE', { mailbox: string }>,
  CreateMethod<'LIST', { refName: string, mailbox: string }>,
  CreateMethod<'LSUB', { refName: string, mailbox: string }>,
  CreateMethod<'STATUS', { mailbox: string, status: string }>,
  CreateMethod<'STARTTLS'>,
  CreateMethod<'CLOSE'>,
  CreateMethod<'EXPUNGE'>,
  CreateMethod<'SEARCH', { spec?: string, criteria: string }>,
  CreateMethod<'FETCH', { sequenceSet: string, criteria: string }>,
  CreateMethod<'STORE', { sequenceSet: string, criteria: string }>,
  CreateMethod<'COPY', { sequenceSet: string, mailbox: string }>,
  CreateMethod<'UID', { command: string, args: string }>,
]

export type ExtractMethodArgs<TMethod extends IMAPMethod> = Extract<MethodsMap[number], { method: TMethod }>['args']