import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'postgres',
    password: POSTGRES_PASSWORD || 'postgres',
    port: POSTGRES_PORT || 5556,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(
    `CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(30) NOT NULL, date DATE NOT NULL DEFAULT CURRENT_DATE);`
  );

  await client.query(
    `CREATE TABLE categories (id SERIAL PRIMARY KEY, name VARCHAR(30) NOT NULL);`
  );

  await client.query(
    `CREATE TABLE authors (id SERIAL PRIMARY KEY, name VARCHAR(30) NOT NULL);`
  );

  await client.query(
    `CREATE TABLE books (id SERIAL PRIMARY KEY, title VARCHAR(30) NOT NULL, userid INTEGER, authorid INTEGER, categoryid INTEGER, FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY(authorid) REFERENCES authors(id) ON DELETE CASCADE, FOREIGN KEY(categoryid) REFERENCES categories(id) ON DELETE CASCADE);`
  );

  await client.query(
    `CREATE TABLE descriptions (id SERIAL PRIMARY KEY, description VARCHAR(10000) NOT NULL, bookid INTEGER UNIQUE, FOREIGN KEY(bookid) REFERENCES books(id) ON DELETE CASCADE);`
  );

  await client.query(
    `CREATE TABLE reviews (id SERIAL PRIMARY KEY, message VARCHAR(10000) NOT NULL, userid INTEGER, bookid INTEGER, FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY(bookid) REFERENCES books(id) ON DELETE CASCADE);`
  );

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`INSERT INTO users (name) VALUES ('Leon');`);
  await client.query(`INSERT INTO users (name) VALUES ('Carlos');`);
  await client.query(`INSERT INTO users (name) VALUES ('Jill');`);

  await client.query(`INSERT INTO categories (name) VALUES ('Animals');`);
  await client.query(`INSERT INTO categories (name) VALUES ('Aircraft');`);
  await client.query(`INSERT INTO categories (name) VALUES ('Biology');`);

  await client.query(`INSERT INTO authors (name) VALUES ('Albert Wesker');`);
  await client.query(`INSERT INTO authors (name) VALUES ('Ada Wong');`);
  await client.query(`INSERT INTO authors (name) VALUES ('Rebecca Chambers');`);

  await client.query(
    `INSERT INTO books (title, userid, authorid, categoryid) VALUES ('About them', 1, 1, 1);`
  );
  await client.query(
    `INSERT INTO books (title, userid, authorid, categoryid) VALUES ('In the sky', 2, 3, 2);`
  );
  await client.query(
    `INSERT INTO books (title, userid, authorid, categoryid) VALUES ('Is the wound bleeding?', 3, 2, 3);`
  );

  await client.query(
    `INSERT INTO descriptions (description, bookid) VALUES ('Some description - 1', 3);`
  );

  await client.query(
    `INSERT INTO descriptions (description, bookid) VALUES ('Some description - 2', 2);`
  );

  await client.query(
    `INSERT INTO descriptions (description, bookid) VALUES ('Some description - 3', 1);`
  );

  await client.query(
    `INSERT INTO reviews (message, userid, bookid) VALUES ('Great book', 1, 3);`
  );

  await client.query(
    `INSERT INTO reviews (message, userid, bookid) VALUES ('I like it', 2, 1);`
  );

  await client.query(
    `INSERT INTO reviews (message, userid, bookid) VALUES ('I wanna be an engineer after reading, it is amazing', 3, 2);`
  );

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
