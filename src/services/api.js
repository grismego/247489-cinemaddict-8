import ModelCards from './model-cards';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`
};

const toJSON = (response) => {
  return response.json();
};

export const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getData() {
    return this._load({url: `movies`})
    .then(toJSON)
    .then(ModelCards.parseDatas);
  }

  updateData({id, newData}) {
    return this._load({
      url: `movies/${id}`,
      method: `PUT`,
      body: JSON.stringify(newData),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(toJSON)
    .then(ModelCards.parseData);
  }
};
