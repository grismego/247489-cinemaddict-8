import {Component} from './component';
import cloneDeep from 'lodash.clonedeep';
import {createTemplate} from '../templates/filters';

export default class Filter extends Component {
  constructor(data) {
    super(data);
    this._data = cloneDeep(data);
  }

  get template() {
    return createTemplate(this._data);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  _bind() {
    if (!this._element.querySelector(`.main-navigation__item--additional`)) {
      this._element
        .querySelector(`.main-navigation__item`)
        .addEventListener(`click`, this._onFilterClick);
    }
  }

  _unbind() {
    // this._element
    //   .querySelector(`.main-navigation__item`)
    //   .removeEventListener(`click`, this._onFilterClick);
  }
}
