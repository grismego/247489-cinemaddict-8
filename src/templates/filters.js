export const createFiltersTemplate = () => (
  `<nav class="main-navigation"></nav>`
);

export const createFilterTemplate = (filter) => (
  `<a 
    href="#${filter.anchor}" data-filter-id="${filter.anchor}"
    class="main-navigation__item ${filter.state ? `main-navigation__item--${filter.state}` : ``}">
    ${filter.name} 
    ${filter.count ? `<span class="main-navigation__item-count">${filter.count}</span>` : ``}
  </a>`
);
