import {
  createPopupTemplate,
  createScoreTemplate,
  createRatingTemplate,
  createCommentsSectionTemplate
} from 'app/templates/popup';

import {createElement} from 'app/lib/create-element';
import BaseComponent from 'app/components/base';

const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;

const CURRENT_USER = `Yo`;
const TEXT_RATE = `Your Rate`;

const CommentBorder = {
  ERROR: `3px solid #8B0000`,
  DEFAULT: `1px solid #979797`
};
const RatingElementColor = {
  DEFAULT: `#d8d8d8`,
  ERROR: `#8B0000`,
  CHECKED: `#ffe800`
};

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
    this.showNewRating = this.showNewRating.bind(this);

    this._toggleStateInput = this._toggleStateInput.bind(this);

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
    this._element.querySelector(`.film-details__watched-status`).innerHTML = (
      this._data.isWatched ? `Already watched` : `Will watch`
    );
  }
  _onAddToWatchListButtonClick() {
    this._data.isAddedToWatched = !this._data.isAddedToWatched;
  }
  _onAddToFavoriteButtonClick() {
    this._data.isFavorite = !this._data.isFavorite;
  }

  showCommentSubmitError() {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);

    inputElement.classList.add(`shake`);
    inputElement.style.border = CommentBorder.ERROR;
    inputElement.disabled = false;

    this._data.comments.pop();
    this._syncForm();
  }

  enableCommentForm() {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);

    inputElement.style.border = CommentBorder.DEFAULT;
    inputElement.value = ``;
    inputElement.classList.remove(`shake`);

    this._toggleStateInput(true);
  }

  showRatingSubmitError() {
    const labelElement = this._element
    .querySelector(`[for="rating-${this._data.personalRating}"]`);

    this._element
      .querySelector(`[value="${this._prevRating}"]`).checked = true;

    this._data.personalRating = this._prevRating;
    this._disableRatingInput(false);
    labelElement.classList.add(`shake`);
  }

  _disableRatingInput(value) {
    this._element.querySelectorAll(`.film-details__user-rating-input`)
      .forEach((item) => {
        item.disabled = value;
      });
  }

  showNewRating() {
    this._element.querySelector(`.film-details__user-rating`).textContent = `${TEXT_RATE} ${this._data.personalRating}`;

    this._disableRatingInput(false);

    this._element.querySelector(`[for="rating-${this._data.personalRating}"]`)
      .style.backgroundColor = RatingElementColor.CHECKED;
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

    this._removeListeners();
    this.update({comments});
    this._partialUpdate();
    this._createListeners();
  }

  _onFormSubmit() {
    this._syncForm();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(
          this._data,
          this.showCommentSubmitError,
          this.enableCommentForm
      );
    }
  }

  _toggleStateInput(value) {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);

    inputElement.disabled = value;
  }

  _onCommentInputKeydown(evt) {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);

    if ((evt.keyCode === KEYCODE_ENTER && evt.ctrlKey) && inputElement.value) {
      this._onFormSubmit();
      this._toggleStateInput(true);
    }
  }

  _isYourComment() {
    return this._data.comments.some((comment) => comment.author === CURRENT_USER);
  }

  _onCommentRemove() {
    if (this._isYourComment()) {
      this._data.comments.pop();
      this._syncForm();
      this._removeListeners();
      // TODO - this.update(this._data);
      this._partialUpdate();
      this._createListeners();
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

      this._removeListeners();
      this.update(newData);
      this._partialUpdate();
      this._createListeners();
      this._disableRatingInput(true);
      if (typeof this._onRatingSubmit === `function`) {
        this._onRatingSubmit(
            this._data, this.showRatingSubmitError, this.showNewRating);
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

  _createListeners() {
    this._element
      .querySelector(`.film-details__inner`)
      .addEventListener(`submit`, this._onFormSubmit);

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

  _removeListeners() {
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
      .removeEventListener(`click`, this._onCommentRemove);

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
