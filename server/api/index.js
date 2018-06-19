//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/top-level-namespace.html

import graphqlHTTP from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import services from "./services";
import bodyParser from "body-parser";

import S3 from "./s3";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'aws_query',
    fields: {
      s3 : {
        type : new GraphQLNonNull(S3.query),
        resolve : services.s3
      }
    }
  }),
  mutation : new GraphQLObjectType({
    name: 'aws_mutation',
    fields: {
      s3 : {
        type : new GraphQLNonNull(S3.mutation),
        resolve : services.s3
      }
    }
  })
});

export const query = `#call init then read then clean
mutation init($bucket: String!, $key: String!, $body: String!, $source: String!, $copy: String!) {
  s3 {
    createBucket(Bucket: $bucket)
    putObject(Bucket: $bucket, Key: $key, Body: $body)
    copyObject(Bucket: $bucket, Key: $copy, CopySource: $source)
  }
}

query read($bucket: String!, $key: String!, $copy: String!) {
  s3 {
    key: getObject(Bucket: $bucket, Key: $key)
    copy: getObject(Bucket: $bucket, Key: $copy)
    listBuckets
    listObjects(Bucket: $bucket)
  }
}

mutation clean($bucket: String!, $key: String!, $copy: String!) {
  s3 {
    key: deleteObject(Bucket: $bucket, Key: $key)
    copy: deleteObject(Bucket: $bucket, Key: $copy)
    deleteBucket(Bucket: $bucket)
  }
}

query createPresignedPost($key: String!, $bucket: String!) {
  s3 {
    createPresignedPost(Key: $key, Bucket: $bucket) {
      url
      fields {
        bucket
        XAmzAlgorithm
        XAmzCredential
        XAmzDate
        Policy
        XAmzSignature
      }
    }
  }
}
`;

export const variables = {
  bucket: "my.bucket",
  key: "my.key",
  body: "my.body",
  copy : "my.copy",
  source : "my.bucket/my.key"
};

export const gqlDefaultMiddleware = (req, res, next) => {    
  req.body.query = req.body.query || query;
  req.body.variables = req.body.variables || variables;
  next();
};

export default app => {
  app.use(bodyParser.json());
  app.use(gqlDefaultMiddleware);
  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  }));
}