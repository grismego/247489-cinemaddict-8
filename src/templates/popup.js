import moment from 'moment';

const EMOJI = [
  {
    icon: `😴`,
    name: `sleeping`
  },
  {
    icon: `😐`,
    name: `neutral-face`,
    isChecked: true
  },
  {
    icon: `😀`,
    name: `grinning`
  }
];

const EMOJIES = {
  'sleeping': `😴`,
  'neutral-face': `😐`,
  'grinning': `😀`
};

const createEmojiTemplate = () => (
  `<div class="film-details__emoji-list">
    ${EMOJI.map((emoji) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji.name}" value="${emoji.name}" ${emoji.isChecked ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emoji.name}">${emoji.icon}</label>`
  )).join(``)}
  </div>`
);

export const createCommentsTemplate = (data) => (
  data.comments.map((comment) => (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">${EMOJIES[comment.emotion]}</span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          
          <span class="film-details__comment-day">${moment(comment.date).fromNow()}</span>
        </p>
      </div>
    </li>`)
  ).join(``));

export const createCommentTemplate = (data) => (`
<li class="film-details__comment">
      <span class="film-details__comment-emoji">${data.comments.emoji}</span>
      <div>
        <p class="film-details__comment-text">${data.comments.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${data.comments.author}</span>
          
          <span class="film-details__comment-day">${moment(data.comments.date).fromNow()}</span>
        </p>
      </div>
    </li>
`);

export const createScoreTemplate = (data) => {
  const items = [];

  for (let i = 1; i < 10; i++) {
    items.push(`
      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === Math.floor(data.personalRating) ? `checked` : ``}>
      <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>
    `);
  }

  return (
    `<div class="film-details__user-rating-score">
      ${items.join(``)}
    </div>`
  );
};

const createGenresTemplate = (card) => {
  const block = [...(card.genre)].map((genre) => (
    `<span class="film-details__genre">${genre}</span>`
  )).join(``);

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
    <td class="film-details__cell">${card.duration} m</td>
  </tr>`
);

export const createCommentsSectionTemplate = (data) => (
  `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>
      ${createCommentsTemplate(data)}
      <div class="film-details__new-comment">
        <div>
          <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
          <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">
            ${createEmojiTemplate()}
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
        </label>
      </div>
    </section>`
);

export const createRatingTemplate = (data) => (
  `<div class="film-details__rating">
  <p class="film-details__total-rating">${data.rating}</p>
  <p class="film-details__user-rating">Your rate ${data.personalRating}</p>
</div>`
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
              <p class="film-details__title-original">Original: ${data.alternativeTitle}</p>
            </div>
            ${createRatingTemplate(data)}
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
              <td class="film-details__cell">${data.actors.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${moment(data.year).format(`D MMMM YYYY`)} (${data.country})</td>
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

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${data.isAddedToWatched ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${data.isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
        
        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${data.isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>

        
      </section>

  
    ${createCommentsSectionTemplate(data)}

    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
        <button class="film-details__watched-reset" type="button">undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="${data.poster}" alt="film-poster" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${data.title}</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          
          ${createScoreTemplate(data)}
        </section>
      </div>
    </section>
  </form>
</section>`
);
