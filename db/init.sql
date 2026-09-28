CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  status      VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  owner       VARCHAR(100) DEFAULT 'anonymous',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, status, owner) VALUES
  ('Configurer l''environnement de dev', 'Mettre en place Docker, ESLint, Prettier', 'done', 'alice'),
  ('Implémenter l''authentification', 'JWT + bcrypt pour le login', 'in-progress', 'bob'),
  ('Écrire les tests unitaires', 'Couvrir les services avec Jest', 'todo', 'alice');
