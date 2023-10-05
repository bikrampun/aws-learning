import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
        Bucket: privateBucketName,
        Key: key,
    });
    console.log("cmd: ", cmd);
    const url = await getSignedUrl(s3Client, cmd, { expiresIn: 60 });
    return url;
}

async function putObject(filename: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: privateBucketName,
    Key: `uploads/${filename}`,
    ContentType: contentType,
  });
  console.log("cmd: ", cmd);
  const url = await getSignedUrl(s3Client, cmd, { expiresIn: 180 });
  return url;
}

async function listObjects() {
  const cmd = new ListObjectsV2Command({
    Bucket: privateBucketName,
  });
  console.log("cmd: ", cmd);
  const result = await s3Client.send(cmd);
  console.log("result: ", result);
}

function deleteObject(key: string) {
  const cmd = new DeleteObjectCommand({
    Bucket: privateBucketName,
    Key: key,
  });
  const result = s3Client.send(cmd);
  return result;
}

async function main() {
    console.log("URL: ", await getObjectURL("uploads/img-1696499868012.jpeg"));
}
async function upload() {
  console.log("URL for uploading: ", await putObject(`img-${Date.now()}.jpeg`, "image/jpeg"));
}
// main();

// upload();
deleteObject("Feed.mp4");
listObjects();