export * from './builder'
export * from './utils'

// type CallableRoute<T = StringifiableRoute> = CallableRouteBase<T>; //& StringifiableRoute;

// users/:uid/properties/:pid
// users/:uid/friends/:fid
// profile
// type Routes = {
//   profile: CallableRoute;
//   users: CallableRoute<{
//     properties: CallableRoute;
//   }>;
// };

// [API]:
// import { builder, utils } from 'dromos'
// builder.define();
// builder.from(schema);

// [TERMS]:
// - schema
// - frame
// - definition

// _routesFromConfig.profile()._;
// _routesFromConfig.users().properties()._;

// const patterns = definePatterns<Routes>()
// patterns.users(':userId').properties(':propertyId')._parse(window.location.pathname)
