<template>
  <view class="detail-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <text class="nav-back" @click="goBack">←</text>
      <text class="nav-title">笔记详情</text>
      <text class="nav-share" @click="shareNote">分享</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 图片轮播 -->
      <swiper class="image-swiper" :indicator-dots="true" :autoplay="false">
        <swiper-item v-for="(image, index) in noteDetail.images" :key="index">
          <image :src="image" class="detail-image" mode="aspectFill" />
        </swiper-item>
      </swiper>

      <!-- 笔记信息 -->
      <view class="note-info">
        <view class="note-header">
          <image :src="noteDetail.avatar" class="author-avatar" />
          <view class="author-info">
            <text class="author-name">{{ noteDetail.author }}</text>
            <text class="publish-time">{{ noteDetail.publishTime }}</text>
          </view>
          <view class="follow-btn" @click="toggleFollow">
            <text>{{ isFollowing ? '已关注' : '关注' }}</text>
          </view>
        </view>

        <text class="note-title">{{ noteDetail.title }}</text>
        <text class="note-content">{{ noteDetail.content }}</text>

        <!-- 话题标签 -->
        <view class="topics">
          <text 
            v-for="(topic, index) in noteDetail.topics" 
            :key="index"
            class="topic-tag"
          >
            #{{ topic }}
          </text>
        </view>

        <!-- 位置信息 -->
        <view v-if="noteDetail.location" class="location">
          <text class="location-icon">📍</text>
          <text class="location-text">{{ noteDetail.location }}</text>
        </view>
      </view>

      <!-- 互动区域 -->
      <view class="interaction-section">
        <view class="interaction-stats">
          <view class="stat-item">
            <text class="stat-icon">❤️</text>
            <text class="stat-text">{{ noteDetail.likes }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">💬</text>
            <text class="stat-text">{{ noteDetail.comments }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">⭐</text>
            <text class="stat-text">{{ noteDetail.collections }}</text>
          </view>
        </view>

        <view class="interaction-buttons">
          <view class="action-btn" @click="toggleLike">
            <text class="action-icon" :class="{ liked: isLiked }">❤️</text>
            <text class="action-text">点赞</text>
          </view>
          <view class="action-btn" @click="toggleComment">
            <text class="action-icon">💬</text>
            <text class="action-text">评论</text>
          </view>
          <view class="action-btn" @click="toggleCollection">
            <text class="action-icon" :class="{ collected: isCollected }">⭐</text>
            <text class="action-text">收藏</text>
          </view>
          <view class="action-btn" @click="shareNote">
            <text class="action-icon">📤</text>
            <text class="action-text">分享</text>
          </view>
        </view>
      </view>

      <!-- 评论区域 -->
      <view class="comments-section">
        <view class="comments-header">
          <text class="comments-title">评论 ({{ noteDetail.comments }})</text>
        </view>
        <view class="comments-list">
          <view 
            v-for="(comment, index) in comments" 
            :key="index"
            class="comment-item"
          >
            <image :src="comment.avatar" class="comment-avatar" />
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-author">{{ comment.author }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <text class="comment-like">❤️ {{ comment.likes }}</text>
                <text class="comment-reply">回复</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入框 -->
    <view class="bottom-input">
      <input 
        v-model="commentInput"
        class="comment-input" 
        placeholder="说点什么..."
        @confirm="submitComment"
      />
      <text class="send-btn" @click="submitComment">发送</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      noteDetail: {
        id: 1,
        title: '超好用的护肤品推荐！',
        content: '最近发现了几款超级好用的护肤品，分享给大家！首先是这款精华，质地清爽不油腻，用了一个月皮肤明显变好了。还有这款面霜，保湿效果特别好，冬天用完全没问题。最后推荐这款面膜，每周用两次，皮肤状态保持得很好。',
        images: [
          'https://picsum.photos/400/600?random=1',
          'https://picsum.photos/400/600?random=2',
          'https://picsum.photos/400/600?random=3'
        ],
        author: '美妆达人',
        avatar: 'https://picsum.photos/50/50?random=1',
        publishTime: '2小时前',
        location: '北京市朝阳区',
        topics: ['护肤', '美妆', '推荐'],
        likes: 1234,
        comments: 56,
        collections: 89
      },
      isLiked: false,
      isCollected: false,
      isFollowing: false,
      commentInput: '',
      comments: [
        {
          id: 1,
          author: '用户A',
          avatar: 'https://picsum.photos/40/40?random=10',
          content: '真的很好用！我也在用这款精华',
          time: '1小时前',
          likes: 12
        },
        {
          id: 2,
          author: '用户B',
          avatar: 'https://picsum.photos/40/40?random=11',
          content: '请问在哪里可以买到？',
          time: '30分钟前',
          likes: 5
        },
        {
          id: 3,
          author: '用户C',
          avatar: 'https://picsum.photos/40/40?random=12',
          content: '感谢分享！准备试试',
          time: '15分钟前',
          likes: 8
        }
      ]
    }
  },
  onLoad(options) {
    if (options.id) {
      this.loadNoteDetail(options.id)
    }
  },
  methods: {
    // 加载笔记详情
    loadNoteDetail(id) {
      // 这里可以根据id加载具体数据
      console.log('加载笔记详情:', id)
    },
    
    // 返回
    goBack() {
      uni.navigateBack()
    },
    
    // 切换点赞
    toggleLike() {
      this.isLiked = !this.isLiked
      this.noteDetail.likes += this.isLiked ? 1 : -1
      uni.showToast({
        title: this.isLiked ? '已点赞' : '取消点赞',
        icon: 'none'
      })
    },
    
    // 切换收藏
    toggleCollection() {
      this.isCollected = !this.isCollected
      this.noteDetail.collections += this.isCollected ? 1 : -1
      uni.showToast({
        title: this.isCollected ? '已收藏' : '取消收藏',
        icon: 'none'
      })
    },
    
    // 切换关注
    toggleFollow() {
      this.isFollowing = !this.isFollowing
      uni.showToast({
        title: this.isFollowing ? '已关注' : '取消关注',
        icon: 'none'
      })
    },
    
    // 切换评论
    toggleComment() {
      // 滚动到评论区域
      uni.pageScrollTo({
        selector: '.comments-section',
        duration: 300
      })
    },
    
    // 分享笔记
    shareNote() {
      uni.showActionSheet({
        itemList: ['分享到微信', '分享到朋友圈', '复制链接'],
        success: (res) => {
          uni.showToast({
            title: '分享成功',
            icon: 'success'
          })
        }
      })
    },
    
    // 提交评论
    submitComment() {
      if (!this.commentInput.trim()) return
      
      const newComment = {
        id: Date.now(),
        author: '我',
        avatar: 'https://picsum.photos/40/40?random=user',
        content: this.commentInput,
        time: '刚刚',
        likes: 0
      }
      
      this.comments.unshift(newComment)
      this.noteDetail.comments += 1
      this.commentInput = ''
      
      uni.showToast({
        title: '评论成功',
        icon: 'success'
      })
    }
  }
}
</script>

