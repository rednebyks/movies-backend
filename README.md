# Node.js SQLite server

## EndPoints

```
POST  /users

POST  /sessions

POST /movies
DELETE  /movies/:id
PATCH  /movies/:id
GET  /movies/:id
GET  /movies
POST /movies/import
```

## DB

Database consists of 4 tables: Actor, Movie, User, Session.

The relation between Actor and Movie is many-to-many so the join table is created during the initialization.

## Setup

```
git clone
npm install
docker build . -t <image_name>
docker run --name <your_name> -p <your_port>:<your_port> -e APP_PORT=<your_port> <image_name>
```
