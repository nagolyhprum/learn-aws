//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/top-level-namespace.html

import graphqlHTTP from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import services from "./services";

import S3 from "./s3";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'AWS',
    fields: {
      s3 : {
        type : new GraphQLNonNull(S3),
        resolve : services.s3
      }
    }
  })
});

export default app => {
  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  }));
}