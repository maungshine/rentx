import { PrismaClient } from '@prisma/client'


// use `prisma` in your application to read and write data in your DB
let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    db = new PrismaClient();
} else {
    //@ts-ignore
    if (!global['db']) {
        //@ts-ignore
        global.db = new PrismaClient();
    }
    //@ts-ignore
    db = global.db;
}





export default db;