/*
  Warnings:

  - Added the required column `availability` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationListingId` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listing_id" TEXT NOT NULL,
    CONSTRAINT "Image_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "street" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "township" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    CONSTRAINT "Location_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Amenties" (
    "bedroom" INTEGER NOT NULL,
    "bath" INTEGER NOT NULL,
    "parking" BOOLEAN NOT NULL,
    "listingId" TEXT NOT NULL,
    CONSTRAINT "Amenties_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "locationListingId" TEXT NOT NULL
);
INSERT INTO "new_Listing" ("id") SELECT "id" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Location_listingId_key" ON "Location"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Amenties_listingId_key" ON "Amenties"("listingId");
