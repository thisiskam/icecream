const pg = require('pg')
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/icecream_flavors')
const app = express()
app.use(express.json())
app.use(require('morgan')('dev'))

// read
app.get('/api/flavors', async (req, res, next) => {
  try {
      const SQL = /* SQL */ `SELECT * FROM flavors`
      const response = await client.query(SQL);
      res.send(response.rows)
  } catch(err) {
      next(err)
  }
})

// read single flavor
app.get('/api/flavors/:id', async (req, res, next) => {
  try {
      const SQL = /* SQL */ `
        SELECT * 
        FROM flavors
        WHERE id=$1`
      const response = await client.query(SQL, [req.params.id]);
      res.send(response.rows)
  } catch(err) {
      next(err)
  }
})

// create
app.post('/api/flavors', async (req, res, next) => {
  try {
      const SQL =  /* SQL */ `
          INSERT INTO flavors(flavor, is_favorite)
          VALUES($1, $2)
          RETURNING *
      `;
      const response = await client.query(SQL, [req.body.flavor, req.body.is_favorite]);
      res.send(response.rows[0]); 
  } catch(err) {
      next(err);
  }
})

// delete

app.delete('/api/flavors/:id', async (req, res, next) => {
  try {
      const SQL =  /* SQL */ `
          DELETE from flavors
          WHERE id=$1
      `;
      await client.query(SQL, [req.params.id]);
      res.sendStatus(200)
  } catch(err) {
      next(err);
  }
})

// Update

app.put('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = /* SQL */ `
      UPDATE flavors
      SET flavor=$1, is_favorite=$2, updated_at=now()
      WHERE id=$3
      RETURNING *
    `;
    const response = await client.query(SQL, 
      [req.body.flavor,
      req.body.is_favorite,
      req.params.id]  
    )
    res.send(response.rows[0])
  } catch(err) {
    next(err)
  }
})

const init = async () => {
    await client.connect();
    console.log('connected to database');
    let SQL = /* SQL */`
      DROP TABLE IF EXISTS flavors;
      CREATE TABLE flavors (
        id SERIAL PRIMARY KEY,
        flavor VARCHAR(255),
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      )
    `;
    await client.query(SQL);
    console.log('tables created');
    SQL = /* SQL */`
      INSERT INTO flavors(flavor) VALUES('Chocolate');
      INSERT INTO flavors(flavor) VALUES('Vanilla');
      INSERT INTO flavors(flavor, is_favorite) VALUES('Coffee', TRUE);
      INSERT INTO flavors(flavor) VALUES('Rocky Road');
      INSERT INTO flavors(flavor) VALUES('Strawberry');
      INSERT INTO flavors(flavor) VALUES('Cookie Dough');
    `;
    await client.query(SQL);
    console.log('data seeded');

    const PORT = process.env.PORT || 3002
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  };
  
  init();