// 本地存储工具
export const storage = {
  // 设置存储
  set(key, value) {
    try {
      uni.setStorageSync(key, value)
      return true
    } catch (e) {
      console.error('存储失败:', e)
      return false
    }
  },
  
  // 获取存储
  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key)
      return value !== '' ? value : defaultValue
    } catch (e) {
      console.error('获取存储失败:', e)
      return defaultValue
    }
  },
  
  // 删除存储
  remove(key) {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (e) {
      console.error('删除存储失败:', e)
      return false
    }
  },
  
  // 清空存储
  clear() {
    try {
      uni.clearStorageSync()
      return true
    } catch (e) {
      console.error('清空存储失败:', e)
      return false
    }
  }
}

// 用户信息存储
export const userStorage = {
  // 保存用户信息
  setUserInfo(userInfo) {
    return storage.set('userInfo', userInfo)
  },
  
  // 获取用户信息
  getUserInfo() {
    return storage.get('userInfo', {})
  },
  
  // 清除用户信息
  clearUserInfo() {
    return storage.remove('userInfo')
  },
  
  // 保存token
  setToken(token) {
    return storage.set('token', token)
  },
  
  // 获取token
  getToken() {
    return storage.get('token', '')
  },
  
  // 清除token
  clearToken() {
    return storage.remove('token')
  }
}

export default storage