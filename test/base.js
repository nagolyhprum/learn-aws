const expect = require('chai').expect;
import Server from "../server/init.js";
import Client from "../client/index.js";

const app = {
  use : _ => _
};

describe("Codebase", () => {
  it("needs to be tested", () => {
    expect(Client()).to.be.equal(true);    
    expect(Server(app)).to.be.equal(app);    
  })
})