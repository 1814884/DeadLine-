// 网络请求工具
const BASE_URL = 'https://api.example.com'

// 请求拦截器
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 显示加载提示
    uni.showLoading({
      title: '加载中...'
    })
    
    // 添加token等认证信息
    const token = uni.getStorageSync('token')
    if (token) {
      options.header = {
        ...options.header,
        'Authorization': `Bearer ${token}`
      }
    }
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        uni.hideLoading()
        
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          uni.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        uni.hideLoading()
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// GET请求
export const get = (url, data = {}) => {
  return request({
    url,
    method: 'GET',
    data
  })
}

// POST请求
export const post = (url, data = {}) => {
  return request({
    url,
    method: 'POST',
    data
  })
}

// PUT请求
export const put = (url, data = {}) => {
  return request({
    url,
    method: 'PUT',
    data
  })
}

// DELETE请求
export const del = (url, data = {}) => {
  return request({
    url,
    method: 'DELETE',
    data
  })
}

export default {
  get,
  post,
  put,
  delete: del
}