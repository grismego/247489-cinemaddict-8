import {generateRandomNumber} from '../random';

const FILMS_MAX_COUNT = 20;

export const generateFilters = () => [
  {
    name: `All movies`,
    state: `active`,
    anchor: `all`
  },
  ...[`Watchlist`, `History`, `Favorites`].map((name) => ({
    name,
    count: generateRandomNumber(0, FILMS_MAX_COUNT),
    anchor: name.toLowerCase()
  })),
  {
    name: `stats`,
    state: `additional`,
    anchor: `stats`
  }
];
