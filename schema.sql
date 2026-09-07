-- ============================================================
-- PostreSQL Schema for Animal Shelter Data
-- ============================================================

-- Users table for authentication (if needed)
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reference table: type of animals (Dog, Cat, Rabbit, etc.)
CREATE TABLE animal_types (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Reference table: type of outcomes (Adoption, Transfer, Euthanasia, ...)
CREATE TABLE outcome_types (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Principal table: animals
CREATE TABLE animals (
    id                SERIAL PRIMARY KEY,
    external_id       VARCHAR(20) UNIQUE,           -- Origin animal ID (ex. A123456)
    name              VARCHAR(100),                 -- can be empty in the original dataset
    date_of_birth     DATE,
    outcome_datetime  TIMESTAMPTZ,
    age_outcome_days  INTEGER,                       
    animal_type_id    INTEGER REFERENCES animal_types(id),      -- Referential integrity constraint (If you try to set `animal_type_id` to 99 and there is no animal of type 99, PostgreSQL will reject it.)
    outcome_type_id   INTEGER REFERENCES outcome_types(id),
    outcome_subtype   VARCHAR(100),
    sex               VARCHAR(10) CHECK (sex IN ('Male', 'Female', 'Unknown')),         -- CHECK constraint to ensure valid values
    is_intact         BOOLEAN,
    breed             VARCHAR(150),
    color             VARCHAR(100),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Useful indexes for filtering and pagination
CREATE INDEX idx_animals_animal_type   ON animals(animal_type_id);      -- By animal type (Dog, Cat, Rabbit, etc.)
CREATE INDEX idx_animals_outcome_type  ON animals(outcome_type_id);     -- By outcome type (Adoption, Transfer, Euthanasia, ...)