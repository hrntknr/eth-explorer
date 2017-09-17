const socketio = require('socket.io')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const config = require('../config')
const web3 = new Web3(config.web3.provider)
const sender = Object.create(null)
let io
const blocks = []
const txs = []
const contracts = {}
const contracts_instance = {}

sender.init = (server)=>{
  io = socketio.listen(server)
  io.sockets.on('connection', (socket)=>{
    socket.on('reqNewBlockHeaders', ()=>{
      socket.emit('resNewBlockHeaders', blocks)
    })
    socket.on('reqPendingTransactions', ()=>{
      socket.emit('resPendingTransactions', txs)
    })
    socket.on('reqContracts', ()=>{
      socket.emit('resContracts', contracts)
    })
  })
}

sender.getWeb3 = ()=>{
  return web3
}

sender.getTxByEventId = (id, tx_hash, callback)=>{
  web3.eth.getTransaction(tx_hash, (err, tx)=>{
    if(err)return callback(err, null)
    contracts_instance[id].getPastEvents('allEvents', {fromBlock: tx.blockNumber, toBlock: tx.blockNumber}, (err, events)=>{
      if(err)return callback(err, null)
      const index = events.findIndex((event)=>{return(event.transactionHash == tx_hash)})
      callback(null, events[index])
    })
  })
}

const broadcast = (msg, data)=>{
  if(io != null) {
    io.emit(msg, data)
  }
}

web3.eth.subscribe('newBlockHeaders', (err, block)=>{
  if(err)return console.error(err.stack)
  web3.eth.getBlock(block.hash, (err, block)=>{
    broadcast('newBlockHeaders', block)
    blocks.unshift(block)
    for(;blocks.length > 10;) {
      blocks.pop()
    }
  })
})

web3.eth.subscribe('pendingTransactions', (err, txhash)=>{
  if(err)return console.error(err.stack)
  web3.eth.getTransaction(txhash, (err, tx)=>{
    if(err)return console.error(err.stack)
    if(tx==null)return
    if(tx.value!=null) {
      tx.ethValue = new BigNumber(web3.utils.fromWei(tx.value, 'ether')).toFixed(2)
    }
    broadcast('pendingTransactions', tx)
    txs.unshift(tx)
    for(;txs.length > 10;) {
      txs.pop()
    }
  })
})

config.contracts.map((contract, index)=>{
  const cnt = new web3.eth.Contract(contract.abi, contract.addr)
  contracts_instance[index] = cnt
  contracts[index] = contract
  contracts[index].events = []
  contract.watchEvent.map((event)=>{
    cnt.events[event]((err, e)=>{
      if(err)return console.error(err.stack)
      broadcast(`event_${index}`, e)
      contracts[index].events.unshift(e)
      for(;contracts[index].events.length > 10;) {
        contracts[index].events.pop()
      }
    })
  })
})

module.exports = sender