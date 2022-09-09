<template>
	<view>
		<view class="head">
			<block v-if="hasLogin">
				<view class="userinfo" @click="toUcenter">
					<u-avatar :src="userInfo.avatar"></u-avatar>
					<view class="username">
						<text>{{ userInfo.username }}</text>
						<text class="sub-txt">{{ userInfo.intro }}</text>
					</view>
					<q-icon class="arrow-right" name="q-arrow-right"></q-icon>
				</view>
			</block>
			<block v-else>
				<view class="btn-login">
					<u-button type="default" shape="circle" @click="toLogin" plain>授权登录</u-button>
				</view>
			</block>
		</view>
		<view class="grid">
			<u-grid :col="4" :border="false" style="margin: 20rpx 0;" @click="toNav">
				<u-grid-item index="/pages/my/fans">
					<text>{{userInfo.fans}}</text>
					<view class="grid-text">粉丝</view>
				</u-grid-item>
				<u-grid-item index="/pages/my/follow">
					<text>{{userInfo.follow}}</text>
					<view class="grid-text">关注</view>
				</u-grid-item>
				<u-grid-item index="/pages/my/post">
					<text>{{userInfo.post_num}}</text>
					<view class="grid-text">帖子</view>
				</u-grid-item>
				<u-grid-item>
					<text>{{userInfo.integral}}</text>
					<view class="grid-text">积分</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 个人中心 -->
		<view class="grid">
		  <view>个人中心</view>
			<view class="btn-wrap">
			<u-grid :col="4" :border="false" style="margin: 20rpx 0;" @click="toNav">
				<u-grid-item index="/pages/my/discuss">
					<image class="gn-icon" src="/static/images/icon/topic.png"></image>
					<view class="grid-text">我的话题</view>
				</u-grid-item>

				<u-grid-item index="/pages/my/topic">
					<image class="gn-icon" src="/static/images/icon/qz.png"></image>
					<view class="grid-text">我的圈子</view>
				</u-grid-item>

				<u-grid-item index="/pages/my/post">
					<image class="gn-icon" src="/static/images/icon/dt.png"></image>
					<view class="grid-text">我的动态</view>
				</u-grid-item>

				<u-grid-item index="/pages/my/thumb">
					<image class="gn-icon" src="/static/images/icon/sc.png"></image>
					<view class="grid-text">我的喜欢</view>
				</u-grid-item>
			</u-grid>
		  </view>
		</view>
		<!-- 服务 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="grid">
			<view>服务</view>
			<view class="btn-wrap">
				<button class="btn-contact" open-type="contact" :show-message-card="true">
					<text class="iconfont icon-kefu icon-size" style="color: #9999ff;"></text>
					<view class="txt">联系客服</view>
				</button>
				<button class="btn-contact" open-type="share">
					<text class="iconfont icon-yaoqinghaoyou1 icon-size" style="color: #79d279;"></text>
					<view class="txt">分享好友</view>
				</button>
			</view>
		</view>
		<ad unit-id="adunit-ec22db5c15c0666d"></ad>
		<!-- #endif -->
		<q-tabbar :active="4" :count="msgCount"></q-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mAd: this.$c.mAd,
			userInfo: '',
			hasLogin: false
		};
	},
	computed:{
		msgCount(){
			return this.$store.state.messegeNum
		}
	},
	onLoad() {
		//#ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		//#endif
	},
	onShow() {
		if (uni.getStorageSync('hasLogin')) {
			this.getUserInfo();
			this.hasLogin = true;
		} else {
			this.hasLogin = false;
		}
		this.getMsgNum();
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		let imgURL = 'https://oss.ymeoo.cn/logo.png';
		return {
			title: this.$c.miniappName,
			path: '/pages/index/index',
			imageUrl: imgURL
		};
	},
	methods: {
		getMsgNum() {
			this.$H.post('message/num').then(res => {
				this.$store.state.messegeNum = [0,0,0,res.result.all_count,0];
			});
		},
		jumpPhoneLogin() {
			uni.navigateTo({
				url: '/pages/user/sms-login'
			});
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/user/login'
			});
		},
		getUserInfo() {
			this.$H.get('user/userInfo').then(res => {
				this.userInfo = res.result;
			});
		},
		toUcenter() {
			uni.navigateTo({
				url: '/pages/user/edit-info/edit'
			});
		},
		toNav(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.head {
	padding: 20rpx;
	background-color: #fff;
	margin: 20rpx;
	border-radius: 10rpx;
	.sub-txt {
		font-size: 24rpx;
		color: #616161;
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
	margin-bottom: 20rpx;
}

.userinfo {
	display: flex;
	align-items: center;
	padding: 20rpx;
}

.userinfo .username {
	display: flex;
	flex-direction: column;
}

.grid-text {
	color: #999;
	font-size: 12px;
	margin-bottom: 20rpx;
}

.userinfo u-avatar {
	margin-right: 20rpx;
}

.userinfo .arrow-right {
	margin-left: auto;
}

.btn-login {
	margin: 40rpx 0;
}

.gn-icon {
	width: 60rpx;
	height: 60rpx;
	margin-bottom: 20rpx;
}

/*服务按钮*/
.btn-wrap {
	display: flex;
	margin-top: 10rpx;
}

.btn-wrap .btn-contact {
	background-color: #fff;
	margin-left: 15rpx;
	margin-right: 15rpx;
	padding: 20rpx;
	line-height: unset;
	font-size: 12px;
	color: #999;
}

.btn-wrap .btn-contact:active {
	background-color: #f5f5f5;
}

.btn-wrap .btn-contact .txt {
	margin-top: 20rpx;
}

.btn-wrap .btn-contact::after {
	border: unset;
	position: unset;
}

.icon-size {
	font-size: 50rpx;
}

.block-wrap {
	background-color: #fff;
	border-radius: 20rpx;
	margin: 20rpx;
	overflow: hidden;
	.block-title {
		background-color: #fff;
		padding: 20rpx;
	}
}
</style>
<style>
page {
	background-color: #f5f5f5;
}

.head {
	padding: 20rpx;
}

.userinfo {
	display: flex;
	align-items: center;
	padding: 20rpx;
	margin: 40rpx 0;
}

.userinfo .username {
	display: flex;
	flex-direction: column;
}

.grid-text {
	color: #999;
	font-size: 12px;
}

.userinfo u-avatar {
	margin-right: 20rpx;
}

.userinfo .icon-right {
	margin-left: auto;
}

.btn-login {
	margin: 40rpx 0;
}

.grid {
	margin: 10rpx;
	padding: 20rpx;
	background-color: #fff;
	border-radius: 10px;
}

.gn-icon {
	width: 60rpx;
	height: 60rpx;
	margin-bottom: 20rpx;
}

/*服务按钮*/
.btn-wrap {
	display: flex;
	margin-top: 30rpx;
}

.btn-wrap .btn-contact {
	background-color: #fff;
	margin-left: 15rpx;
	margin-right: 15rpx;
	padding: 20rpx;
	line-height: unset;
	font-size: 12px;
	color: #999;
}

.btn-wrap .btn-contact:active {
	background-color: #f5f5f5;
}

.btn-wrap .btn-contact .txt {
	margin-top: 20rpx;
}

.btn-wrap .btn-contact::after {
	border: unset;
	position: unset;
}

.icon-size {
	font-size: 50rpx;
}
</style>