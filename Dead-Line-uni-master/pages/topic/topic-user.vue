<template>
	<view>
		<!-- navbar -->
		<u-navbar>
			<!-- tabs -->
			<view class="tab-box"><u-tabs :list="tabList" font-size="35" name="cate_name" bg-color="#fff" :current="current" @change="tabChange"></u-tabs></view>
		</u-navbar>
		<view v-show="current === 0">
			<!-- 基本信息 -->
			<view class="topic-info">
				<image class="cover" :src="topicInfo.cover_image"></image>
				<view class="right">
					<text class="topic-name">{{ topicInfo.topic_name }}</text>
					<view class="count-box">
						<text>{{ topicInfo.post_count }}动态</text>
						<text>{{ topicInfo.user_count }}成员</text>
					</view>
				</view>
			</view>
			<!-- 简介 -->
			<view class="desc-box">
				<view class="title">圈子简介</view>
				<text class="desc">{{ topicInfo.description || '暂无简介' }}</text>
			</view>
		</view>
		<view v-show="current === 1">
			<!-- 圈主 -->
			<view class="user-block">
				<view class="title">圈主</view>
				<user-list :list="[topicInfo.userInfo]" loadStatus="none"></user-list>
			</view>
			<!-- 管理员 -->
			<view class="user-block" v-show="topicInfo.admin_list.length > 0">
				<view class="title">管理员</view>
				<user-list :list="topicInfo.admin_list" loadStatus="none"></user-list>
			</view>
			<!-- 圈友 -->
			<view class="user-block">
				<view class="title">圈友</view>
				<user-list :list="userList" :loadStatus="loadStatus"></user-list>
			</view>
		</view>
	</view>
</template>

<script>
import userList from '../../components/user-list/user-list.vue';
export default {
	components: {
		userList
	},
	data() {
		return {
			userList: [],
			page: 1,
			loadStatus: 'loadmore',
			topicId: '',
			topicInfo: {},
			tabList: [
				{
					name: '介绍'
				},
				{
					name: '成员'
				}
			],
			current: 0
		};
	},
	onLoad(options) {
		this.topicId = options.id;
		this.getUserList();
		this.getTopicInfo();
	},
	onReachBottom() {
		this.page++;
		this.getUserList();
	},
	methods: {
		getTopicInfo() {
			this.$H
				.get('topic/detail', {
					id: this.topicId
				})
				.then(res => {
					this.topicInfo = res.result;
				});
		},
		tabChange(index) {
			this.current = index;
		},
		getUserList() {
			this.loadStatus = 'loading';
			this.$H
				.post('topic/user', {
					page: this.page,
					id: this.topicId
				})
				.then(res => {
					this.userList = this.userList.concat(res.result.data);
					if (res.result.current_page === res.result.last_page || res.result.last_page === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				});
		}
	}
};
</script>
<style>
page {
	background-color: #f5f5f5;
}
</style>
<style lang="scss" scoped>
.tab-box {
	margin-left: 40%;
}
.topic-info {
	display: flex;
	margin-bottom: 20rpx;
	background-color: #fff;
	padding: 30rpx;
	.cover {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}

	.right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		.topic-name {
			font-weight: 600;
		}
		.count-box {
			font-size: 24rpx;
			color: #999;
			text {
				margin-right: 20rpx;
			}
		}
	}
}

.desc-box {
	background-color: #fff;
	padding: 30rpx;
	min-height: 990rpx;
	.title {
		font-weight: 600;
		margin-bottom: 20rpx;
	}
	.desc {
		color: #616161;
		line-height: 1.8;
	}
}

.user-block{
	margin-bottom: 20rpx;
	background-color: #fff;
	padding: 20rpx;
	&:last-child{
		margin-bottom: 0;
	}
	.title{
		font-weight: 600;
	}
}
</style>
