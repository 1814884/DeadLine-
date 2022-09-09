<template>
	<view>
		<view class="c-wrap">
			<u-form ref="uForm" label-width="auto">
				<u-form-item label="头像">
					<u-avatar @click="onAvatar" mode="square" slot="right" :src="userInfo.avatar" size="100"></u-avatar>
				</u-form-item>
				<u-form-item label="昵称" right-icon="arrow-right">
					<u-input @click="jump(userInfo.username,'username')" :placeholder="userInfo.username"
						:disabled="true" input-align="right" />
				</u-form-item>
				<u-form-item label="性别" right-icon="arrow-right">
					<u-input @click="showGender = true" :placeholder="userInfo.gender"
						:disabled="true" input-align="right" />
				</u-form-item>
				<u-form-item label="个性签名" right-icon="arrow-right">
					<u-input @click="jump(userInfo.intro,'intro')" :placeholder="userInfo.intro" :disabled="true"
						input-align="right" />
				</u-form-item>
				<u-form-item label="标签" label-position="top" :border-bottom="false">
					<view @click="jump(userInfo.tag_str,'tag_str')" class="tag-box">
						<view v-for="(item,index) in userInfo.tag_str" :key="index" class="tag">{{item}}</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="f-fixed">
			<q-button @click="outlogin">退出登录</q-button>
		</view>
		<!-- 性别选择 -->
		<q-select v-model="showGender" :list="gender" @confirm="saveGender"></q-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {},
				userInfo: {},
				showGender:false,
				gender:[
					{
						lable:"男",
						value:1
					},
					{
						lable:"女",
						value:2
					},
					{
						lable:"保密",
						value:0
					}
				]
			};
		},
		onShow(options) {
			this.getUserInfo();
		},
		methods: {
			// 修改性别
			saveGender(index){				
				let gender = this.gender[index[0]].value;
	
				this.$H.post("user/userInfoEdit", {
					gender:gender
				}).then(res => {
					if(res.code == 200){
						this.userInfo.gender = this.gender[index[0]].lable
					}
				})
			},
			getUserInfo() {
				this.$H.get("user/userInfo").then(res => {
					this.userInfo = res.result
				})
			},
			jump(value, type) {
				uni.navigateTo({
					url: "submit?value=" + JSON.stringify(value) + "&type=" + type
				})
			},
			outlogin() {
				uni.removeStorageSync("hasLogin");
				uni.removeStorageSync("token");
				uni.removeStorageSync("userInfo");
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			onAvatar() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						uni.showLoading({
							mask:true,
							title:"上传头像中"
						})
						uni.uploadFile({
							url: that.$c.domain + 'common/upload',
							filePath: res.tempFilePaths[0],
							name: 'Image',
							header: {
								token: uni.getStorageSync("token")
							},
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								if (data.code == 200) {
									that.updateAvatar(data.result.url)
									uni.hideLoading();
								}
							}
						});
					}
				});

			},
			updateAvatar(avatar){
				this.$H.post("user/userInfoEdit", {
					avatar:avatar
				}).then(res => {
					if (res.code == 200) {
						this.userInfo.avatar = avatar;
					}
				})
			}
		}
	}
</script>
<style scoped>
	.c-wrap {
		padding: 20rpx;
		background-color: #FFFFFF;
	}

	.bind-mobile {
		display: flex;
	}

	/* 标签 */
	.tag-box {}

	.tag-box .tag {
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		display: inline-block;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		background-color: #ffebe5;
	}

	.tag-box .tag:nth-child(2n) {
		background-color: #ecf9f2;
	}

	.tag-box .tag:nth-child(3n) {
		background-color: #fff7e5;
	}

	.tag-box .tag:nth-child(5n) {
		background-color: #b3e0ff;
	}
</style>
