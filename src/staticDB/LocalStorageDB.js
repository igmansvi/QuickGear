import defaultData from "./data.json";

/**
 * LocalStorageDB - A utility class for handling local storage operations
 * with role-based access control and persistence
 */
class LocalStorageDB {
  constructor() {
    this.storageKey = "quickgear_data";
    this.initializeDB();
  }

  /**
   * Initialize the database from local storage or default data
   */
  initializeDB() {
    if (!localStorage.getItem(this.storageKey)) {
      // First time initialization - use default data
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }
  }

  /**
   * Reset the database to default data (useful for development/testing)
   */
  resetDB() {
    localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    return defaultData;
  }

  /**
   * Get the entire database
   */
  getAllData() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  /**
   * Save the entire database
   */
  saveAllData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /**
   * Get all items from a specific collection
   */
  getCollection(collectionName) {
    const data = this.getAllData();
    return data[collectionName] || [];
  }

  /**
   * Save a collection to the database
   */
  saveCollection(collectionName, items) {
    const data = this.getAllData();
    data[collectionName] = items;
    this.saveAllData(data);
    return items;
  }

  /**
   * Get a single item from a collection by ID
   */
  getItem(collectionName, id) {
    const collection = this.getCollection(collectionName);
    return collection.find((item) => item.id === parseInt(id));
  }

  /**
   * Add an item to a collection
   */
  addItem(collectionName, item) {
    const collection = this.getCollection(collectionName);

    // Generate new ID
    const newId =
      collection.length > 0
        ? Math.max(...collection.map((item) => item.id)) + 1
        : 1;

    const newItem = { ...item, id: newId };
    collection.push(newItem);
    this.saveCollection(collectionName, collection);
    return newItem;
  }

  /**
   * Update an item in a collection
   */
  updateItem(collectionName, id, updates) {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex((item) => item.id === parseInt(id));

    if (index === -1) return null;

    collection[index] = { ...collection[index], ...updates };
    this.saveCollection(collectionName, collection);
    return collection[index];
  }

  /**
   * Delete an item from a collection
   */
  deleteItem(collectionName, id) {
    const collection = this.getCollection(collectionName);
    const newCollection = collection.filter((item) => item.id !== parseInt(id));

    if (newCollection.length === collection.length) return false;

    this.saveCollection(collectionName, newCollection);
    return true;
  }

  /**
   * Check if a user has admin privileges
   */
  isAdmin(userId) {
    const user = this.getItem("users", userId);
    return user && user.role === "admin";
  }

  /**
   * Filter collection items based on a filter function
   */
  filterCollection(collectionName, filterFn) {
    const collection = this.getCollection(collectionName);
    return collection.filter(filterFn);
  }

  /**
   * Query a collection with complex criteria
   */
  queryCollection(collectionName, queryObject) {
    const collection = this.getCollection(collectionName);

    return collection.filter((item) => {
      return Object.entries(queryObject).every(([key, value]) => {
        return item[key] === value;
      });
    });
  }

  /**
   * Get the current timestamp in MySQL format
   */
  getTimestamp() {
    return new Date().toISOString().replace("T", " ").split(".")[0];
  }
}

// Create a singleton instance
const localStorageDB = new LocalStorageDB();

export default localStorageDB;
