import {createElement} from 'app/lib/create-element';
import cloneDeep from 'lodash.clonedeep';

export default class BaseComponent {
  constructor(data) {
    if (new.target === BaseComponent) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._data = cloneDeep(data);
    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  _createListeners() {

  }

  _removeListeners() {

  }

  rerender(data) {
    const prevElement = this.element;

    this.unrender();
    this.update(data);

    const nextElement = this.render();

    return {prevElement, nextElement};
  }

  render() {
    this._element = createElement(this.template);
    this._createListeners();

    return this._element;
  }

  unrender() {
    this._removeListeners();
    this._element = null;
  }

  update(data) {
    Object.keys(data).filter((property) => this._data.hasOwnProperty(property)).forEach((key) => {
      this._data[key] = data[key];
    });
  }
}
