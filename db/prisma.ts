import { PrismaClient } from '@prisma/client'


// use `prisma` in your application to read and write data in your DB
let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    db = new PrismaClient();
} else {
    if (!global.db) {
        global.db = new PrismaClient();
    }
    db = global.db;
}



export default db;