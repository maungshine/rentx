/*
  Warnings:

  - Added the required column `township` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "township" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "locationListingId" TEXT NOT NULL
);
INSERT INTO "new_Listing" ("availability", "id", "locationListingId", "price", "title", "type") SELECT "availability", "id", "locationListingId", "price", "title", "type" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
