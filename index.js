const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/icecream_flavors')
const app = express()

const init = async () => {
    await client.connect();
    console.log('connected to database');
    let SQL = ``;
    await client.query(SQL);
    console.log('tables created');
    SQL = ` `;
    await client.query(SQL);
    console.log('data seeded');

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  };
  
  init();