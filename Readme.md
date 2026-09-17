# My-API

Une API REST pour gérer les données d'animaux en refuge (Animal Shelter Data).

## Table des matières

- **Description**
- **Tech & architecture**
- **Prérequis**
- **Installation**
- **Base de données & seed**
- **Lancer le serveur**
- **Structure du projet**
- **Contribuer**

## Description

API légère construite avec Express.js et PostgreSQL pour stocker et interroger les informations des animaux (type, sexe, race, issue/outcome, etc.). Cache Redis utilisé pour améliorer les performances des requêtes fréquentes.

## Tech & architecture

- Backend: Node.js, Express
- Base de données: PostgreSQL
- Cache: Redis

## Base de données & seed

Le schéma SQL est disponible dans `schema.sql`.

`scripts/seed.js` importe les CSV présents dans `data/` et peuple les tables de référence et les données initiales.

## Lancer le serveur

```bash
npm run dev
```

## Structure du projet

```
src/
  features/
    animals/
      animals.routes.js
      animals.controller.js
      animals.service.js
    auth/
      auth.routes.js
      auth.controller.js
      auth.service.js
      auth.validation.js
  middlewares/
    auth.middleware.js
  db/
    pool.js
  cache/
    redis.js
scripts/
  seed.js
data/
  *.csv
schema.sql
server.js
```

## Endpoints principaux (exemples)

- `GET /api/animals` : liste des animaux
- `GET /api/animals/:id` : détail d'un animal
- `POST /api/auth/login` : authentification
