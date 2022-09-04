import { define, ID } from './define'
import { from } from './from'

export enum types {
  route = 'route',
}
export type RouteValue = types | Schema
export type Schema = { [key: string]: RouteValue }

export type Route = (id?: ID) => StringifiableRoute
export type Subroute<T> = {
  (id?: ID): T & StringifiableRoute
}

export type Notation = 'kebab-case' | 'camelCase' | 'snake_case'
export type Config = {
  notation: Notation
}

type StringifiableRoute = {
  // _: () => string;
  _: string
  toString: () => string
}

export const builder = {
  define,
  from,
}
