import {
  createPopupTemplate,
  createScoreTemplate,
  createRatingTemplate,
  createCommentsSectionTemplate
} from '../templates/popup';

import {createElement} from '../util';
import BaseComponent from './Base';

const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;

const CURRENT_USER = `Yo`;

export default class CardPopupComponent extends BaseComponent {
  constructor(data) {
    super(data);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onChangeRating = this._onChangeRating.bind(this);
    this._onCommentInputKeydown = this._onCommentInputKeydown.bind(this);
    this._onEscClick = this._onEscClick.bind(this);
    this._onCommentRemove = this._onCommentRemove.bind(this);

    this._onMarkAsWatchedButtonClick = this._onMarkAsWatchedButtonClick.bind(this);
    this._onAddToWatchListButtonClick = this._onAddToWatchListButtonClick.bind(this);
    this._onAddToFavoriteButtonClick = this._onAddToFavoriteButtonClick.bind(this);

    this._onClose = null;
    this._onSubmit = null;
  }

  _processForm(formData) {
    const entry = {};

    const taskEditMapper = CardPopupComponent.createMapper(entry);

    Array.from(formData.entries()).forEach(
        ([property, value]) => taskEditMapper[property] && taskEditMapper[property](value)
    );

    return entry;
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onChangeRating(fn) {
    this._onChangeRating = fn;
  }

  _onMarkAsWatchedButtonClick() {
    this._data.isWatched = !this._data.isWatched;
  }
  _onAddToWatchListButtonClick() {
    this._data.isAddedToWatched = !this._data.isAddedToWatched;
  }
  _onAddToFavoriteButtonClick() {
    this._data.isFavorite = !this._data.isFavorite;
  }

  _onCloseClick() {
    this._onFormSubmit();
    return typeof this._onClose === `function` && this._onClose();
  }

  _emojiMapper(key) {
    switch (key) {
      case `sleeping`:
        return `😴`;
      case `neutral-face`:
        return `😐`;
      case `grinning`:
        return `😀`;
      default:
        return ``;
    }
  }

  _onFormSubmit() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const data = this._processForm(formData);


    const comments = this._data.comments.slice();

    if (data.comment.length) {
      comments.push({
        author: CURRENT_USER,
        time: new Date(),
        comment: data.comment,
        emoji: this._emojiMapper(data.emoji)
      });
    }

    this._data.rating = data.rating;

    this._unbind();
    this.update({comments});
    this._partialUpdate();
    this._bind();
    return typeof this._onSubmit === `function` && this._onSubmit(this._data);
  }

  _onCommentInputKeydown(evt) {
    const inputElement = this._element
    .querySelector(`.film-details__comment-input`);
    if ((evt.keyCode === KEYCODE_ENTER && evt.ctrlKey) && inputElement.value) {
      this._onFormSubmit();
    }
  }

  _isYourComment() {
    return this._data.comments.some((comment) => comment.author === CURRENT_USER);
  }

  _onCommentRemove() {
    if (this._isYourComment()) {
      this._data.comments.pop();
      this.update(this._data);
      this._partialUpdate();
    }
  }

  static createMapper(target) {
    return {
      score: (value) => {
        target.rating = value;
      },
      comment: (value) => {
        target.comment = value;
      },
      [`comment-emoji`]: (value) => {
        target.emoji = value;
      }
    };
  }

  _onChangeRating(evt) {
    if (evt.target.tagName === `INPUT`) {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      this._unbind();
      this.update(newData);
      this._partialUpdate();
      this._bind();

    }
  }

  _onEscClick(evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      if (typeof this._onClose === `function`) {
        this._onClose(this._data);
      }
    }
  }

  _bind() {
    this._element
      .querySelector(`.film-details__inner`)
      .removeEventListener(`submit`, this._onFormSubmit);

    this._element
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseClick);

    this._element
      .querySelector(`.film-details__user-rating-score`)
      .addEventListener(`click`, this._onChangeRating);

    document.addEventListener(`keydown`, this._onEscClick);

    this._element
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onCommentInputKeydown);

    this._element
      .querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onCommentRemove);

    this
      ._element.querySelector(`#watchlist`)
      .addEventListener(`change`, this._onAddToWatchListButtonClick);
    this
      ._element.querySelector(`#watched`)
      .addEventListener(`change`, this._onMarkAsWatchedButtonClick);
    this
      ._element.querySelector(`#favorite`)
      .addEventListener(`change`, this._onAddToFavoriteButtonClick);
  }

  _unbind() {
    this._element
      .querySelector(`.film-details__inner`)
      .removeEventListener(`submit`, this._onFormSubmit);

    this._element
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);

    this._element
      .querySelector(`.film-details__inner`)
      .removeEventListener(`click`, this._onChangeRating);

    this._element
      .querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onCommentInputKeydown);

    document.removeEventListener(`keydown`, this._onEscClick);

    this
      ._element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onCommentRemove);

    this
      ._element.querySelector(`#watchlist`)
      .removeEventListener(`change`, this._onAddToWatchListButtonClick);
    this
      ._element.querySelector(`#watched`)
      .removeEventListener(`change`, this._onMarkAsWatchedButtonClick);
    this
      ._element.querySelector(`#favorite`)
      .removeEventListener(`change`, this._onAddToFavoriteButtonClick);
  }

  _partialUpdate() {
    const nextScoreElement = createElement(createScoreTemplate(this._data));
    const prevScoreElement = this._element.querySelector(`.film-details__user-rating-score`);

    const nextRatingElement = createElement(createRatingTemplate(this._data));
    const prevRatingElement = this._element.querySelector(`.film-details__rating`);

    const nextCommentsElement = createElement(createCommentsSectionTemplate(this._data));
    const prevCommentsElement = this._element.querySelector(`.film-details__comments-wrap`);

    prevScoreElement.parentNode.replaceChild(nextScoreElement, prevScoreElement);
    prevRatingElement.parentNode.replaceChild(nextRatingElement, prevRatingElement);
    prevCommentsElement.parentNode.replaceChild(nextCommentsElement, prevCommentsElement);
  }
}
