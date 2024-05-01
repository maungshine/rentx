import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AMAZON_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.NEXT_PUBLIC_AMAZON_S3_SECRET_KEY as string
    }
})