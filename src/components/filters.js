import BaseComponent from 'app/components/base';
import {createFiltersTemplate} from '../templates/filters';
import FilterComponent from 'app/components/filter';

const defaultData = {
  cards: [],
  filters: []
};

export default class FiltersComponent extends BaseComponent {
  constructor(data = defaultData) {
    super(data);

    this.components = null;
    this._onChange = null;
  }

  get template() {
    return createFiltersTemplate(this._data.filters);
  }

  set onChange(fn) {
    this._onChange = fn;
  }

  render() {
    const element = super.render();

    this.components = this._data.filters.map((filterData) => {
      const component = new FilterComponent(filterData);

      element.appendChild(component.render());

      component.onSelect = (filterName) => {
        if (typeof this._onChange === `function`) {
          this._onChange(filterName, filterData.filterBy);
        }
      };

      return component;
    });

    return element;
  }

  unrender() {
    this.components.forEach((component) => {
      this.element.removeChild(component.element);
      component.unrender();
    });

    this.components = null;

    super.unrender();
  }
}
