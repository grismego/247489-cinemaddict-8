export const createTemplate = (navigations) => (
  navigations
  .map((navigation) => (
    `<a href="#${navigation.anchor}" class="main-navigation__item ${navigation.state || ``} 
    ${navigation.classNameModificator || ``}">
    ${navigation.name} ${navigation.count ? `<span class="main-navigation__item-count">${navigation.count}</span>` : ``}</a>`
  ))
  .join(``)
);
