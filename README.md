# Angular/NestJS Quickstart project template (Multi-tenant edition)

# Description
The purpose of this branch is to setup environment for multi-tenant SааS using Postgres database. 

This project includes the following features:
- Server Side Rendering
- Progressive Web Application
- Database connection
- User authorization using JWT
- Database migrations
- Multiple tenants using Postgres schemas


## Prerequisites
You need to have installed NodeJS v16+.

You need the following node packages installed globally:

- @angular/cli
- @nestjs/cli
- ts-node

Copy and paste this to install them:

`npm install -g @angular/cli @nestjs/cli ts-node`


## How to start?
- Clone the project
- Change branch by running `git checkout multi-tenant`
- Run `npm run setup` to install the dependencies.

**NB!**: You'll see lots of warnings because of conflicting peer dependencies and/or unsupported engines. That's because the package @nestjs/ng-universal is almost dead and it has very slow support response. It'll be fixed as soon as this package is updated or someone releases alternative to it.

#### Setting up the database
- Check credentials for connecting to Postgres database in `/environments/.env.local`.
- Create database `myapp` or change the name in the environment file.
- (Optional) Change primary account data in the environment file with credentials of your choosing.
- Run `npm run migrations:generate:core` to generate initial state of the "public" schema
- Run `npm run migrations:generate:tenants` to generate the structure of the tenant schemas
- Run `npm run migrations:run:core` to update the "public" schema

#### Creating tenants
- Our example tenant name is going to be called "test"
- Create tenant host in "hosts" file (Linux - `/etc/hosts`, Windows - `C:\Windows\System32\drivers\etc\hosts`) by adding a new row `127.0.0.1 test.localhost` at the end of the file. For more information - [How to Edit Your Hosts File on Windows, Mac, or Linux](https://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/)
- Create new database entry for the tenant in `public.tenants` table using your terminal or SQL client of your choosing. Insert into the column "name" the name of your tenant ("test" in our case). The name of your tenant should be the first alphanumeric part of the host, i.e. the host can be `test.com`, `test.example.com` even `test.something.example.co.uk`. The app is going to look at the string BEFORE the first dot in the host ("test" in all of the examples).


## Creating your own project

If you want to use this quickstart template for project of your own, follow these steps:

- Remove "origin" remote - `git remote remove origin`
- Add your own "origin" remote - `git remote add origin [address-of-your-remote-repo]`
- Rename the project - replace every occurrence of "ng-nest-template" with the name of your project (use small caps and dashes instead of spaces)
- Change database connection settings in `/environments/.env.local` and `/environments/.env.production`
- Replace primary account credentials with some of your choosing
- Follow the steps above related to creating tenants


## Development server

Run `npm run dev:ssr` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. 


## Code scaffolding

You can create Angular modules/components/directives etc. and NestJS modules/controllers/services etc. as it's documented - [Angular CLI](https://angular.io/cli) [NestJS CLI](https://docs.nestjs.com/)

## Build

Run `ng build:ssr` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

To get more help on the NestJS CLI use `nest --help` or go check out the [NestJS CLI Overview and Command Reference](https://docs.nestjs.com/cli/overview) page.


# CHANGELOG

## v1.1.0
Refactored directories.

Now all source code is in **/src** folder. Compiled files are in **/dist** folder (without folder with the name of the project).

New directory structure is:

**/src/browser** - the Angular front-end
**/src/common** - common functions, shared by both front-end and server-side
**/src/environments** - .env files
**/src/migrations** - database migrations files
**/src/server** - NestJS server-side code

## v1.0.0
First stable release with the following features:
- Server Side Rendering
- Progressive Web Application
- Database connection
- User authorization using JWT
- Database migrations
