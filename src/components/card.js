import {createTemplate} from '../templates/cards';
import {Component} from './component';

export default class Card extends Component {
  constructor(data) {
    super(data);
    this._onClick = this._onClick.bind(this);
  }

  get template() {
    return createTemplate(this._data, true);
  }

  set onPopup(fn) {
    this._onPopup = fn;
  }

  _onClick() {
    return typeof this._onPopup === `function` && this._onPopup();
  }

  _bind() {
    this._element
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onClick);
  }

  _unbind() {
    this._element
      .querySelector(`.film-card__comments`)
      .removeEventListener(`click`, this._onClick);
  }

  update(data) {
    this._rating = data.rating;
  }
}
