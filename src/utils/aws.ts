import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { AWSTemporaryCredentials } from "@/types";

export const uploadToS3 = async (
  file: File,
  awsTempCreds: AWSTemporaryCredentials,
) => {
  const s3 = new S3Client({
    region: awsTempCreds.region,
    credentials: {
      accessKeyId: awsTempCreds.access_key_id,
      secretAccessKey: awsTempCreds.secret_key,
      sessionToken: awsTempCreds.session_token,
      expiration: new Date(awsTempCreds.expiration),
    },
  });
  const fileKey = `${awsTempCreds.identity_id}/${Date.now()}-${file.name}`;

  const uploadParams = {
    Bucket: awsTempCreds.bucket,
    Key: fileKey,
    Body: file,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(uploadParams);
  const s3Response = await s3.send(command);
  return { s3Response, fileKey };
};
