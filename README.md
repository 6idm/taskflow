# TaskFlow

Gestionnaire de tâches collaboratif (Node.js / Express).
Projet de formation, Bachelor CDA, EPSI Grenoble.

## Prérequis

- Node.js 22 ou plus (voir `.nvmrc`)
- Docker et Docker Compose v2 (Docker Desktop lancé)
- Git

## Démarrage rapide

```bash
git clone https://github.com/6idm/taskflow.git
cd taskflow
cp .env.example .env      # puis remplace les valeurs "change-me"
npm ci
docker compose up -d      # PostgreSQL + Redis
npm start
```

L'application est disponible sur http://localhost:3000.

## Configuration

Toute la configuration passe par des variables d'environnement, dans un fichier `.env`
non versionné. Le fichier `.env.example` sert de modèle.

| Variable            | Description                |
| ------------------- | -------------------------- |
| `PORT`              | Port HTTP de l'application |
| `SECRET_KEY`        | Clé secrète (obligatoire)  |
| `POSTGRES_USER`     | Utilisateur PostgreSQL     |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL    |
| `POSTGRES_DB`       | Nom de la base             |
| `POSTGRES_PORT`     | Port local de PostgreSQL   |
| `REDIS_PORT`        | Port local de Redis        |

Générer une clé secrète :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Infrastructure

| Service    | Image                | Port local |
| ---------- | -------------------- | ---------- |
| PostgreSQL | `postgres:17-alpine` | 5432       |
| Redis      | `redis:7-alpine`     | 6379       |

- Les ports ne sont exposés que sur `127.0.0.1`.
- Le schéma initial (table `tasks`) est dans `db/init.sql`. Il est exécuté uniquement au
  premier démarrage, quand le volume est vide.
- Repartir de zéro (supprime les données) : `docker compose down -v && docker compose up -d`.

## Qualité du code

| Commande         | Rôle                          |
| ---------------- | ----------------------------- |
| `npm run lint`   | Analyse le code (ESLint)      |
| `npm run format` | Formate le code (Prettier)    |
| `npm run check`  | Lint + vérification du format |

Lance `npm run check` avant chaque commit.

## Structure du projet

```
taskflow/
├── db/init.sql             # schéma initial PostgreSQL
├── public/                 # front-end statique servi par Express
├── config.js               # lecture centralisée de la configuration
├── docker-compose.yml      # PostgreSQL + Redis
├── eslint.config.js        # configuration ESLint
├── .prettierrc.json        # configuration Prettier
├── .env.example            # modèle des variables d'environnement
├── .nvmrc                  # version de Node attendue
└── server.js               # serveur Express
```

## Limites connues

- Les tâches sont encore stockées en mémoire : la connexion à PostgreSQL et Redis est
  prévue dans une prochaine étape.
- Failles XSS connues (route `/search`, rendu `innerHTML` dans `public/app.js`) :
  à traiter dans un TP dédié à la sécurité.
