<template>
  <view class="profile-container">
    <!-- 用户信息头部 -->
    <view class="profile-header">
      <view class="user-info">
        <image :src="userInfo.avatar" class="user-avatar" />
        <view class="user-details">
          <text class="user-name">{{ userInfo.name }}</text>
          <text class="user-desc">{{ userInfo.desc }}</text>
          <view class="user-stats">
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.notes }}</text>
              <text class="stat-label">笔记</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.followers }}</text>
              <text class="stat-label">粉丝</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.following }}</text>
              <text class="stat-label">关注</text>
            </view>
          </view>
        </view>
      </view>
      <view class="edit-profile" @click="editProfile">
        <text>编辑资料</text>
      </view>
    </view>

    <!-- 我的笔记 -->
    <view class="my-notes-section">
      <view class="section-header">
        <text class="section-title">我的笔记</text>
        <text class="more-btn" @click="viewAllNotes">查看全部</text>
      </view>
      <view class="notes-grid">
        <view 
          v-for="(note, index) in myNotes" 
          :key="index"
          class="note-item"
          @click="goToNoteDetail(note)"
        >
          <image :src="note.image" class="note-image" mode="aspectFill" />
          <view class="note-overlay">
            <text class="note-likes">❤️ {{ note.likes }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToFavorites">
        <text class="menu-icon">⭐</text>
        <text class="menu-text">我的收藏</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToDrafts">
        <text class="menu-icon">📝</text>
        <text class="menu-text">草稿箱</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToSettings">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToHelp">
        <text class="menu-icon">❓</text>
        <text class="menu-text">帮助与反馈</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 关于我们 -->
    <view class="about-section">
      <text class="about-text">小红书 v1.0.0</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        name: '小红书用户',
        desc: '分享生活，发现美好',
        avatar: 'https://picsum.photos/100/100?random=user',
        notes: 28,
        followers: 1234,
        following: 567
      },
      myNotes: [
        {
          id: 1,
          image: 'https://picsum.photos/200/200?random=1',
          likes: 1234
        },
        {
          id: 2,
          image: 'https://picsum.photos/200/200?random=2',
          likes: 567
        },
        {
          id: 3,
          image: 'https://picsum.photos/200/200?random=3',
          likes: 2345
        },
        {
          id: 4,
          image: 'https://picsum.photos/200/200?random=4',
          likes: 890
        },
        {
          id: 5,
          image: 'https://picsum.photos/200/200?random=5',
          likes: 1567
        },
        {
          id: 6,
          image: 'https://picsum.photos/200/200?random=6',
          likes: 432
        }
      ]
    }
  },
  methods: {
    // 编辑资料
    editProfile() {
      uni.showToast({
        title: '编辑资料功能',
        icon: 'none'
      })
    },
    
    // 查看全部笔记
    viewAllNotes() {
      uni.showToast({
        title: '查看全部笔记',
        icon: 'none'
      })
    },
    
    // 跳转到笔记详情
    goToNoteDetail(note) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${note.id}`
      })
    },
    
    // 我的收藏
    goToFavorites() {
      uni.showToast({
        title: '我的收藏',
        icon: 'none'
      })
    },
    
    // 草稿箱
    goToDrafts() {
      uni.showToast({
        title: '草稿箱',
        icon: 'none'
      })
    },
    
    // 设置
    goToSettings() {
      uni.showToast({
        title: '设置',
        icon: 'none'
      })
    },
    
    // 帮助与反馈
    goToHelp() {
      uni.showToast({
        title: '帮助与反馈',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.profile-container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.profile-header {
  background-color: #fff;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.user-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.user-stats {
  display: flex;
  gap: 40rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.edit-profile {
  padding: 15rpx 30rpx;
  border: 1rpx solid #FF2442;
  border-radius: 30rpx;
  color: #FF2442;
  font-size: 26rpx;
}

.my-notes-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-btn {
  font-size: 26rpx;
  color: #FF2442;
}

.notes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.note-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.note-image {
  width: 100%;
  height: 100%;
}

.note-overlay {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  background: rgba(0, 0, 0, 0.5);
  padding: 5rpx 10rpx;
  border-radius: 15rpx;
}

.note-likes {
  color: #fff;
  font-size: 20rpx;
}

.menu-section {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  width: 40rpx;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  font-size: 24rpx;
  color: #999;
}

.about-section {
  text-align: center;
  padding: 40rpx;
}

.about-text {
  font-size: 24rpx;
  color: #999;
}
</style>