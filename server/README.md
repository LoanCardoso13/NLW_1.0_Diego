<h1 align='center'>Back-end Tutorial</h1>

This tutorial makes use of global installations of NodeJS. An API design platform such as Insomnia or Postman is highly recommended. We will create the back-end for the Ecol application.

Within the back-end directory, here named "server", initialize your project and install some basic dependencies: 

```bash
npm init -y
npm i express knex sqlite3
```

If sqlite3 fails to install due to version incompatibility, manually add the following the dependency in your package.json file:

```json
  "dependencies": {
    "sqlite3": "5.0.0"
  }
```

And then run:

```bash
npm install
```

I will be using sqlite3 with knexJS in my project, but you can change your SQL by configuring knex configuration files accordingly. I have a tutorial for Postgres. 

Don't forget to have your .gitignore file with:

```javascript
node_modules/
```

We will be running our back-end in typescript, so let's add the respective libraries:

```bash
npm i typescript @types/express ts-node -D
```

Now we have typescript installed so that we can run .ts files, the express types so that our IDE can help our coding and ts-node to run the node in typescript. All as development dependencies because we won't be using them in production. 

Npx runs the binary files inside node_modules/bin/ .

To create a configuration file (tsconfig.json) for typescript at the root folder we run the command:

```bash
npx tsc --init
```

At the root directory, we make an src folder and a server.ts file containing:

```javascript
import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log('Listing users')

    response.send('Hello World')
});

app.listen(3333);
```

And we can already run our server:

```bash
npx ts-node src/server.ts
```

And check if it works. 

To monitor changes in the server.ts file and automatically restart the server, we install the following development dependency:

```bash
npm install ts-node-dev -D
```

Let's add this script to our package.json file, along with an option to ignore the node_modules directory, in order to make it a bit faster:

```json
  "scripts": {
    "dev": "ts-node-dev --ignore-watch node_modules src/server.ts"
  }
```

To run the server from now on we type:

```bash
npm run dev
```

To make express run json we ought to explicitly code it, a server.ts file, for example, could be:

```javascript
import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (request, response) => {
    return response.json({message: 'Hello world'});
});

app.listen(3333);
```

In order to be able to scale up our routes neatly, we create a separate file in the same directory (src) called routes.ts:

```javascript
import express from 'express';

const routes = express.Router();

routes.get('/', (request, response) => {
    return response.json({message: 'Hello world'});
});

export default routes;
```

Server.ts is then left as:

```javascript
import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333);
```

Next we create the database folder within src. Inside it we create a connection.ts file that configure our use of KnexJS and exports it to be used throughout the project:

```javascript
import knex from 'knex';
import path from 'path';

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
})

export default connection;
```

