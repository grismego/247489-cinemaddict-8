const NoviceRangValue = {
  MIN_VALUE: 10,
  MAX_VALUE: 20
};

export const setUserRang = (data) => {
  switch (true) {
    case data <= NoviceRangValue.MIN_VALUE :
      return `novice`;
    case data > NoviceRangValue.MIN_VALUE && data < NoviceRangValue.MAX_VALUE:
      return `fan`;
    case data >= NoviceRangValue.MAX_VALUE:
      return `movie buff`;
    default:
      return `No rang`;
  }
};
