CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  surname VARCHAR(30) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(30) NOT NULL
);

CREATE TABLE rating(
    id SERIAL PRIMARY KEY,
    user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users (id),
    value INTEGER NOT NULL
);