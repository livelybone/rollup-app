import LocalStorage from '../utils/localStorage'

/**
 * key of localStorage, don't change if not necessary!!
 * */
const key = 'lang'

const storage = new LocalStorage()

export const langs = [
  { name: '简体中文', value: 'CN' },
  { name: '繁体中文', value: 'CNT' },
  { name: 'English', value: 'EN' },
]

export function getLang() {
  return Promise.resolve(storage.get(key) || langs[0].value)
}

export function setLang(val) {
  return new Promise((res, rej) => {
    console.log(val)
    if (langs.some(l => l.value === val)) {
      storage.set(key, val)
      res('Language set successful')
    }
    rej(new Error('The language you want to set doesn\'t exist'))
  })
}
