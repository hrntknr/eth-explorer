<template lang="pug">
  div#contract
    h2 {{contract.title}}
    transition-group.list(name="item" tag="ul")
      li.item(v-for="event in contract.events" :key="event.transactionHash")
        router-link(:to="{path: `/event/${id}/${event.transactionHash}`}")
          p TX# {{event.transactionHash}}
          p Event: {{event.event}}
</template>

<script>
export default {
  props: {
    'contract': Object,
    'id': String,
    'io': Object
  },
  created() {
    this.io.on(`event_${this.id}`, (event)=>{
      this.contract.events.unshift(event)
      for(;this.contract.events.length > 10;) {
        this.contract.events.pop()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
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
</style>
