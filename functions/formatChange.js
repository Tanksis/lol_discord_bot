const tierOrder = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];
const rankOrder = ["I", "II", "III", "IV"];
//this function is used to format the and check the lp changes since last bot call

function formatChange(oldRank, newRank, summonerName) {
  const oldRankVal = [oldRank.rank, oldRank.tier, oldRank.leaguePoints];
  const newRankVal = [newRank.rank, newRank.tier, newRank.leaguePoints];

  const sameRank = oldRankVal.every((val, index) => val === newRankVal[index]);

  if (sameRank) {
    return null;
  }
  const oldTierIndex = tierOrder.indexOf(oldRank.tier);
  const newTierIndex = tierOrder.indexOf(newRank.tier);
  const oldRankIndex = rankOrder.indexOf(oldRank.rank);
  const newRankIndex = rankOrder.indexOf(newRank.rank);

  let result = "";

  // Determine if it's a promotion or demotion
  const isPromotion =
    newTierIndex > oldTierIndex ||
    (newTierIndex === oldTierIndex && newRankIndex < oldRankIndex);

  const sign = isPromotion ? "+" : "-";

  if (oldTierIndex !== newTierIndex || oldRankIndex !== newRankIndex) {
    result += `\`\`\`diff\n${sign}${oldRank.tier} ${oldRank.rank} ${oldRank.leaguePoints} LP -> ${newRank.tier} ${newRank.rank} ${newRank.leaguePoints} LP (${summonerName})\n\`\`\``;
  } else {
    // Only LP changed
    const lpChange = (newRank.leaguePoints || 0) - (oldRank.leaguePoints || 0);
    const lpSign = lpChange >= 0 ? "+" : "-";
    result += `\`\`\`diff\n${lpSign}${oldRank.tier} ${oldRank.rank} ${oldRank.leaguePoints} LP -> ${newRank.tier} ${newRank.rank} ${newRank.leaguePoints} LP (${summonerName})\n\`\`\``;
  }

  return result || null;
}

//new format to change:
//expected output will be +GOLD III 32 lp -> GOLD II 10 lp if promoted
//-SILVER I 10 lp -> SILVER II 85 lp if demoted

function formatChangeLogic(oldRank, newRank) {
  const oldTierIndex = tierOrder.indexOf(oldRank.tier);
  const newTierIndex = tierOrder.indexOf(newRank.tier);
  const oldRankIndex = rankOrder.indexOf(oldRank.rank);
  const newRankIndex = rankOrder.indexOf(newRank.rank);

  let result = "";

  // Determine if it's a promotion or demotion
  const isPromotion =
    newTierIndex > oldTierIndex ||
    (newTierIndex === oldTierIndex && newRankIndex < oldRankIndex);

  const sign = isPromotion ? "+" : "-";

  if (oldTierIndex !== newTierIndex || oldRankIndex !== newRankIndex) {
    result += `${sign}${oldRank.tier} ${oldRank.rank} ${oldRank.leaguePoints} LP -> ${newRank.tier} ${newRank.rank} ${newRank.leaguePoints} LP`;
  } else {
    // Only LP changed
    const lpChange = (newRank.leaguePoints || 0) - (oldRank.leaguePoints || 0);
    const lpSign = lpChange >= 0 ? "+" : "-";
    result += `${lpSign}${oldRank.tier} ${oldRank.rank} ${oldRank.leaguePoints} LP -> ${newRank.tier} ${newRank.rank} ${newRank.leaguePoints} LP`;
  }

  return result || null;
}

module.exports = { formatChange, formatChangeLogic };
