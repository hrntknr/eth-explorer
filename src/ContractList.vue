<template>
  <div id="contract">
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
