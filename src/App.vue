<template lang="pug">
  div#app
    router-view
    h1 Ethereum block explorer
    div#content
      BlockList(:io="io")
      TxList(:io="io")
      ContractList(v-for="(contract, id) in contracts" :key="id" :contract="contract" :id="id" :io="io")
      ERC20List(v-for="(erc20, id) in erc20s" :key="id" :erc20="erc20" :id="id" :io="io")
</template>

<script>
import ioClient from 'socket.io-client'
import BlockList from './BlockList.vue'
import TxList from './TxList.vue'
import ContractList from './ContractList.vue'
import ERC20List from './ERC20List.vue'
export default {
  name: 'app',
  components: {
    BlockList,
    TxList,
    ContractList,
    ERC20List
  },
  data() {
    return {
      contracts: {},
      erc20s: {},
      io: null
    }
  },
  created() {
    this.io = ioClient()
    this.io.emit('reqContracts')
    this.io.on('resContracts', (contracts)=>{
      this.$set(this, 'contracts', contracts)
    })
    this.io.emit('reqERC20s')
    this.io.on('resERC20s', (erc20s)=>{
      this.$set(this, 'erc20s', erc20s)
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
}
</style>
