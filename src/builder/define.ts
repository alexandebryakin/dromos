import { Config, Notation } from './builder'
import { kebabize } from './notation/kebabize'
import { snakecasize } from './notation/snakecasize'

type ICallable = (id?: ID) => string
type ICallableResult = ICallable | string
export type CallableFn = {
  (id?: ID): CallableFn | ICallableResult
  [key: string]: CallableFn | ICallableResult
}

export type RouteBuilder<DefineRoutesResult> = {
  structs: Struct<DefineRoutesResult>[]
  define: FnResourcesDefiner<DefineRoutesResult>
}

export type ID = string | number

type FnDefiner = <DefineRoutesResult>(root: RouteBuilder<DefineRoutesResult>) => void

type ResourcesOptions = {
  notation?: Notation
}
type Struct<DefineRoutesResult> = {
  name: string
  options: ResourcesOptions
  subbuilder: RouteBuilder<DefineRoutesResult> | null
}

type FnSubroutesBuilderFn<DefineRoutesResult> = (
  subroutesBuilder: (builder: RouteBuilder<DefineRoutesResult>) => void,
) => void
type FnResourcesDefinerResult<DefineRoutesResult> = {
  subroutes: FnSubroutesBuilderFn<DefineRoutesResult>
}
type FnResourcesDefiner<DefineRoutesResult> = (
  name: string,
  options?: ResourcesOptions,
) => FnResourcesDefinerResult<DefineRoutesResult>

const nonEmpty = (val: unknown) => !!val

const TO_STRING_ALIAS = '_'
const LEADING_FORWARD_SLASH = '/'

const _makeStringifiable = (f: ICallable): CallableFn => {
  const toString = () => LEADING_FORWARD_SLASH + f()
  // @ts-expect-error
  const result: CallableFn = f
  result.toString = toString
  result[TO_STRING_ALIAS] = toString()
  return result
}

type FnTransformer = (str: string) => string
const _transformName = (name: string, options: ResourcesOptions, config: Config) => {
  const notation = options.notation || config.notation

  const transform: FnTransformer = {
    'kebab-case': kebabize,
    snake_case: snakecasize,
    camelCase: (str: string) => str,
  }[notation]

  return transform(name)
}

const _buildSubroute = <DefineRoutesResult>(
  name: Struct<DefineRoutesResult>['name'],
  options: Struct<DefineRoutesResult>['options'],
  subbuilder: Struct<DefineRoutesResult>['subbuilder'],
  config: Config,
  prefix = '',
): CallableFn => {
  const result = (id?: string) => {
    const f = _makeStringifiable(() => {
      return [prefix, _transformName(name, options, config), id].filter(nonEmpty).join('/')
    })

    ;(subbuilder?.structs || []).forEach((struct) => {
      const rootPrefix = f().toString()

      const sub: CallableFn = _buildSubroute(struct.name, struct.options, struct.subbuilder, config, rootPrefix)

      f[struct.name] = sub
    })

    return f
  }

  return result as CallableFn
}

const _convertStructsToRoutes = <DefineRoutesResult>(
  structs: Struct<DefineRoutesResult>[],
  config: Config,
): DefineRoutesResult => {
  const result: { [key: string]: CallableFn } = {}
  structs.forEach((struct) => {
    result[struct.name] = _buildSubroute(struct.name, struct.options, struct.subbuilder, config)
  })

  return result as unknown as DefineRoutesResult
}

const _getBuilder = <DefineRoutesResult>(): RouteBuilder<DefineRoutesResult> => {
  const structs: Struct<DefineRoutesResult>[] = []

  const define: FnResourcesDefiner<DefineRoutesResult> = (name, options: ResourcesOptions = {}) => {
    const struct: Struct<DefineRoutesResult> = {
      name,
      options,
      subbuilder: null,
    }
    structs.push(struct)

    const result: FnResourcesDefinerResult<DefineRoutesResult> = {
      subroutes: (subroutesBuilder) => {
        const subbuilder = _getBuilder<DefineRoutesResult>()
        subroutesBuilder(subbuilder)
        struct.subbuilder = subbuilder
      },
    }

    return result
  }

  return {
    define,
    structs,
  }
}

export const defaultConfig: Config = {
  notation: 'camelCase',
}

export function define<DefineRoutesResult>(definer: FnDefiner, config: Config = defaultConfig): DefineRoutesResult {
  const builder = _getBuilder<DefineRoutesResult>()

  definer(builder)

  return _convertStructsToRoutes<DefineRoutesResult>(builder.structs, config)
}
