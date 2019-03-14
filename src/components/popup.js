import {createPopupTemplate} from '../templates/popup';
import {Component} from './component';

// @ вынести
const KEYCODE_ENTER = 13;

export default class CardPopup extends Component {
  constructor(data) {
    super(data);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onChangeRating = this._onChangeRating.bind(this);
    // this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onAddCommentKeydown = this._onAddCommentKeydown.bind(this);
    this._rating = data.rating;
    this._onSubmit = null;

    this._comments = data.comments;
  }

  _processForm(formData) {
    const entry = {
      rating: ``,
      comment: {}
    };

    const taskEditMapper = CardPopup.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }
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

  _onCloseClick() {
    return typeof this._onClose === `function` && this._onClose();
  }

  _onChangeRating(evt) {
    if (evt.target.tagName === `INPUT`) {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      this._unbind();
      this.update(newData);
      this._partialUpdate();
      this._bind();
      this._onSubmit(newData);
    }
  }

  _onAddCommentKeydown(evt) {
    if (evt.keyCode === KEYCODE_ENTER) {
      evt.preventDefault();
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      this._comments.push({
        author: ``,
        time: new Date(),
        comment: newData.comment.comment,
      });

      this._unbind();
      this.update(newData);
      this._partialUpdate();
      this._bind();

      this._onSubmit(newData, this._comments);
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
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseClick);
    this._element
      .querySelector(`.film-details__user-rating-score`)
      .addEventListener(`click`, this._onChangeRating);
    this._element
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onAddCommentKeydown);
  }
  _unbind() {
    this._element
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);
    this._element
      .querySelector(`.film-details__inner`)
      .removeEventListener(`click`, this._onChangeRating);
    this._element
      .querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onAddCommentKeydown);
  }

  // @ ???
  _partialUpdate() {
    // this._element = createElement(this.template);
    // document.body.replaceChild(createElement(this.template), this._element);
  }

  update(data) {
    this._rating = data.rating;
  }
}
