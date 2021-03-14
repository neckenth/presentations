const axios = require("axios");
const open = require("open");
const _ = require("lodash");
const { breedIds, URL, headers } = require("./const");

const funcs = {
  meow: () => console.log("MEOW"),
  getBreedId: () => breedIds[Math.floor(Math.random() * breedIds.length)],

  getCatPic: (breedId) => {
    funcs.meow();
    let filepath = "";
    return axios
      .get(`${URL}images/search?breed_id=${breedId}`, headers)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length) {
          filepath = res.data[0].url;
          return open(filepath, (err) => {
            if (err) {
              console.log("err");
            }
          });
        } else {
          throw new Error("No cat pics match your provided breed name.");
        }
      })
      .catch((e) => {
        throw new Error(e);
      });
  },

  getCatTemperament: (breed) => {
    funcs.meow();
    return axios
      .get(`${URL}breeds/search/?q=${breed}`, headers)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length === 1) {
          const { name, temperament, id } = res.data[0];
          return `${_.capitalize(name)} cats are ${temperament}!`;
        } else {
          return "No cats match your provided breed name.";
        }
      })
      .catch((e) => {
        throw new Error(
          `Something went wrong getting temperament for breed: ${breed}`
        );
      });
  },

  doSomething: (providedId, callback1, callback2) => {
    if (!providedId) {
      return callback1(funcs.getBreedId());
    }
    return callback2(providedId);
  },

  setTimeoutPromise: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  eventuallyGetCatPic: (breedId, ms) => {
    funcs.setTimeoutPromise(ms).then(() => funcs.getCatPic(breedId));
  },
};

module.exports = funcs;
