<img align="left" src="https://github.com/wednesday-solutions/nodejs-hapi-template/blob/main/nodejs_hapi_template_github.svg" width="480" height="560" />

<div>
  <a href="https://www.wednesday.is/?utm_source=github&utm_medium=nodejs-hapi-template" align="left" style="margin-left: 0;">
    <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f5879492fafecdb3e5b0e75_wednesday_logo.svg">
  </a>
  <p>
    <h1 align="left">Node Hapi Template
    </h1>
  </p>

  <p>
An enterprise Hapi template application built using Nodejs showcasing - Testing Strategies, DB seeding & migrations, integration with an ORM, containerization using Docker, REST Apis, a middleware for authorization, redis caching, rate limited endpoints, paginated endpoints, and directory based routing
  </p>

---

  <p>
    <h4>
      Expert teams of digital product strategists, developers, and designers.
    </h4>
  </p>

  <div>
    <a href="https://www.wednesday.is/contact-us/?utm_source=github&utm_medium=nodejs-hapi-template" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88b9005f9ed382fb2a5_button_get_in_touch.svg" width="121" height="34">
    </a>
    <a href="https://github.com/wednesday-solutions/" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88bb1958c3253756c39_button_follow_on_github.svg" width="168" height="34">
    </a>
  </div>

---

<span>We’re always looking for people who value their work, so come and join us. <a href="https://www.wednesday.is/hiring">We are hiring!</a></span>

</div>

