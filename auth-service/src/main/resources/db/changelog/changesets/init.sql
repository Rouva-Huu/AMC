CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('USER')),
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    city TEXT
);