import {createTemplate} from '../templates/cards';
import BaseComponent from './Base';

export default class CardComponent extends BaseComponent {
  constructor(data, options = {}) {
    super(data);
    this._onClick = this._onClick.bind(this);
    this._onControlFormClick = this._onControlFormClick.bind(this);

    this._commentsClickCallback = null;
    this._addToWatchListCallback = null;
    this._markAsWatchedCallback = null;
    this._markAsFavoriteCallback = null;
    this._options = options;
  }

  get template() {
    return createTemplate(this._data, this._options);
  }

  set onCommentsClick(fn) {
    this._commentsClickCallback = fn;
  }

  set onAddToWatchList(fn) {
    this._addToWatchListCallback = fn;
  }
  set onMarkAsWatched(fn) {
    this._markAsWatchedCallback = fn;
  }
  set onMarkAsFavorite(fn) {
    this._markAsFavoriteCallback = fn;
  }

  _onClick() {
    return typeof this._commentsClickCallback === `function` && this._commentsClickCallback();
  }

  _onControlFormClick(evt) {
    evt.preventDefault();

    if (typeof typeof this._markAsWatchedCallback === `function` && evt.target.classList.contains(`film-card__controls-item--mark-as-watched`)) {
      this._data.isWatched = !this._data.isWatched;
      this._markAsWatchedCallback(this._data.isWatched);
    }

    if (typeof this._markAsFavoriteCallback === `function` && evt.target.classList.contains(`film-card__controls-item--favorite`)) {
      this._data.isFavorite = !this._data.isFavorite;
      this._markAsFavoriteCallback(this._data.isFavorite);
    }

    if (typeof this._addToWatchListCallback === `function` && evt.target.classList.contains(`film-card__controls-item--add-to-watchlist`)) {
      this._data.isAddedToWatched = !this._data.isAddedToWatched;
      this._addToWatchListCallback(this._data.isAddedToWatched);
    }
  }

  _bind() {
    this._element
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onClick);
    if (this._options === true) {
      this._element
      .querySelector(`.film-card__controls`)
      .addEventListener(`click`, this._onControlFormClick);
    }
  }

  _unbind() {
    this._element
      .querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onClick);
    if (this._options === true) {
      this._element
        .querySelector(`.film-card__controls`)
        .removeEventListener(`click`, this._onControlFormClick);
    }
  }
}
