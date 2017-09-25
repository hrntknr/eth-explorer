<template>
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
</template>

<script>
export default {
  props: {
    'io': Object
  },
  data() {
    return {
      txs: []
    }
  },
  created() {
    this.io.emit('reqPendingTransactions')
    this.io.on('resPendingTransactions', (txs)=>{
      this.$set(this, 'txs', txs)
      this.io.on('pendingTransactions', (tx)=>{
        this.txs.unshift(tx)
        for(;this.txs.length > 10;) {
          this.txs.pop()
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
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
</style>
