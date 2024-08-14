const {
  formatChange,
  formatChangeLogic,
} = require("../functions/formatChange");

function createRank(tier, rank, leaguePoints) {
  return { tier, rank, leaguePoints };
}

test("+PLATINUM III 10 lp -> PLATINUM II 10 lp", () => {
  const oldRank = createRank("PLATINUM", "III", 10);
  const newRank = createRank("PLATINUM", "II", 10);

  const result = formatChangeLogic(oldRank, newRank);
  expect(result).toEqual("+PLATINUM III 10 LP -> PLATINUM II 10 LP");
});

test("-PLATINUM II 90 LP -> PLATINUM III 80 LP", () => {
  const oldRank = createRank("PLATINUM", "II", 90);
  const newRank = createRank("PLATINUM", "III", 80);

  const result = formatChangeLogic(oldRank, newRank);
  expect(result).toEqual("-PLATINUM II 90 LP -> PLATINUM III 80 LP");
});

test("+GOLD IV 10 LP -> GOLD II 90 LP", () => {
  const oldRank = createRank("GOLD", "IV", 10);
  const newRank = createRank("GOLD", "II", 90);

  const result = formatChangeLogic(oldRank, newRank);
  expect(result).toEqual("+GOLD IV 10 LP -> GOLD II 90 LP");
});

test("+SILVER I 10 LP -> GOLD IV 90 LP", () => {
  const oldRank = createRank("SILVER", "I", 10);
  const newRank = createRank("GOLD", "IV", 90);

  const result = formatChangeLogic(oldRank, newRank);
  expect(result).toEqual("+SILVER I 10 LP -> GOLD IV 90 LP");
});

test("-DIAMOND I 50 LP -> PLATINUM IV 0 LP", () => {
  const oldRank = createRank("DIAMOND", "I", 50);
  const newRank = createRank("PLATINUM", "IV", 0);

  const result = formatChangeLogic(oldRank, newRank);
  expect(result).toEqual("-DIAMOND I 50 LP -> PLATINUM IV 0 LP");
});

test("-BRONZE II 50 LP -> IRON III 20 LP", () => {
  const oldRank = createRank("BRONZE", "II", 50);
  const newRank = createRank("IRON", "III", 20);

  const result = formatChangeLogic(oldRank, newRank);
  expect(result).toEqual("-BRONZE II 50 LP -> IRON III 20 LP");
});
