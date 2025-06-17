import defaultData from "./data.json";

class LocalStorageDB {
  constructor() {
    this.storageKey = "quickgear_data";
    this.initializeDB();
  }

  initializeDB() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }
  }

  resetDB() {
    localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    return defaultData;
  }

  getAllData() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveAllData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getCollection(collectionName) {
    const data = this.getAllData();
    return data[collectionName] || [];
  }

  saveCollection(collectionName, items) {
    const data = this.getAllData();
    data[collectionName] = items;
    this.saveAllData(data);
    return items;
  }

  getItem(collectionName, id) {
    const collection = this.getCollection(collectionName);
    return collection.find((item) => item.id === parseInt(id));
  }

  addItem(collectionName, item) {
    const collection = this.getCollection(collectionName);

    const newId =
      collection.length > 0
        ? Math.max(...collection.map((item) => item.id)) + 1
        : 1;

    const newItem = { ...item, id: newId };
    collection.push(newItem);
    this.saveCollection(collectionName, collection);
    return newItem;
  }

  updateItem(collectionName, id, updates) {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex((item) => item.id === parseInt(id));

    if (index === -1) return null;

    collection[index] = { ...collection[index], ...updates };
    this.saveCollection(collectionName, collection);
    return collection[index];
  }

  deleteItem(collectionName, id) {
    const collection = this.getCollection(collectionName);
    const newCollection = collection.filter((item) => item.id !== parseInt(id));

    if (newCollection.length === collection.length) return false;

    this.saveCollection(collectionName, newCollection);
    return true;
  }

  isAdmin(userId) {
    const user = this.getItem("users", userId);
    return user && user.role === "admin";
  }

  filterCollection(collectionName, filterFn) {
    const collection = this.getCollection(collectionName);
    return collection.filter(filterFn);
  }

  queryCollection(collectionName, queryObject) {
    const collection = this.getCollection(collectionName);

    return collection.filter((item) => {
      return Object.entries(queryObject).every(([key, value]) => {
        return item[key] === value;
      });
    });
  }

  getTimestamp() {
    return new Date().toISOString().replace("T", " ").split(".")[0];
  }
}

const localStorageDB = new LocalStorageDB();

export default localStorageDB;
