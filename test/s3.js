import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { 
  createBucket,
  putObject,
  getObject,
  listBuckets,
  listObjects,
  deleteBucket,
  deleteObject,
  copyObject,
  uploadMultipart
} from "../server/api/s3";
import services from "../server/api/services";
const integrationS3 = services.s3();
chai.use(chaiAsPromised);

const repeater = (input, times) => Array.from({ length : times }).map(() => input).join("");

const Bucket = "my.unique.bucket.name",
  Key = "my.key",
  Body = "my.body",
  DNE = "my.dne",
  Copy = "my.copy",
  MulipartKey = "my.multipart",
  MulipartBody = repeater(repeater(repeater("0", 7), 1024), 1025);

describe("s3", () => {
  describe("createBucket", () => {    
    it("creates bucket", () => {
      return expect(createBucket(integrationS3, {
        Bucket
      })).to.eventually.be.true;
    });
    it("prevents duplicate buckets", () => {
      return expect(createBucket(integrationS3, {
        Bucket
      })).to.eventually.be.rejected;
    });
  });
  describe("uploadMultipart", () => {
    it("uploads a document", () => {
      return uploadMultipart(integrationS3, {
        Bucket,
        Key : MulipartKey,
        Body : MulipartBody
      }).then(success => {
        expect(success).to.be.true;
        return getObject(integrationS3, {
          Bucket,
          Key : MulipartKey
        }).then(data => {
          expect(data).to.be.equal(MulipartBody);
        });
      })
    })
  })
  describe("putObject", () => {
    it("puts a new object to the bucket", () => {
      return expect(putObject(integrationS3, {
        Bucket,
        Key,
        Body
      })).to.eventually.be.true;      
    });
    it("cant put to non existant bucket", () => {
      return expect(putObject(integrationS3, {
        Bucket : DNE,
        Key,
        Body
      })).to.eventually.be.rejected;      
    })
  });
  describe("copyObject", () => {
    it("copies the object", () => {
      return expect(copyObject(integrationS3, {        
        Bucket, 
        CopySource : `${Bucket}/${Key}`, 
        Key : Copy
      })).to.eventually.be.true;
    })
    it("cannot copy dne", () => {
      return expect(copyObject(integrationS3, {        
        Bucket, 
        CopySource : `${DNE}/${DNE}`, 
        Key : Copy
      })).to.eventually.be.rejected;
    })
  })
  describe("getObject", () => {
    it("get an existing object from the bucket", () => {
      return Promise.all([
        expect(getObject(integrationS3, {
          Bucket,
          Key
        })).to.eventually.equal(Body),
        expect(getObject(integrationS3, {
          Bucket,
          Key : Copy
        })).to.eventually.equal(Body)
      ]);
    });
    it("cant get non existant item", () => {
      return expect(getObject(integrationS3, {
        Bucket,
        Key : DNE
      })).to.eventually.be.rejected;      
    })
  });
  describe("listBuckets", () => {
    it("lists all bucket names", () => {
      return expect(listBuckets(integrationS3)).to.eventually.deep.equal([Bucket]);
    })
    it("fails with rejection", () => {
      return expect(listBuckets({
        listBuckets : (args, callback) => callback(new Error())
      })).to.eventually.be.rejected;
    })
  })
  describe("listObjects", () => {
    it("list all objects in bucket", () => {
      return expect(listObjects(integrationS3, {
        Bucket
      })).to.eventually.deep.equal([Copy, Key, MulipartKey]);      
    });
    it("cannot list objects in non-existant bucket", () => {
      return expect(listObjects(integrationS3, {
        Bucket : DNE
      })).to.eventually.be.rejected;    
    });
  });
  describe("deleteBucket / deleteObject", () => {
    it("deletes a bucket", () => {
      return Promise.all([
        deleteObject(integrationS3, {
          Bucket,
          Key
        }),
        deleteObject(integrationS3, {
          Bucket,
          Key : Copy
        }),
        deleteObject(integrationS3, {
          Bucket,
          Key : MulipartKey
        })        
      ]).then(([a, b, c]) => {
        expect(a).to.be.true;
        expect(b).to.be.true;
        expect(c).to.be.true;
        return expect(deleteBucket(integrationS3, {
          Bucket
        })).to.eventually.be.true
      })
    })
    it("cannot delete non-existant buckets or keys", () => {
      return Promise.all([
        expect(deleteBucket(integrationS3, {
          Bucket
        })).to.eventually.be.rejected,
        expect(deleteObject(integrationS3, {
          Bucket,
          Key
        })).to.eventually.be.rejected
      ])
    })
  })
});