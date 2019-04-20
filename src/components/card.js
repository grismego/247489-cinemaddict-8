import {createTemplate} from 'app/templates/cards';
import BaseComponent from 'app/components/base';

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

    this._commentsElement = null;
    this._controlsElement = null;
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
    if (typeof this._markAsWatchedCallback === `function` && evt.target.classList.contains(`film-card__controls-item--mark-as-watched`)) {
      this._data.isWatched = !this._data.isWatched;
      this._data.watchingDate = Date.now();
      this._markAsWatchedCallback(this._data.isWatched, this._data.watchingDate);
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

  _createListeners() {
    this._commentsElement = this._element.querySelector(`.film-card__comments`);
    this._commentsElement.addEventListener(`click`, this._onClick);

    if (this._options) {
      this._controlsElement = this._element.querySelector(`.film-card__controls`);
      this._controlsElement.addEventListener(`click`, this._onControlFormClick);
    }
  }

  _removeListeners() {
    this._commentsElement.removeEventListener(`click`, this._onClick);
    this._commentsElement = null;

    if (this._options) {
      this._controlsElement.removeEventListener(`click`, this._onControlFormClick);
      this._controlsElement = null;
    }
  }

}
