const NOVICE_RANG_MIN_VALUE = 10;
const MOVIE_RANG_MAX_VALUE = 20;

export const setUserRang = (data) => {
  switch (true) {
    case data <= NOVICE_RANG_MIN_VALUE:
      return `novice`;
    case data > NOVICE_RANG_MIN_VALUE && data < MOVIE_RANG_MAX_VALUE:
      return `fan`;
    case data >= MOVIE_RANG_MAX_VALUE:
      return `movie buff`;
    default:
      return `No rang`;
  }
};
