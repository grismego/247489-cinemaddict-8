import {
  createPopupTemplate,
  createScoreTemplate,
  createRatingTemplate,
  createCommentsSectionTemplate
} from '../templates/popup';

import {createElement} from '../lib/create-element';
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

    this.showCommentSubmitError = this.showCommentSubmitError.bind(this);
    this.enableCommentForm = this.enableCommentForm.bind(this);
    this.showRatingSubmitError = this.showRatingSubmitError.bind(this);


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

  set onRatingSubmit(fn) {
    this._onRatingSubmit = fn;
  }

  _onMarkAsWatchedButtonClick() {
    this._data.isWatched = !this._data.isWatched;
    this._element.querySelector(`.film-details__watched-status`)
    .innerHTML = this._data.isWatched ? `Already watched` : `Will watch`;
  }
  _onAddToWatchListButtonClick() {
    this._data.isAddedToWatched = !this._data.isAddedToWatched;
  }
  _onAddToFavoriteButtonClick() {
    this._data.isFavorite = !this._data.isFavorite;
  }

  showCommentSubmitError() {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);
    inputElement.style.border = `3px solid  red`;
    inputElement.disabled = false;
  }

  enableCommentForm() {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);
    inputElement.disabled = false;
    inputElement.style.border = `solid 1px #979797`;
  }

  showRatingSubmitError() {
    const labelElement = this._element
    .querySelector(`[for="rating-${this._data.personalRating}"]`);
    this._element
      .querySelector(`[value="${this._prevRating}"]`).checked = true;
    this._data.personalRating = this._prevRating;
    labelElement.classList.add(`shake`);
  }

  _onCloseClick() {
    this._syncForm();
    return typeof this._onClose === `function` && this._onClose(this._data);
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

  _syncForm() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const data = this._processForm(formData);

    const comments = this._data.comments.slice();

    if (data.comment.length) {
      comments.push({
        author: CURRENT_USER,
        date: Date.now(),
        comment: data.comment,
        emotion: data.emotion
      });
    }
    this._data.personalRating = data.personalRating;

    this._unbind();
    this.update({comments});
    this._partialUpdate();
    this._bind();

    return typeof this._onSubmit === `function` && this._onSubmit(this._data, this);
  }

  _onFormSubmit() {
    this._syncForm();
    return typeof this._onSubmit === `function` && this._onSubmit(this._data, this);
  }

  _onCommentInputKeydown(evt) {
    const inputElement = this._element
    .querySelector(`.film-details__comment-input`);
    if ((evt.keyCode === KEYCODE_ENTER && evt.ctrlKey) && inputElement.value) {
      this._syncForm();
    }
  }

  _isYourComment() {
    return this._data.comments.some((comment) => comment.author === CURRENT_USER);
  }

  _onCommentRemove() {
    if (this._isYourComment()) {
      this._data.comments.pop();
      // this._syncForm();
      this._unbind();
      this.update(this._data);
      this._partialUpdate();
      this._bind();
    }
  }

  static createMapper(target) {
    return {
      score: (value) => {
        target.personalRating = value;
      },
      comment: (value) => {
        target.comment = value;
      },
      [`comment-emoji`]: (value) => {
        target.emotion = value;
      }
    };
  }

  _onChangeRating(evt) {
    this._prevRating = this._data.personalRating;
    if (evt.target.tagName === `INPUT`) {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      this._unbind();
      this.update(newData);
      this._partialUpdate();
      this._bind();

      if (typeof this._onRatingSubmit === `function`) {
        this._onRatingSubmit(this._data, this);
      }
    }

  }

  _onEscClick(evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      this._syncForm();

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
