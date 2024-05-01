-- CreateTable
CREATE TABLE "UserListings" (
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "asignedBy" TEXT NOT NULL,

    PRIMARY KEY ("userId", "listingId"),
    CONSTRAINT "UserListings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserListings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
