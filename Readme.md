# My API 

## Choix de la stack : 

Framework : Express JS
Base : Postgre SQL

## Création d'un schéma de données

C'est une base de données qui suit chaque animal dans un refuge : son identité, son type, son sexe, sa race, et son sort final (adopté, transféré, euthanasié…), avec des tables de référence pour éviter les doublons et des index pour que les recherches restent rapides.

## Création de la base de données

Nom de la base de données : ASD (Acronyme de : Animal Shelter Data)

## Architecture

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
  middlewares/
    auth.middleware.js
  db/
    pool.js
  cache/
    redis.js
```

feature-based avec une petite séparation controller/service/repository à l'intérieur de chaque feature