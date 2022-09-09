<template>
	<view class="wrap">
		<view style="position: absolute;"><u-navbar :custom-back="onBack" back-icon-color="#fff" :background="background" :border-bottom="false"></u-navbar></view>
		<view class="head">
			<image mode="aspectFill" class="bg" :src="topicInfo.bg_image"></image>
			<view class="head-c">
				<text class="name">{{ topicInfo.topic_name }}</text>
				<view class="count">
					<text>{{ topicInfo.user_count }}人已加入</text>
					<text>{{ topicInfo.post_count }}篇内容</text>
					<block v-if="topicInfo.is_join">
						<u-button class="mg-left-auth" @click="showShare = true" :custom-style="btnStyle">
							<u-icon name="share"></u-icon>
							<text>分享</text>
						</u-button>
					</block>
					<block v-else><u-button class="mg-left-auth" :custom-style="btnStyle" @click="joinTopic">加入圈子</u-button></block>
				</view>
			</view>
		</view>
		<!-- 简介 -->
		<navigator class="member-wrap" :url="'/pages/topic/topic-user?id=' + topicId">
			<view class="member-wrap-head">
				<view class="notice-box">公告<text class="notice-txt">{{topicInfo.description || replace}}</text></view>
				<u-icon class="icon" name="arrow-right"></u-icon>
			</view>
		</navigator>
		<!-- 置顶 -->
		<view class="post-top-box">
			<navigator
				@longpress="onTopDel(item, index)"
				class="post-item"
				:url="'/pages/post/detail?id=' + item.id"
				v-for="(item, index) in topicInfo.top_post"
				:key="index"
			>
				<view class="tag">置顶</view>
				<view class="title">{{ item.title || item.content.substring(0, 15) }}</view>
			</navigator>
		</view>
		<!-- 圈话题 -->
		<view class="member-wrap" v-if="topicInfo.discuss_list.length > 0">
			<view class="member-wrap-head">
				<text>圈话题</text>
				<navigator :url="'../discuss/list?topic_id=' + topicId" class="user-num" hover-class="none">
					<text>更多</text>
					<u-icon class="icon" name="arrow-right"></u-icon>
				</navigator>
			</view>
			<scroll-view :scroll-x="true" style="height: 180rpx;">
				<view class="dis-wrap">
					<navigator :url="'/pages/discuss/detail?id=' + item.id" class="d-item" v-for="(item, index) in topicInfo.discuss_list" :key="item.id">
						<view class="u-line-2">{{ item.title.substring(0, 10) }}</view>
					</navigator>
				</view>
			</scroll-view>
		</view>
		
		<view class="tabs-box">
			<view class="tab-left"><u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabsChange"></u-tabs></view>
		</view>
		<view v-show="current == 0">
			<post-list :showTopic="false" :handle="true" :uid="topicInfo.uid" :list="postNews" :loadStatus="loadStatus" :admin="topicInfo.is_admin"></post-list>
		</view>
		<view v-show="current == 1">
			<post-list :showTopic="false" :handle="true" :uid="topicInfo.uid" :list="postHot" :loadStatus="loadStatus" :admin="topicInfo.is_admin"></post-list>
		</view>
		<!-- 底部菜单 -->
		<view class="tabbar">
			<view @click="onMenu" class="tab-item">
				<image class="icon" src="../../static/menu.png"></image>
				<text>菜单</text>
			</view>
			<view @click="onPlus" class="tab-item mid-button"><u-icon name="plus" size="50"></u-icon></view>
			<navigator url="/pages/more/more" open-type="switchTab" class="tab-item" hover-class="none">
				<image class="icon" src="../../static/hot.png"></image>
				<text>推荐</text>
			</navigator>
		</view>
		<!-- 菜单弹框 -->
		<q-popup v-model="showMenu">
			<view class="popup-head">
				<text>菜单</text>
				<u-icon @click="showMenu = false" size="40" class="close" color="#999" name="close"></u-icon>
			</view>
			<u-grid :col="4" :border="false">
				<!-- 如果是圈主或管理员 -->
				<block v-if="topicInfo.uid == sessionUser.uid || topicInfo.is_admin">
					<u-grid-item @click="jumpMenu('/pages/discuss/add?topicId=' + topicId)">
						<image class="menu-icon" src="../../static/add-dis.png"></image>
						<view class="grid-text">新建话题</view>
					</u-grid-item>
					<u-grid-item @click="jumpMenu('/pages/topic/info-edit?topicId=' + topicId)">
						<image class="menu-icon" src="../../static/topic.png"></image>
						<view class="grid-text">圈子信息</view>
					</u-grid-item>
					<!-- 				<u-grid-item>
					<image class="menu-icon" src="../../static/notic.png"></image>
					<view class="grid-text">公告</view>
				</u-grid-item> -->
					<!-- 如果是圈主 -->
					<block v-if="topicInfo.uid == sessionUser.uid">
						<u-grid-item @click="jumpMenu('/pages/topic/admin?id=' + topicId)">
							<image class="menu-icon" src="../../static/admin.png"></image>
							<view class="grid-text">管理员</view>
						</u-grid-item>
	
						<u-grid-item @click="delTopicModel = true">
							<image class="menu-icon" src="../../static/jiesan.png"></image>
							<view class="grid-text">解散圈子</view>
						</u-grid-item>
					</block>
				</block>
				<!-- 普通成员 -->
				<block v-else>
					<u-grid-item @click="outTopic">
						<image class="menu-icon" src="../../static/jiesan.png"></image>
						<view class="grid-text">退出圈子</view>
					</u-grid-item>
				</block>
			</u-grid>
		</q-popup>
		<!-- 加入圈子弹窗 -->
		<u-modal v-model="joinTopicModel" :show-cancel-button="true" confirm-text="加入圈子" :content="'是否加入【' + topicInfo.topic_name + '】?'" @confirm="joinTopic"></u-modal>
		<!-- 解散圈子弹窗 -->
		<u-modal
			v-model="delTopicModel"
			:show-cancel-button="true"
			confirm-color="red"
			confirm-text="确认"
			:content="'解散【' + topicInfo.topic_name + '】后，将不可恢复，是否确认解散？'"
			@confirm="topicDel"
		></u-modal>
		<!-- 选择分享弹窗 -->
		<u-popup v-model="showShare" mode="center" border-radius="20" width="80%">
			<view class="share-type">
				<button open-type="share" class="type-item u-reset-button">
					<u-icon class="icon" name="weixin-fill" color="#00b33c"></u-icon>
					<text>发给微信好友</text>
				</button>
				<view class="type-item" @click="shareCanvas">
					<u-icon class="icon" name="photo" color="#ffcc00"></u-icon>
					<text>生成分享海报</text>
				</view>
				<view class="type-item" @click="copyPageUrl">
					<u-icon class="icon" name="cut" color="#0099ff"></u-icon>
					<text>复制链接</text>
				</view>
			</view>
		</u-popup>
		<!-- 海报弹窗 -->
		<u-popup v-model="showCanvas" mode="center" border-radius="20" width="80%">
			<view class="canvas-box">
				<canvas style="width: 300px;height: 400px;" canvas-id="shareCanvas"></canvas>
				<view class="footer"><u-button :custom-style="shareBtnStyle" @click="saveImgToAlbum" type="success" shape="circle">保存/分享</u-button></view>
			</view>
		</u-popup>
		<!-- 发布弹窗 -->
		<u-popup v-model="showPlusPost" mode="center" border-radius="20" width="80%">
			<view class="share-type">
				<view @click="onTrigger(1)" class="type-item">
					<u-icon class="icon" size="40" name="photo" color="#1aa3ff"></u-icon>
					<text>发布帖子</text>
				</view>
				<view @click="onTrigger(2)" class="type-item">
					<u-icon class="icon" size="40" name="play-circle-fill" color="#ff5c33"></u-icon>
					<text>发布视频</text>
				</view>
				<view @click="onTrigger(3)" class="type-item">
					<image class="icon" src="/static/h_1.png"></image>
					<text>发布投票</text>
				</view>
			</view>
		</u-popup>
		<!-- 弥补操作菜单高度 -->
		<view style="height: 200rpx;"></view>
	</view>
