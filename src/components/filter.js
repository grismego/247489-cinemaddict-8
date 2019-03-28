import BaseComponent from './component';
import {createFilterTemplate} from '../templates/filters';

export default class Filter extends BaseComponent {
  constructor(data) {
    super(data);
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  get template() {
    return createFilterTemplate(this._data);
  }

  set onSelect(fn) {
    this._onSelect = fn;
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    if (typeof this._onSelect === `function`) {
      this._onSelect(evt.target.getAttribute(`data-filter-id`));
    }
  }

  _bind() {
    if (this._data.state !== `additional`) {
      this._element.addEventListener(`click`, this._onFilterClick);
    }
  }

  _unbind() {
    if (this._data.state !== `additional`) {
      this._element.removeEventListener(`click`, this._onFilterClick);
    }
  }
}
