<template>
  <view id="app">
    <!-- 应用根组件 -->
  </view>
</template>

<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 通用样式 */
.container {
  padding: 0 20rpx;
}

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.flex-between {
  justify-content: space-between;
  align-items: center;
}

.text-center {
  text-align: center;
}

.text-primary {
  color: #FF2442;
}

.text-gray {
  color: #999;
}

.text-small {
  font-size: 24rpx;
}

.text-normal {
  font-size: 28rpx;
}

.text-large {
  font-size: 32rpx;
}

.text-bold {
  font-weight: bold;
}

.mt-10 {
  margin-top: 10rpx;
}

.mt-20 {
  margin-top: 20rpx;
}

.mb-10 {
  margin-bottom: 10rpx;
}

.mb-20 {
  margin-bottom: 20rpx;
}

.p-10 {
  padding: 10rpx;
}

.p-20 {
  padding: 20rpx;
}

.rounded {
  border-radius: 10rpx;
}

.shadow {
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}
</style>