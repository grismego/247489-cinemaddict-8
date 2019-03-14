const CONTROLS = [
  {
    name: `watchlist`,
    label: `Add to watchlist`
  },
  {
    name: `watched`,
    label: `Already watched`
  },
  {
    name: `favorite`,
    label: `Add to favorites`
  }
];

const EMOJI = [
  {
    icon: `😴`,
    name: `sleeping`
  },
  {
    icon: `😐`,
    name: `neutral-face`
  },
  {
    icon: `😀`,
    name: `grinning`
  }
];

const createCommentsTemplate = () => (
  `<div class="film-details__emoji-list">
    ${EMOJI.map((emoji) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji.name}" value="${emoji.name}">
    <label class="film-details__emoji-label" for="emoji-${emoji.name}">${emoji.icon}</label>`
  )).join(``)}
  </div>`
);

const createControlsTemplate = () => (
  `<section class="film-details__controls">
    ${CONTROLS.map((control) => (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${control.name}" name="${control.name}">
     <label for="${control.name}" class="film-details__control-label film-details__control-label--${control.name}">${control.label}</label>`
  )).join(``)}
  </section>`
);

const createScoreTemplate = (data) => {
  const arr = [];
  for (let i = 1; i < 10; i++) {
    arr.push(`
      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === Math.floor(data) ? `checked` : ``}>
      <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>
    `);
  }
  return arr.join(``);
};

const createGenresTemplate = (card) => {
  const block = [...(card.genre)].map((genre) => (
    `<span class="film-details__genre">${genre}</span>`
  )).join(``).split(` `);

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">Genres</td>
      <td class="film-details__cell">
      ${block}
    </tr>`);
};

const createRuntimeTemplate = (card) => (
  `<tr class="film-details__row">
    <td class="film-details__term">Runtime</td>
    <td class="film-details__cell">${card.duration}</td>
  </tr>`
);

export const createPopupTemplate = (data) => (
  `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${data.poster}" alt="${data.title}">
        <p class="film-details__age">${data.ageRating}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${data.title}</h3>
            <p class="film-details__title-original">Original: ${data.title}</p>
          </div>
          <div class="film-details__rating">
            <p class="film-details__total-rating">${data.rating}</p>
            <p class="film-details__user-rating">Your rate ${Math.floor(data.rating)}</p>
          </div>
        </div>
        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${data.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${data.writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${data.actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">15 June 2018 (${data.country})</td>
          </tr>
          ${createRuntimeTemplate(data)}
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${data.country}</td>
          </tr>
          ${createGenresTemplate(data)}
        </table>

        <p class="film-details__film-description">
          ${data.description}
        </p>
      </div>
    </div>

  ${createControlsTemplate()}

  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">1</span></h3>

    <ul class="film-details__comments-list">
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">😴</span>
        <div>
          <p class="film-details__comment-text">So long-long story, boring!</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">Tim Macoveev</span>
            <span class="film-details__comment-day">3 days ago</span>
          </p>
        </div>
      </li>
    </ul>

    <div class="film-details__new-comment">
      <div>
        <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
        <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">
          ${createCommentsTemplate()}
      </div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
      </label>
    </div>
  </section>

  <section class="film-details__user-rating-wrap">
    <div class="film-details__user-rating-controls">
      <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
      <button class="film-details__watched-reset" type="button">undo</button>
    </div>

    <div class="film-details__user-score">
      <div class="film-details__user-rating-poster">
        <img src="images/posters/blackmail.jpg" alt="film-poster" class="film-details__user-rating-img">
      </div>

      <section class="film-details__user-rating-inner">
        <h3 class="film-details__user-rating-title">${data.title}</h3>

        <p class="film-details__user-rating-feelings">How you feel it?</p>

        <div class="film-details__user-rating-score">
        ${createScoreTemplate(data.rating)}
        </div>
      </section>
    </div>
  </section>
</form>
</section>`
);
