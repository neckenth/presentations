const axios = require("axios");
const open = require("open");
const _ = require("lodash");

const API_KEY = "4fe4e11a-c8d6-49a6-a99d-465cb210e560";
const URL = "https://api.thecatapi.com/v1/";

const headers = {
  "X-API-Key": API_KEY,
};

const getBreedId = () => {
  const request = {
    url: `${URL}breeds/`,
    method: "GET",
    headers,
  };
  return axios(request)
    .then((res) => res.data)
    .then((data) => {
      if (Array.isArray(data)) {
        return data.map((breed) => breed.id)[
          Math.floor(Math.random() * data.length)
        ];
      }
    })
    .catch((e) => {
      throw new Error(`Something went wrong getting random breed id`);
    });
};

const getCatPic = (breedId) => {
  console.log("breedid", breedId);
  const request = {
    url: `${URL}images/search?breed_id=${breedId}`,
    method: "GET",
    headers,
  };
  let filepath = "";
  return axios(request)
    .then((res) => {
      if (Array.isArray(res.data) && res.data.length) {
        filepath = res.data[0].url;
        return open(filepath, (err) => {
          if (err) {
            console.log("err");
          }
        });
      } else {
        return "No cat pics match your provided breed name.";
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getCatTemperament = (breed) => {
  const request = {
    url: `${URL}breeds/search/?q=${breed}`,
    method: "GET",
    headers,
  };
  return axios(request)
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
};

const doSomething = (providedId, callback) => {
  if (!providedId) {
    return getBreedId().then((id) => {
      return callback(id);
    });
  }
  return callback(providedId);
};

const setTimeoutPromise = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const eventuallyGetCatPic = (breedId, ms) => {
  setTimeoutPromise(ms).then(() => getCatPic(breedId));
};

getCatPic("munc").then(() => console.log("CAT!"));
getCatTemperament("beng").then((temp) => console.log(temp));
doSomething(undefined, getCatPic).then(() => console.log("CAT!"));
doSomething(undefined, getCatTemperament).then(() => console.log("CAT!"));

eventuallyGetCatPic("munc", 5000);

// to do tomorrow:
/*
fake - fake timer for eventuallyGetCatPic
stub -
* replace getBreedId to always return a singular id
* code paths for doSomething - (if they provide an id, then the callback should be x, if they don't, then the callback should be y, for eg)
* for getCatTemperament, stub out the actual axios request
spy - doSomething for args and to assert that the callbacks and stuff are also fired
duplicate this with mocks?
*/
