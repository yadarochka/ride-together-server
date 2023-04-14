CREATE TABLE gender (
  id SERIAL PRIMARY KEY,
  gender VARCHAR(10) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  surname VARCHAR(30) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(30) NOT NULL,
  gender_id INTEGER NOT NULL, 
  FOREIGN KEY (gender_id) REFERENCES gender (id)
);

CREATE TABLE rating(
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER, 
  to_user_id INTEGER, 
  value INTEGER NOT NULL,
  FOREIGN KEY (from_user_id) REFERENCES users (id),
  FOREIGN KEY (to_user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS status_ride (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL
);

CREATE TABLE ride (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL, 
  status_id INTEGER NOT NULL,
  departure_location NUMERIC[] NOT NULL,
  arrival_location NUMERIC[] NOT NULL,
  departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
  available_seats INTEGER NOT NULL,
  total_seats INTEGER NOT NULL,
  price INTEGER NOT NULL,
  additional_details VARCHAR(255),
  FOREIGN KEY (driver_id) REFERENCES users (id),
  FOREIGN KEY (status_id) REFERENCES status_ride (id)
);

CREATE TABLE user_ride (
  ride_id INTEGER, 
  user_id INTEGER, 
  FOREIGN KEY (ride_id) REFERENCES ride (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE tokens (
  user_id INTEGER,
  token VARCHAR(300),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO gender (gender) VALUES ('Мужской');
INSERT INTO gender (gender) VALUES ('Женский');

ALTER TABLE user_ride ADD CONSTRAINT unique_ride_user_idx UNIQUE (ride_id, user_id);