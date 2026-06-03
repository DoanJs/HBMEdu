import localforage from "localforage";

localforage.config({
  name: "QXEdu",
  storeName: "cacheStore",
});

export default localforage;
