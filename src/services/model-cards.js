export default class ModelCards {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`].title;
    this.poster = data[`film_info`].poster;
    this.rating = data[`film_info`][`total_rating`];
    this.description = data[`film_info`].description;
    this.genre = data[`film_info`].genre.join(` `);
    this.duration = data[`film_info`].runtime;
    this.year = data[`film_info`].release.date;
    this.director = data[`film_info`].director;
    this.ageRating = data[`film_info`][`age_rating`];
    this.actors = data[`film_info`].actors;
    this.writers = data[`film_info`].writers;
    this.country = data[`film_info`].release[`release_country`];
    // this.comments = {
    //   author: data[`comments`].author,
    //   emoji: data[`comments`].emoji,
    // };
    this.comments = data[`comments`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.isAddedToWatched = data[`user_details`][`watchlist`];
    this.isFavorite = data[`user_details`][`favorite`];
  }

  static toRAW(data) {
    return {
      'id': data.id,
      'comments': data.popup.commentsList,
      'film_info': {
        'actors': data.actors,
        'age_rating': data.ageRating,
        'alternative_title': data.title,
        'description': data.description,
        'director': data.director,
        'genre': data.genre,
        'poster': data.poster,
        'release': {
          'date': data.year,
          'release_country': data.country
        },
        'runtime': data.duration,
        'title': data.title,
        'total_rating': data.rating,
        'writers': data.writers
      },
      'user_details': {
        'already_watched': data.isWatched,
        'favorite': data.isFavorite,
        'personal_rating': 5,
        'watching_date': 1,
        'watchlist': data.isAddedToWatched
      }
    };
  }

  static parseData(data) {
    return new ModelCards(data);
  }

  static parseDatas(data) {
    return data.map(ModelCards.parseData);
  }
}


// id: index,
//   title: getRandomArrayElement(TITLES),
//   poster: `../images/posters/${getRandomArrayElement(POSTERS)}.jpg`,
//   rating: generateRandomRating(),
//   description: getRandomArrayElements(DESCRIPTIONS, DESCRIPTIONS_MAX_COUNT).join(`, `),
//   genre: getRandomArrayElement(GENRES),
//   duration: generateRandomNumber(0, 300),
//   year: generateReleaseDate(),
//   commentsCount: generateRandomNumber(COMMENTS_MIN_COUNT, COMMENTS_MAX_COUNT),
//   director: getRandomArrayElement(DIRECTOR),
//   ageRating: getRandomArrayElement(AGE_RATING),
//   actors: getRandomArrayElements(ACTORS, ACTORS.length).join(`, `),
//   writers: getRandomArrayElement(WRITERS),
//   country: getRandomArrayElement(COUNTRY),
//   comments: [
//     {
//       author: `Tim Macoveev`,
//       time: `20190313`,
//       comment: `So long-long story, boring!`,
//       emoji: `😴`,
//     },
//     {
//       author: `Denis Popov`,
//       time: `20190314`,
//       comment: `Pretty good!`,
//       emoji: `😀`,
//     },
//   ],
//   isWatched: Math.random() > 0.5,
//   isAddedToWatched: true,
//   isFavorite: false