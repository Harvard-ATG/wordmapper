# Server

The server has 3 parts:

1. A public facing splash page instructing users on how to install the client tool (i.e. bookmarklet).
2. An admin interface to manage users.
3. An API that the client tool uses in order to persist alignments on source texts.

## Database Migrations

Migrations are simple SQL files with "do" and "undo" for each step up/down. Uses [postgrator](https://github.com/rickbergfalk/postgrator) to run the migrations via the *migrate.js* script.

```sh
$ node ./migrate.js max   # migrate to the latest version
$ node ./migrate.js 001   # migrate to a specific version
```

Note: database connection information is expected to be specified via the `DATABASE_URL` environment variable prior to running the migration:

```sh
export DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME
```

## API Endpoints

Endpoint | Methods | Description
--- | --- | ---
/api/auth | POST | Authentication (i.e. login). Returns a JWT that must be used for authenticated requests.
/api/alignments | GET,POST,PUT,DELETE | Alignments on a set of source texts.
/api/sources | GET,POST | Source texts.
/api/pages | GET,POST | Webpages containing source texts.


