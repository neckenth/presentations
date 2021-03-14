const sinon = require("sinon");
const mock = require("mock-require");
const funcs = require("../index");
const { breedIds } = require("../const");
const axios = require("axios");
const { request } = require("http");
// const { open } = require("open");
const proxyquire = require("proxyquire");
const { getCatPic } = require("../index");

describe("SPIES", () => {
  let getBreedIdStub;
  let getStub;
  let getCatTemperamentSpy;
  let getCatPicSpy;

  beforeEach(() => {
    // stub a synchronous func to force return value (e.g. generateAuthCode in Neolith auth flow)
    getBreedIdStub = sinon.stub(funcs, "getBreedId").returns("beng");
    getCatPicSpy = sinon.spy(funcs, "getCatPic");
    getCatTemperamentSpy = sinon.spy(funcs, "getCatTemperament");

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
  });

  afterEach(() => {
    getBreedIdStub.restore();
    getStub.restore();
    getCatPicSpy.restore();
    getCatTemperamentSpy.restore();
  });

  it("anonymous function spies", () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    funcs.doSomething("chee", callback1, callback2);

    sinon.assert.notCalled(callback1);
    sinon.assert.calledOnceWithExactly(callback2, "chee");

    const callback3 = sinon.spy();
    const callback4 = sinon.spy();

    funcs.doSomething(undefined, callback3, callback4);

    sinon.assert.calledOnceWithExactly(callback3, "beng");
    sinon.assert.notCalled(callback4);
  });

  it("wrapping all/specific object methods", () => {
    funcs.doSomething(undefined, funcs.getCatPic, funcs.getCatTemperament);

    sinon.assert.notCalled(funcs.getCatTemperament);
    sinon.assert.calledOnceWithExactly(funcs.getCatPic, "beng");
  });
  it("wrapping all/specific object methods", () => {
    funcs.doSomething("chee", funcs.getCatPic, funcs.getCatTemperament);

    sinon.assert.notCalled(funcs.getCatPic);
    sinon.assert.calledOnceWithExactly(funcs.getCatTemperament, "chee");
  });

  // it("testing something", () => {
  //   delete require.cache[require.resolve("open")];
  //   // Second we need rewrite the cached sum module to be as follows:
  //   require.cache[require.resolve("open")] = {
  //     exports: sinon.stub(),
  //   };
  //   // Third we need to require the doStuff module again
  //   require("open");
  //   const openStub = sinon.stub(open, "index.open");
  //   funcs.getCatPic("munc");

  //   // console.log("OPEN SPY", openSpy.getCalls());
  //   openStub.restore();
  // });

  // TO ADD - STUBBING OUT REQUIRED MODULES - DON'T WANT TO ACTUALLY CALL OPEN
});
