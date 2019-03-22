import {createTemplate} from '../templates/cards';
import {Component} from './component';

export default class Card extends Component {
  constructor(data) {
    super(data);
    this._onClick = this._onClick.bind(this);
    this._onControlFormClick = this._onControlFormClick.bind(this);
    this._onCommentsClick = null;
    this._onAddToWatchList = null;
    this._onMarkAsWatched = null;
    this._onMarkAsFavorite = null;
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
  set onMarkAsFavorite(fn) {
    this._onMarkAsFavorite = fn;
  }

  _onClick() {
    return typeof this._onCommentsClick === `function` && this._onCommentsClick();
  }

  _onControlFormClick(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains(`film-card__controls-item--mark-as-watched`)) {
      if (typeof this._onMarkAsWatched === `function`) {
        this._data.isWatched = !this._data.isWatched;
        this._onMarkAsWatched(this._data.isWatched);
      }
    }
    if (evt.target.classList.contains(`film-card__controls-item--favorite`)) {
      if (typeof this._onMarkAsFavorite === `function`) {
        this._data.isFavorite = !this._data.isFavorite;
        this._onMarkAsFavorite(this._data.isFavorite);
      }
    }
    if (evt.target.classList.contains(`film-card__controls-item--add-to-watchlist`)) {
      if (typeof this._onAddToWatchList === `function`) {
        this._data.addedToWathed = !this._data.addedToWathed;
        this._onAddToWatchList(this._data.addedToWathed);
      }
    }
  }


  _bind() {
    this._element
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onClick);
    this._element
      .querySelector(`.film-card__controls`)
      .addEventListener(`click`, this._onControlFormClick);
    // this._element
    //   .querySelector(`.film-card__controls-item--add-to-watchlist`)
    //   .addEventListener(`click`, this._onAddToWatchList);
  }

  _unbind() {
    this._element
      .querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onClick);
    this._element
      .querySelector(`.film-card__controls`)
      .removeEventListener(`click`, this._onControlFormClick);
    // this._element
    //   .querySelector(`.film-card__controls-item--add-to-watchlist`)
    //   .removeEventListener(`click`, this._onAddToWatchList);
  }
}
