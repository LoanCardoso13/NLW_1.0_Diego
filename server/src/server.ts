import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

// Knex makes equivalent:
// SELECT * FROM users WHERE name = 'Jow'
// knex('users).where('name', 'Jow').select('*')

app.listen(3333);