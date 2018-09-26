<template>
  <div class="activity-demo">
    <img src="../../assets/logo.png" alt="">
    <client-header/>
    {{title}}
    <select class="select" v-model="lang">
      <option v-for="(l,i) in langs" :value="l.value" :key="i">{{l.name}}</option>
    </select>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions, import/no-unresolved
import { HttpMixin, LangMixin, SnackbarMixin, TitleMixin } from 'src/common/Mixin'
import ClientHeader from '../../common/components/ClientHeader.vue'

export default {
  name: 'ActivityDemo',
  mixins: [TitleMixin, LangMixin, HttpMixin, SnackbarMixin],
  beforeMount() {
    this.getUserInfo()
  },
  data() {
    return {
      title: 'Activity demo',
    }
  },
  methods: {},
  components: { ClientHeader },
}
</script>
