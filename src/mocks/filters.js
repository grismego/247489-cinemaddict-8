import {generateRandomNumber} from '../util';

export const filters = [
  {
    name: `All movies`,
    classNameModificator: `main-navigation__item--active`,
    anchor: `all`
  },
  {
    name: `Watchlist`,
    count: generateRandomNumber(1, 20),
    anchor: `watchlist`
  },
  {
    name: `History`,
    count: generateRandomNumber(1, 20),
    anchor: `history`
  },
  {
    name: `Favorites`,
    count: generateRandomNumber(1, 20),
    anchor: `favorites`
  },
  {
    name: `stats`,
    classNameModificator: `main-navigation__item--additional`,
    anchor: `stats`
  }
];

