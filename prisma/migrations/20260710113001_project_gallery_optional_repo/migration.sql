-- Ajout de la galerie d'images et passage du lien de dépôt en optionnel
ALTER TABLE "Project" ADD COLUMN "gallery" TEXT NOT NULL DEFAULT '[]';

-- SQLite ne permet pas de modifier la nullabilité d'une colonne : recréation de la table
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "repoUrl" TEXT,
    "demoUrl" TEXT,
    "imageUrl" TEXT NOT NULL,
    "gallery" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("id", "title", "description", "tags", "repoUrl", "demoUrl", "imageUrl", "gallery", "order", "createdAt", "updatedAt")
    SELECT "id", "title", "description", "tags", "repoUrl", "demoUrl", "imageUrl", "gallery", "order", "createdAt", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
