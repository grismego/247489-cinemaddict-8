import {createPopupTemplate} from '../templates/popup';
import {Component} from './component';

export default class CardPopup extends Component {
  constructor(data) {
    super(data);
    this._onCloseClick = this._onCloseClick.bind(this);
    // this._onChangeRating = this._onChangeRating.bind(this);
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._rating = data.rating;
    this._onSubmit = null;
  }

  _processForm(formData) {
    const entry = {
      rating: ``
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

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
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

  // _onChangeRating() {
  //   return typeof this._onClose === `function` && this._onChange();
  // }

  static createMapper(target) {
    return {
      score: (value) => (target.rating = value),
      comment: (value) => (target.comment = value)
    };
  }


  _bind() {
    // this._element
    //   .querySelector(`.film-details__close-btn`)
    //   .addEventListener(`click`, this._onCloseClick);
    this._element
      .querySelector(`.film-details__inner`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    // this._element
    //   .querySelectorAll(`.film-details__user-rating-label`)
    //   .forEach((element) => {
    //     element.addEventListener(`click`, this._onChangeRating);
    //   });
  }
  _unbind() {
    // this._element
    //   .querySelector(`.film-details__close-btn`)
    //   .removeEventListener(`click`, this._onCloseClick);
    this._element
      .querySelector(`.film-details__inner`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  update(data) {
    this._rating = data.rating;
  }
}
