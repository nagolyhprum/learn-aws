import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';

export const createBucket = (client, args, req) => {
  return new Promise((resolve, reject) => {
    client.createBucket({ 
      Bucket : args.bucket 
    }, (err, data) => {
      resolve(err ? `${err}` : null);
    });
  });
}

export const putObject = (client, args, req) => {
  return new Promise((resolve, reject) => {
    client.putObject({ 
      Bucket : args.bucket,
      Key : args.key,
      Body : args.body
    }, (err, data) => {
      resolve(err ? `${err}` : null);
    });
  });        
}

export const getObject = (client, args, ) => {        
  return new Promise((resolve, reject) => {
    client.getObject({ 
      Bucket : args.bucket,
      Key : args.key
    }, (err, data) => {
      resolve(err ? `${err}` : data.Body.toString("utf-8"));
    });
  });        
}

export default new GraphQLObjectType({
  name : "s3",
  fields : {
    createBucket : {
      type : GraphQLString,
      args : {
        bucket : {
          type : GraphQLString
        }
      },
      resolve : createBucket
    },

    putObject : {
      type : GraphQLString,
      args : {
        bucket : {
          type : GraphQLString        
        },
        key : {
          type : GraphQLString
        },
        body : {
          type : GraphQLString
        }
      },
      resolve : putObject
    },

    getObject : {
      //TODO : change type
      //"{\"LastModified\":\"2018-06-15T16:52:06.000Z\",\"ContentLength\":7,\"ETag\":\"\\\"438d4ab10c65f4523812335df8a32338\\\"\",\"ContentType\":\"application/octet-stream\",\"Metadata\":{},\"Body\":{\"type\":\"Buffer\",\"data\":[109,121,32,98,111,100,121]}}"
      type : new GraphQLNonNull(GraphQLString),
      args : {
        bucket : {
          type : GraphQLString        
        },
        key : {
          type : GraphQLString
        }        
      },
      resolve : getObject
    }
  }
});