![Nodejs Hapi Template](https://github.com/wednesday-solutions/node-js-hapi-template/workflows/Nodejs%20Hapi%20Template/badge.svg)

<div>
<img src='./badges/badge-statements.svg' height="20"/>
<img src='./badges/badge-branches.svg' height="20"/>
</div>
<div>
<img src='./badges/badge-lines.svg'  height="20"/>
<img src='./badges/badge-functions.svg' height="20"/>
</div>

---

## Out of the box support for

-   Dockerization
-   Authorization middleware
-   Redis Cache
-   Rate Limited endpoints
-   Paginated endpoints
-   Swagger UI
-   Support for directory based routing
-   Simplified support for migrations and seeders using sequelize
-   DAO layer for all database interactions
-   Tests using jest

## Setup and Configuration.

### Pre-requisites

-   node
-   docker
-   docker-compose
-   mysql
-   redis

### Installation

-   Install dependencies using yarn
    - `npm install -g yarn`
    -   `yarn install`

### Setup

-   Run `./scripts/setup-local.sh`
-   This will seed the data in mysql and run the server.
-   Server will start on `http://localhost:9000`


### Routing 

All routes are organized under the `lib/routes` folder. Any subfolder inside `lib/routes` can contain route files (e.g., `routes.js`).

Routes are automatically loaded using the `loadRoutes` plugin:

```js
await loadRoutes.register(server, {
  routes: '**/routes.js',               // finds all routes.js files recursively
  cwd: path.resolve(process.cwd(), 'lib/routes'), // base folder for scanning
  log: true,
  ignore: '**/routes.test.js'           // ignores test files
});

```

The plugin scans the folder structure, finds all matching route files, and registers them with Hapi using server.route(). Each route file should export either a single route object or an array of route objects.

### Database Seeding

The application uses seeders to populate initial OAuth clients, scopes, resources, and users. After running migrations, seeders are executed in order:

1. **01_oauth_clients.js** - Creates test OAuth2 clients (TEST_CLIENT_ID_0 through TEST_CLIENT_ID_4 with secret TEST_CLIENT_SECRET)
2. **02_users.js** - Creates test users 
3. **03_oauth_client_resources.js** - Associates resources with clients 
4. **04_oauth_client_scopes.js** - Associates scopes (USER, ADMIN, SUPER_ADMIN, INTERNAL_SERVICE) with clients 
5. **05_oauth_access_token.js** - Pre-seeds sample access tokens

**Important:** Ensure both `oauth_client_scopes` and `oauth_client_resources` have data for each client, otherwise token creation will fail. The seeders handle this automatically.

**Manual seeding (if needed):**
```bash
ENVIRONMENT_NAME=local npx sequelize db:seed:all
```

**To re-seed from scratch:**
```bash
ENVIRONMENT_NAME=local npx sequelize db:drop
ENVIRONMENT_NAME=local npx sequelize db:create
ENVIRONMENT_NAME=local npx sequelize db:migrate
npx sequelize db:seed:all
```


### Public URL/API
- When you do auth: false in options passing to routes array it'll not check the auth token

### Auto Generate models from database

-   Automatically generate bare sequelize models from your database.
    `https://github.com/sequelize/sequelize-auto`

Example:
`sequelize-auto -o "./models" -d temp_dev -h localhost -u root -p 3306 -x password -e mysql`

### Sequelize

[Sequelize](https://sequelize.readthedocs.io/en/latest/) is a promise-based ORM for Node.js. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.

Install Sequelize:

-   `npm install -g sequelize-cli`

Full documentation: https://sequelize.readthedocs.io/en/latest/

## Authentication & Authorization (OAuth2 Client Credentials)

This application uses OAuth2 Client Credentials flow for authentication. All protected API endpoints require a valid Bearer token.

### Getting an Access Token

**Step 1: Request a token using client credentials**
```bash
curl -i -X POST http://localhost:9000/oauth2/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type":"CLIENT_CREDENTIALS",
    "client_id":"TEST_CLIENT_ID_0",
    "client_secret":"TEST_CLIENT_SECRET"
  }'
```

**Response:** JSON object with `accessToken` field (opaque string valid for ~12 hours)

**Step 2: Use the token to call protected endpoints**
```bash
TOKEN="<access_token_from_step_1>"
curl -i -H "Authorization: Bearer $TOKEN" http://localhost:9000/users?page=1&limit=10
```

### How Authentication Works

1. **Token Request** (POST /oauth2/tokens):
   - Validates `client_id` and `client_secret` against `oauth_clients` table
   - Fetches client metadata (scopes and resources) from `oauth_client_scopes` and `oauth_client_resources`
   - Creates and stores an access token in `oauth_access_tokens` with expiry
   - Returns the token to client

2. **Protected Endpoint Access**:
   - Client sends `Authorization: Bearer <token>` header
   - Hapi bearer-auth middleware intercepts and extracts token
   - `config/auth.js` validates function:
     - Looks up token in DB and checks expiry
     - Validates token's scopes/permissions for the requested route via `validateScopeForRoute`
     - Updates token TTL (sliding window: extends expiry by 1 day with each request)
   - If valid → route handler executes; if invalid → 401 Unauthorized

### Architecture Overview

**Database Layer** (`lib/daos/` and `lib/models/`):
- Sequelize ORM models for `users`, `oauth_clients`, `oauth_client_scopes`, `oauth_client_resources`, `oauth_access_tokens`
- DAO pattern for clean data access: `userDao.js`, `oauthClientsDao.js`, `oauthAccessTokensDao.js`, etc.
- All queries abstracted behind DAO functions; routes call DAOs, not models directly

**Redis Caching** (`utils/cacheConstants.js` and `utils/cacheMethods.js`):
- Catbox Redis provider configured in `lib/testServer.js` and `server.js`
- Server methods (e.g., `findOneUser`) cached with TTL (1 month by default)
- Cache key invalidation available via reset-cache endpoints

**Swagger Documentation** (`server.js`):
- Registered via `hapi-swaggerui` plugin with `inert` and `vision`
- UI available at `http://localhost:9000/documentation`
- All routes tagged with API categories for Swagger grouping
- Templates served from `node_modules/hapi-swaggerui/templates`

**Routing** (`plugins/loadRoutes.js` and `lib/routes/`):
- Directory-based auto-routing: files under `lib/routes/` are auto-discovered and prefixed
- Example: `lib/routes/oauth2/tokens/routes.js` → POST /oauth2/tokens
- Each route exports an array of route objects with handler, method, options, etc. 

**Middleware & Plugins** (`server.js`):
- Bearer token auth: `hapi-auth-bearer-token` 
- Rate limiting: `hapi-rate-limit`
- Pagination: `hapi-pagination`
- Request ID tracking: `cls-rtracer`
- CORS: `hapi-cors`
- Request/response interceptors: snake_case ↔ camelCase conversion, request logging, error handling




### MySql and redis setup
MySql and redis setup is been handled by docker compose.

### Migrations

With migrations you can transfer your existing database into another state and vice-versa.

**Setting up Sequelize Migrations for a initial database**

Steps

1. Create a `resources` folder
2. Create individual `.sql` files for each table and add it sequentially, by prefixing by 01,02 & so on.
3. Each file should contain the proper sql syntax.
4. Point the migration files to `/resources/v1`
5. Run `npx sequlize db:migrate`

**Structure with example**

```
    /
        migrations/
            20191014145811-initial-migration.js
        resources/
            v1/
                01_create_school.sql
                02_create_student.sql
```

**Database State Changes**

1. Create a migration file that prefixes with the timestamp add it in the `/migrations` folder. Ex: `20191014145811-alter-student.js`
2. Add the .sql file in the `/resources/v2`
3. Point the new migration file to `/resources/v2`
4. Run `npx sequlize db:migarte --name migartions/20191014145811-alter-student.js`

**Structure**

```
    /
        migrations/
            20191015143811-initial-migration.js
            20191014145811-alter-student.js
        resources/
            v1/
                01_create_school.sql
                02_create_student.sql
            v2/
                03_alter_student.sql

```

## Troubleshooting

### Token Request Returns "Error while creating access token"

**Cause:** OAuth client exists but has no scopes or resources in the database.

**Solution:** Ensure the client has at least one scope. Run seeders:
```bash
npx sequelize db:seed:all
```

Or manually add a scope:
```bash
mysql -u root -p -h 127.0.0.1 -D temp_dev -e "INSERT INTO oauth_client_scopes (oauth_client_id, scope, created_at) VALUES (1, 'ADMIN', NOW());"
```

### Seeder Fails with "Function.prototype.apply was called on undefined"

**Cause:** ESM imports in seeders fail in the Sequelize seeder context.

**Solution:** Already fixed in this codebase—seeders now hardcode constants instead of importing them. No action needed.

### Protected Endpoints Return 401 Unauthorized

**Causes:**
1. Token not included in header: use `Authorization: Bearer <token>` (case-sensitive)
2. Token expired: request a new token (valid for ~12 hours)
3. Token has insufficient scopes for the route: verify client scopes match route requirements

**Debug:** Check server logs for `createAccessToken` and `validateScopeForRoute` messages.



