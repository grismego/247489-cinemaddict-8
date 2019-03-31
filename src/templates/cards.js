import moment from 'moment';

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

const countDuration = (duration) => (
  [
    Math.floor(duration / 60),
    duration % 60
  ]
);

export const createCardSectionTemplate = (title, isExtra = false, showMore = false) => (
  `<section class="films-list${isExtra ? `--extra` : ``}">
    <h2 class="films-list__title ${isExtra ? `` : `visually-hidden`}">${title}</h2>
    <div class="films-list__container"></div>
    ${showMore ? `<button class="films-list__show-more">Show more</button>` : ``}
  </section>
`);

export const createCardSectionsTemplate = () => (
  createCardSectionTemplate(`All movies. Upcoming`, false, true) +
  createCardSectionTemplate(`Top rated`, true) +
  createCardSectionTemplate(`Most commented`, true)
);

const createControlsTemplate = () => (
  `<form class="film-card__controls">
    ${CONTROLS.map((control) => (
    `<button class="film-card__controls-item button film-card__controls-item--${control.modificator}">
        ${control.name}
     </button>`
  )).join(``)}
  </form>`
);

export const createTemplates = (cards, withOptions = false) => (
  cards
    .map((card) => {
      const [hour, min] = countDuration(card.duration);
      return (
        `<article class="film-card ${withOptions ? `` : `film-card--no-controls`}">
          <h3 class="film-card__title">${card.title}</h3>
          <p class="film-card__rating">${card.rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${moment(card.year).format(`YYYY`)}</span>
            <span class="film-card__duration">${hour}h ${min}m</span>
            <span class="film-card__genre">${card.genre}</span>
          </p>
          <img src="${card.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${card.description}</p>
          <button class="film-card__comments">${card.comments.length} comments</button>
          ${withOptions ? createControlsTemplate() : ``}
        </article>`
      );
    })
    .join(``)
);

export const createTemplate = (card, withOptions = false) => {
  const [hour, min] = countDuration(card.duration);
  return (
    `<article class="film-card ${withOptions ? `` : `film-card--no-controls`}">
      <h3 class="film-card__title">${card.title}</h3>
      <p class="film-card__rating">${card.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(card.year).format(`YYYY`)}</span>
        <span class="film-card__duration">${hour}h ${min}m</span>
        <span class="film-card__genre">${card.genre}</span>
      </p>
      <img src="${card.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${card.description}</p>
      <button class="film-card__comments">${card.comments.length} comments</button>
      ${withOptions ? createControlsTemplate() : ``}
    </article>`
  );
};
