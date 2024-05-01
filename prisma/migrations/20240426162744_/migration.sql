-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Amenties" (
    "bedroom" INTEGER NOT NULL,
    "bath" INTEGER NOT NULL,
    "parking" BOOLEAN NOT NULL,
    "listingId" TEXT NOT NULL,
    CONSTRAINT "Amenties_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Amenties" ("bath", "bedroom", "listingId", "parking") SELECT "bath", "bedroom", "listingId", "parking" FROM "Amenties";
DROP TABLE "Amenties";
ALTER TABLE "new_Amenties" RENAME TO "Amenties";
CREATE UNIQUE INDEX "Amenties_listingId_key" ON "Amenties"("listingId");
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "img_key" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    CONSTRAINT "Image_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "img_key", "listing_id", "url") SELECT "id", "img_key", "listing_id", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Location" (
    "street" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "township" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "num" TEXT NOT NULL,
    CONSTRAINT "Location_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Location" ("city", "listingId", "num", "street", "township", "ward") SELECT "city", "listingId", "num", "street", "township", "ward" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE UNIQUE INDEX "Location_listingId_key" ON "Location"("listingId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
