function decimalsToTime(decimals) {
  const hours = Math.floor(decimals);
  const minutes = Math.round((decimals - hours) * 60);
  return `${hours}h${minutes.toString().padStart(2, '0')}`;
}

module.exports = {
  decimalsToTime
}