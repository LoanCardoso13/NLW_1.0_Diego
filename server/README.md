<h1 align='center'>Back-end Tutorial</h1>

This tutorial makes use of global installation of NodeJS and an API design platform such as Insomnia or Postman is highly recommended. If using sqlite3 it's also recommended to have a GUI for managing the database such as DB Browser for SQLite or as an extension in the IDE, like SQLite for VS code. We will create the back-end for the Ecol application.

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

Also importing the path library for future use, server.ts is then left as:

```javascript
import express from 'express';
import path from 'path';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333);
```

Next we create the database folder within src. Inside it we create a connection.ts file to configure our use of KnexJS and export it throughout the project:

```javascript
import knex from 'knex';
import path from 'path';

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
})

export default connection;
```

It's time to create the migrations folder within the database directory. Inside migrations we make three files, they'll run at the order of the commencing numbers, so we create "00_create_points.ts", "01_create_items.ts" and "02_create_point_items.ts". We import knex in order to use its types. The following code will be common to the three files:

```javascript
import Knex from 'knex';

export async function up(knex: Knex) {}

export async function down(knex: Knex) {}
```

In "00_create_points.ts" we write the knex code that generalizes SQL (documentation in http://www.knexjs.org):

```javascript
import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.integer('latitude').notNullable();
        table.integer('longitude').notNullable();
        table.string('city').notNullable();
        table.string('state').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('points');
}
```

To configure KnexJS (documentation in http://www.knexjs.org) in the project we create a knexfile.ts in the root directory (server in this case) containing:

```javascript
import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    useNullAsDefault: true,
}
```

Running the following command will then create the database.sqlite file in the database folder, which can be checked with a GUI program.

```bash
npx knex migrate:latest --knexfile knexfile.ts migrate:latest
```

Since it's long we'll create a script for this command in our package.json file:

```json
  "scripts": {
    "dev": "ts-node-dev --ignore-watch node_modules src/server.ts",
    "knex:migrate": "knex --knexfile knexfile.ts migrate:latest"
  },
```

From now on we just run from npm:

```bash
npm run knex:migrate
```

In "01_create_items.ts" we write:

```javascript
import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('items');
}
```

In "02_create_point_items.ts":

```javascript
import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();

        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('point_items');
}
```

You may delete the database.sqlite and run the migrations from npm again to verify the complete database.

Download each .svg picture from the uploads folder in this repository (lampadas.svg, baterias.svg, papeis-papelao.svg, eletronicos.svg, organicos.svg and oleo.svg). Put them all inside an uploads folder in the at the root of the project. Make them available to our back-end by adding to server.ts:

```javascript
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
```

From now on we can see the pictures in our browser by typing, for instance:

```http
http://localhost:3333/uploads/oleo.svg
```

We then create the seeds folder in the database directory. Inside it we write "create_items.ts":

```javascript
import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        {title: 'Light Bulbs', image: 'lampadas.svg'},
        {title: 'Batteries', image: 'baterias.svg'},
        {title: 'Paper and Cardboard', image: 'papeis-papelao.svg'},
        {title: 'Electronics', image: 'eletronicos.svg'},
        {title: 'Organic', image: 'organicos.svg'},
        {title: 'Cooking Oil', image: 'oleo.svg'},
    ])
}
```

Configure it in knexfile.ts accordingly:

```javascript
seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
```

And create a shorthand command in our package.json:

```json
"scripts": {
    "dev": "ts-node-dev --ignore-watch node_modules src/server.ts",
    "knex:migrate": "knex --knexfile knexfile.ts migrate:latest",
    "knex:seed": "knex --knexfile knexfile.ts seed:run"
  },
```

Now to populate the items table we run:

```bash
npm run knex:seed
```

Now that we populated our items table, while the server is still running, we create a route for listing the items. Routes.ts changes as follows:

```javascript
import express from 'express';
import knex from './database/connection';

const routes = express.Router();

routes.get('/items', async (request, response) => {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`
        }
    })

    return response.json({serializedItems});
});

export default routes;
```

Using an API design platform such as Insomnia we can list the items and click any address, while server is running, to see our browser open up the respective picture. 

Now let's build the registry of collection points functionality. First we make the POST route:

```javascript
routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state
    } = request.body;

    await knex('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state
    });

    return response.json({message: 'cool'});
})
```

And, while running the server, it is a good idea to use Insomnia to try the route. Use JSON body to insert: 

```json
{
	"name": "Joe's market",
	"email": "jow@email.com",
	"whatsapp": "123123123",
	"latitude": -45,
	"longitude": -13,
	"city": "Toronto",
	"state": "Ontario",
	"items": [
		1,
		2,
		6
	]
}
```

If it went all you should see the message "cool". Then you may also check the data you inserted with your preferred SQLite DB browser. It is still missing the items part, so add:

```javascript
routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state,
        items
    } = request.body;

    const ids = await knex('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state
    });

    const pointItems = items.map((item_id: number) => {
        return {
            item_id,
            point_id: ids[0]
        };
    });

    await knex('point_items').insert(pointItems);

    return response.json({message: 'cool'});
})
```

Now by posting again, through Insomnia, you should see the "point_items" table filled with point_id 2 relating to item_id 1, 2 and 6. Let's just improve the code a little bit by securing a fail in the first knex promise won't break the app and making a bit more semantic and readable the the use of point_id from the first promise: 

```javascript
routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state,
        items
    } = request.body;

    const trx = await knex.transaction();

    const insertedIds = await trx('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        state
    });

    const point_id = insertedIds[0]

    const pointItems = items.map((item_id: number) => {
        return {
            item_id,
            point_id
        };
    });

    await trx('point_items').insert(pointItems);

    return response.json({message: 'cool'});
})
```

Routes.ts is getting big and messy, so we refactor our code, by adding a controllers folder in the src directory, with the files "itemsController.ts" and "pointsController.ts". The latter is the function to create a point, its content will be:

```javascript
import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            state,
            items
        } = request.body;
    
        const trx = await knex.transaction();
    
        const insertedIds = await trx('points').insert({
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            state
        });
    
        const point_id = insertedIds[0]
    
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            };
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
    
        return response.json({message: 'cool'});
    }
}

export default PointsController;
```

Similarly, "itemsController.ts" becomes:

```javascript
import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(request: Request, response: Response)  {
        const items = await knex('items').select('*');
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`
            }
        })
    
        return response.json({serializedItems});
    }
}

export default ItemsController;
```

And routes.ts is reduced to:

```javascript
import express from 'express';

import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);

export default routes;
```

Let's go ahead and make our server able to list a specific point with its items. first we create a route:

```javascript
routes.get('/points/:id', pointsController.show);
```

Then we add a function in pointsController.ts:

```javascript
async show(request: Request, response: Response) {
    const {id} = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
        return response.status(400).json({message: 'point not found'});
    }

    const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title');

    return response.json({ point, items });
}
```

And with Insomnia we may verify that a request that lists only a specific point now works as well.

Finally we create a route to list and filter collection points. In routes.ts we add a route:

```javascript
routes.get('/points', pointsController.index);
```

And create the index function in pointsController.ts:

```javascript
async index(request: Request, response: Response) {
    const {city, state, items} = request.query;

    const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

    const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('state', String(state))
        .distinct()
        .select('points.*');

    return response.json(points);
}
```

Using Insomnia you should already test the filtering of your points database by using queries. 