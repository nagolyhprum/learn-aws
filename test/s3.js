import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { 
  createBucket,
  putObject,
  getObject,
  listBuckets,
  listObjects,
  deleteBucket,
  deleteObject
} from "../server/api/s3";
import services from "../server/api/services";
const integrationS3 = services.s3();
chai.use(chaiAsPromised);
describe("s3", () => {
  const Bucket = "my.unique.bucket.name",
    Key = "mykey",
    Body = "mybody",
    BucketDNE = "bucket.dne",
    KeyDNE = "key.dne";
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
        Bucket : BucketDNE,
        Key,
        Body
      })).to.eventually.be.rejected;      
    })
  });
  describe("getObject", () => {
    it("get an existing object from the bucket", () => {
      return expect(getObject(integrationS3, {
        Bucket,
        Key
      })).to.eventually.equal(Body);      
    });
    it("cant get non existant item", () => {
      return expect(getObject(integrationS3, {
        Bucket,
        Key : KeyDNE
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
      })).to.eventually.deep.equal([Key]);      
    });
    it("cannot list objects in non-existant bucket", () => {
      return expect(listObjects(integrationS3, {
        Bucket : BucketDNE
      })).to.eventually.be.rejected;    
    });
  });
  describe("deleteBucket", () => {
    it("deletes a bucket", () => {
      return deleteObject(integrationS3, {
        Bucket,
        Key
      }).then(deleted => {
        expect(deleted).to.be.true;
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