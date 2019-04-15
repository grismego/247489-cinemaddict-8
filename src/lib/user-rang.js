const NOVICE_RANG_MIN_VALUE = 10;
const MOVIE_RANG_MAX_VALUE = 20;

export const setUserRang = (data) => {
  let rank;
  switch (true) {
    case data <= NOVICE_RANG_MIN_VALUE:
      rank = `novice`;
      break;
    case data > NOVICE_RANG_MIN_VALUE && data < MOVIE_RANG_MAX_VALUE:
      rank = `fan`;
      break;
    case data >= MOVIE_RANG_MAX_VALUE:
      rank = `movie buff`;
      break;
    default:
      rank = `No rang`;
  }
  return rank;
};
