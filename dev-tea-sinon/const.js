const breeds = [
  "Abyssinian",
  "Aegean",
  "American Bobtail",
  "American Curl",
  "American Shorthair",
  "American Wirehair",
  "Arabian Mau",
  "Australian Mist",
  "Balinese",
  "Westie",
  "Norwich Terrier",
  "Bambino",
  "Bengal",
  "Birman",
  "Bombay",
  "British Longhair",
  "British Shorthair",
  "Burmese",
  "Burmilla",
  "California Spangled",
  "Chantilly-Tiffany",
  "Chartreux",
  "German Shepherd",
  "Chausie",
  "Cheetoh",
  "Colorpoint Shorthair",
  "Cornish Rex",
  "Cymric",
  "Chihuahua",
  "Cyprus",
  "Devon Rex",
  "Donskoy",
  "Dragon Li",
  "Egyptian Mau",
  "Miniature Dachsund",
  "European Burmese",
  "Exotic Shorthair",
  "Havana Brown",
  "Cairn Terrier",
  "Himalayan",
  "Japanese Bobtail",
  "Javanese",
  "Khao Manee",
  "Korat",
  "Kurilian",
  "LaPerm",
  "Maine Coon",
  "Malayan",
  "Manx",
  "Munchkin",
  "Nebelung",
  "Norwegian Forest Cat",
  "Ocicat",
  "Greyhound",
  "Oriental",
  "Persian",
  "Pixie-bob",
  "Ragamuffin",
  "Ragdoll",
  "Russian Blue",
  "Savannah",
  "Scottish Fold",
  "Selkirk Rex",
  "Siamese",
  "Golden Retriever",
  "Siberian",
  "Singapura",
  "Snowshoe",
  "Somali",
  "Sphynx",
  "Tonkinese",
  "Toyger",
  "Turkish Angora",
  "Turkish Van",
  "York Chocolate",
];

const breedIds = [
  "abys",
  "aege",
  "abob",
  "acur",
  "asho",
  "awir",
  "amau",
  "amis",
  "bali",
  "bamb",
  "beng",
  "birm",
  "bomb",
  "bslo",
  "bsho",
  "bure",
  "buri",
  "cspa",
  "ctif",
  "char",
  "chau",
  "chee",
  "csho",
  "crex",
  "cymr",
  "cypr",
  "drex",
  "dons",
  "lihu",
  "emau",
  "ebur",
  "esho",
  "hbro",
  "hima",
  "jbob",
  "java",
  "khao",
  "kora",
  "kuri",
  "lape",
  "mcoo",
  "mala",
  "manx",
  "munc",
  "nebe",
  "norw",
  "ocic",
  "orie",
  "pers",
  "pixi",
  "raga",
  "ragd",
  "rblu",
  "sava",
  "sfol",
  "srex",
  "siam",
  "sibe",
  "sing",
  "snow",
  "soma",
  "sphy",
  "tonk",
  "toyg",
  "tang",
  "tvan",
  "ycho",
];

const API_KEY = "4fe4e11a-c8d6-49a6-a99d-465cb210e560";
const URL = "https://api.thecatapi.com/v1/";

const headers = {
  "X-API-Key": API_KEY,
};

module.exports = {
  breeds,
  breedIds,
  API_KEY,
  URL,
  headers,
};
