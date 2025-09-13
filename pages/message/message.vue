<template>
  <view class="message-container">
    <!-- 顶部导航 -->
    <view class="message-nav">
      <view class="nav-item" :class="{ active: currentTab === 0 }" @click="switchTab(0)">
        消息
      </view>
      <view class="nav-item" :class="{ active: currentTab === 1 }" @click="switchTab(1)">
        通知
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="message-scroll" scroll-y>
      <!-- 消息标签页 -->
      <view v-if="currentTab === 0" class="message-list">
        <view 
          v-for="(message, index) in messageList" 
          :key="index"
          class="message-item"
          @click="goToChat(message)"
        >
          <image :src="message.avatar" class="message-avatar" />
          <view class="message-content">
            <view class="message-header">
              <text class="message-name">{{ message.name }}</text>
              <text class="message-time">{{ message.time }}</text>
            </view>
            <text class="message-text">{{ message.lastMessage }}</text>
          </view>
          <view v-if="message.unread > 0" class="unread-badge">
            {{ message.unread > 99 ? '99+' : message.unread }}
          </view>
        </view>
      </view>

      <!-- 通知标签页 -->
      <view v-if="currentTab === 1" class="notification-list">
        <view 
          v-for="(notification, index) in notificationList" 
          :key="index"
          class="notification-item"
          @click="goToNotification(notification)"
        >
          <image :src="notification.icon" class="notification-icon" />
          <view class="notification-content">
            <text class="notification-title">{{ notification.title }}</text>
            <text class="notification-desc">{{ notification.desc }}</text>
            <text class="notification-time">{{ notification.time }}</text>
          </view>
          <view v-if="!notification.read" class="unread-dot"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      messageList: [
        {
          id: 1,
          name: '美妆达人',
          avatar: 'https://picsum.photos/50/50?random=1',
          lastMessage: '谢谢你的点赞！',
          time: '10:30',
          unread: 2
        },
        {
          id: 2,
          name: '美食家',
          avatar: 'https://picsum.photos/50/50?random=2',
          lastMessage: '这个餐厅真的很不错',
          time: '09:15',
          unread: 0
        },
        {
          id: 3,
          name: '旅行者',
          avatar: 'https://picsum.photos/50/50?random=3',
          lastMessage: '下次一起去旅行吧',
          time: '昨天',
          unread: 1
        },
        {
          id: 4,
          name: '时尚博主',
          avatar: 'https://picsum.photos/50/50?random=4',
          lastMessage: '这套穿搭怎么样？',
          time: '昨天',
          unread: 0
        },
        {
          id: 5,
          name: '健身教练',
          avatar: 'https://picsum.photos/50/50?random=5',
          lastMessage: '坚持就是胜利！',
          time: '2天前',
          unread: 3
        }
      ],
      notificationList: [
        {
          id: 1,
          type: 'like',
          icon: 'https://picsum.photos/40/40?random=10',
          title: '有人点赞了你的笔记',
          desc: '美妆达人 点赞了你的"超好用的护肤品推荐！"',
          time: '2小时前',
          read: false
        },
        {
          id: 2,
          type: 'comment',
          icon: 'https://picsum.photos/40/40?random=11',
          title: '有人评论了你的笔记',
          desc: '美食家: 看起来很好吃的样子！',
          time: '5小时前',
          read: false
        },
        {
          id: 3,
          type: 'follow',
          icon: 'https://picsum.photos/40/40?random=12',
          title: '有人关注了你',
          desc: '旅行者 开始关注你',
          time: '1天前',
          read: true
        },
        {
          id: 4,
          type: 'system',
          icon: 'https://picsum.photos/40/40?random=13',
          title: '系统通知',
          desc: '欢迎使用小红书！',
          time: '3天前',
          read: true
        }
      ]
    }
  },
  methods: {
    // 切换标签页
    switchTab(index) {
      this.currentTab = index
    },
    
    // 跳转到聊天页面
    goToChat(message) {
      // 清除未读消息
      message.unread = 0
      
      uni.showToast({
        title: `进入与${message.name}的聊天`,
        icon: 'none'
      })
    },
    
    // 跳转到通知详情
    goToNotification(notification) {
      // 标记为已读
      notification.read = true
      
      uni.showToast({
        title: '查看通知详情',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.message-container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.message-nav {
  display: flex;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.nav-item.active {
  color: #FF2442;
  font-weight: bold;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background-color: #FF2442;
  border-radius: 2rpx;
}

.message-scroll {
  height: calc(100vh - 100rpx);
}

.message-list, .notification-list {
  background-color: #fff;
}

.message-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.message-item:last-child {
  border-bottom: none;
}

.message-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.message-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.message-time {
  font-size: 24rpx;
  color: #999;
}

.message-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.unread-badge {
  position: absolute;
  top: 20rpx;
  right: 30rpx;
  min-width: 30rpx;
  height: 30rpx;
  background-color: #FF2442;
  color: #fff;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  padding: 0 10rpx;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
  margin-top: 10rpx;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.notification-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10rpx;
  display: block;
}

.notification-time {
  font-size: 24rpx;
  color: #999;
}

.unread-dot {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #FF2442;
  border-radius: 50%;
}
</style>