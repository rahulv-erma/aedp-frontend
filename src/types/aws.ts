export type AWSTemporaryCredentials = {
  identity_id: string;
  access_key_id: string;
  secret_key: string;
  session_token: string;
  expiration: Date;
  region: string;
  bucket: string;
};
