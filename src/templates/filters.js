export const createTemplate = (filters) => (
  filters
  .map((filter) => (
    `<a href="#${filter.anchor}" class="main-navigation__item ${filter.classNameModificator || ``}">
    ${filter.name} ${filter.count ? `<span class="main-navigation__item-count">${filter.count}</span>` : ``}</a>`
  ))
  .join(``)
);
