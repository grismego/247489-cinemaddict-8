import {createTemplate} from '../templates/cards';
import {Component} from './component';

export default class Card extends Component {
  constructor(data) {
    super();
    this._data = data;
    this._onClick = this._onClick.bind(this);
  }

  get template() {
    return createTemplate(this._data, true);
  }
  get element() {
    return this._element;
  }

  set onPopup(fn) {
    this._onPopup = fn;
  }
  _onClick() {
    return typeof this._onPopup === `function` && this._onPopup();
  }

  unrender() {
    this._element = null;
  }

  bind() {
    this._element
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onClick);
  }
}
