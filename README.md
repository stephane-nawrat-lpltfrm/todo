# Todo App - Vanilla JavaScript Edition

## Présentation
Ce projet est une application de gestion de tâches développée en JavaScript pur (ES6+). L'objectif principal était de mettre en œuvre une architecture pilotée par l'état (State-driven UI) sans l'utilisation de frameworks externes, afin de maîtriser la manipulation du DOM et la persistance des données.

## Fonctionnalités principales
- Gestion du CRUD (Create, Read, Update, Delete) pour les tâches.
- Mode édition dynamique avec basculement d'affichage (Input/Texte).
- Persistance locale des données (LocalStorage).
- Interface responsive optimisée pour les périphériques mobiles (cibles tactiles de 44px).
- Normalisation des entrées utilisateur (gestion des espaces et capitalisation).

## Installation et Utilisation
1. Installation des dépendances :
   npm install
2. Lancement de l'environnement de développement :
   npm run dev
3. Build pour la production :
   npm run build

## Structure du projet
- /src/index.js : Point d'entrée, gestion des événements et rendu du DOM.
- /src/storage.js : Module de gestion de la persistance des données.
- /src/style.css : Stylesheet utilisant des variables CSS pour la maintenabilité.
- /docs/ : Documentation technique détaillée.