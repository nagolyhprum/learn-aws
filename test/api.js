import { expect } from "chai";
import {
  gqlDefaultMiddleware,
  query,
  variables
} from "../server/api";
describe("api", () => {
  describe("gqlDefaultMiddleware", () => {
    it("sets up the request with default parameters", () => {
      const req = { body : {} };
      gqlDefaultMiddleware(req, null, () => {
        expect(req).to.be.deep.equal({
          body : {
            query,
            variables
          }
        })
      })
    })
  })
})