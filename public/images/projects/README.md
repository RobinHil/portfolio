# Images des projets

Les captures affichées sur `/projets` et dans la modale de détail. Formats
servis tels quels, sans redimensionnement : `jpg`, `jpeg`, `png`, `webp`,
`gif`, `avif`.

Pour ajouter une image, la déposer ici puis la référencer dans
`utils/content.ts` (tableau `PROJECTS`, champ `imageUrl` pour la couverture,
`gallery` pour le carrousel) par son chemin public complet, par exemple
`/images/projects/ma-capture.jpg`. Ne pas préfixer le chemin de base du
déploiement : c'est le composant `ProjectImage` qui le résout.

Notes :

- Une URL `https://` complète (Unsplash par exemple) reste acceptée à la place
  d'un chemin local.
- Rien ne redimensionne ni ne recompresse ces fichiers au build. Ils partent
  dans l'artefact tels quels, donc une capture de 2 Mo coûte 2 Mo à chaque
  visiteur qui ouvre la page : les compresser avant de les déposer.
- Les fichiers présents sont des captures réelles des applications. Ils
  peuvent être remplacés ou renommés librement, tant que `utils/content.ts`
  est mis à jour en conséquence.
