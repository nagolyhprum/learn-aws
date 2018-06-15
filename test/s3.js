import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { 
  createBucket,
  putObject,
  getObject,
  listBuckets
} from "../server/api/s3";
import services from "../server/api/services";
const integrationS3 = services.s3();
chai.use(chaiAsPromised);
describe("s3", () => {
  const bucket = "my.unique.bucket.name",
    key = "mykey",
    body = "mybody";
  describe("createBucket", () => {    
    it("creates bucket", () => {
      return expect(createBucket(integrationS3, {
        bucket
      })).to.eventually.not.exist;
    });
    it("prevents duplicate buckets", () => {
      return expect(createBucket(integrationS3, {
        bucket
      })).to.eventually.exist;
    });
  });
  describe("putObject", () => {
    it("puts a new object to the bucket", () => {
      return expect(putObject(integrationS3, {
        bucket,
        key,
        body
      })).to.eventually.not.exist;      
    });
    it("cant put to non existant bucket", () => {
      return expect(putObject(integrationS3, {
        bucket : "bucket.dne",
        key,
        body
      })).to.eventually.exist;      
    })
  });
  describe("getObject", () => {
    it("get an existing object from the bucket", () => {
      return expect(getObject(integrationS3, {
        bucket,
        key
      })).to.eventually.equal(body);      
    });
    it("cant get non existant item", () => {
      return expect(getObject(integrationS3, {
        bucket,
        key : "key.dne"
      })).to.eventually.exist;      
    })
  });
  describe("listBuckets", () => {
    it("lists all bucket names", () => {
      return expect(listBuckets(integrationS3)).to.eventually.deep.equal([bucket]);
    })
  })
});