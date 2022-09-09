<template>
	<view class="container">
		<input v-model="form.title" class="title-input" placeholder="标题(选填)" />
		<textarea placeholder="这一刻的想法..." :auto-height="true" maxlength="-1" v-model="form.content" class="post-txt"></textarea>
		<!-- 上传图片 -->
		<block v-if="form.type == 1">
			<u-upload
				ref="uUpload"
				:size-type="['compressed']"
				name="Image"
				:max-count="9"
				:header="header"
				:action="uploadImgUrl"
				@on-uploaded="submit"
				:auto-upload="false"
			></u-upload>
		</block>
		<!-- 上传视频 -->
		<block v-if="form.type == 2">
			<view v-if="form.media.length == 0" class="upload-wrap" @click="chooseVideo">
				<image class="icon" src="/static/video.png"></image>
				<text>上传视频</text>
			</view>
			<video v-if="form.media.length > 0" @click="chooseVideo" :controls="false" :show-center-play-btn="false" class="upload-video" :src="form.media[0]"></video>
		</block>
		<!-- 选择圈子 -->
		<navigator v-if="isTopic" url="/pages/choose-topic/choose-topic" class="choose-item">
			<image class="icon" src="/static/p_1.png"></image>
			<text class="txt">{{ topicName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 选择话题 -->
		<navigator v-if="!isTopic" :url="'/pages/choose-discuss/choose-discuss?topic_id=' + form.topic_id" class="choose-item">
			<image class="icon" src="/static/m_1.png"></image>
			<text class="txt">{{ disName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 所在位置 -->
		<view @click="chooseLocation" class="choose-item">
			<u-icon class="icon add-icon" name="map" color="#999" size="40"></u-icon>
			<text class="txt">{{ form.address || '所在位置' }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</view>
		<view class="submit-btn">
			<q-button v-if="form.type == 1" @click="uploadImg" shape="circle">发布</q-button>
			<q-button v-if="form.type == 2" @click="videoSubmit" shape="circle">发布</q-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			uploadImgUrl: this.$c.domain + 'common/upload',
			topicName: '选择圈子',
			disName: '选择话题',
			form: {
				title: '',
				type: 1,
				topic_id: '',
				discuss_id: '',
				content: '',
				media: [],
				longitude: 0,
				latitude: 0,
				address: ''
			},
			header: {
				token: uni.getStorageSync('token')
			},
			isTopic: true
		};
	},
	onLoad(options) {
		this.form.type = options.type;

		if (options.is_topic) {
			this.isTopic = options.is_topic;
		}

		if (options.topic_id) {
			this.form.topic_id = options.topic_id;
			this.isTopic = false;
		}
		if (options.discuss_id) {
			this.form.discuss_id = options.discuss_id;
		}

		let location = uni.getStorageSync('location_info');
		this.form.longitude = location.longitude;
		this.form.latitude = location.latitude;
	},
	methods: {
		chooseVideo() {
			var self = this;
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				success: function(res) {
					let viedoPath = res.tempFilePath;

					uni.showLoading({
						mask: true,
						title: '上传中'
					});

					uni.uploadFile({
						url: self.$c.domain + 'common/uploadFile',
						filePath: viedoPath,
						name: 'file',
						header: {
							token: uni.getStorageSync('token')
						},
						success: uploadFileRes => {
							let upData = JSON.parse(uploadFileRes.data);
							if (upData.code == 200) {
								self.form.media.push(upData.result.url);
							}
						},
						complete() {
							uni.hideLoading();
						}
					});
				}
			});
		},
		uploadImg() {
			if (!this.form.topic_id) {
				this.$u.toast('请选择圈子');
				return;
			}

			if (!this.form.content) {
				this.$u.toast('内容不能为空');
				return;
			}

			uni.showLoading({
				mask: true,
				title: '发布中'
			});
			this.$refs.uUpload.upload();
		},
		chooseLocation() {
			let that = this;
			uni.chooseLocation({
				success: function(res) {
					// console.log('位置名称：' + res.name);
					// console.log('详细地址：' + res.address);
					// console.log('纬度：' + res.latitude);
					// console.log('经度：' + res.longitude);
					that.form.address = res.name;
					that.form.latitude = res.latitude;
					that.form.longitude = res.longitude;
				}
			});
		},
		videoSubmit() {
			if (this.form.media.length == 0) {
				this.$u.toast('请上传视频');
				return;
			}

			if (!this.form.topic_id) {
				this.$u.toast('请选择圈子');
				return;
			}
			uni.showLoading({
				mask: true,
				title: '发布中'
			});
			this.$H.post('post/addPost', this.form).then(res => {
				if (res.code == 200) {
					uni.redirectTo({
						url: '/pages/post/video-detail?id=' + res.result.id
					});
				}
				uni.hideLoading();
			});
		},
		submit(e) {
			uni.showLoading({
				mask: true,
				title: '发布中'
			});

			let mediaList = [];
			e.forEach(function(item, index) {
				mediaList.push(item.response.result.url);
			});

			this.form.media = mediaList;

			this.$H.post('post/addPost', this.form).then(res => {
				if (res.code == 200) {
					uni.redirectTo({
						url: '/pages/post/detail?id=' + res.result.id
					});
				}
				uni.hideLoading();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.title-input{
	border-bottom: 1px solid #F5F5F5;
	margin: 20rpx 0;
	padding: 20rpx 0;
}
.post-txt {
	width: 100%;
	padding: 20rpx 0;
	min-height: 300rpx;
}

.upload-wrap {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 180rpx;
	height: 180rpx;
	background-color: #F5F5F5;
	margin-top: 30rpx;
	border-radius: 10rpx;
	.icon{
		width: 50rpx;
		height: 50rpx;
	}
	
	text{
		font-size: 24rpx;
	}
}

.upload-video{
	width: 180rpx;
	height: 180rpx;
	margin-top: 30rpx;
}

.choose-item{
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1px solid #F5F5F5;
	&:last-child{
		border: 0;
	}
	.txt{
		margin-left: 20rpx;
	}
	.icon{
		width: 40rpx;
		height: 40rpx;
	}
	.u-icon{
		margin-left: auto;
		color: #999;
	}
	
	.add-icon{
		margin-left: 0;
	}
}

.submit-btn{
	margin-top: 50rpx;
	background-color: aqua;
}
</style>
