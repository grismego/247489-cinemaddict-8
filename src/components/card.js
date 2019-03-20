import {createTemplate} from '../templates/cards';
import {Component} from './component';

import cloneDeep from 'lodash.clonedeep';

export default class Card extends Component {
  constructor(data) {
    super(data);
    this._data = cloneDeep(data);
    this._onClick = this._onClick.bind(this);
    this._onCommentsClick = null;
  }

  get template() {
    return createTemplate(this._data, true);
  }

  set onCommentsClick(fn) {
    this._onCommentsClick = fn;
  }

  _onClick() {
    return typeof this._onCommentsClick === `function` && this._onCommentsClick();
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
    if (data.rating) {
      this._data.rating = data.rating;
    }

    if (data.comments) {
      this._data.comments = data.comments;
    }
  }
}
