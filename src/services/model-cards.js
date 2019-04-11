export default class ModelCards {
  constructor(data) {
    this.id = data[`id`];
    this.actors = data[`film_info`].actors.join(`, `);
    this.ageRating = data[`film_info`][`age_rating`];
    this.alternativeTitle = data[`film_info`][`alternative_title`];
    this.description = data[`film_info`].description;
    this.director = data[`film_info`].director;
    this.genre = data[`film_info`].genre.join(` `);
    this.poster = data[`film_info`].poster;
    this.title = data[`film_info`].title;
    this.year = data[`film_info`].release.date;
    this.rating = data[`film_info`][`total_rating`];
    this.country = data[`film_info`].release[`release_country`];
    this.duration = data[`film_info`].runtime;
    this.writers = data[`film_info`].writers;
    this.comments = data[`comments`];
    this.personalRating = data[`user_details`][`personal_rating`];
    this.watchingDate = data[`user_details`][`watching_date`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.isAddedToWatched = data[`user_details`][`watchlist`];
    this.isFavorite = data[`user_details`][`favorite`];
  }

  static toRAW(data) {
    return {
      'id': data.id,
      'comments': data.comments,
      'film_info': {
        'actors': data.actors,
        'age_rating': data.ageRating,
        'description': data.description,
        'director': data.director,
        'genre': data.genre,
        'poster': data.poster,
        'release': {
          'date': data.year,
          'release_country': data.country
        },
        'runtime': data.duration / 1000 / 60,
        'title': data.title,
        'total_rating': data.rating,
        'writers': data.writers
      },
      'user_details': {
        'already_watched': data.isWatched,
        'favorite': data.isFavorite,
        'watching_date': data.comments.date,
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
