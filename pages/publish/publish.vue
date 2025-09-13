<template>
  <view class="publish-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <text class="nav-cancel" @click="goBack">取消</text>
      <text class="nav-title">发布笔记</text>
      <text class="nav-publish" @click="publishNote">发布</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 图片选择区域 -->
      <view class="image-section">
        <view class="image-grid">
          <view 
            v-for="(image, index) in selectedImages" 
            :key="index"
            class="image-item"
          >
            <image :src="image" class="selected-image" mode="aspectFill" />
            <text class="remove-image" @click="removeImage(index)">×</text>
          </view>
          <view 
            v-if="selectedImages.length < 9" 
            class="add-image-btn"
            @click="chooseImage"
          >
            <text class="add-icon">+</text>
            <text class="add-text">添加图片</text>
          </view>
        </view>
      </view>

      <!-- 文字内容 -->
      <view class="text-section">
        <textarea 
          v-model="noteContent"
          class="content-textarea"
          placeholder="分享你的生活..."
          maxlength="1000"
          :show-count="true"
        />
      </view>

      <!-- 话题标签 -->
      <view class="topic-section">
        <view class="section-title">添加话题</view>
        <view class="topic-input-wrapper">
          <input 
            v-model="topicInput"
            class="topic-input"
            placeholder="输入话题标签"
            @confirm="addTopic"
          />
          <text class="add-topic-btn" @click="addTopic">添加</text>
        </view>
        <view class="topic-list">
          <view 
            v-for="(topic, index) in topics" 
            :key="index"
            class="topic-tag"
          >
            #{{ topic }}
            <text class="remove-topic" @click="removeTopic(index)">×</text>
          </view>
        </view>
      </view>

      <!-- 位置信息 -->
      <view class="location-section">
        <view class="location-item" @click="chooseLocation">
          <text class="location-icon">📍</text>
          <text class="location-text">{{ location || '添加位置' }}</text>
          <text class="location-arrow">></text>
        </view>
      </view>

      <!-- 隐私设置 -->
      <view class="privacy-section">
        <view class="privacy-item">
          <text class="privacy-label">谁可以看</text>
          <picker 
            :value="privacyIndex" 
            :range="privacyOptions"
            @change="onPrivacyChange"
          >
            <view class="privacy-picker">
              <text class="privacy-value">{{ privacyOptions[privacyIndex] }}</text>
              <text class="privacy-arrow">></text>
            </view>
          </picker>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedImages: [],
      noteContent: '',
      topicInput: '',
      topics: [],
      location: '',
      privacyIndex: 0,
      privacyOptions: ['公开', '仅粉丝可见', '仅自己可见']
    }
  },
  methods: {
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 9 - this.selectedImages.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.selectedImages = [...this.selectedImages, ...res.tempFilePaths]
        }
      })
    },
    
    // 移除图片
    removeImage(index) {
      this.selectedImages.splice(index, 1)
    },
    
    // 添加话题
    addTopic() {
      if (!this.topicInput.trim()) return
      if (this.topics.includes(this.topicInput.trim())) {
        uni.showToast({
          title: '话题已存在',
          icon: 'none'
        })
        return
      }
      this.topics.push(this.topicInput.trim())
      this.topicInput = ''
    },
    
    // 移除话题
    removeTopic(index) {
      this.topics.splice(index, 1)
    },
    
    // 选择位置
    chooseLocation() {
      uni.chooseLocation({
        success: (res) => {
          this.location = res.name
        },
        fail: () => {
          uni.showToast({
            title: '获取位置失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 隐私设置改变
    onPrivacyChange(e) {
      this.privacyIndex = e.detail.value
    },
    
    // 发布笔记
    publishNote() {
      if (this.selectedImages.length === 0) {
        uni.showToast({
          title: '请至少选择一张图片',
          icon: 'none'
        })
        return
      }
      
      if (!this.noteContent.trim()) {
        uni.showToast({
          title: '请输入笔记内容',
          icon: 'none'
        })
        return
      }
      
      // 模拟发布
      uni.showLoading({
        title: '发布中...'
      })
      
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '发布成功',
          icon: 'success'
        })
        
        // 清空内容
        this.selectedImages = []
        this.noteContent = ''
        this.topics = []
        this.location = ''
        this.privacyIndex = 0
        
        // 返回首页
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      }, 2000)
    },
    
    // 返回
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.publish-container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-cancel, .nav-publish {
  font-size: 28rpx;
  color: #FF2442;
}

.nav-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.content-scroll {
  height: calc(100vh - 100rpx);
  padding: 20rpx;
}

.image-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
}

.selected-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}

.remove-image {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #ff4757;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
}

.add-image-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.add-icon {
  font-size: 60rpx;
  margin-bottom: 10rpx;
}

.add-text {
  font-size: 24rpx;
}

.text-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.content-textarea {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
}

.topic-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.topic-input-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.topic-input {
  flex: 1;
  height: 60rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.add-topic-btn {
  padding: 15rpx 30rpx;
  background-color: #FF2442;
  color: #fff;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.topic-tag {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: #f0f0f0;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #666;
}

.remove-topic {
  margin-left: 10rpx;
  color: #999;
  font-size: 20rpx;
}

.location-section, .privacy-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.location-item, .privacy-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.location-item:last-child, .privacy-item:last-child {
  border-bottom: none;
}

.location-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.location-text, .privacy-label {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.location-arrow, .privacy-arrow {
  font-size: 24rpx;
  color: #999;
}

.privacy-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

.privacy-value {
  font-size: 28rpx;
  color: #666;
}
</style>