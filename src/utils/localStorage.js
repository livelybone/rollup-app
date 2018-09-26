import Cookie from './cookie'

export default class LocalStorage {
  constructor(handleStorage) {
    this.localStorageSupport = false
    this.listener = null
    if (typeof window !== 'undefined') {
      this.localStorageSupport = !!window.localStorage
      if (handleStorage) {
        this.listener = e => handleStorage(e)
        window.addEventListener('storage', this.listener)
      }
    }
  }

  set(key, val) {
    if (!val) this.del(key)
    try {
      if (this.localStorageSupport) {
        localStorage.setItem(key, val)
      } else {
        Cookie.set(key, val)
      }
    } catch (e) {
      console.error(e)
      this.localStorageSupport = false
      Cookie.set(key, val)
    }
  }

  get(key) {
    try {
      if (this.localStorageSupport) {
        return localStorage.getItem(key)
      }
      return Cookie.get(key)
    } catch (e) {
      console.error(e)
      this.localStorageSupport = false
      return Cookie.get(key)
    }
  }

  del(key) {
    try {
      if (this.localStorageSupport) {
        localStorage.removeItem(key)
      } else {
        Cookie.del(key)
      }
    } catch (e) {
      console.error(e)
      this.localStorageSupport = false
      Cookie.del(key)
    }
  }

  removeListener() {
    if (this.listener) window.removeEventListener('storage', this.listener)
  }
}
