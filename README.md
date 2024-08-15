# Collecte de Cadeaux et de [Vœux d'Anniversaire](https://hbd.meshavegas.com/)

Ce projet est une application web développée avec React et Vite, permettant de collecter des cadeaux et des vœux d'anniversaire. Les utilisateurs peuvent envoyer des messages et des cadeaux, qui sont ensuite affichés sur le site de manière organisée.

## Fonctionnalités

- **Collecte de messages** : Les utilisateurs peuvent envoyer des vœux d'anniversaire via un formulaire.
- **Affichage des meilleurs vœux et cadeaux** : Les messages et cadeaux les plus populaires sont affichés en haut de la page.
- **Envoi de cadeaux** : Les utilisateurs peuvent envoyer des cadeaux virtuels à l'utilisateur célébrant son anniversaire.
- **Validation de paiement** : Un système de validation pour les paiements des cadeaux est intégré.
- **Responsive** : L'interface s'adapte aux différentes tailles d'écran.

## Technologies Utilisées

- **React** : Pour la création de l'interface utilisateur.
- **Vite** : Pour le bundling et le développement rapide de l'application.
- **Firebase** : Pour la gestion de la base de données et le stockage des fichiers.
- **Formik** : Pour la gestion des formulaires.
- **Ant Design** : Pour les composants de l'interface utilisateur.
- **Iconsax** : Pour les icônes utilisées dans l'application.
- **Axios** : Pour les appels HTTP.
- **Swiper** : Pour le carrousel d'images (commenté mais prêt à l'utilisation).
- **PrimeFlex** : Pour la gestion des layouts et des composants flexibles.

## Installation et Démarrage

### Prérequis

- Node.js (version 14 ou supérieure)
- NPM ou Yarn

### Étapes d'installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/meshavegas/AnivApp.git
   ```
2. Accédez au dossier du projet :
   ```bash
   cd AnivApp
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

### Lancement de l'application

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
   ou
   ```bash
   yarn dev
   ```
2. Ouvrez votre navigateur et accédez à `http://localhost:3000`.

## Configuration Firebase

1. Créez un projet Firebase sur [Firebase Console](https://console.firebase.google.com/).
2. Ajoutez un fichier `fb-conf.js` à la racine de votre projet avec les configurations Firebase :
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { getStorage } from "firebase/storage";

   const firebaseConfig = {
     apiKey: "VOTRE_API_KEY",
     authDomain: "VOTRE_AUTH_DOMAIN",
     projectId: "VOTRE_PROJECT_ID",
     storageBucket: "VOTRE_STORAGE_BUCKET",
     messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
     appId: "VOTRE_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);
   const storage = getStorage(app);

   export { db, storage };
   ```
3. Remplissez ce fichier avec les informations de configuration Firebase obtenues depuis la console Firebase.

## Contribution

Les contributions sont les bienvenues ! Si vous avez des idées d'amélioration ou de nouvelles fonctionnalités, n'hésitez pas à soumettre une issue ou une pull request.

## License

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.

## Auteurs

- **Mesha Vegas** - *Développeur principal* - [Votre Profil GitHub](https://github.com/meshavegas)

---
