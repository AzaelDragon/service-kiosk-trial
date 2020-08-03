# Service Kiosk

A simple service order ticketing API powered by NestJS and GraphQL. Built as a coding skills trial.

> _Este README también se encuentra disponible en [🇪🇸 Español](https://github.com/AzaelDragon/service-kiosk-trial/blob/master/README-ES.md)._

## Features

- GraphQL API with [Playground](https://github.com/prisma-labs/graphql-playground) (Can be disabled through environment variables).
- Code-First approach through the Decorator pattern with [NestJS](https://nestjs.com).
- Database modelling, migration and database access to PostgreSQL mediated through [Prisma](https://www.prisma.io).
- JWT authentication through [passport-jwt](https://github.com/mikenicholson/passport-jwt).
- OpenAPI-compliant REST API for secondary actions documented with [Swagger](https://swagger.io).
- Out of the box [Docker](https://www.docker.com) containerization.
- Automatically deployed to [Heroku](https://service-kiosk-trial.herokuapp.com/).

## Project Setup

### Dependencies

The project uses [Yarn](https://yarnpkg.com) to handle it's dependencies and scripts. The project's dependencies can be installed using:

```bash
yarn install
```

### Environment

This project uses a set of predefined environment variables in order to correctly setup necessary paths and parameters. These configurations must be stored in a `.env` file for the app's own settings, and another one for Prisma's database settings.

You can find example configurations for both these files in the root folder `/example.env`, and in `/prisma/example.env` for the application and Prisma, respectively.

To quickly setup the environment from the root of the project, use:

```bash
cp example.env .env && cp prisma/example.env prisma/.env
```

Then, customize these settings to your liking.

### Docker

> _If you do not wish to use docker to run this application, you will have to manually setup a database instance._

If you wish to run this application in a Docker container, `Dockerfile` and `docker-compose.yml` files are provided with the project to setup the required containers. Docker-compose will setup a development environment with support for Visual Studio Code's debugger.

To setup the containers and run the application, use:

```bash
yarn docker:up
```

Or, if you wish to run it in the background:

```bash
yarn docker:up:bg
```

Docker-compose will generate two containers for the application:

- A base, `main` container which holds the application's data
- A secondary `db` container, holding a PostgreSQL instance for data storage.

### Database setup

This project uses [Prisma](https://www.prisma.io) for all data-related affairs. This includes [Prisma Migrate](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-migrate) and [Prisma client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).

Once dependencies have been installed, all the database migration processes can be executed by running:

```bash
yarn prisma:setup
```

This command will generate the required tables, the Prisma Client, and will seed the database. If you wish to run each step individually, you can use the following commands:

```bash
# Migrate the database schema.
yarn prisma:up

# Generate the application's ORM client.
yarn prisma:generate

# Seed the database with sample data.
yarn prisma:seed
```

Additional commands can be found in the project's `package.json` and in [Prisma's Documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/).

### Starting the server

To manually start an instance of the application, run the command:

```bash
yarn start
```

> _If you would like to use the compilation on file change and a debugger, run `yarn start:debug` instead._

### Modifying the Prisma schema

If you wish to change the Prisma model used for the application's data, edit `prisma/schema.prisma` and then run the following commands:

```bash
yarn prisma:save      # Save a new migration.
yarn prisma:up        # Save the migration's changes to the database.
yarn prisma:generate  # Generate the Prisma Client's files.
yarn prisma:seed      # Seed the database.
```

It is posible that you need to modify the migration file to fit your new model, located in `prisma/seed.ts`.

### Modifying the GraphQL schema

The GraphQL schema is automatically generated through a code-first approach. This means that such schema is generated from the models, resolvers, arguments and input classes present in the `src/` folder of the project.

> _This project is entirely open source. For more information, refer to this project's [License](https://github.com/AzaelDragon/service-kiosk-trial/blob/master/LICENSE) file, located in the root of the repository._
