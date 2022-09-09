<template>
	<view>
		<view class="discussInfo">
			<view class="user">
				<u-avatar class="avatar" :src="discussInfo.userInfo.avatar"></u-avatar>
				<view class="user-c">
					<text>{{discussInfo.userInfo.username}}</text>
					<text>发起</text>
				</view>
			</view>
			<view class="dis-title">{{discussInfo.title}}</view>
			<view class="count">
				<text>{{discussInfo.post_count}} 篇内容</text>
				<text>{{discussInfo.read_count}} 次浏览</text>
			</view>
			<view class="discuss-desc">{{discussInfo.introduce}}</view>
		</view>
		<post-list :list="postList" :loadStatus="loadStatus"></post-list>
	</view>
</template>

<script>
	import postList from '../../components/post-list/post-list.vue';
	export default {
		components: {
			postList
		},
		data() {
			return {
				disId: 0,
				loadStatus: "loading",
				postList: [],
				discussInfo: {
					userInfo: {}
				},
				page: 1
			};
		},
		onLoad(options) {
			this.disId = options.id;
			this.getDiscussInfo();
			this.getPostList();

			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.discussInfo.introduce,
				path: '/pages/discuss/detail?id=' + this.disId,
			}
		},
		onShareTimeline() {
			let imgURL = "";
			return {
				title: this.discussInfo.introduce,
				imageUrl: imgURL,
				query: 'id=' + this.disId
			}
		},
		methods: {
			onTrigger() {
				uni.navigateTo({
					url: "/pages/post/add?topic_id=" + this.discussInfo.topic_id + "&discuss_id=" + this
						.discussInfo
						.id
				})
			},
			getDiscussInfo() {
				this.$H.get('discuss/detail', {
					id: this.disId
				}).then(res => {
					this.discussInfo = res.result;
				})
			},
			getPostList() {
				this.loadStatus = "loading";
				this.$H.get('post/list', {
					dis_id: this.disId,
					page: this.page
				}).then(res => {
					this.postList = this.postList.concat(res.result.data);

					if (res.current_page === res.last_page || res.last_page === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f5f5f5;
	}
	
	.discussInfo {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		align-items: center;
	}
	
	.discussInfo>.user {
		display: flex;
		margin: 20rpx 0;
	}
	
	.discussInfo>.user>.user-c {
		display: flex;
		flex-direction: column;
	}
	
	.discussInfo>.user>.user-c text:nth-child(2) {
		font-size: 10px;
		color: #999;
	}
	
	.avatar {
		margin-right: 10rpx;
	}
	
	.count {
		font-size: 12px;
		color: #999;
		margin-bottom: 10rpx;
	}
	.count text{
		margin: 0 10rpx;
	}
	
	.dis-title{
		font-size: 36rpx;
		font-weight: 600;
		color: #616161;
	}
	
	.discuss-desc{
		color: #616161;
	}
</style>
