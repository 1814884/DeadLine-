<template>
	<view>
		<!-- navbar -->
		<u-navbar :is-back="false" z-index="99999">
			<!-- tabs -->
			<u-tabs :list="tabList" font-size="35" name="cate_name" bg-color="#fff" :current="current"
				@change="tabChange"></u-tabs>
		</u-navbar>
		<!-- 推荐 -->
		<view v-if="current === 0">
			<view class="post-list">
				<post-list :list="postList" :loadStatus="loadStatus"></post-list>
			</view>
		</view>
		<!-- 我的圈子 -->
		<view v-if="current === 1">
			<view class="topic-wrap">
				<view class="block-title">
					<view>我加入的圈子</view>
				</view>
				<u-grid @click="jump" :col="5" :border="false">
		<!-- 我的圈子 -->
					<u-grid-item :index="'/pages/topic/detail?id='+item.id"
						v-for="(item, index) in joinTopicList" :key="index">
						<view class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" :src="item.cover_image">
							</u-image>
							<view class="name">{{ item.topic_name.substring(0, 5) }}</view>
							<text v-if="sessionUid == item.uid" class="user">圈主</text>
						</view>
					</u-grid-item>
					<!-- 创建圈子 -->
					<u-grid-item index="/pages/topic/add/add">
						<navigator class="grid-topic">
							<u-image width="120rpx" :border-radius="10" height="120rpx" src="/static/add-1.png">
							</u-image>
							<view class="name">创建圈子</view>
						</navigator>
					</u-grid-item>
				</u-grid>
			</view>
			<post-list :list="joinTopicPost" :loadStatus="loadStatus3"></post-list>
		</view>

		<!-- 关注 -->
		<view v-if="current === 2">
			<post-list :list="followUserPost" :loadStatus="loadStatus1"></post-list>
		</view>

		<!-- tabbar -->
		<q-tabbar :active="0" :count="msgCount"></q-tabbar>
		<!-- 返回顶部 -->
		<q-back-top></q-back-top>
	</view>
</template>

<script>
	import postList from '../../components/post-list/post-list.vue';
	import jointopicList from '../../components/topic-list/topic-list.vue';
	export default {
		components: {
			postList,
			jointopicList
		},
		data() {
			return {
				sessionUid: uni.getStorageSync('userInfo').uid,
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				loadStatus3: 'loadmore',
				page: 1,
				page2: 1,
				page3: 1,
				shareCover: '',
				postList: [],
				topDisList: [],
				swiperList: [],
				followUserPost: [],
				joinTopicPost: [],
				tabList: [{
						name: '推荐'
					},{
						name: '圈子动态'
					},
					{
						name: '关注'
					},
				],
				current: 0,
				joinTopicList:[]
			};
		},
		computed: {
			msgCount() {
				return this.$store.state.messegeNum
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				console.log(res.target);
			}
			return {
				title: this.$c.miniappName,
				path: '/pages/index/index',
				imageUrl: this.shareCover
			};
		},
		onLoad() {
			this.getPostList();
			this.getSysInfo();
			this.getFollowUserPost();
			this.getJoinTopicPost();
			this.getUserJoinTopic();
		},
		onShow() {
			this.getMsgNum();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			if (this.current === 0) {
				this.page1++
				this.getPostList();
			}

			if (this.current === 1) {
				this.page2++
				this.getFollowUserPost();
			}

			if (this.current === 2) {
				this.page3++
				this.getJoinTopicPost();
			}
		},
		
		onPullDownRefresh() {
			this.page1 = 1;
			this.page2 = 1;
			this.page3 = 1;
			this.postList = [];
			this.getPostList();
			// this.$refs.waterfall.clear();
			
			if (this.current === 0) {
				this.page2 = 1;
				this.followUserPost = [];
				this.getFollowUserPost();
			}

			if (this.current === 1) {
				this.page3 = 1;
				this.joinTopicPost = [];
				this.getJoinTopicPost();
				this.getUserJoinTopic();
			}
			uni.stopPullDownRefresh();
		},
		methods: {
			getMsgNum() {
				this.$H.post('message/num').then(res => {
					this.$store.state.messegeNum = [0, 0, 0, res.result.all_count, 0];
				});
			},
			tabChange(index) {
				this.page1 = 1;
				this.page2 = 1;
				this.page3 = 1;
				this.current = index;
				if (index === 0) {
					this.followPost = [];
					this.getFollowUserPost();
				}
				if (index === 1) {
					this.postList = [];
					this.getPostList();
				}

				if (index == 2) {
					this.nearbyPostList = [];
				}
			},
			
			// 用户加入的圈子
			getUserJoinTopic() {
				this.loadStatus = 'loading';
				this.$H
					.post('topic/userJoinTopic', {
						class_id: this.topicClassId
					})
					.then(res => {
						this.joinTopicList = res.result.data;
						uni.stopPullDownRefresh();
					});
			},
			jump(url){
				uni.navigateTo({
					url:url
				})
			},
			getSysInfo() {
				this.$H.get('system/miniConfig').then(res => {
					this.shareCover = res.result.intro;
				});
			},
			// 获取加入的圈子动态
			getJoinTopicPost() {
				this.loadStatus3 = 'loading';
				this.$H
					.get('post/joinTopicPost', {
						page: this.page3
					})
					.then(res => {
						this.joinTopicPost = this.joinTopicPost.concat(res.result.data);
						if (res.result.current_page === res.result.last_page || res.result.last_page === 0) {
							this.loadStatus3 = 'nomore';
						} else {
							this.loadStatus3 = 'loadmore';
						}
					});
			},
			// 获取关注用户帖子
			getFollowUserPost() {
				this.loadStatus1 = 'loading';
				this.$H
					.get('post/followUserPost', {
						page: this.page2
					})
					.then(res => {
						this.followUserPost = this.followUserPost.concat(res.result.data);
						if (res.result.current_page === res.result.last_page || res.result.last_page === 0) {
							this.loadStatus1 = 'nomore';
						} else {
							this.loadStatus1 = 'loadmore';
						}
					});
			},
			
			// 用户的动态
			getPostList() {
				this.loadStatus2 = 'loading';
				this.$H.post('post/list', {
					page: this.page1
				}).then(res => {
					this.postList = this.postList.concat(res.result.data);
					if (res.result.current_page === res.result.last_page || res.result.last_page === 0) {
						this.loadStatus2 = "nomore";
					} else {
						this.loadStatus2 = "loadmore"
					}
				});
			},
		}
	};
</script>

<style>
	page {
		background-color: #e8e8e8;
	}
</style>
<style lang="scss" scoped>
	.swiper-body{
		height: calc(100vh - var(--status-bar-height) - 43px);
	}
	
	.body-scroll-view{
		width: 100%;
		height: 100%;
	}
	
	.tab-box {
		width: 80%;
	}
	
	.block-title {
		font-weight: bold;
		padding: 10rpx;
		color: #616161;
		display: flex;
		font-size: 28rpx;
		.right{
			margin-left: auto;
			color: #999;
			font-size: 24rpx;
		}
	}
	
	// 圈子
	.topic-wrap{
		padding: 0 10rpx; 
		background-color: #fff;
		margin-bottom: 20rpx;
	}
	.grid-topic{
		position: relative;
		margin-bottom: 20rpx;
		.name{
			font-size: 24rpx;
			text-align: center;
		}
		.user{
			position: absolute;
			left: 0;
			top: 0;
			font-size: 20rpx;
			display: block;
			background-color: $themes-color;
			padding: 5rpx;
			border-radius: 0 0 10rpx 0;
		}
	}
</style>
