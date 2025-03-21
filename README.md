# Task Manager API (NestJs - MySql)
## Description

An API to manage your tasks

## Project setup

install packages
```bash
$ npm install
```
create `.env` file
```bash
$ cp example.env .env
```
default values:
```dotenv
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=task_user
DATABASE_PASSWORD=task_user
DATABASE_NAME=task_manager

JWT_SECRET=secret

DEV=true
```

setup your mysql server with config in the .env file

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Documents
swagger ui docs are on `/doc` route

and raw docs are on `/doc/json` route