</template>

<script>
import postList from '../../components/post-list/post-list.vue';
import disList from '../../components/discuss-list/discuss-list.vue';
import userList from '../../components/user-list/user-list.vue';
export default {
	components: {
		postList,
		disList,
		userList
	},
	data() {
		return {
			showPlusPost: false,
			showCanvas: false,
			showShare: false,
			joinTopicModel: false,
			delTopicModel: false,
			showMenu: false,
			current: 0,
			tabList: [ {
					name: '最新'
				}, {
					name: '最热'
				},
			],
			noticeShow: false,
			btnStyle: {
				marginRight: 0,
				width: '150rpx',
				fontSize: '12px',
				height: '60rpx',
				lineHeight: '60rpx',
				backgroundColor: '#333',
				color: '#fff'
			},
			shareBtnStyle: {
				backgroundColor: '#333'
			},
			topicId: 0,
			topicInfo: {
				member_list: [],
				discuss_list: [],
				description: '',
				userInfo: {
					username: ''
				}
			},
			postHot: [],
			postNews: [],
			loadStatus: 'loading',
			page1: 1,
			page2: 1,
			background: {
				backgroundColor: 'unset'
			},
			sessionUser: uni.getStorageSync('userInfo')
		};
	},
	onLoad(options) {
		this.topicId = options.id;

		if (options.scene) {
			this.topicId = options.scene;
		}

		this.getTopicInfo();
		this.getPostList();
	},
	onReachBottom() {
		if (this.current == 0) {
			this.page1++;
		}

		if (this.current == 1) {
			this.page2++;
		}

		this.getPostList();
	},
	onPullDownRefresh() {
		if (this.current == 0) {
			this.page1 = 1;
			this.postNews = [];
		}

		if (this.current == 1) {
			this.page2 = 1;
			this.postHot = [];
		}

		this.getPostList();
		this.getTopicInfo();
		uni.stopPullDownRefresh();
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: this.topicInfo.topic_name + '-' + this.topicInfo.description,
			path: '/pages/topic/detail?id=' + this.topicId,
			imageUrl: this.topicInfo.bg_image
		};
	},
	onShareTimeline() {
		return {
			title: this.topicInfo.topic_name + '-' + this.topicInfo.description,
			imageUrl: this.topicInfo.bg_image,
			query: 'id=' + this.topicId
		};
	},
	filters: {
		substr: function(e) {
			return e.substr(0, 5);
		},
		replace(str) {
			str = str.replace(/\n/g, '');
			return str;
		}
	},
	methods: {
		onTopDel(e, index) {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '是否解除置顶?',
				success: function(res) {
					if (res.confirm) {
						that.$H
							.post('post/topPostDel', {
								post_id: e.id,
								topic_id: e.topic_id
							})
							.then(res => {
								if (res.code == 200) {
									that.topicInfo.top_post.splice(index, 1);
								}
							});
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
		},
		copyPageUrl() {
			let that = this;
			uni.setClipboardData({
				data: 'pages/topic/detail?id=' + this.topicId,
				success: function() {
					uni.hideToast();
					that.$q.toast('复制成功', 'success');
					that.showShare = false;
				}
			});
		},
		onMenu() {
			if (this.topicInfo.is_join) {
				this.showMenu = true;
			} else {
				this.joinTopicModel = true;
			}
		},
		onPlus() {
			if (this.topicInfo.is_join) {
				this.showPlusPost = true;
			} else {
				this.joinTopicModel = true;
			}
		},
		// 保存海报到相册
		saveImgToAlbum() {
			uni.canvasToTempFilePath({
				x: 0,
				y: 0,
				width: 300,
				height: 400,
				canvasId: 'shareCanvas',
				success: function(res) {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function() {
							console.log('save success');
						}
					});
				}
			});
		},
		// 生成分享海报
		async shareCanvas() {
			uni.showLoading({
				mask: true,
				title: '正在生成海报'
			});

			this.showCanvas = true;
			this.showShare = false;
			var context = uni.createCanvasContext('shareCanvas');

			//白色背景矩形
			context.setFillStyle('#FFFFFF');
			context.fillRect(0, 0, 300, 400);

			// 圈子名称
			context.setFillStyle('#000000');
			let txtWith = context.measureText(this.topicInfo['topic_name']).width;
			context.setFontSize(20);
			context.fillText(this.topicInfo['topic_name'], txtWith / 2, 40, 280);

			// 邀请你一起加入
			context.setFontSize(16);
			context.setFillStyle('#999');
			context.fillText('邀请你一起加入', txtWith / 2, 80, 280);

			// 微信扫一扫
			context.setFontSize(14);
			context.fillText('微信扫一扫', 120, 365, 280);

			// 圈子二维码
			let qrCode = await this.getQrCode();
			let tempQrCode = await this.downloadFile(qrCode);
			context.drawImage(tempQrCode, 30, 100, 240, 240);

			context.draw();

			uni.hideLoading();
		},
		downloadFile(url) {
			return new Promise(resolve => {
				uni.downloadFile({
					url: url,
					success: res => {
						resolve(res.tempFilePath);
					}
				});
			});
		},
		getQrCode() {
			return new Promise(resolve => {
				this.$H
					.get('topic/qrCode', {
						id: this.topicId
					})
					.then(res => {
						resolve(res.result);
					});
			});
		},
		// 解散圈子
		topicDel() {
			uni.showLoading({
				mask: true,
				title: '操作中'
			});
			this.$H
				.post('topic/topicDel', {
					id: this.topicId
				})
				.then(res => {
					if (res.code == 200) {
						this.$u.toast('该圈子已成功解散');

						setTimeout(function() {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}, 1500);
					}
					uni.hideLoading();
				});
		},
		jumpUser() {
			uni.navigateTo({
				url: '/pages/topic/topic-user?id=' + this.topicId
			});
		},
		onBack() {
			let pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},
		tabsChange(index) {
			this.current = index;
			if (index == 1 && this.postHot.length == 0) {
				this.getPostList();
			}
		},
		onTrigger(type) {
			if (!this.topicInfo.is_join) {
				this.joinTopicModel = true;
				return;
			}

			this.showPlusPost = false;
			if (type == 3) {
				uni.navigateTo({
					url: '/pages/vote/vote?topic_id=' + this.topicId
				});
			} else {
				uni.navigateTo({
					url: '/pages/post/add?topic_id=' + this.topicId + '&topic_name=' + this.topicInfo.topic_name + '&type=' + type
				});
			}
		},
		jump(uid) {
			uni.navigateTo({
				url: '/pages/user/home?uid=' + uid
			});
		},
		joinTopic() {
			this.$H
				.post('topic/joinTopic', {
					id: this.topicId
				})
				.then(res => {
					if (res.code === 200) {
						this.topicInfo.is_join = true;
						this.joinTopicModel = false;
					}
				});
		},
		outTopic() {
			this.$H
				.post('topic/userTopicDel', {
					id: this.topicId
				})
				.then(res => {
					if (res.code === 200) {
						this.topicInfo.is_join = false;
						this.showMenu = false;
					}
				});
		},
		getTopicInfo() {
			this.$H
				.get('topic/detail', {
					id: this.topicId
				})
				.then(res => {
					this.topicInfo = res.result;
				});
		},
		jumpMenu(url) {
			this.showMenu = false;
			uni.navigateTo({
				url: url
			});
		},
		getPostList() {
			this.loadStatus = 'loading';
			let page = this.page1;
			let order = 'id desc';

			if (this.current == 1) {
				page = this.page2;
				order = 'read_count desc';
			}

			this.$H
				.get('post/list', {
					topic_id: this.topicId,
					page: page,
					order: order
				})
				.then(res => {
					if (this.current == 0) {
						this.postNews = this.postNews.concat(res.result.data);
					}

					if (this.current == 1) {
						this.postHot = this.postHot.concat(res.result.data);
					}

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
.wrap{
	height: calc(100vh);
}
.mg-left-auth{
	margin-left: auto;
}	

.mg-left-20{
	margin-left: 20rpx;
}

.tabs-box{
	background-color: #FFFFFF;
	 .tab-left{
		 width: 60%;
	 }
}

  /*  */
.notice-txt {
	color: #999;
	font-size: 12px;
	margin-left: 20rpx;
}

.grid-text {
	font-size: 12px;
	color: #616161;
	margin-bottom: 30rpx;
}

.head {
	position: relative;
	height: 380rpx;
}

.head-c {
	position: absolute;
	top: 200rpx;
	left: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	color: #fff;
	padding: 30rpx;
}

.head-c .count {
	font-size: 10px;
	display: flex;
	align-items: center;
}

.head-c .count text {
	margin: 0 5rpx;
	color: #e6e6e6;
}

.head-c .name {
	font-size: 20px;
	font-weight: bold;
}

.margin-left {
	margin-left: auto;
	margin-right: 20rpx;
}

.head .bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

/* 管理员 */
.member-wrap {
	padding: 30rpx;
	background-color: #fff;
	border-bottom: 1px solid #eee;
}

.member-wrap .avatar {
	margin-bottom: 10rpx;
}

.member-wrap .member-wrap-head {
	display: flex;
	color: #616161;
	.user-num{
		margin-left: auto;
		color: #999;
	}
	
	.icon {
		margin-left: auto;
		color: #999;
	}
}
// 置顶
.post-top-box{
	background-color: #fff;
	padding: 20rpx;
	.post-item{
		display: flex;
		align-items: center;
		padding: 20rpx;
		font-size: 28rpx;
		&:last-child{
			margin-bottom: 0;
		}
		.tag{
			background-color: #333;
			color: #fff;
			padding: 0 10rpx;
			border-radius: 10rpx;
			font-size: 20rpx;
			height: 40rpx;
			line-height: 40rpx;
			margin-right: 20rpx;
		}
	}
}
// 圈话题
.dis-wrap{
	display: flex;
	margin-top: 10rpx;
	.d-item{
		flex-grow:0;
		flex-shrink:0;
		width: 330rpx;
		background-color: #F5F5F5;
		border-radius: 20rpx;
		padding: 10rpx;
		font-size: 28rpx;
		font-weight: 600;
		margin-right: 10rpx;
	}
}

// 菜单
.tabbar{
	position: fixed;
	bottom: 50rpx;
	width: 70%;
	margin-left: 15%;
	margin-right: 15%;
	background-color: #fff;
	display: flex;
	padding: 10rpx;
	box-shadow: 0 0 10rpx #e6e6e6;
	font-size: 24rpx;
	border-radius: 100rpx;
	z-index: 9999;
	.tab-item{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		.icon{
			margin-top: 10rpx;
			width: 40rpx;
			height: 40rpx;
		}
	}
	
	.mid-button{
		background-color: #333;
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		color: #fff;
	}
}

// 菜单弹窗
.popup-head{
	text-align: center;
	font-size: 24rpx;
	position: relative;
	padding: 30rpx;
	border-bottom: 1px solid #F5F5F5;
	margin-bottom: 30rpx;
	.close{
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}
}

.menu-icon{
	width: 60rpx;
	height: 60rpx;
	margin-bottom: 10rpx;
}

// 分享类型弹窗
.share-type{
	padding: 50rpx 30rpx;
	.type-item{
		background-color: #F5F5F5;
		padding: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.icon{
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}
		
		&:nth-child(2){
			margin: 20rpx 0;
		}
	}
}

//海报弹窗
.canvas-box{
	height: 500px;
	position: relative;
	.footer{
		position: absolute;
		bottom: 20rpx;
		left: 20rpx;
		right: 20rpx;
	}
}


</style>
