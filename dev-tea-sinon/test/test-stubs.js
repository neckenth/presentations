const { expect } = require("chai");
const sinon = require("sinon");
const funcs = require("../index");
const { breedIds } = require("../const");
const axios = require("axios");

describe("STUBS", () => {
  let getBreedIdStub;
  let getCatTemperamentStub;
  let getCatPicStub;
  let getStub;

  beforeEach(() => {
    // stub a synchronous func to force return value (e.g. generateAuthCode in Neolith auth flow)
    getBreedIdStub = sinon.stub(funcs, "getBreedId").returns("beng");

    // stub an async func to avoid network or db request and force immediate resolution of return value
    getCatTemperamentStub = sinon
      .stub(funcs, "getCatTemperament")
      // stub returns a Promise that resolves to the provided value
      .resolves("Munchkin cats are Agile, Easy Going, Intelligent, Playful!");

    // stub out different behaviors for different code paths (i.e. testing error handling)
    // can do this with callsFake (among other methods) - forces a fake function to be invoked when the stubbed func is called
    getCatPicStub = sinon.stub(funcs, "getCatPic").callsFake((id) => {
      if (!breedIds.includes(id)) {
        throw new Error("No cat pics match your provided breed name.");
      }
      return Promise.resolve();
    });

    // something more like what you'll see in Neolith - stubbing network responses
    // stub out the request library itself!
    getStub = sinon.stub(axios, "get").callsFake((req) => {
      if (req.includes("rando")) {
        throw new Error("No cat pics match your provided breed name.");
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
  });

  afterEach(() => {
    getBreedIdStub.restore();
    getCatTemperamentStub.restore();
    getCatPicStub.restore();
    getStub.restore();
  });

  it("getBreedId synchronously returns a `random` breedId per the stub", () => {
    const breedId = funcs.getBreedId();
    expect(breedId).to.equal("beng");
  });

  it("doSomething returns a Promise - resolves to the Munchkin temperament per the stub", async () => {
    // notice how even though we're forcing getBreedId() to return "beng", the "munc" temperament is returned
    const temperament = await funcs.doSomething(
      undefined,
      funcs.getCatTemperament,
      funcs.getCatPic
    );
    expect(temperament).to.equal(
      "Munchkin cats are Agile, Easy Going, Intelligent, Playful!"
    );
  });

  it("getCatPic properly throws an error if the provided breedId isn't included in API", async () => {
    // just testing an error is not thrown here
    const anotherBreedId = "chee";
    funcs.getCatPic(anotherBreedId);

    try {
      await funcs.getCatPic("westie");
    } catch (e) {
      // testing the assertion is thrown properly
      expect(e.message).to.equal("No cat pics match your provided breed name.");
    }

    try {
      await funcs.getCatTemperament("rando");
    } catch (e) {
      expect(e.message).to.equal("No cat pics match your provided breed name.");
    }

    // remove the wrapping getCatTemperamentStub to test the axios stub
    getCatTemperamentStub.restore();

    const cheetohTemperament = await funcs.getCatTemperament("chee");
    expect(cheetohTemperament).to.equal(
      "Cheetoh cats are Affectionate, Gentle, Intelligent, Social!"
    );
  });
});

// do spies next! (doSomething is a good one for this)
