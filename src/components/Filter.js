import BaseComponent from './Base';
import {createFilterTemplate} from '../templates/filters';

export default class FilterComponent extends BaseComponent {
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
    if (typeof this._onSelect === `function` && evt.target.tagName === `A`) {
      this._onSelect(evt.target.getAttribute(`data-filter-id`));
    }
  }

  _bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  _unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}
