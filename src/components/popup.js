import {createPopupTemplate} from '../templates/popup';
import {Component} from './component';

export default class CardPopup extends Component {
  constructor(data) {
    super(data);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onChangeRating = this._onChangeRating.bind(this);
    this._rating = data.rating;
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  _onCloseClick() {
    if (typeof this._onClose === `function`) {
      this._onClose();
    }
  }

  _bind() {
    this._element
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseClick);
    this._element
      .querySelectorAll(`.film-details__user-rating-input`)
      .forEach((element) => {
        element.addEventListener(`click`, this._onChangeRating);
      });
  }
  _unbind() {
    this._element
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);
    this._element
      .querySelectorAll(`.film-details__user-rating-input`)
      .forEach((element) => {
        element.removeEventListener(`click`, this._onChangeRating);
      });
  }

  _partialUpdate() {
    this._element = this.template;
  }

  _onChangeRating(evt) {
    this._unbind();
    this._data.rating = evt.target.value;
    // this._partialUpdate();
    this._bind();
  }

  // _processForm(formData) {
  //   const entry = {
  //     rating: ``,
  //     comment: ``
  //   };

  //   const popupMapper = CardPopup.createMapper(entry);
  //   for (const pair of formData.entries()) {
  //     const [property, value] = pair;
  //     if (popupMapper[property]) {
  //       popupMapper[property](value);
  //     }
  //   }
  //   return entry;
  // }

  // static createMapper(target) {
  //   return {
  //     score: (value) => (target.rating = value),
  //     comment: (value) => (target.comments.add(value))
  //   };
  // }

  // _partialUpdate() {
  //   this._element.innerHTML = this.template;
  // }

  update(data) {
    this._rating = data.rating;
  }
}
