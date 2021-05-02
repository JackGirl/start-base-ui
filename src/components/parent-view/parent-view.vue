<template>
  <keep-alive :exclude="notCacheName">
    <router-view ref="child"/>
  </keep-alive>
</template>
<script>
export default {
  name: 'ParentView',
  data () {
    return {
    }
  },
  computed: {
    notCacheName () {
      return (this.$route.meta && this.$route.meta.keepAlive) ? this.$route.name : ''
    }
  }
}
</script>
