# Service Kiosk

Una simple API para la administración de órdenes de servicio basada en NestJS y GraphQL. Construído como parte de una prueba de habilidades en programación.

> _This README is also available in [🇺🇸 English](https://github.com/AzaelDragon/service-kiosk-trial/blob/master/README.md)._

## Características

- API GraphQL con [Playground](https://github.com/prisma-labs/graphql-playground) (Puede ser desactivado a través de variables de entorno).
- Desarrollado con un enfoque de código primero "`code-first`" a través del patrón Decorador mediante [NestJS](https://nestjs.com).
- Modelado de datos, migración y acceso a una base de datos PostgreSQL mediado por [Prisma](https://www.prisma.io).
- Autenticación basada en JWT mediante [passport-jwt](https://github.com/mikenicholson/passport-jwt).
- API Rest adherida al estándar OpenAPI para acciones secundarias documentada con [Swagger](https://swagger.io).
- Distribución en contenedores mediada por [Docker](https://www.docker.com).
- Despliegue automático a [Heroku](https://service-kiosk-trial.herokuapp.com/).

## Inicialización del proyecto

### Dependencias

Este proyecto usa [Yarn](https://yarnpkg.com) para administrar sus dependencias y sus scripts. Estas dependencias pueden ser instaladas usando:

```bash
yarn install
```

### Entorno

El proyecto usa un conjunto de variables de entorno predefinidas para inicializar correctamente algunas rutas y parámetros. estas configuraciones deben ser almacenadas en un archivo `.env` para las configuraciones de la aplicación en sí, y uno para las configuraciones de Prisma.

El proyecto posee configuraciones de ejemplo en los archivos `/example.env`, y `/prisma/example.env` para la aplicación y para prisma, respectivamente.

Para rápidamente inicializar el entorno, ejecuta los siguientes comandos en tu terminal:

```bash
cp example.env .env && cp prisma/example.env prisma/.env
```

Después, cambia los parámetros en dichos archivos como lo creas conveniente.

### Docker

> _Si no deseas usar docker para ejecutar la aplicación, deberás crear un entorno de base de datos tu mismo._

Si se desea ejecutar la aplicación en un entorno de docker, los archivos `Dockerfile` y `docker-compose.yml` se encuentran en la raíz del repositorio para una rápida inicialización de los contenedores. Docker-compose creará un entorno de desarrollo con un debugger con soporte para Visual Studio Code sin modificaciones adicionales.

Para generar los contenedores y ejecutar la aplicación, ejecuta:

```bash
yarn docker:up
```

O si deseas ejecutar la aplicación en segundo plano:

```bash
yarn docker:up:bg
```

Docker-compose generará dos contenedores para la aplicación

- Un contenedor primario, `main`, en el cual se encuentran los datos de la aplicación en sí.
- Un contenedor secundario, `db`, con una instancia de PostgreSQL 12 para el almacenamiento de datos.

### Inicialización de la base de datos

Este proyecto usa [Prisma](https://www.prisma.io) para todas las cuestiones relacionadas a datos. Esto incluye [Prisma Migrate](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-migrate) y [Prisma client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).

Una vez las dependencias hayan sido instaladas, es posible ejecutar:

```bash
yarn prisma:setup
```

Este comando generará las tablas requeridas, el cliente de Prisma, y poblará la base datos. Si deseas ejecutar cada uno de estos pasos individualmente, usa los siguientes comandos:

```bash
# Migrar el esquema de base de datos.
yarn prisma:up

# Generar el cliente ORM de la aplicación.
yarn prisma:generate

# Poblar la base de datos con ejemplos.
yarn prisma:seed
```

Puedes encontrar comandos adicionales en el archivo `package.json` y en la [Documentación de Prisma](https://www.prisma.io/docs/reference/tools-and-interfaces/).

### Iniciando el servidor

Para iniciar manualmente una instancia de la aplicación, ejecuta el comando

```bash
yarn start
```

> _Si deseas tener compilación en cambios y un depurador, ejecuta `yarn start:debug` en lugar de la instriucción de arriba._

### Modificando el esquema de Prisma

Si deseas cambiar el modelo de Prisma usado en la aplicación, edita el archivo `prisma/schema.prisma` y después, ejecuta los siguientes comandos:

```bash
yarn prisma:save      # Guardar una nueva migración.
yarn prisma:up        # Guardar los cambios de la migración a la base de datos.
yarn prisma:generate  # Generar el cliente de Prisma.
yarn prisma:seed      # Poblar la base de datos.
```

También es posible que debas cambiar el archivo de población para que se ajuste a tu modelo, localizado en `prisma/seed.ts`.

### Modificando el esquema de GraphQL

El esquema de GraphQL es generado automáticamente gracias al enfoque `code-first`. Esto significa que dicho esquema es generado a partir de los modelos, models, resolvers, argumentos y clases de entrada presentes en la carpeta `src/` del proyecto.

> _Este proyecto es completamente abierto. Para más información, visita el archivo de [Licencia](https://github.com/AzaelDragon/service-kiosk-trial/blob/master/LICENSE) ubicado en la raíz de este repositorio._
