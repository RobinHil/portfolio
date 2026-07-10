# Images des projets de démonstration

Déposez ici les images de **vos** projets (formats : `jpg`, `jpeg`, `png`, `webp`, `gif`, `avif`),
puis référencez leurs noms de fichiers dans `server/plugins/seed.ts` (constante `SEED_PROJECTS`,
champs `image` pour la couverture et `gallery` pour le carrousel) - **avant le premier démarrage**.

Au premier lancement (base vide), ces fichiers sont importés automatiquement dans le stockage
d'uploads (le même que celui utilisé par l'interface admin) et servis sous `/uploads/…`.

Notes :

- Ce dossier ne sert **que** pour les données initiales. Une fois le site lancé, tout se gère
  depuis l'interface admin (upload direct, aucun fichier à déposer à la main).
- Une URL `https://` complète (ex. Unsplash) reste acceptée à la place d'un nom de fichier.
- Si un fichier référencé est manquant, le seed continue : couverture de secours pour l'image
  principale, entrée ignorée pour la galerie (un avertissement est loggé).
- Les fichiers `*.jpg` fournis par défaut sont des placeholders générés - remplacez-les librement
  (vous pouvez aussi changer les noms, tant que `seed.ts` est mis à jour en conséquence).
