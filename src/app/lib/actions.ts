'use server'

import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client, } from '@aws-sdk/client-s3';
import { lookup } from 'mime-types'; // to get MIME types from file extensions
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { cookies } from 'next/headers';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    }
});

export const listS3Files = async () => {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!, // Your S3 bucket name
        };

        const command = new ListObjectsV2Command(params);
        const data = await s3.send(command);

        // Return the list of files (objects) in the bucket
        return   await Promise.all((data.Contents || []).map(async (file) => {
            let preSignedUrl;
            if(process.env.AWS_S3_BUCKET_NAME && file.Key) preSignedUrl = await createPreSignedUrlWithClient(process.env.AWS_S3_BUCKET_NAME, file.Key);
            const mimeType= lookup(file.Key || '');
            return {
                key: file.Key,
                size: file.Size,
                lastModified: file.LastModified,
                mimeType, // Get the MIME type of the file
                ...(preSignedUrl && { preSignedUrl })
            }
        }));
    } catch (error) {
        console.error('Error fetching files from S3:', error);
        return [];
    }
}

export const listS3FilesCacheMiss = async () => {
    const _cookies = cookies();
    return listS3Files();
}

export const fileUploadFormData = async (form: FormData) => {
    try {
        const file = form.getAll('file')?.[0] as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: file.name,
            Body: buffer,
            ContentType: file.type,
        };
        const command = new PutObjectCommand(params);
        return await s3.send(command);
    } catch(e) {
        console.error(e);
    }
}

export const createPreSignedUrlWithClient = async (Bucket: string, Key: string) => {
    const command = new GetObjectCommand({ Bucket, Key });
    return await getSignedUrl(s3, command, { expiresIn: 360000 });
};