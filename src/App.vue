<template>
  <div id="app">
    <router-view></router-view>
    <h1>Ethereum block explorer</h1>
    <div id="content">
      <div id="blocks">
        <h2>Blocks</h2>
        <transition-group name="item" class="list" tag="ul">
          <li v-for="block in blocks" :key="block.hash" class="item">
            <router-link :to="{path: `/block/${block.hash}`}">
              <div>
                <p>Block: {{block.number}}</p>
                <p>{{block.time}}</p>
              </div>
              <p>Hash {{block.hash}}</p>
              <div>
                <p>GasUsed: {{block.gasUsed}}</p>
                <p>GasLimit: {{block.gasLimit}}</p>
                <p>IncludeTx: {{block.transactions.length}}</p>
              </div>
            </router-link>
          </li>
        </transition-group>
      </div>
      <div id="txs">
        <h2>Pending Txs</h2>
        <transition-group name="item" tag="ul" class="list">
          <li v-for="tx in txs" :key="tx.hash" class="item" v-bind:class="{contract: tx.input!='0x'}">
            <router-link :to="{path: `/tx/${tx.hash}`}">
              <p>TX# {{tx.hash}}</p>
              <div>
                <p>From: {{tx.from}}</p>
                <p>To: {{tx.from}}</p>
              </div>
              <div>
                <p>Amount: {{tx.ethValue}} ether</p>
                <p>Gas: {{tx.gas}}</p>
              </div>
            </router-link>
          </li>
        </transition-group>
      </div>
      <div v-for="(contract, id) in contracts" :key="id" id="contract">
        <h2>{{contract.title}}</h2>
        <transition-group name="item" tag="ul" class="list">
          <li v-for="event in contract.events" :key="event.transactionHash" class="item">
            <router-link :to="{path: `/event/${id}/${event.transactionHash}`}">
              <p>TX# {{event.transactionHash}}</p>
              <p>Event: {{event.event}}</p>
            </router-link>
          </li>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import ioClient from 'socket.io-client'
import moment from 'moment'
export default {
  name: 'app',
  data() {
    return {
      blocks: [],
      txs: [],
      contracts: {}
    }
  },
  created() {
    const io = ioClient()
    io.emit('reqNewBlockHeaders')
    io.on('resNewBlockHeaders', (blocks)=>{
      blocks.map((block)=>{block.time = moment(block.timestamp*1000).format('LTS')})
      this.$set(this, 'blocks', blocks)
      io.on('newBlockHeaders', (block)=>{
        block.time = moment(block.timestamp*1000).format('LTS')
        this.blocks.unshift(block)
        for(;this.blocks.length > 10;) {
          this.blocks.pop()
        }
      })
    })
    io.emit('reqPendingTransactions')
    io.on('resPendingTransactions', (txs)=>{
      this.$set(this, 'txs', txs)
      io.on('pendingTransactions', (tx)=>{
        this.txs.unshift(tx)
        for(;this.txs.length > 10;) {
          this.txs.pop()
        }
      })
    })
    io.emit('reqContracts')
    io.on('resContracts', (contracts)=>{
      this.$set(this, 'contracts', contracts)
      for(let id in contracts) {
        io.on(`event_${id}`, (event)=>{
          this.contracts[id].events.unshift(event)
          for(;this.contracts[id].events.length > 10;) {
            this.contracts[id].events.pop()
          }
        })
      }
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
  text-decoration-line: none;
}
.list {
  height: 944px;
  overflow: hidden;
  .item {
    a {
      color: #2c3e50
    }
    transition: all .3s ease;
    overflow: hidden;
    height: 90px;
    margin: 4px;
  }
  .item-enter, .item-leave-to {
    height: 0;
    opacity: 0;
  }
}
#content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  #blocks {
    width: 500px;
    .item {
      p {
        font-size: .9em;
        white-space: nowrap;
        margin: 0 0 0 10px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      div {
        display: flex;
        flex-direction: row;
      }
    }
  }
  #txs {
    width: 500px;
    .item {
      p {
        font-size: .9em;
        white-space: nowrap;
        margin: 0 0 0 10px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      div {
        display: flex;
        flex-direction: row;
      }
    }
    .item.contract {
      border-left: 2px solid #3498db;
    }
    .item:not(.contract) {
      border-left: 2px solid #e74c3c;
    }
  }
  #contract {
    width: 500px;
    .item {
      p {
        font-size: .9em;
        white-space: nowrap;
        margin: 0 0 0 10px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      div {
        display: flex;
        flex-direction: row;
      }
    }
  }
}
</style>
