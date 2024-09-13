
const express = require('express');
const { getLatestTx } = require('../store/txData');
const { getLatestBlock } = require('../store/blockData');

const router = express.Router();


// Gets a transaction
router.get('/transactions', async (req, res, next) => {
  
  try{
    const transaction = await getLatestTx();
    
    if (!transaction) {
      return res.status(404).json({ error: 'Router.get transactions: data not found' });
    }

    res.status(200).json(transaction);

  } catch (err) {
    err.custom ='Router.get transactions error';
    next(err);
  }

}); 


// Gets a block
router.get('/blocks', async (req, res, next) => {

  try{

    const block = await getLatestBlock();

    if (!block) {
      return res.status(404).json({ error: 'Router.get blocks: data not found' })
    }

    res.status(200).json(block)

  } catch (err) {
    err.custom = 'Router.get blocks error';
    next(err);
  }

})


module.exports = router;