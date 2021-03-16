const sinon = require("sinon");
const funcs = require("../index");
const axios = require("axios");

describe("FAKES", () => {
  let getBreedIdStub;
  let getStub;
  let fake;

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

    fake = sinon.fake.returns(
      new Promise((resolve) => setTimeout(resolve, 5000))
    );
  });

  afterEach(() => {
    getBreedIdStub.restore();
    getStub.restore();
    sinon.restore();
  });

  it("can be used w/ sinon.replace() to replace functionality", () => {
    sinon.replace(funcs, "setTimeoutPromise", fake);

    // asking to get the pic in 1 second, but due to the fake, we have to wait 5
    funcs.eventuallyGetCatPic("drex", 1000);
  });
});
