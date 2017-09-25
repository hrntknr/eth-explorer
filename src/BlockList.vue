<template lang="pug">
  div#blocks
    h2 Blocks
    transition-group.list(name="item" tag="ul")
      li.item(v-for="block in blocks" :key="block.hash")
        router-link(:to="{path: `/block/${block.hash}`}")
          div
            p Block: {{block.number}}
            p {{block.time}}
          p Hash {{block.hash}}
          div
            p GasUsed: {{block.gasUsed}}
            p GasLimit: {{block.gasLimit}}
            p IncludeTx: {{block.transactions.length}}
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
