<template>
  <view class="discover-container">
    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-bar">
        <input 
          v-model="searchKeyword" 
          class="search-input" 
          placeholder="搜索笔记、用户"
          @confirm="onSearch"
        />
        <text class="search-icon" @click="onSearch">🔍</text>
      </view>
    </view>

    <!-- 分类标签 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view 
          v-for="(category, index) in categories" 
          :key="index"
          class="category-item"
          :class="{ active: selectedCategory === index }"
          @click="selectCategory(index)"
        >
          {{ category }}
        </view>
      </view>
    </scroll-view>

    <!-- 内容列表 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scrolltolower="loadMore"
      refresher-enabled
      @refresherrefresh="onRefresh"
      :refresher-triggered="refreshing"
    >
      <!-- 推荐内容 -->
      <view class="recommend-section">
        <view class="section-title">为你推荐</view>
        <view class="content-grid">
          <view 
            v-for="(item, index) in recommendList" 
            :key="index"
            class="content-item"
            @click="goToDetail(item)"
          >
            <image :src="item.image" class="content-image" mode="aspectFill" />
            <view class="content-overlay">
              <text class="content-title">{{ item.title }}</text>
              <view class="content-meta">
                <image :src="item.avatar" class="content-avatar" />
                <text class="content-username">{{ item.username }}</text>
                <text class="content-likes">❤️ {{ item.likes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 热门内容 -->
      <view class="hot-section">
        <view class="section-title">热门内容</view>
        <view class="hot-list">
          <view 
            v-for="(item, index) in hotList" 
            :key="index"
            class="hot-item"
            @click="goToDetail(item)"
          >
            <image :src="item.image" class="hot-image" mode="aspectFill" />
            <view class="hot-content">
              <text class="hot-title">{{ item.title }}</text>
              <view class="hot-meta">
                <image :src="item.avatar" class="hot-avatar" />
                <text class="hot-username">{{ item.username }}</text>
                <text class="hot-likes">❤️ {{ item.likes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 加载更多 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      selectedCategory: 0,
      refreshing: false,
      loading: false,
      categories: ['推荐', '美妆', '美食', '旅行', '穿搭', '健身', '读书', '生活'],
      recommendList: [],
      hotList: []
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loadRecommendData()
      this.loadHotData()
    },
    
    // 加载推荐数据
    loadRecommendData() {
      const mockData = [
        {
          id: 1,
          title: '超好用的护肤品推荐！',
          image: 'https://picsum.photos/300/200?random=1',
          avatar: 'https://picsum.photos/50/50?random=1',
          username: '美妆达人',
          likes: 1234
        },
        {
          id: 2,
          title: '今天的美食分享',
          image: 'https://picsum.photos/300/200?random=2',
          avatar: 'https://picsum.photos/50/50?random=2',
          username: '美食家',
          likes: 567
        },
        {
          id: 3,
          title: '旅行日记 - 三亚',
          image: 'https://picsum.photos/300/200?random=3',
          avatar: 'https://picsum.photos/50/50?random=3',
          username: '旅行者',
          likes: 2345
        },
        {
          id: 4,
          title: '穿搭分享',
          image: 'https://picsum.photos/300/200?random=4',
          avatar: 'https://picsum.photos/50/50?random=4',
          username: '时尚博主',
          likes: 890
        }
      ]
      this.recommendList = mockData
    },
    
    // 加载热门数据
    loadHotData() {
      const mockData = [
        {
          id: 5,
          title: '健身心得分享，坚持就是胜利！',
          image: 'https://picsum.photos/400/300?random=5',
          avatar: 'https://picsum.photos/50/50?random=5',
          username: '健身教练',
          likes: 1567
        },
        {
          id: 6,
          title: '读书笔记 - 深度思考',
          image: 'https://picsum.photos/400/300?random=6',
          avatar: 'https://picsum.photos/50/50?random=6',
          username: '书虫',
          likes: 432
        },
        {
          id: 7,
          title: '生活小技巧分享',
          image: 'https://picsum.photos/400/300?random=7',
          avatar: 'https://picsum.photos/50/50?random=7',
          username: '生活家',
          likes: 789
        }
      ]
      this.hotList = mockData
    },
    
    // 选择分类
    selectCategory(index) {
      this.selectedCategory = index
      this.loadData()
    },
    
    // 搜索
    onSearch() {
      if (!this.searchKeyword.trim()) return
      uni.showToast({
        title: `搜索: ${this.searchKeyword}`,
        icon: 'none'
      })
    },
    
    // 下拉刷新
    onRefresh() {
      this.refreshing = true
      setTimeout(() => {
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
.discover-container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.search-section {
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  padding: 20rpx 30rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.search-icon {
  font-size: 32rpx;
  margin-left: 20rpx;
}

.category-scroll {
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.category-list {
  display: flex;
  padding: 20rpx;
  white-space: nowrap;
}

.category-item {
  display: inline-block;
  padding: 10rpx 30rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #666;
  white-space: nowrap;
}

.category-item.active {
  background-color: #FF2442;
  color: #fff;
}

.content-scroll {
  height: calc(100vh - 200rpx);
  padding: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.content-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.content-item {
  width: 48%;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  position: relative;
}

.content-image {
  width: 100%;
  height: 200rpx;
}

.content-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20rpx;
  color: #fff;
}

.content-title {
  font-size: 24rpx;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.content-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-avatar {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.content-username {
  font-size: 20rpx;
  flex: 1;
}

.content-likes {
  font-size: 20rpx;
}

.hot-list {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.hot-item {
  display: flex;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.hot-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hot-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.hot-meta {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.hot-avatar {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.hot-username {
  font-size: 24rpx;
  color: #666;
  flex: 1;
}

.hot-likes {
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