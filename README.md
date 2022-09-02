# dromos

A lib that allows to define and build routes eloquently

## Installing

Using npm:

```bash
$ npm install dromos
```

Using yarn:

```bash
$ yarn add dromos
```

# Usage

## builder.define

**Define your routes**

```ts
import { builder, Route, Subroute } from 'dromos'

type Routes = {
  profile: Route
  users: Subroute<{
    friends: Route
    properties: Subroute<{
      hotels: Route
      houses: Route
    }>
  }>
  settings: Subroute<{
    general: Route
    password: Route
  }>
}

export const routes = builder.define<Routes>((root) => {
  root.define('profile')

  root.define('users').subroutes((users) => {
    users.define('friends')
    users.define('properties').subroutes((properties) => {
      properties.define('hotels')
      properties.define('houses')
    })
  })

  root.define('settings').subroutes((settings) => {
    settings.define('general')
    settings.define('password')
  })
})
```

and use it:

```ts
routes.profile()._ // → → 'profile'

routes.users()._ // → 'users'
routes.users(123)._ // → 'users/123'
routes.users('abc-def')._ // → 'users/abc-def'

routes.users().properties()._ // → 'users/properties'
routes.users().properties('p1')._ // → 'users/properties/p1'
routes.users('u1').properties('p1')._ // → 'users/u1/properties/p1'
routes.users('u1').properties('p1').hotels()._ // → 'users/u1/properties/p1/hotels'
routes.users('u1').properties('p1').houses()._ // → 'users/u1/properties/p1/houses'

routes.users().friends()._ // → 'users/friends'
routes.users().friends('f1')._ // → 'users/friends/f1'
routes.users('u1').friends('f1')._ // → 'users/u1/friends/f1'

routes.settings().general()._ // → 'settings/general'
routes.settings().password()._ // → 'settings/password'
```

## Config

## config.notation

allows to specify the notation that will be used to generate pathnames

| Values         |         | Implementation Status |
| -------------- | ------- | --------------------- |
| **camelCase**  | default | available             |
| **kebab-case** |         | available             |
| **snake_case** |         | TODO                  |

**Example**

```ts
import { builder, Config, Route, Subroute } from 'dromos'

const config: Config = {
  notation: 'kebab-case',
}

type Routes = {
  mainPath: Subroute<{
    subPath: Route
    anotherSubPath: Route
  }>
}

export const routes = builder.define<Routes>((root) => {
  root.define('mainPath').subroutes((mainPath) => {
    mainPath.define('subPath')
    mainPath.define('anotherSubPath')
  })
}, config)

// [Usage]:
routes.mainPath()._ // → 'main-path'
routes.mainPath().subPath()._ // → 'main-path/sub-path'
routes.mainPath().anotherSubPath()._ // → 'main-path/another-sub-path'
```

## Options

## options.notation

allows to override global `config.notation`

**Example**

```ts
import { builder, Config, Route, Subroute } from 'dromos'

const config: Config = {
  notation: 'kebab-case',
}

type Routes = {
  mainPath: Subroute<{
    subPath: Subroute<{
      innerSubPath: Route
    }>
  }>
}

export const routes = builder.define<Routes>((root) => {
  root.define('mainPath').subroutes((mainPath) => {
    mainPath.define('subPath', { notation: 'camelCase' }).subroutes((subPath) => {
      subPath.define('innerSubPath')
    })
  })
}, config)

// [Usage]:
routes.mainPath()._ // → 'main-path'
routes.mainPath().subPath()._ // → 'main-path/subPath'
routes.mainPath().subPath().innerSubPath()._ // → 'main-path/subPath/inner-sub-path'
```

## builder.from

allows to define routes from an Object schema

**Define your routes**

```ts
import { builder, Schema, Route, Subroute } from 'dromos'

const config: Config = {
  notation: 'kebab-case',
}

type Routes = {
  profile: Route
  users: Subroute<{
    friends: Route
    properties: Subroute<{
      hotels: Route
      houses: Route
    }>
  }>
  settings: Subroute<{
    general: Route
    password: Route
  }>
}

const schema: Schema = {
  profile: types.route,
  users: {
    friends: types.route,
    properties: {
      hotels: types.route,
      houses: types.route,
    },
  },
  settings: {
    general: types.route,
    password: types.route,
  },
}

const routes = builder.from<Routes>(schema, config)

// [Usage]:
routes.profile()._ // → → 'profile'

routes.users()._ // → 'users'
routes.users('u1').properties('p1').hotels()._ // → 'users/u1/properties/p1/hotels'
routes.users('u1').properties('p1').houses()._ // → 'users/u1/properties/p1/houses'

routes.settings().general()._ // → 'settings/general'
routes.settings().password()._ // → 'settings/password'
```

## Future Plans

→ Add a helper to generate all the paths from defined `routes`

→ Include options into schema definition:
Possible example:

```ts
const schema: Schema = {
  profile: types.route,
  users: {
    __options: {
      notation: 'kebab-case',
    },
    properties: {
      hotels: types.route,
      houses: types.route,
    },
  },
}
```
