const createContentTemplate = () => (
  `<form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
  </form>`
);

export const createTemplate = (cards, options) => cards.map((card) => {
  return (`<article class="film-card ${options ? `` : `film-card--no-controls`}">
  <h3 class="film-card__title">${card.title}</h3>
  <p class="film-card__rating">${card.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${card.year}</span>
    <span class="film-card__duration">${card.duration.hour}h ${card.duration.minutes}m</span>
    <span class="film-card__genre">${card.genre}</span>
  </p>
  <img src="${card.poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${card.description}</p>
  <button class="film-card__comments">${card.commentsCount} comments</button>
  ${options ? createContentTemplate() : ``}
</article>`);
});
