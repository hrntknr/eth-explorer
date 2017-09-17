const express = require('express')
const router = express.Router()
const sender = require('./sender')
const web3 = require('./sender').getWeb3()

router.get('/', (req, res)=>{
  res.render('index')
})

router.get('/getTransaction/:hash', (req, res, next)=>{
  web3.eth.getTransaction(req.params.hash, (err, tx)=>{
    if(err)return next(err)
    if(tx.value!=null) {
      tx.ethValue = web3.utils.fromWei(tx.value, 'ether')
    }
    res.json(tx)
  })
})

router.get('/getBlock/:hash', (req, res, next)=>{
  web3.eth.getBlock(req.params.hash, (err, block)=>{
    if(err)return next(err)
    res.json(block)
  })
})

router.get('/getEvent/:id/:tx_hash', (req, res, next)=>{
  sender.getTxByEventId(req.params.id, req.params.tx_hash, (err, event)=>{
    if(err)return next(err)
    if(event == null) {
      const err = new Error('Not Found')
      err.status = 404
      return next(err)
    }
    res.json(event)
  })
})

module.exports = router
