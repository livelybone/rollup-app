/* eslint-disable import/no-extraneous-dependencies */
/**
 * auth_token
 */
import { Observer } from '@livelybone/simple-observer'
import LocalStorage from '../utils/localStorage'

class AuthTokenClass {
  constructor() {
    this.key = 'AUTH_TOKEN'
    this.expireKey = 'EXPIRE'
    this.localStorage = new LocalStorage()
    this.tokenChange = new Observer((next) => {
      this.next = next
    })
  }

  setToken(val, expired) {
    const { token = '', token_expire = '' } = val || {}
    const oldToken = this.getT()
    this.localStorage.set(this.key, token)
    this.localStorage.set(this.expireKey, token_expire)
    if (this.next && token !== oldToken) this.next(token, expired)
  }

  getToken() {
    const token = this.getT()
    if (!token) return token
    const now = Date.now()
    const expireTime = +this.localStorage.get(this.expireKey) * 1000
    if (now > expireTime) {
      this.setToken('', true)
      return ''
    }
    return token
  }

  getT() {
    return this.localStorage.get(this.key)
  }
}

export default new AuthTokenClass()
