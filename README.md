# Angular/NestJS Quickstart project template

This project includes the following features:
- Server Side Rendering
- Progressive Web Application
- Database connection
- User authorization using JWT
- Database migrations


## Prerequisites

You need to have installed NodeJS v16+.

You need the following node packages installed globally:

- @angular/cli
- @nestjs/cli
- ts-node

Copy and paste this to install them:

`npm install -g @angular/cli @nestjs/cli ts-node`


## How to start?

- Clone the project then run `npm run setup` to install the dependencies.

NB!: You'll see lots of warnings because of conflicting peer dependencies and/or unsupported engines. That's because the package @nestjs/ng-universal is almost dead and it has very slow support response. It'll be fixed as soon as this package is updated or someone releases alternative to it.

- Check credentials for connecting to MySQL/MariaDB database in `/environments/.env.local`.
- Create database `myapp` or change the name in the environment file.
- (Optional) Change primary account data in the environment file with credentials of your choosing.
- Run `npm run migrations:generate` to generate the initial state of the database then run `npm run migrations:run` to apply changes to the database.


## Creating your own project

If you want to use this quickstart template for project of your own, follow these steps:

- Remove "origin" remote - `git remote remove origin`
- Add your own "origin" remote - `git remote add origin [address-of-your-remote-repo]`
- Rename the project - replace every occurrence of "ng-nest-template" with the name of your project (use small caps and dashes instead of spaces)
- Change database connection settings in `/environments/.env.local` and `/environments/.env.production`
- Replace primary account credentials with some of your choosing


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
