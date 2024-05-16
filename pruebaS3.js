import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "./env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

process.env.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID;
process.env.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;

// const s3 = new S3Client({
//   region: "eu-north-1",
//   endpoint: "http://s3.eu-north-1.amazonaws.com",
// });

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  endpoint: "http://s3.eu-north-1.amazonaws.com",
});

const poner = async () => {
  try {
    const params = {
      Bucket: "surflog-archivos",
      Key: "hello-sb3.txt",
      Body: "Hello S3!",
    };
    await s3.send(new PutObjectCommand(params));
    console.log("Object uploaded successfully!");
  } catch (error) {
    console.error("Error uploading object:", error);
  }
};

const getFromS3 = async (ruta) => {
  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    endpoint: "http://s3.eu-north-1.amazonaws.com",
  });
  const command = new GetObjectCommand({
    Bucket: "surflog-archivos",
    Key: ruta,
    ACL: "public-read",
  });
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.log(url);
  return url;
};

const deleteFromS3 = async (ruta) => {
  const s3 = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    endpoint: "http://s3.eu-north-1.amazonaws.com",
  });
  const params = {
    Bucket: "surflog-archivos",
    Key: ruta,
  };
  const command = new DeleteObjectCommand(params);
  return await s3.send(command);
};

// await poner();
// await getFromS3("terminator.jpg");
await deleteFromS3("terminator.jpg");
