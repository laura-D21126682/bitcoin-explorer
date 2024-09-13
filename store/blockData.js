
let latestBlock = null;

const setLatestBlock = (blockData) => {
  latestBlock = blockData;
};

const getLatestBlock = () => {
  return latestBlock;
};

const clearLatestBlock = () => {
  latestBlock = null;
};



module.exports = {
  setLatestBlock,
  getLatestBlock,
  clearLatestBlock,
};