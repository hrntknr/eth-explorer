<template>
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
</template>

<script>
import moment from 'moment'
export default {
  props: {
    'io': Object
  },
  data() {
    return {
      blocks: []
    }
  },
  created() {
    this.io.emit('reqNewBlockHeaders')
    this.io.on('resNewBlockHeaders', (blocks)=>{
      blocks.map((block)=>{block.time = moment(block.timestamp*1000).format('LTS')})
      this.$set(this, 'blocks', blocks)
      this.io.on('newBlockHeaders', (block)=>{
        block.time = moment(block.timestamp*1000).format('LTS')
        this.blocks.unshift(block)
        for(;this.blocks.length > 10;) {
          this.blocks.pop()
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
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
</style>
