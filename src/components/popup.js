import BaseComponent from 'app/components/base';
import {createElement} from 'app/lib/create-element';
import {
  createPopupTemplate,
  createScoreTemplate,
  createRatingTemplate,
  createCommentsSectionTemplate,
  createUserContorlsTemplate
} from 'app/templates/popup';

const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;

const TEXT_CURRENT_USER = `Yo`;
const TEXT_RATE = `Your Rate`;
const TEXT_COMMENT_ADDED = `Comment added`;
const TEXT_COMMENT_REMOVED = `Comment removed`;

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
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
    this._onCommentRemove = this._onCommentRemove.bind(this);

    this._onMarkAsWatchedButtonClick = this._onMarkAsWatchedButtonClick.bind(this);
    this._onAddToWatchListButtonClick = this._onAddToWatchListButtonClick.bind(this);
    this._onAddToFavoriteButtonClick = this._onAddToFavoriteButtonClick.bind(this);

    this._addToWatchListCallback = null;
    this._markAsWatchedCallback = null;
    this._markAsFavoriteCallback = null;

    this.showCommentSubmitError = this.showCommentSubmitError.bind(this);
    this.enableCommentForm = this.enableCommentForm.bind(this);
    this.showRatingSubmitError = this.showRatingSubmitError.bind(this);
    this.showNewRating = this.showNewRating.bind(this);

    this._toggleStateInput = this._toggleStateInput.bind(this);

    this._closeCallback = null;
    this._submitCallback = null;
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  set onClose(fn) {
    this._closeCallback = fn;
  }

  set onSubmit(fn) {
    this._submitCallback = fn;
  }

  set onRatingSubmit(fn) {
    this._submitRatingCallback = fn;
  }

  set onCommentRemove(fn) {
    this._commentRemoveCallback = fn;
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

  showCommentSubmitError() {
    const commentsSectionElement = this._element.querySelector(`.film-details__comments-wrap`);
    const commentsCountElement = commentsSectionElement.querySelector(`.film-details__comments-count`);

    this._commentInputElement.classList.add(`shake`);
    this._commentInputElement.style.border = CommentBorder.ERROR;
    this._commentInputElement.disabled = false;

    commentsCountElement.textContent = this._data.comments.length;
    this._commentInputElement.addEventListener(`input`, this._onCommentFormInput);
  }

  enableCommentForm() {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);
    this._partialUpdate();
    this._createListeners();
    inputElement.style.border = CommentBorder.DEFAULT;
    inputElement.value = ``;
    inputElement.classList.remove(`shake`);
    this._commentStatusElement.textContent = TEXT_COMMENT_ADDED;
    this._commentInputElement.disabled = false;

  }

  showNewRating() {
    this._element.querySelector(`.film-details__user-rating`).textContent = `${TEXT_RATE} ${this._data.personalRating}`;

    this._disableRatingInput(false);

    this._element.querySelector(`[for="rating-${this._data.personalRating}"]`)
      .style.backgroundColor = RatingElementColor.CHECKED;
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

  _onMarkAsWatchedButtonClick() {
    const value = !this._data.isWatched;
    this._data.isWatched = value;
    this._data.watchingDate = Date.now();
    this._markAsWatchedCallback(value, this._data.watchingDate);
  }

  _onAddToWatchListButtonClick() {
    const value = !this._data.isAddedToWatched;
    this._data.isAddedToWatched = value;
    this._addToWatchListCallback(value);
  }

  _onAddToFavoriteButtonClick() {
    const value = !this._data.isFavorite;
    this._data.isFavorite = !value;
    this._markAsFavoriteCallback(value);
  }

  _disableRatingInput(value) {
    this._element.querySelectorAll(`.film-details__user-rating-input`)
      .forEach((item) => {
        item.disabled = value;
      });
  }


  _onCloseClick() {
    return typeof this._closeCallback === `function` && this._closeCallback(this._data);
  }

  _onFormSubmit() {
    if (typeof this._submitCallback === `function`) {
      this._submitCallback(
          this._data,
          this.showCommentSubmitError,
          this.enableCommentForm
      );
    }
  }

  _toggleStateInput(value) {
    this._commentInputElement.disabled = value;
  }

  _onCommentInputKeydown(evt) {
    const inputElement = this._element.querySelector(`.film-details__comment-input`);

    if ((evt.keyCode === KEYCODE_ENTER && evt.ctrlKey) && inputElement.value) {
      this._addComment(inputElement.value);
      if (typeof this._submitCallback === `function`) {
        this._submitCallback(
            this._data,
            this.showCommentSubmitError,
            this.enableCommentForm
        );
      }
    }
  }

  _isYourComment() {
    return this._data.comments.some((comment) => comment.author === TEXT_CURRENT_USER);
  }

  _onCommentRemove() {
    if (this._isYourComment()) {
      this._data.comments.pop();
      this._removeListeners();
      this.update(this._data);
      this._partialUpdate();
      this._createListeners();
      this._commentStatusElement.textContent = TEXT_COMMENT_REMOVED;
      if (typeof this._commentRemoveCallback === `function`) {
        this._commentRemoveCallback(this._data);
      }
    }
  }


  _getEmoji() {
    const emojiElement = this._element.querySelector(`.film-details__emoji-list`);
    const inputElements = emojiElement.querySelectorAll(`input`);
    const checkedElement = Array.from(inputElements).find((element) => element.checked);
    return checkedElement.value;
  }

  _addComment(comment) {
    this._data.comments.push({
      comment,
      author: TEXT_CURRENT_USER,
      date: new Date(),
      emotion: this._getEmoji()
    });
  }

  _onChangeRating(evt) {
    this._prevRating = this._data.personalRating;
    if (evt.target.tagName === `INPUT`) {
      this._data.personalRating = evt.target.value;
      this._removeListeners();
      this._partialUpdate();
      this._createListeners();
      this._disableRatingInput(true);
      if (typeof this._submitRatingCallback === `function`) {
        this._submitRatingCallback(this._data, this.showRatingSubmitError, this.showNewRating);
      }
    }

  }

  _onDocumentKeydown(evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      if (typeof this._closeCallback === `function`) {
        this._closeCallback(this._data);
      }
    }
  }

  _partialUpdate() {
    const nextUserControlElement = createElement(createUserContorlsTemplate(this._data));
    const prevUserControlElement = this._element.querySelector(`.film-details__user-rating-controls`);

    const nextScoreElement = createElement(createScoreTemplate(this._data));
    const prevScoreElement = this._element.querySelector(`.film-details__user-rating-score`);

    const nextRatingElement = createElement(createRatingTemplate(this._data));
    const prevRatingElement = this._element.querySelector(`.film-details__rating`);

    const nextCommentsElement = createElement(createCommentsSectionTemplate(this._data));
    const prevCommentsElement = this._element.querySelector(`.film-details__comments-wrap`);

    prevScoreElement.parentNode.replaceChild(nextScoreElement, prevScoreElement);
    prevRatingElement.parentNode.replaceChild(nextRatingElement, prevRatingElement);
    prevCommentsElement.parentNode.replaceChild(nextCommentsElement, prevCommentsElement);
    prevUserControlElement.parentNode.replaceChild(nextUserControlElement, prevUserControlElement);
  }

  _createListeners() {

    this._commentInputElement = this._element.querySelector(`.film-details__comment-input`);
    this._commentRemoveButtonElemet = this._element.querySelector(`.film-details__watched-reset`);
    this._commentStatusElement = this._element.querySelector(`.film-details__watched-status`);
    this._formDetailsElement = this._element.querySelector(`.film-details__inner`);
    this._formDetailsCloseButton = this._element.querySelector(`.film-details__close-btn`);
    this._userScoreElement = this._element.querySelector(`.film-details__user-rating-score`);
    this._watchlistButtonElement = this._element.querySelector(`#watchlist`);
    this._watchedButtonElement = this._element.querySelector(`#watched`);
    this._favoriteButtonElement = this._element.querySelector(`#favorite`);


    this._formDetailsElement.addEventListener(`submit`, this._onFormSubmit);
    this._formDetailsCloseButton.addEventListener(`click`, this._onCloseClick);
    this._userScoreElement.addEventListener(`click`, this._onChangeRating);
    this._commentInputElement.addEventListener(`keydown`, this._onCommentInputKeydown);
    this._commentRemoveButtonElemet.addEventListener(`click`, this._onCommentRemove);
    this._watchlistButtonElement.addEventListener(`change`, this._onAddToWatchListButtonClick);
    this._watchedButtonElement.addEventListener(`change`, this._onMarkAsWatchedButtonClick);
    this._favoriteButtonElement.addEventListener(`change`, this._onAddToFavoriteButtonClick);
    document.addEventListener(`keydown`, this._onDocumentKeydown);
  }

  _removeListeners() {
    this._formDetailsCloseButton.removeEventListener(`click`, this._onCloseClick);
    this._formDetailsElement.removeEventListener(`click`, this._onChangeRating);
    this._commentInputElement.removeEventListener(`keydown`, this._onCommentInputKeydown);
    this._commentRemoveButtonElemet.removeEventListener(`click`, this._onCommentRemove);
    this._watchlistButtonElement.removeEventListener(`change`, this._onAddToWatchListButtonClick);
    this._watchedButtonElement.removeEventListener(`change`, this._onMarkAsWatchedButtonClick);
    this._favoriteButtonElement.removeEventListener(`change`, this._onAddToFavoriteButtonClick);

    document.removeEventListener(`keydown`, this._onDocumentKeydown);

    this._commentInputElement = null;
    this._commentRemoveButtonElemet = null;
    this._commentStatusElement = null;
    this._formDetailsElement = null;
    this._formDetailsCloseButton = null;
    this._userScoreElement = null;
    this._watchlistButtonElement = null;
    this._watchedButtonElement = null;
    this._favoriteButtonElement = null;
  }
}
