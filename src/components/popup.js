import {createPopupTemplate} from '../templates/popup';
import {Component} from './component';

export default class CardPopup extends Component {
  constructor(data) {
    super(data);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onSubmitForm = this._onSubmitForm.bind(this);
    this._rating = data.rating;
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

  _bind() {
    this._element
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseClick);
    this._element
      .querySelector(`.film-details__inner`)
      .addEventListener(`submit`, this._onSubmitForm);
    this._element
      .querySelector(`.film-details__user-rating-label`)
      .addEventListener(`click`, this._onChangeRating);
  }
  _unbind() {
    this._element
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);

    this._element
      .querySelector(`.film-details__inner`)
      .removeEventListener(`submit`, this._onCloseClick);
  }

  _onChangeRating() {
     // const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    // console.log(formData);
    // this.bind();
  }

  _onSubmitForm(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`..film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function` && this._onSubmit(newData)) {
      this.update(newData);
    }
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  update(data) {
    this._rating = data.rating;
  }
}
