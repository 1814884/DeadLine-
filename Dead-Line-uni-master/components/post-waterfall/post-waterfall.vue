<template>
	<view class="wrap">
		<u-waterfall v-model="list" ref="uWaterfall">
			<template v-slot:left="{ leftList }">
				<view @click="jump(item)" class="demo-warter warter-left" v-if="item.media.length > 0" v-for="(item, index) in leftList" :key="index">
					<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
					<block v-if="item.type == 1"><u-lazy-load threshold="300" border-radius="20" :image="item.media[0]" :index="index"></u-lazy-load></block>
					<block v-else>
						<view class="video-wrap">
							<image class="cover-img" mode="aspectFill" :src="item.media[0] + '?x-oss-process=video/snapshot,t_0,f_jpg'"></image>
							<image class="icon" src="/static/play.png"></image>
						</view>
					</block>
					<view class="footer-wrap">
						<view class="p-title">{{ item.content }}</view>
						<view class="p-user">
							<u-avatar size="35" :src="item.userInfo.avatar"></u-avatar>
							<text class="username">{{ item.userInfo.username }}</text>
							<!-- <view class="distance">
								<u-icon name="map"></u-icon>
								<text>{{item.distance}}km</text>
							</view> -->
						</view>
					</view>
				</view>
			</template>
			<template v-slot:right="{ rightList }">
				<view @click="jump(item)" class="demo-warter warter-right" v-if="item.media.length > 0" v-for="(item, index) in rightList" :key="index">
					<block v-if="item.type == 1"><u-lazy-load threshold="300" border-radius="20" :image="item.media[0]" :index="index"></u-lazy-load></block>
					<block v-else>
						<view class="video-wrap">
							<image class="cover-img" mode="aspectFill" :src="item.media[0] + '?x-oss-process=video/snapshot,t_0,f_jpg'"></image>
							<image class="icon" src="/static/play.png"></image>
						</view>
					</block>
					<view class="footer-wrap">
						<view class="p-title">{{ item.content }}</view>
						<view class="p-user">
							<u-avatar size="35" :src="item.userInfo.avatar"></u-avatar>
							<text class="username">{{ item.userInfo.username }}</text>
							<!-- 	<view class="distance">
								<u-icon name="map"></u-icon>
								<text>{{item.distance}}km</text>
							</view> -->
						</view>
					</view>
				</view>
			</template>
		</u-waterfall>
		<u-loadmore v-if="loadStatus != 'none'" :status="loadStatus"></u-loadmore>
	</view>
</template>

<script>
export default {
	props: {
		list: Array,
		loadStatus: {
			type: String,
			default: 'loadmore'
		}
	},
	methods: {
		jump(item) {
			if (item.type == 1) {
				uni.navigateTo({
					url: '/pages/post/detail?id=' + item.id
				});
			} else {
				uni.navigateTo({
					url: '/pages/post/video-detail?id=' + item.id
				});
			}
		},
		clear() {
			this.$refs.uWaterfall.clear();
		}
	}
};
</script>
<style lang="scss" scoped>
.wrap {
	padding: 20rpx;
}

.demo-warter {
	border-radius: 8px;
	background-color: #ffffff;
	position: relative;
	overflow: hidden;
	margin-bottom: 50rpx;
}

.warter-left {
	margin-right: 20rpx;
}

.demo-title {
	font-size: 30rpx;
	margin-top: 5px;
	color: $u-main-color;
}

.footer-wrap {
	padding: 20rpx;
	color: #616161;
}

.footer-wrap .p-title {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.footer-wrap .p-user {
	display: flex;
	align-items: center;
	line-height: 20rpx;
	font-size: 22rpx;
	margin-top: 20rpx;
}

.footer-wrap .p-user .username {
	font-size: 20rpx;
	margin-left: 10rpx;
}

.footer-wrap .p-user .distance {
	display: flex;
	align-items: center;
	margin-left: auto;
}

.video-wrap {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 100%;
	height: 500rpx;

	.icon {
		width: 100rpx;
		height: 100rpx;
		z-index: 999;
	}

	image {
		position: absolute;
	}
}
.cover-img{
	width: 100%;
	border-radius: 20rpx !important;
}
</style>
