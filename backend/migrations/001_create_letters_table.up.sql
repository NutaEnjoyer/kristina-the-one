CREATE TABLE IF NOT EXISTS letters (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    date VARCHAR(50),
    tag VARCHAR(100),
    in_progress BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_letters_date ON letters(date);
CREATE INDEX idx_letters_tag ON letters(tag);
