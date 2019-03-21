import {createTemplate} from '../templates/cards';
import {Component} from './component';

import cloneDeep from 'lodash.clonedeep';

export default class Card extends Component {
  constructor(data) {
    super(data);
    this._data = cloneDeep(data);
    this._onClick = this._onClick.bind(this);
    this._onAddToWatchList = this._onAddToWatchList.bind(this);
    this._onMarkAsWatched = this._onMarkAsWatched.bind(this);
    this._onCommentsClick = null;
  }

  get template() {
    return createTemplate(this._data, true);
  }

  set onCommentsClick(fn) {
    this._onCommentsClick = fn;
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }
  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  _onClick() {
    return typeof this._onCommentsClick === `function` && this._onCommentsClick();
  }

  _onMarkAsWatched(evt) {
    evt.preventDefault();
    this._data.isWathced = !this._data.isWathced;
  }

  _onAddToWatchList(evt) {
    evt.preventDefault();
    this._data.addedToWathed = !this._data.addedToWathed;
  }

  _bind() {
    this._element
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onClick);
    this._element
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._onAddToWatchList);
  }

  _unbind() {
    this._element
      .querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onClick);
    this._element
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .removeEventListener(`click`, this._onAddToWatchList);
  }

  update(data) {
    if (data.rating) {
      this._data.rating = data.rating;
    }

    if (data.comments) {
      this._data.comments = data.comments;
    }
  }
}
