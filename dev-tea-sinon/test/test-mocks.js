const { expect } = require("chai");
const sinon = require("sinon");
const funcs = require("../index");
const { breedIds } = require("../const");
const axios = require("axios");
const { mock } = require("sinon");

describe("MOCKS", () => {
  let getBreedIdStub;
  let getStub;
  let mock;

  beforeEach(() => {
    getBreedIdStub = sinon.stub(funcs, "getBreedId").returns("beng");

    getStub = sinon.stub(axios, "get").callsFake((req) => {
      if (req.includes("rando")) {
        throw new Error("No cat pics match your provided breed name.");
      }
      if (req.includes("images")) {
        return Promise.resolve({
          data: [{ url: "https://cdn2.thecatapi.com/images/jnqO9lwG2.jpg" }],
        });
      }
      return Promise.resolve({
        data: [
          {
            name: "Cheetoh",
            temperament: "Affectionate, Gentle, Intelligent, Social",
            id: "chee",
          },
        ],
      });
    });

    mock = sinon.mock(funcs);

    // this is a fake to prevent images from opening in the browser during each test
    // will explain later
    const fake = sinon.fake.returns("coolio");
    sinon.replace(funcs, "specialOpen", fake);
  });

  afterEach(() => {
    getBreedIdStub.restore();
    getStub.restore();
    sinon.restore();
  });

  it("meow is called once each time we try to get a cat pic", () => {
    const expectation = mock.expects("meow");

    expectation.exactly(1);
    funcs.getCatPic("drex");

    // also restores mocked methods!
    mock.verify();
  });
});
