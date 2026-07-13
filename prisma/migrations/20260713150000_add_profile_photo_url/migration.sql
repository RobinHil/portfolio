-- Ajout de la photo de profil éditable depuis l'admin
ALTER TABLE "Profile" ADD COLUMN "photoUrl" TEXT NOT NULL DEFAULT '/images/profile.jpg';
