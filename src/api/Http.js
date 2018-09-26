/**
 * http: axios
 */
import axios from 'axios'
import config from '../../config/config'
import { convertToFormData, getUrl } from '../utils/request-deal'
import AuthToken from './AuthToken'

function setAuth(url) {
  axios.defaults.headers.Authorization = `Bearer ${AuthToken.getToken()}`
  axios.defaults.headers['X-SITE-ID'] = typeof window !== 'undefined' && window.INIT_STATE && window.INIT_STATE.siteInfo ? window.INIT_STATE.siteInfo.id || '' : ''
  return url
}

function initialAxios() {
  axios.defaults.baseURL = config.backendUrl
  axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
  // axios.defaults.withCredentials = true; // 允许 AJAX 跨域请求带 Cookie 设置
  // 如果你想在客户端app中获取自定义的 header 信息，需要在服务器端 header 中添加 Access-Control-Expose-Headers：
  // header('Access-Control-Expose-Headers:token,uid');
  // 处理服务器返回的错误信息
  axios.defaults.validateStatus = status => (status >= 200 && status < 300) || (status >= 400)
}

initialAxios()

export default class Http {
  static get(url, data) {
    const uri = getUrl(url, data)
    return Http.responseDeal(axios.get(setAuth(uri)))
  }

  static getFile(url) {
    // 适用于需要登录的情况
    return axios.get(setAuth(url), { responseType: 'blob' }).then(res => res.data)
  }

  static post(url, data) {
    // backend 代码统一使用urlParams/FormData对象的处理方式，因此这个API不用，put方法同理
    return Http.responseDeal(axios.post(setAuth(url), data))
  }

  static postForm(url, data) {
    const formData = convertToFormData(data)
    return Http.responseDeal(axios.post(setAuth(url), formData, { headers: { 'Content-Type': 'multipart/form-data' } }))
  }

  static del(url) {
    return Http.responseDeal(axios.delete(setAuth(url)))
  }

  static put(url, data) {
    return Http.responseDeal(axios.put(setAuth(url), data))
  }

  static putForm(url, data) {
    const formData = convertToFormData(data)
    return Http.responseDeal(axios.put(setAuth(url), formData, { headers: { 'Content-Type': 'multipart/form-data' } }))
  }

  static all(callback, ...reqs) {
    const queue = reqs.map((req) => {
      if (req.method === 'GET') {
        return Http.get(req.url, req.data)
      }
      return axios({
        method: req.method,
        url: setAuth(req.url),
        data: req.data,
      })
    })
    return axios.all(queue).then(axios.spread((acct, perms) => {
      callback(acct, perms)
    }))
  }

  static responseDeal(promise) {
    return promise.then((res) => {
      // 去除config, request, status, statusText...等一些其他字段，关注data
      const { data } = res
      if (data) {
        if (Http.errorValidate(data)) {
          throw new Error(data.message || data.msg)
        } else {
          return data.result
        }
      }
      return res
    }, (e) => {
      // setImmediate(() => Vue.prototype.snackBar.error(e));
      throw e
    })
  }

  static errorValidate(data) {
    // 与后台约定的错误验证方式
    // 现约定， 对于返回的数据的字段code，0表示成功，1表示出错
    return data.code !== 0
  }
}
