const compareRanks = require("../functions/compareRanks");

function createRank(tier, rank, leaguePoints) {
  return { tier, rank, leaguePoints };
}

test("compare if PLATINUM I, 10 lp > PLATINUM IV, 0 lp", () => {
  const ranks = [
    createRank("PLATINUM", "I", 10),
    createRank("PLATINUM", "IV", 0),
  ];

  const sortedRanks = ranks.sort(compareRanks);

  expect(sortedRanks).toEqual([
    createRank("PLATINUM", "I", 10),
    createRank("PLATINUM", "IV", 0),
  ]);
});

test("compare if DIAMOND III, 50 lp > PLATINUM I, 90 lp", () => {
  const ranks = [
    createRank("PLATINUM", "I", 90),
    createRank("DIAMOND", "III", 50),
  ];

  const sortedRanks = ranks.sort(compareRanks);

  expect(sortedRanks).toEqual([
    createRank("DIAMOND", "III", 50),
    createRank("PLATINUM", "I", 90),
  ]);
});

test("compare if CHALLENGER I, 300 lp > GRANDMASTER I, 400 lp", () => {
  const ranks = [
    createRank("GRANDMASTER", "I", 400),
    createRank("CHALLENGER", "I", 300),
  ];

  const sortedRanks = ranks.sort(compareRanks);

  expect(sortedRanks).toEqual([
    createRank("CHALLENGER", "I", 300),
    createRank("GRANDMASTER", "I", 400),
  ]);
});

test("compare if GOLD II, 10 lp > SILVER IV, 95 lp", () => {
  const ranks = [createRank("SILVER", "IV", 95), createRank("GOLD", "II", 10)];

  const sortedRanks = ranks.sort(compareRanks);

  expect(sortedRanks).toEqual([
    createRank("GOLD", "II", 10),
    createRank("SILVER", "IV", 95),
  ]);
});
