const CONTROLS = [
  {
    name: `WL`,
    modificator: `add-to-watchlist`
  },
  {
    name: `WTCHD`,
    modificator: `mark-as-watched`
  },
  {
    name: `FAV`,
    modificator: `favorite`
  }
];

const createControlsTemplate = () => (
  `<form class="film-card__controls">
    ${CONTROLS.map((control) => (
    `<button class="film-card__controls-item button film-card__controls-item--${control.modificator}">
        ${control.name}
     </button>`
  )).join(``)}
  </form>`
);

export const createTemplates = (cards, withOptions) => (
  cards
    .map((card) => (
      `<article class="film-card ${withOptions ? `` : `film-card--no-controls`}">
        <h3 class="film-card__title">${card.title}</h3>
        <p class="film-card__rating">${card.rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${card.year}</span>
          <span class="film-card__duration">${card.duration}</span>
          <span class="film-card__genre">${card.genre}</span>
        </p>
        <img src="${card.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${card.description}</p>
        <button class="film-card__comments">${card.commentsCount} comments</button>
        ${withOptions ? createControlsTemplate() : ``}
      </article>`
    ))
    .join(``)
);

export const createTemplate = (card, withOptions) => (
  `<article class="film-card ${withOptions ? `` : `film-card--no-controls`}">
    <h3 class="film-card__title">${card.title}</h3>
    <p class="film-card__rating">${card.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${card.year}</span>
      <span class="film-card__duration">${card.duration}</span>
      <span class="film-card__genre">${card.genre}</span>
    </p>
    <img src="${card.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${card.description}</p>
    <button class="film-card__comments">${card.comments.length} comments</button>
    ${withOptions ? createControlsTemplate() : ``}
  </article>`
);
