import { Config, RouteValue, Schema } from './builder'
import { defaultConfig, define, RouteBuilder } from './define'

const _defineSubroutes = <DefineRoutesResult>(
  subroutesBuilder: RouteBuilder<DefineRoutesResult>,
  subroutesSchema: Schema,
) => {
  Object.entries(subroutesSchema).forEach(([routeName, routeValue]) => {
    _handleSubroutes(routeName, routeValue, subroutesBuilder)
  })
}

const _handleSubroutes = <DefineRoutesResult>(
  routeName: string,
  routeValue: RouteValue,
  subroutesBuilder: RouteBuilder<DefineRoutesResult>,
) => {
  const callbacks = subroutesBuilder.define(routeName)

  if (typeof routeValue === 'object') {
    callbacks.subroutes((subroutesBuilder) => {
      _defineSubroutes(subroutesBuilder, routeValue)
    })
  }
}

export function from<DefineRoutesResult>(schema: Schema = {}, config: Config = defaultConfig): DefineRoutesResult {
  return define<DefineRoutesResult>((root) => {
    _defineSubroutes(root, schema)
  }, config)
}
