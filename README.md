# Udemy-Clone-API

> This is the backend api for udemy like site. You can see all uses and its end-points [Here](https://udemycloneapisajid.netlify.app)

## Project Setup

```bash
# install dependencies
npm install

# install globally nodemon
npm install -g nodemon

```

## Configuration Setup

```

PORT=5000
NODE_ENV=development

MONGO_URI=MongoDb URI

GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY=mapquest api key
FILE_UPLOAD_PATH=./public/uploads
FILE_UPLOAD_SIZE=1000000

JWT_SECRET=thiskeyisScreteDontBother
JWT_EXPIREIN=30d
JWT_COOKIE_EXPRIE=30

SMTP_HOST=Your smtp host provider
SMTP_PORT=port
SMTP_EMAIL=username
SMTP_PASSWORD=password
FROM_EMAIL=your email
FROM_NAME=your name

```

## Run The Seeder

```bash

# for import
node seeder -i

# for delete
node seeder -d

```

## Run App

```bash

# Run in dev mode
npm run dev

# Run in prod mode
npm start

```

- version: 1.0.0
- License: MIT
- author: Sajid Ansari.
