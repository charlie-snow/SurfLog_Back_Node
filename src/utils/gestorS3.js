import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// PARA NODE:
import { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID } from "../../env.js";
// PARA NODE

export const uploadToS3 = async (archivo, ruta) => {
  try {
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
      Body: archivo,
    };

    await s3.send(new PutObjectCommand(params));
    console.log("Object uploaded successfully!");
  } catch (error) {
    console.error("Error uploading object:", error);
  }
};

export const getFromS3 = async (ruta) => {
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
  console.log("url img: ");
  console.log(url);
  return url;
};

export const deleteFromS3 = async (ruta) => {
  console.log("Ruta: " + ruta);

  try {
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
    await s3.send(command);
    console.log("El archivo ha sido borrado: " + ruta);
    // return await s3.send(command);
  } catch (error) {
    console.log("Error borrando el archivo: " + ruta + " - error: " + error);
  }
};
