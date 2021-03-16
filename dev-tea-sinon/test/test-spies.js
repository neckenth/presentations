const sinon = require("sinon");
const funcs = require("../index");
const axios = require("axios");

describe("SPIES", () => {
  let getBreedIdStub;
  let getStub;
  let getCatTemperamentSpy;
  let getCatPicSpy;

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
    getCatPicSpy = sinon.spy(funcs, "getCatPic");
    getCatTemperamentSpy = sinon.spy(funcs, "getCatTemperament");

    // this is a fake to prevent images from opening in the browser during each test
    // will explain later
    const fake = sinon.fake.returns("coolio");
    sinon.replace(funcs, "specialOpen", fake);
  });

  afterEach(() => {
    getBreedIdStub.restore();
    getStub.restore();
    getCatPicSpy.restore();
    getCatTemperamentSpy.restore();
    sinon.restore();
  });

  it("anonymous function spies", () => {
    // given specific arguments, one callback will be called while the other will not
    // test the code follows the correct path
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    funcs.doSomething("chee", callback1, callback2);

    // this time using Sinon's assertions
    sinon.assert.notCalled(callback1);
    sinon.assert.calledOnceWithExactly(callback2, "chee");

    const callback3 = sinon.spy();
    const callback4 = sinon.spy();

    funcs.doSomething(undefined, callback3, callback4);

    sinon.assert.calledOnceWithExactly(callback3, "beng");
    sinon.assert.notCalled(callback4);
  });

  it("wrapping all/specific object methods - 1", () => {
    funcs.doSomething(undefined, funcs.getCatPic, funcs.getCatTemperament);

    sinon.assert.notCalled(funcs.getCatTemperament);
    sinon.assert.calledOnceWithExactly(funcs.getCatPic, "beng");
  });
  it("wrapping all/specific object methods - 2", () => {
    funcs.doSomething("chee", funcs.getCatPic, funcs.getCatTemperament);

    sinon.assert.notCalled(funcs.getCatPic);
    sinon.assert.calledOnceWithExactly(funcs.getCatTemperament, "chee");
  });
});
