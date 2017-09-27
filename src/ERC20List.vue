<template lang="pug">
  div#erc20
    h2 {{erc20.title}}
    transition-group.list(name="item" tag="ul")
      li.item(v-for="event in erc20.events" :key="event.transactionHash")
        router-link(:to="{path: `/tx/${event.transactionHash}`}")
          p TX# {{event.transactionHash}}
          div
            p From: {{event.returnValues['0']}}
            p To: {{event.returnValues['1']}}
          div
            p Amount: {{event.returnValues['2']}}
</template>

<script>
export default {
  props: {
    'erc20': Object,
    'id': String,
    'io': Object
  },
  created() {
    this.io.on(`erc20tx_${this.id}`, (event)=>{
      this.erc20.events.unshift(event)
      for(;this.erc20.events.length > 10;) {
        this.erc20.events.pop()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
#erc20 {
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
