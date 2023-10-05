import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.BUCKET_REGION;

console.log("accessKeyId: ", accessKeyId);

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error("Missing AWS credentials or region");
}

const publicBucketName = process.env.PUBLIC_BUCKET_NAME;
const privateBucketName = process.env.PRIVATE_BUCKET_NAME;
if (!publicBucketName || !privateBucketName) {
  throw new Error("Missing bucket name");
}

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

async function getObjectURL(key: string) {
    const cmd = new GetObjectCommand({
        Bucket: publicBucketName,
        Key: key,
    });
    console.log("cmd: ", cmd);
    const url = await getSignedUrl(s3Client, cmd, { expiresIn: 60 });
    return url;
}

async function main() {
    console.log("URL: ", await getObjectURL("bikram.jpg"));
}

main();