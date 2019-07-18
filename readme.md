# Note: This API Service is not intended to offer login/registration endpoints.

In fact there are no endpoints, This service is a pure websocket implementation.

### In order to register or login a 3rd party service must be setup.

When a user login/register event occurs, the 3rd party service should generate a JWT token and return it to the user, at which point the user will authenticate their initial websocket connection using that token.

# Folder Structure
```yaml
/src # project source files
    /@classes # classes & reusables
    /@models # object models/schema
    /@services # project source services ( database, email, push, etc )
    /@views # view definition classes
    main.ts # project root
/config
    default.json # default config file
    /env # environment config (env files are merged with default on build)
        development.json
        production.json
readme.md # this file
package.json # node package sources
rollup.config.js # build compiler (rollupjs) config
tsconfig.json # typescript config
```

Running `npm start` builds `/bundle.js` in project root.
