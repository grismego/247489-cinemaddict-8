import ModelCards from 'app/models/card';

const createArrayFromObject = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  getCards() {
    if (this._isOnline()) {
      return this._api.getCards()
        .then((data) => {
          data.map((it) => this._store.setItem({
            key: it.id,
            item: ModelCards.toRAW(it)
          }));
          return data;
        });
    } else {
      const rawDataMap = this._store.getAll();
      const rawData = createArrayFromObject(rawDataMap);
      const data = ModelCards.parseData(rawData);

      return Promise.resolve(data);
    }
  }

  updateCard({id, newData}) {
    if (this._isOnline()) {
      return this._api.updateCard({id, newData})
        .then((data) => {
          this._store.setItem({key: data.id, item: ModelCards.toRAW(data)});
          return data;
        });
    } else {
      const data = newData;
      this._needSync = true;
      this._store.setItem({key: data.id, item: data});
      return Promise.resolve(ModelCards.parseData(data));
    }
  }

  syncData() {
    return this._api.syncData({data: createArrayFromObject(this._store.getAllItems())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
