import { builder, Config, Route, Subroute } from '../src/'

describe('builder', () => {
  describe('basic usage', () => {
    const config: Config = {
      notation: 'camelCase',
    }

    type Routes = {
      profile: Route
      users: Subroute<{
        properties: Subroute<{
          else: Route
        }>
        friends: Route
        kebabCase: Subroute<{
          someOtherThing: Route
        }>
      }>
      settings: Subroute<{
        general: Route
        password: Route
      }>
    }

    const routes = builder.define<Routes>((root) => {
      root.define('profile')

      root.define('users').subroutes((users) => {
        users.define('properties').subroutes((smthelse) => {
          smthelse.define('else')
        })

        users.define('friends')

        users.define('kebabCase', { notation: 'kebab-case' }).subroutes((kebabCase) => {
          kebabCase.define('someOtherThing')
        })
      })

      root.define('settings').subroutes((settings) => {
        settings.define('general')
        settings.define('password')
      })
    }, config)

    it('bulds paths properly', () => {
      expect(routes.profile()._).toBe('/profile')

      expect(routes.users()._).toBe('/users')
      expect(routes.users(123)._).toBe('/users/123')
      expect(routes.users('abc-def')._).toBe('/users/abc-def')

      expect(routes.users().properties()._).toBe('/users/properties')
      expect(routes.users().properties('p1')._).toBe('/users/properties/p1')
      expect(routes.users('u1').properties('p1')._).toBe('/users/u1/properties/p1')

      expect(routes.users('u1').properties('p1').else()._).toBe('/users/u1/properties/p1/else')

      expect(routes.users().friends()._).toBe('/users/friends')
      expect(routes.users().friends('f1')._).toBe('/users/friends/f1')
      expect(routes.users('u1').friends('f1')._).toBe('/users/u1/friends/f1')

      expect(routes.settings().general()._).toBe('/settings/general')
      expect(routes.settings().password()._).toBe('/settings/password')
    })
  })

  describe('config.notation: camelCase', () => {
    const config: Config = {
      notation: 'camelCase',
    }

    type Routes = {
      generalSettings: Subroute<{
        editEmail: Route
        changePassword: Route
      }>
    }

    const routes = builder.define<Routes>((root) => {
      root.define('generalSettings').subroutes((generalSettings) => {
        generalSettings.define('editEmail')
        generalSettings.define('changePassword')
      })
    }, config)

    it('builds paths in camelCase', () => {
      expect(routes.generalSettings()._).toBe('/generalSettings')
      expect(routes.generalSettings().editEmail()._).toBe('/generalSettings/editEmail')
      expect(routes.generalSettings().changePassword()._).toBe('/generalSettings/changePassword')
    })
  })

  describe('config.notation: kebab-case', () => {
    const config: Config = {
      notation: 'kebab-case',
    }

    type Routes = {
      generalSettings: Subroute<{
        editEmail: Route
        changePassword: Route
      }>
    }

    const routes = builder.define<Routes>((root) => {
      root.define('generalSettings').subroutes((profile) => {
        profile.define('editEmail')
        profile.define('changePassword')
      })
    }, config)

    it('builds paths in camelCase', () => {
      expect(routes.generalSettings()._).toBe('/general-settings')
      expect(routes.generalSettings().editEmail()._).toBe('/general-settings/edit-email')
      expect(routes.generalSettings().changePassword()._).toBe('/general-settings/change-password')
    })
  })

  describe('config.notation: snake_case', () => {
    const config: Config = {
      notation: 'snake_case',
    }

    type Routes = {
      generalSettings: Subroute<{
        editEmail: Route
        changePassword: Route
      }>
    }

    const routes = builder.define<Routes>((root) => {
      root.define('generalSettings').subroutes((profile) => {
        profile.define('editEmail')
        profile.define('changePassword')
      })
    }, config)

    it('builds paths in snake_case', () => {
      expect(routes.generalSettings()._).toBe('/general_settings')
      expect(routes.generalSettings().editEmail()._).toBe('/general_settings/edit_email')
      expect(routes.generalSettings().changePassword()._).toBe('/general_settings/change_password')
    })
  })

  describe('config.notation combined with options.notation', () => {
    const config: Config = {
      notation: 'camelCase',
    }

    type Routes = {
      generalSettings: Subroute<{
        editEmail: Subroute<{
          primaryEmail: Route
        }>
        changePassword: Subroute<{
          oneThing: Route
          anotherThing: Route
        }>
      }>
    }

    const routes = builder.define<Routes>((root) => {
      root.define('generalSettings').subroutes((profile) => {
        profile.define('editEmail', { notation: 'kebab-case' }).subroutes((editEmail) => {
          editEmail.define('primaryEmail')
        })
        profile.define('changePassword').subroutes((changePassword) => {
          changePassword.define('oneThing', { notation: 'kebab-case' })
          changePassword.define('anotherThing', { notation: 'snake_case' })
        })
      })
    }, config)

    it('builds paths in camelCase', () => {
      expect(routes.generalSettings()._).toBe('/generalSettings')

      expect(routes.generalSettings().editEmail()._).toBe('/generalSettings/edit-email')
      expect(routes.generalSettings().editEmail().primaryEmail()._).toBe('/generalSettings/edit-email/primaryEmail')

      expect(routes.generalSettings().changePassword()._).toBe('/generalSettings/changePassword')
      expect(routes.generalSettings().changePassword().oneThing()._).toBe('/generalSettings/changePassword/one-thing')
      expect(routes.generalSettings().changePassword().anotherThing()._).toBe(
        '/generalSettings/changePassword/another_thing',
      )
    })
  })
})
