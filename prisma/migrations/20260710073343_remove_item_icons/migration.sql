-- Suppression des icônes par élément (les icônes sont désormais déduites des catégories côté front)
ALTER TABLE "Skill" DROP COLUMN "icon";
ALTER TABLE "Interest" DROP COLUMN "icon";