<style scoped>
.detail-container {
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

.nav-back, .nav-share {
  font-size: 32rpx;
  color: #FF2442;
}

.nav-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.content-scroll {
  height: calc(100vh - 140rpx);
}

.image-swiper {
  height: 500rpx;
}

.detail-image {
  width: 100%;
  height: 100%;
}

.note-info {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.note-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
  display: block;
}

.publish-time {
  font-size: 24rpx;
  color: #999;
}

.follow-btn {
  padding: 10rpx 30rpx;
  background-color: #FF2442;
  color: #fff;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.note-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.note-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.topic-tag {
  padding: 8rpx 20rpx;
  background-color: #f0f0f0;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #FF2442;
}

.location {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 24rpx;
}

.location-icon {
  margin-right: 10rpx;
}

.interaction-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.interaction-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon {
  font-size: 32rpx;
  margin-bottom: 10rpx;
}

.stat-text {
  font-size: 24rpx;
  color: #666;
}

.interaction-buttons {
  display: flex;
  justify-content: space-around;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  font-size: 32rpx;
  margin-bottom: 10rpx;
}

.action-icon.liked, .action-icon.collected {
  color: #FF2442;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

.comments-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 100rpx;
}

.comments-header {
  margin-bottom: 30rpx;
}

.comments-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.comments-list {
  max-height: 600rpx;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  margin-bottom: 30rpx;
}

.comment-item:last-child {
  margin-bottom: 0;
}

.comment-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.comment-author {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 22rpx;
  color: #999;
}

.comment-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10rpx;
  display: block;
}

.comment-actions {
  display: flex;
  gap: 30rpx;
}

.comment-like, .comment-reply {
  font-size: 22rpx;
  color: #999;
}

.bottom-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #eee;
  display: flex;
  align-items: center;
}

.comment-input {
  flex: 1;
  height: 60rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  margin-right: 20rpx;
}

.send-btn {
  padding: 15rpx 30rpx;
  background-color: #FF2442;
  color: #fff;
  border-radius: 30rpx;
  font-size: 26rpx;
}
</style>