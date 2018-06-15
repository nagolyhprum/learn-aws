import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';

export const createBucket = (client, args) => {
  return new Promise((resolve, reject) => {
    client.createBucket({ 
      Bucket : args.bucket 
    }, (err, data) => {
      resolve(err ? `${err}` : null);
    });
  });
}

export const putObject = (client, args) => {
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

export const getObject = (client, args) => {        
  return new Promise((resolve, reject) => {
    client.getObject({ 
      Bucket : args.bucket,
      Key : args.key
    }, (err, data) => {
      resolve(err ? `${err}` : data.Body.toString("utf-8"));
    });
  });        
}

export const listBuckets = (client) => {        
  return new Promise((resolve, reject) => {    
    client.listBuckets({}, (err, data) => {
      err ? reject(err) : resolve(data.Buckets.map(bucket => bucket.Name));
    });
  });        
}

export const listObjects = (client, args) => {        
  return new Promise((resolve, reject) => {    
    client.listObjects({
      Bucket : args.bucket
    }, (err, data) => {
      err ? reject(err) : resolve(data.Contents.map(object => object.Key));
    });
  });        
}

export default {

  query : new GraphQLObjectType({
    name : "s3_query",
    fields : {
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
      },

      listBuckets : {
        //TODO : update with create date and what not
        type : new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        resolve : listBuckets
      },

      listObjects : {
        //TODO : update with create date and what not
        type : new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        args : {
          bucket : {
            type : GraphQLString        
          }
        },
        resolve : listObjects
      }
    }
  }),

  mutation : new GraphQLObjectType({
    name : "s3_mutation",
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
      }
    }
  })

}
