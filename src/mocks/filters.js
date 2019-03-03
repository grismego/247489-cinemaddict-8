import {generateRandomNumber} from '../util';

const NAMES = [`All movies`, `Watchlist`, `History`, `Favorites`, `stats`];
const ANCHORS = [`all`, `wathlist`, `history`, `favorites`, `stats`];

const generateFilters = () => NAMES.map((name) => {
  const addClassNameModificator = () => {
    let className = ``;
    if (name === `All movies` || name === `stats`) {
      if (name === `All movies`) {
        className = `main-navigation__item--active`;
      } else {
        className = `main-navigation__item--additional`;
      }
    }
    return className;
  };
  return {
    name,
    amount: generateRandomNumber(0, 50),
    classNameModificator: addClassNameModificator(),
    anchor: ANCHORS
  };
});

// const NAMES = new Map([[`All movies`, `all`], [`Watchlist`, `wathlist`], [`History`, `history`], [`Favorites`, `favorites`], [`stats`, `stats`]]);

// const generateFilters = () => NAMES.map(([name, anchor]) => {
//   const addClassNameModificator = () => {
//     let className = ``;
//     if (name === `All movies` || name === `stats`) {
//       if (name === `All movies`) {
//         className = `main-navigation__item--active`;
//       } else {
//         className = `main-navigation__item--additional`;
//       }
//     }
//     return className;
//   };
//   return {
//     name,
//     amount: generateRandomNumber(0, 50),
//     classNameModificator: addClassNameModificator(),
//     anchor
//   };
// });


console.log(generateFilters())

// export default [
//   {
//     name: `All movies`,
//     state: `main-navigation__item--active`,
//     anchor: `all`
//   },
//   {
//     name: `Watchlist`,
//     count: 13,
//     anchor: `watchlist`
//   },
//   {
//     name: `History`,
//     count: 6,
//     anchor: `history`
//   },
//   {
//     name: `Favorites`,
//     count: 8,
//     anchor: `favorites`
//   },
//   {
//     name: `stats`,
//     classNameModificator: `main-navigation__item--additional`,
//     anchor: `stats`
//   }
// ];
