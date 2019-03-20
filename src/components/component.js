import {createElement} from '../util';

export class Component {
  constructor(data) {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._data = data;
    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  _bind() {
    throw new Error(`You have to define bind.`);
  }

  _unbind() {
    throw new Error(`You have to define unbind.`);
  }

  render() {
    this._element = createElement(this.template);
    this._bind();

    return this._element;
  }

  unrender() {
    this._unbind();
    this._element = null;
  }

  update() {
    throw new Error(`You have to define unbind.`);
  }
}
