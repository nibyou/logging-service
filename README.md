<p align="center">
  <img src="https://content.luca-kiebel.de/websites/nibyou.de/img/NIBYOU%20logo%20and%20claim%20-%20digital%20-%20big.png" alt="Nibyou Logo">
</p>

# Nibyou Logging Microservice

Used to add a JWT Authentication Layer in front of our Grafana Loki central Logging to allow frontends to send logs as well.

For this to work you first have to create a Loki server and put it behind a reverse proxy that adds Basic Auth. This can be done with nginx for example.

## Installation

```bash
$ npm install
```

## Configuration

Check out the `example.env` file in the root directory.

Fill out the variables and rename the file to `.env`.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

The Nibyou Microservice is licensed under the [AGPL-3 license](LICENSE).
