const filterFunctions = {
  history: (it) => it.isWatched,
  favorites: (it) => it.isFavorite,
  watchlist: (it) => it.addedToWathed
};

export const generateFilters = (cards = []) => [
  {
    name: `All movies`,
    state: `active`,
    anchor: `all`,
  },
  ...[`Watchlist`, `History`, `Favorites`].map((name) => ({
    name,
    count: cards.filter(filterFunctions[name.toLowerCase()]).length,
    anchor: name.toLowerCase(),
    filterBy: filterFunctions[name.toLowerCase()]
  })),
  {
    name: `stats`,
    state: `additional`,
    anchor: `stats`
  }
];
