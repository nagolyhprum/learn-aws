Goal
====

Learn AWS

Install
=======

Please install make using the following command:

```bash
$ npm i -g make
```

Also be sure to have the latest `docker` and `docker-compose` installed.

Run
===

Then you can do things like:

Start a dev server:

```bash
$ make dev
```

This will set up a watch on both server and client and add hot reloading in docker. You can then navigate to http://localhost/graphql and see some example queries.

Start a prod server:

```bash
$ make prod
```

Will build and run code in forever.

Test your code with coverage:

```bash
$ make test
```

Fires up docker to do integration testing.