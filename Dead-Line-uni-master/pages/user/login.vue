<template>
	<view class="login">
		<image class="logo" :src="shareCover"></image>
		<text class="txt1">申请获取以下权限</text>
		<text class="txt2">获取你的公开信息（昵称、头像等）</text>
		<q-button @click="login">授权登录</q-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				domain: this.$H.domain,
				shareCover: ""
			};
		},
		onLoad() {
			this.getSysInfo();
		},
		methods: {
			getSysInfo() {
				this.$H.get("system/miniConfig").then(res => {
					this.shareCover = res.result.intro;
				})
			},
			async login() {

				uni.showLoading({
					mask: true,
					title: '登录中'
				});

				let that = this;

				let userInfo = await this.getUserProfile();
				let loginCode = await this.getLoginCode();

				that.$H.post('user/miniWxLogin', {
					code: loginCode,
					username: userInfo.nickName,
					avatar: userInfo.avatarUrl,
					province: userInfo.province,
					city: userInfo.city,
					gender: userInfo.gender
				}).then(res2 => {
					if (res2.code === 200) {
						uni.setStorageSync("hasLogin", true);
						uni.setStorageSync("token", res2.result.token);
						uni.navigateBack();
						that.getUserInfo();

						uni.hideLoading();
					}
				})
			},
			getUserInfo() {
				this.$H.get("user/userInfo").then(res => {
					uni.setStorageSync("userInfo", res.result)
				})
			},
			getLoginCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							resolve(loginRes.code);
						}
					});
				});
			},
			getUserProfile() {
				return new Promise((resolve, reject) => {
					wx.getUserProfile({
						lang: 'zh_CN',
						desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
						success: res => {
							resolve(res.userInfo);
						}
					});
				});
			}

		}
	}
</script>

<style lang="scss">
	.login {
		display: flex;
		flex-direction: column;
		padding: 100rpx;
	}

	.login .logo {
		width: 230rpx;
		height: 230rpx;
		margin: 50rpx auto;
	}

	.login .txt1 {
		margin-bottom: 10rpx;
	}

	.login .txt2 {
		color: #999;
		margin-bottom: 50rpx;
	}
</style>
