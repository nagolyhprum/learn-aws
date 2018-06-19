import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean
} from 'graphql';

const NNBoolean = new GraphQLNonNull(GraphQLBoolean),
  NNString = new GraphQLNonNull(GraphQLString),
  NNList = type => new GraphQLNonNull(new GraphQLList(type));

export const createBucket = (client, args) => {
  return new Promise((resolve, reject) => {
    client.createBucket(args, (err, data) => {
      err ? reject(err) : resolve(true);
    });
  });
}

export const putObject = (client, args) => {
  return new Promise((resolve, reject) => {
    client.putObject(args, (err, data) => {
      err ? reject(err) : resolve(true);
    });
  });        
}

export const getObject = (client, args) => {        
  return new Promise((resolve, reject) => {
    client.getObject(args, (err, data) => {
      err ? reject(err) : resolve(data.Body.toString("utf-8"));
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
    client.listObjects(args, (err, data) => {
      err ? reject(err) : resolve(data.Contents.map(object => object.Key));
    });
  });        
}

export const deleteBucket = (client, args) => {
  return new Promise((resolve, reject) => {
    client.deleteBucket(args, (err, data) => {
      err ? reject(err) : resolve(true);
    });
  }); 
};

export const deleteObject = (client, args) => {
  return new Promise((resolve, reject) => {
    client.deleteObject(args, (err, data) => {
      err ? reject(err) : resolve(true);
    });
  }); 
};

export const copyObject = (client, args) => {
  return new Promise((resolve, reject) => {
    client.copyObject(args, (err, data) => {
      err ? reject(err) : resolve(true);
    });
  }); 
};

export const uploadMultipart = (client, args) => {
  const {
    Bucket,
    Key,
    Body
  } = args;
  return new Promise((resolve, reject) => {
    client.createMultipartUpload({ Key, Bucket }, (err, data) => {
      if(err) return reject(err);
      const { UploadId } = data;
      const ContentLength = 1024 * 1024 * 5; //must be > 5mb
      Promise.all(
        Array.from({ length : Math.ceil(Body.length / ContentLength) }).map((_, i) => new Promise((resolve, reject) => {
          const start = i * ContentLength;
          const end = Math.min(start + ContentLength, Body.length);
          client.uploadPart({        
            Body: Body.slice(start, end), 
            Key,
            Bucket,
            PartNumber : i + 1, 
            UploadId
          }, (err, data) => err ? reject(err) : resolve({ ETag : data.ETag, PartNumber : i + 1 }))
        }))
      ).then(Parts => new Promise((resolve, reject) => {
        client.completeMultipartUpload({
          Bucket, 
          Key, 
          MultipartUpload: { Parts }, 
          UploadId
        }, (err, data) => err ? reject(err) : resolve(true))
      })).then(resolve).catch((uploadError) => {
        client.abortMultipartUpload({ Bucket, Key, UploadId }, abortErr => abortErr ? reject(abortErr) : reject(uploadError))
      });
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
        type : NNString,
        args : {
          Bucket : {
            type : NNString        
          },
          Key : {
            type : NNString
          }        
        },
        resolve : getObject
      },

      listBuckets : {
        //TODO : update with create date and what not
        type : NNList(NNString),
        resolve : listBuckets
      },

      listObjects : {
        //TODO : update with create date and what not
        type : NNList(NNString),
        args : {
          Bucket : {
            type : NNString        
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
        type : NNBoolean,
        args : {
          Bucket : {
            type : NNString
          }
        },
        resolve : createBucket
      },

      putObject : {
        type : NNBoolean,
        args : {
          Bucket : {
            type : NNString        
          },
          Key : {
            type : NNString
          },
          Body : {
            type : NNString
          }
        },
        resolve : putObject
      },

      deleteBucket : {
        type : NNBoolean,
        args : {
          Bucket : {
            type : NNString
          }
        },
        resolve : deleteBucket        
      },

      deleteObject : {
        type : NNBoolean,
        args : {
          Bucket : {
            type : NNString        
          },
          Key : {
            type : NNString
          }
        },
        resolve : deleteObject
      },

      copyObject : {
        type : NNBoolean,
        args : {
          Bucket : {
            type : NNString
          },
          CopySource : {
            type : NNString
          },
          Key : {
            type : NNString
          }
        },
        resolve : copyObject
      }
    }
  })

}
