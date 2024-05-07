-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "profileImageUrl" TEXT,
    "profileImageKey" TEXT,
    "role" TEXT NOT NULL,
    "emailVerified" BOOLEAN,
    "provider" TEXT NOT NULL,
    "verificationCode" TEXT,
    "codeExpiredTime" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserListings" (
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "asignedBy" TEXT NOT NULL,

    CONSTRAINT "UserListings_pkey" PRIMARY KEY ("userId","listingId")
);

-- CreateTable
CREATE TABLE "Favourites" (
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "asignedBy" TEXT NOT NULL,

    CONSTRAINT "Favourites_pkey" PRIMARY KEY ("userId","listingId")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'No Description',
    "township" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "img_key" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "street" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "township" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "num" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Amenties" (
    "bedroom" INTEGER NOT NULL,
    "bath" INTEGER NOT NULL,
    "parking" BOOLEAN NOT NULL,
    "listingId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Location_listingId_key" ON "Location"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Amenties_listingId_key" ON "Amenties"("listingId");

-- AddForeignKey
ALTER TABLE "UserListings" ADD CONSTRAINT "UserListings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserListings" ADD CONSTRAINT "UserListings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amenties" ADD CONSTRAINT "Amenties_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
