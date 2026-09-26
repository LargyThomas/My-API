# My-API

Une API REST pour gérer les données d'animaux en refuge (Animal Shelter Data), avec authentification, cache Redis, et un frontend React pour la consulter.

## Liens

- **Frontend en production** : https://animal-shelter-app.onrender.com
- **Documentation Swagger** : https://animal-shelter-api-yytb.onrender.com/api-docs
- **Documentation Postman** : https://documenter.getpostman.com/view/55051081/2sBYAyupaa

## Table des matières

- **Description**
- **Fonctionnalités**
- **Tech & architecture**
- **Base de données & seed**
- **Lancer le serveur en local**
- **Structure du projet**

## Description

API construite avec Express.js et PostgreSQL pour stocker et interroger les informations des animaux (type, sexe, race, issue/outcome, etc.) d'un refuge, avec plus de 5000 animaux importés depuis le dataset public de l'Austin Animal Center. Un frontend React permet de consulter et gérer ces données.

## Fonctionnalités

- Authentification par email/mot de passe (JWT) et par Google OAuth
- CRUD complet sur les animaux : `GET`/`POST`/`PUT`/`DELETE`
- Lecture (`GET`) accessible sans connexion, écriture réservée aux utilisateurs authentifiés
- Pagination sur la liste des animaux (20 par page maximum)
- Cache Redis sur les listes d'animaux, invalidé automatiquement à chaque création/modification/suppression
- Dashboard frontend pour gérer les animaux une fois connecté
- Documentation Swagger interactive et collection Postman publique

## Tech & architecture

- Backend : Node.js, Express
- Frontend : React, Vite
- Base de données : PostgreSQL
- Cache : Redis
- Authentification : JWT, Passport.js (stratégie Google OAuth2)
- Hébergement : Render (free tier)

## Base de données & seed

Le schéma SQL est disponible dans `schema.sql`.

`scripts/seed.js` importe les CSV présents dans `data/` et peuple les tables de référence et les données initiales.

## Lancer le serveur en local

```bash
npm install
node server.js
```

Le frontend se lance séparément :

```bash
cd frontend
npm install
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

## Endpoints principaux

- `GET /animals` : liste paginée des animaux (public)
- `GET /animals/:id` : détail d'un animal, par id ou external_id (public)
- `GET /animals/meta/types` : types d'animaux et types d'événements disponibles (public)
- `POST /animals` : créer un animal (authentifié)
- `PUT /animals/:id` : modifier un animal (authentifié)
- `DELETE /animals/:id` : supprimer un animal (authentifié)
- `POST /api/auth/login` : connexion par email/mot de passe
- `GET /api/auth/google` : connexion via Google

La liste complète et détaillée est disponible sur `/api-docs` (Swagger) et dans la documentation Postman ci-dessus.