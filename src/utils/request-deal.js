export function queryString(params, encode) {
  let str = ''
  Object.keys(params).forEach((i) => {
    str += `&${i}=${encode ? encodeURIComponent(params[i]) : params[i]}`
  })
  return str.slice(1)
}

export function getUrl(url, params) {
  if (!params || Object.keys(params).length <= 0) return url
  let key = url + (url.indexOf('?') >= 0 ? '&' : '?')
  if (params) key += queryString(params, true)
  return key
}

export function convertToFormData(obj) {
  const data = new FormData()
  Object.keys(obj).forEach((i) => {
    if (obj[i] === undefined) return
    if (obj[i] instanceof FileList) {
      [].map.call(obj[i], file => data.append(i, file))
    } else if (obj[i] instanceof Array && (obj[i][0] instanceof File || (typeof obj[i][0] === 'string' && obj[i][0].indexOf('data') === 0) || obj[i][0] instanceof FileList)) { // 多张图片
      obj[i].forEach((item) => {
        if (item instanceof FileList) [].map.call(item, file => data.append(i, file))
        else data.append(i, item)
      })
    } else if ((typeof obj[i]).indexOf('object') >= 0) {
      if (obj[i] instanceof Array && (obj[i][0] instanceof File || obj[i][0] instanceof FileList)) {
        // 上传多张图片
        obj[i].forEach((item) => {
          if (item instanceof File) data.append(i, item);
          else [].map.call(item, file => data.append(i, file))
        })
      } else data.append(i, JSON.stringify(obj[i]))
    } else {
      data.append(i, obj[i])
    }
  })
  return data
}
