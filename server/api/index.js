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

mutation init($bucket: String!, $key: String!, $body: String!) {
  s3 {
    createBucket(Bucket: $bucket)
    putObject(Bucket: $bucket, Key: $key, Body: $body)
  }
}

query read($bucket: String!, $key: String!) {
  s3 {
    getObject(Bucket: $bucket, Key: $key)
    listBuckets
    listObjects(Bucket: $bucket)
  }
}

mutation clean($bucket: String!, $key: String!) {
  s3 {
    deleteObject(Bucket: $bucket, Key: $key)
    deleteBucket(Bucket: $bucket)
  }
}`;

export const variables = {
  bucket: "my.name",
  key: "my.key",
  body: "my.body"
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