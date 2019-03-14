import {
  createPopupTemplate,
  createScoreTemplate,
  createCommentsSectionTemplate
} from '../templates/popup';

import {createElement} from '../util';
import {Component} from './component';

const KEYCODE_ENTER = 13;

export default class CardPopup extends Component {
  constructor(data) {
    super(data);

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onCommentInputKeydown = this._onCommentInputKeydown.bind(this);


    // this._onChangeRating = this._onChangeRating.bind(this);
    // this._onResetClick = this._onResetClick.bind(this);


    this._onClose = null;
    this._onSubmit = null;
  }

  _processForm(formData) {
    const entry = {
      rating: ``,
      comment: {}
    };

    const taskEditMapper = CardPopup.createMapper(entry); //

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

  _onCloseClick() {
    return typeof this._onClose === `function` && this._onClose();
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }


  /*
_onChangeRating(evt) {
    if (evt.target.tagName === `INPUT`) {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const data = this._processForm(formData);

      this._unbind(); // ???
      this.update(newData);
      this._partialUpdate();
      this._bind(); // ????
      this._onSubmit(newData);
    }
  }
*/

  _onFormSubmit() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const data = this._processForm(formData);

    const comments = this._data.comments.slice();

    comments.push({
      author: ``,
      time: new Date(),
      comment: data.comment.comment,
    });

    this._unbind();
    this.update({comments});
    this._partialUpdate();
    this._bind();

    return typeof this._onSubmit === `function` && this._onSubmit(data);
  }

  _onCommentInputKeydown(evt) {
    if (evt.keyCode === KEYCODE_ENTER) {
      this._onFormSubmit();
    }
  }

  static createMapper(target) {
    return {
      score: (value) => (target.rating = value),
      comment: (value) => (target.comment = value)
    };
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

    this._element
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onCommentInputKeydown);
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
  }

  _partialUpdate() {
    const nextScoreElement = createElement(createScoreTemplate(this._data));
    const nextCommentsElement = createElement(createCommentsSectionTemplate(this._data));
    const prevScoreElement = this._element.querySelector(`.film-details__user-rating-score`);
    const prevCommentsElement = this._element.querySelector(`.film-details__comments-wrap`);

    prevCommentsElement.parentNode.replaceChild(nextCommentsElement, prevCommentsElement);
    prevScoreElement.parentNode.replaceChild(nextScoreElement, prevScoreElement);
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
