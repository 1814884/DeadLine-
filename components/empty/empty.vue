<template>
  <view class="empty-container">
    <image :src="icon" class="empty-icon" />
    <text class="empty-text">{{ text }}</text>
    <text v-if="subText" class="empty-sub-text">{{ subText }}</text>
    <view v-if="showButton" class="empty-button" @click="onButtonClick">
      <text class="button-text">{{ buttonText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    icon: {
      type: String,
      default: 'https://picsum.photos/200/200?random=empty'
    },
    text: {
      type: String,
      default: '暂无数据'
    },
    subText: {
      type: String,
      default: ''
    },
    showButton: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: '刷新'
    }
  },
  methods: {
    onButtonClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
  min-height: 400rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.empty-sub-text {
  font-size: 24rpx;
  color: #ccc;
  margin-bottom: 40rpx;
}

.empty-button {
  padding: 20rpx 40rpx;
  background-color: #FF2442;
  border-radius: 30rpx;
}

.button-text {
  color: #fff;
  font-size: 26rpx;
}
</style>