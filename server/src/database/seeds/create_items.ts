import Knex from 'knex';

export async function seed(knex:Knex) {
    await knex('items').insert([
        {title: 'Light bulb', image: 'lampadas.svg'},
        {title: 'Batteries', image: 'baterias.svg'},
        {title: 'Paper and cardboard', image: 'papeis-papelao.svg'},
        {title: 'Electronics', image: 'eletronicos.svg'},
        {title: 'Organic', image: 'organicos.svg'},
        {title: 'Cooking oil', image: 'oleo.svg'},
    ]);
}