<template>
	<view>
		<q-field label="圈子类目" :required="true" :disabled="true" type="select" :isClick="true" @click="jumpClass" :placeholder="cateName"></q-field>
		<q-field label="圈子名称" v-model="form.topic_name" :required="true" placeholder="请填写圈子名称"></q-field>
		<q-field label="圈子介绍" type="textarea" v-model="form.description" :required="true" placeholder="请填写圈子介绍"></q-field>
		<view class="upload-wrap">
			<u-form-item :required="true" label="圈子头像" label-position="top">
				<u-upload
					ref="uUpload"
					name="Image"
					:header="header"
					:action="uploadImgUrl"
					@on-remove="onRemove1"
					:before-upload="beforeUpload"
					max-count="1"
					@on-uploaded="onUploaded1"
				></u-upload>
			</u-form-item>
			<u-form-item :required="true" label="圈子背景" label-position="top">
				<u-upload
					ref="uUpload"
					name="Image"
					:header="header"
					:action="uploadImgUrl"
					@on-remove="onRemove2"
					:before-upload="beforeUpload"
					max-count="1"
					@on-uploaded="onUploaded2"
				></u-upload>
			</u-form-item>
		</view>
		<!-- 提交按钮 -->
		<q-button shape="circle" @click="submit">提交</q-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cateList: [],
			cateName: '请选择',
			uploadImgUrl: this.$c.domain + 'common/upload',
			header: {
				token: uni.getStorageSync('token')
			},
			form: {
				cate_id: '',
				topic_name: '',
				description: '',
				cover_image: '',
				bg_image: ''
			}
		};
	},
	onLoad() {
		this.getCate();
	},
	methods: {
		beforeUpload() {
			uni.showLoading({
				mask: true,
				title: '上传中'
			});
		},
		jumpClass() {
			uni.navigateTo({
				url: 'shoose-class'
			});
		},
		onRemove1() {
			this.form.cover_image = '';
		},
		onRemove2() {
			this.form.bg_image = '';
		},
		onUploaded1(e) {
			this.form.cover_image = e[0].response.result.url;
			uni.hideLoading();
		},
		onUploaded2(e) {
			this.form.bg_image = e[0].response.result.url;
			uni.hideLoading();
		},
		submit() {
			if (!this.form.cate_id) {
				this.$u.toast('请选择圈子类目');
				return;
			}

			if (!this.form.topic_name) {
				this.$u.toast('请填写圈子名称');
				return;
			}

			if (!this.form.description) {
				this.$u.toast('请填写圈子介绍');
				return;
			}

			if (!this.form.cover_image) {
				this.$u.toast('请上传圈子头像');
				return;
			}

			if (!this.form.bg_image) {
				this.$u.toast('请上传圈子主页背景图');
				return;
			}

			this.$H.post('topic/topicAdd', this.form).then(res => {
				if (res.code == 200) {
					this.$u.toast('成功创建圈子');
					uni.redirectTo({
						url: '/pages/topic/detail?id=' + res.result.id
					});
				}
			});
		},
		getCate() {
			this.$H.post('topic/classList').then(res => {
				this.cateList = res.result;
			});
		}
	}
};
</script>

<style>
page {
	background-color: #fff;
}

.upload-wrap {
	padding: 30rpx;
}
</style>
