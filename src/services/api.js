import ModelCard from 'app/models/card';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`
};

const SYNC_URL = `movies/sync`;
const CONTENT_TYPE = `application/json`;

const toJSON = (response) => {
  return response.json();
};

export default class ApiService {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  syncData({data}) {
    return this._load({
      url: SYNC_URL,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': CONTENT_TYPE})
    })
    .then((response) => response.json);
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getCards() {
    return this._load({url: `movies`})
    .then(toJSON)
    .then(ModelCard.parseDatas);
  }

  updateCard({id, newData}) {
    return this._load({
      url: `movies/${id}`,
      method: `PUT`,
      body: JSON.stringify(newData),
      headers: new Headers({'Content-Type': CONTENT_TYPE})
    })
    .then(toJSON)
    .then(ModelCard.parseData);
  }
}

