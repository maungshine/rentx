-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'No Description',
    "township" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);
INSERT INTO "new_Listing" ("availability", "id", "latitude", "longitude", "price", "title", "township", "type") SELECT "availability", "id", "latitude", "longitude", "price", "title", "township", "type" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
