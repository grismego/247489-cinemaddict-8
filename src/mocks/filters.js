export const filterFunctions = {
  history: (it) => it.isWatched,
  favorites: (it) => it.isFavorite,
  watchlist: (it) => it.isAddedToWatched
};

export const generateFilters = (cards = []) => [
  {
    name: `All movies`,
    state: `active`,
    anchor: `all`,
  },
  ...[`Watchlist`, `History`, `Favorites`].map((name) => {
    const filterBy = filterFunctions[name.toLowerCase()];
    return {
      name,
      count: cards.filter(filterBy).length,
      anchor: name.toLowerCase(),
      filterBy
    };
  }),
  {
    name: `stats`,
    state: `additional`,
    anchor: `stats`
  }
];
