/*
  Warnings:

  - You are about to drop the column `locationListingId` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `img_key` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "img_key" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    CONSTRAINT "Image_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "listing_id") SELECT "id", "listing_id" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "township" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);
INSERT INTO "new_Listing" ("availability", "id", "price", "title", "township", "type") SELECT "availability", "id", "price", "title", "township", "type" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE TABLE "new_Location" (
    "street" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "township" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "num" TEXT NOT NULL,
    CONSTRAINT "Location_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Location" ("city", "listingId", "street", "township", "ward") SELECT "city", "listingId", "street", "township", "ward" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE UNIQUE INDEX "Location_listingId_key" ON "Location"("listingId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
