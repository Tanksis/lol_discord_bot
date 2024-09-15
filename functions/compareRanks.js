const tierOrder = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];
const rankOrder = ["IV", "III", "II", "I"];

//compare function should return a negative, zero, or pos value
//the func is then used using .sort which compares based off return val
//eg if val is negative, the value is lower than a positive val
function compareRanks(a, b) {
  const tierComparison = tierOrder.indexOf(b.tier) - tierOrder.indexOf(a.tier);
  if (tierComparison !== 0) return tierComparison;

  const rankComparison = rankOrder.indexOf(b.rank) - rankOrder.indexOf(a.rank);
  if (rankComparison !== 0) return rankComparison;

  return b.leaguePoints - a.leaguePoints; // Higher league points first
}

module.exports = compareRanks;
