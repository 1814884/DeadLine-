<template>
  <view class="home-container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="goToSearch">
        <text class="search-placeholder">搜索笔记、用户</text>
        <text class="search-icon">🔍</text>
      </view>
    </view>

    <!-- 瀑布流内容 -->
    <scroll-view 
      class="waterfall-container" 
      scroll-y 
      @scrolltolower="loadMore"
      refresher-enabled
      @refresherrefresh="onRefresh"
      :refresher-triggered="refreshing"
    >
      <view class="waterfall">
        <view 
          v-for="(item, index) in leftColumn" 
          :key="'left-' + index"
          class="waterfall-item left-column"
          @click="goToDetail(item)"
        >
          <image 
            :src="item.image" 
            class="item-image"
            mode="widthFix"
            @load="onImageLoad"
          />
          <view class="item-content">
            <text class="item-title">{{ item.title }}</text>
            <view class="item-meta">
              <image :src="item.avatar" class="user-avatar" />
              <text class="user-name">{{ item.username }}</text>
              <view class="item-stats">
                <text class="like-count">❤️ {{ item.likes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="waterfall">
        <view 
          v-for="(item, index) in rightColumn" 
          :key="'right-' + index"
          class="waterfall-item right-column"
          @click="goToDetail(item)"
        >
          <image 
            :src="item.image" 
            class="item-image"
            mode="widthFix"
            @load="onImageLoad"
          />
          <view class="item-content">
            <text class="item-title">{{ item.title }}</text>
            <view class="item-meta">
              <image :src="item.avatar" class="user-avatar" />
              <text class="user-name">{{ item.username }}</text>
              <view class="item-stats">
                <text class="like-count">❤️ {{ item.likes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 加载更多提示 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      refreshing: false,
      loading: false,
      leftColumn: [],
      rightColumn: [],
      allItems: [],
      leftHeight: 0,
      rightHeight: 0
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      // 模拟数据
      const mockData = [
        {
          id: 1,
          title: '超好用的护肤品推荐！',
          image: 'https://picsum.photos/300/400?random=1',
          avatar: 'https://picsum.photos/50/50?random=1',
          username: '美妆达人',
          likes: 1234
        },
        {
          id: 2,
          title: '今天的美食分享',
          image: 'https://picsum.photos/300/500?random=2',
          avatar: 'https://picsum.photos/50/50?random=2',
          username: '美食家',
          likes: 567
        },
        {
          id: 3,
          title: '旅行日记 - 三亚',
          image: 'https://picsum.photos/300/350?random=3',
          avatar: 'https://picsum.photos/50/50?random=3',
          username: '旅行者',
          likes: 2345
        },
        {
          id: 4,
          title: '穿搭分享',
          image: 'https://picsum.photos/300/450?random=4',
          avatar: 'https://picsum.photos/50/50?random=4',
          username: '时尚博主',
          likes: 890
        },
        {
          id: 5,
          title: '健身心得',
          image: 'https://picsum.photos/300/380?random=5',
          avatar: 'https://picsum.photos/50/50?random=5',
          username: '健身教练',
          likes: 1567
        },
        {
          id: 6,
          title: '读书笔记',
          image: 'https://picsum.photos/300/420?random=6',
          avatar: 'https://picsum.photos/50/50?random=6',
          username: '书虫',
          likes: 432
        }
      ]
      
      this.allItems = [...this.allItems, ...mockData]
      this.distributeItems()
    },
    
    // 分配瀑布流项目
    distributeItems() {
      this.leftColumn = []
      this.rightColumn = []
      this.leftHeight = 0
      this.rightHeight = 0
      
      this.allItems.forEach(item => {
        if (this.leftHeight <= this.rightHeight) {
          this.leftColumn.push(item)
          this.leftHeight += 400 // 估算高度
        } else {
          this.rightColumn.push(item)
          this.rightHeight += 400
        }
      })
    },
    
    // 下拉刷新
    onRefresh() {
      this.refreshing = true
      setTimeout(() => {
        this.allItems = []
        this.loadData()
        this.refreshing = false
      }, 1000)
    },
    
    // 加载更多
    loadMore() {
      if (this.loading) return
      this.loading = true
      setTimeout(() => {
        this.loadData()
        this.loading = false
      }, 1000)
    },
    
    // 图片加载完成
    onImageLoad() {
      // 可以在这里重新计算瀑布流高度
    },
    
    // 跳转到搜索页
    goToSearch() {
      uni.navigateTo({
        url: '/pages/discover/discover'
      })
    },
    
    // 跳转到详情页
    goToDetail(item) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${item.id}`
      })
    }
  }
}
</script>

<style scoped>
.home-container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.search-bar {
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.search-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  padding: 20rpx 30rpx;
}

.search-placeholder {
  color: #999;
  font-size: 28rpx;
}

.search-icon {
  font-size: 32rpx;
}

.waterfall-container {
  height: calc(100vh - 120rpx);
  padding: 20rpx 10rpx;
}

.waterfall {
  width: 50%;
  padding: 0 10rpx;
  display: inline-block;
  vertical-align: top;
}

.waterfall-item {
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100%;
  border-radius: 20rpx 20rpx 0 0;
}

.item-content {
  padding: 20rpx;
}

.item-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 15rpx;
}

.item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.user-name {
  font-size: 24rpx;
  color: #666;
  flex: 1;
}

.item-stats {
  display: flex;
  align-items: center;
}

.like-count {
  font-size: 24rpx;
  color: #999;
}

.loading {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 28rpx;
}
</style>