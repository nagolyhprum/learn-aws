import S3 from 'aws-sdk/clients/s3';

const config = port => ({
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey",
    region: "local",
    endpoint : `http://localstack:${port}`,
    apiVersions: {
      s3: "2006-03-01"
    }
});

export default {
  s3 : () => new S3(config(4572))
}