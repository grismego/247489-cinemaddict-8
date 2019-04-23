export default class Store {

  constructor({key, storage}) {
    this._storage = storage;
    this._storageKey = key;
  }

  setItem({key, item}) {
    const items = this.getAllItems();
    items[key] = item;

    this._storage.setItem(this._storageKey, JSON.stringify(items));
  }

  getAllItems() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storageKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (err) {
      return emptyItems;
    }
  }
}
