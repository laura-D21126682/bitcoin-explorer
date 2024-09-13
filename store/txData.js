let latestTx = null;


const setLatestTx = (txData) => {
  latestTx = txData;
};

const getLatestTx = () => {
  return latestTx;
};

const clearLatestTx = () => {
  latestTx = null;
};


module.exports = {
  setLatestTx,
  getLatestTx,
  clearLatestTx,
};