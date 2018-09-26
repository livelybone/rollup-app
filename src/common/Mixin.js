import AuthToken from '../api/AuthToken'
import Http from '../api/Http'
import * as Langs from '../api/Langs'

const { langs, getLang, setLang } = Langs

/**
 * 页面标题设置
 * */
export const TitleMixin = {
  beforeMount() {
    this.setTitle()
  },
  watch: {
    title() {
      this.setTitle()
    },
  },
  methods: {
    setTitle() {
      if (!this.title) throw new Error('Please set title attribute in data')
      else document.title = this.title
    },
  },
}

/**
 * 多语言设置，当前语言获取
 * */
export const LangMixin = {
  beforeMount() {
    this.getLang().then((val) => {
      this.lang = val
    })
  },
  data() {
    return {
      langs,
      lang: '',
    }
  },
  watch: {
    lang(val) {
      this.setLang(val).then(console.log).catch(console.error)
    },
  },
  methods: {
    getLang,
    setLang,
  },
}

/**
 * Http 请求封装，另含两个接口方法
 * @method getUserInfo 获取用户信息
 * @method signOut 登出
 * */
export const HttpMixin = {
  data() {
    return {
      Http,
      userInfo: {},
    }
  },
  methods: {
    getUserInfo() {
      this.Http.get('user/info').then((res) => {
        this.userInfo = res
      }).catch(this.snackbar.error)
    },
    signOut() {
      AuthToken.setToken('')
      this.userInfo = {}
      return Promise.resolve()
    },
  },
}

/**
 * 全局 snackbar 组件
 * */
export const SnackbarMixin = {
  created() {
    this.snackbar = window.snackbar
  },
  data() {
    return {
      snackbar: null,
    }
  },
}
