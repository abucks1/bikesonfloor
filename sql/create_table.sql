DROP TABLE IF EXISTS bikes;
CREATE TABLE IF NOT EXISTS bikes (
id SERIAL PRIMARY KEY,
bikename VARCHAR(255) NOT NULL,
frame_size VARCHAR(255),
wheel_size VARCHAR(255),
price_point VARCHAR(255) NOT NULL,
qty_available VARCHAR(255) NOT NULL,
category VARCHAR(255) NOT NULL
);




