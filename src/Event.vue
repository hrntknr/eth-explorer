<template lang="pug">
  div.mask(v-on:click="close")
    div.content
      h1(v-if="event") Event: {{event.event}}
      h1(v-else) Event
      p TX# 
        router-link(:to="{path: `/tx/${$route.params.tx_hash}`}") {{$route.params.tx_hash}}
      div(v-if="event")
        p Block: 
          router-link(:to="{path: `/block/${event.blockHash}`}") {{event.blockHash}}
        p Address: {{event.address}}
        div
          h2 ReturnValues
          p(v-for="(value, key) in event.returnValues" :key="key") {{key}}: {{value}}
        div#rawData
          h2 RawData
          pre {{event.raw.data}}
        div#topics
          h2 Topics
          pre(v-for="(topic, index) in event.raw.topics" :key="index") {{index}}: {{topic}}
      div.loader(v-else)
</template>

<script>
import axios from 'axios'
export default {
  name: 'event',
  data() {
    return {
      event: null
    }
  },
  created() {
    window.addEventListener('keydown', e =>{if(e.key=='Escape')this.$router.push('/')})
    axios.get(`/getEvent/${this.$route.params.id}/${this.$route.params.tx_hash}`)
    .then((res)=>{
      this.$set(this, 'event', res.data)
    })
    .catch((err)=>{
      console.error(err)
      this.$router.push('/')
    })
  },
  methods: {
    close(e) {
      if(e.target.className=='mask')this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
#rawData,#topics {
  background-color: #f6f8fa;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
#txs {
  font-size: .9em;
}
.mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  background-color: #edeff0;
  box-shadow:0px 0px 10px;
  max-width: 980px;
  max-height: calc(100% - 80px);
  overflow-y: auto;
  padding: 20px;
  border-radius: 3px;
}
h1 {
  font-size: 1.5em;
}
h2 {
  font-size: 1.2em;
}

.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.loader {
  color: #97D3E3;
  font-size: 10px;
  margin: 80px auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}

</style>