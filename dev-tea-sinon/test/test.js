const assert = require("assert");
const { expect } = require("chai");
const sinon = require("sinon");
const funcs = require("../index");

describe("doSomething", () => {
  it("returns the correct temperament when callback is getCatTemperament", () => {
    // stub a synchronous func to force return value
    const getBreedIdStub = sinon.stub(funcs, "getBreedId").returns("beng");

    // stub an async func to avoid network request and force immediate resolution of return value
    const getCatTemperamentStub = sinon
      .stub(funcs, "getCatTemperament")
      .resolves("Munchkin cats are Agile, Easy Going, Intelligent, Playful!");

    const temperament = funcs.doSomething(undefined, funcs.getCatTemperament);

    // notice how even though we're forcing getBreedId() to return "beng", the "munc" temperament is returned
    console.log("TEMPERAMENT", temperament);
    getBreedIdStub.restore();
    getCatTemperamentStub.restore();
  });
});
