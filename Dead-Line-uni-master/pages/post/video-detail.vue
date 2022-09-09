<template>
	<view>
		<video class="video_" :enable-danmu="true" :danmu-btn="true" :autoplay="true" :enable-play-gesture="true"
			:controls="false" :show-fullscreen-btn="false" :loop="true" :src="postDetail.media[0]"></video>
		<view class="tool-box">
			<navigator hover-class="none" :url="'/pages/user/home?uid=' + postDetail.uid" class="item">
				<u-avatar :src="postDetail.userInfo.avatar"></u-avatar>
			</navigator>
			<view class="item">
				<image v-show="postDetail.is_collection" @click="cancelCollection" src="/static/fav-1.png"></image>
				<image v-show="!postDetail.is_collection" @click="addCollection" src="/static/fav.png"></image>
				<text>{{ postDetail.collection_count }}</text>
			</view>
			<view class="item" @click="commentPopup = true">
				<image src="/static/comment.png"></image>
				<text>{{ postDetail.comment_count }}</text>
			</view>
			<button open-type="share" class="u-reset-button item">
				<image src="/static/share.png"></image>
			</button>
		</view>
		<!-- 底部内容 -->
		<view class="footer">
			<navigator :url="'/pages/user/home?uid=' + postDetail.uid" hover-class="none" class="username">
				@{{ postDetail.userInfo.username }}</navigator>
			<text class="c-txt" @longpress="onCopy">{{ postDetail.content | replace }}</text>
		</view>
		<!-- 评论弹窗 -->
		<q-popup v-model="commentPopup" height="50vh">
			<scroll-view scroll-y style="height: 45vh;" @scrolltolower="reachBottom">
				<view class="comment-box">
					<view class="title">评论（{{ postDetail.comment_count }}）</view>
					<!-- 帖子内容 -->
					<view class="comment-item"  @longpress="onCopy">
						<image @click="jumpUser(postDetail.userInfo.uid)" class="avatar"
							:src="postDetail.userInfo.avatar"></image>
						<view class="c-content">
							<view class="user">
								<text>{{ postDetail.userInfo.username }}</text>
							</view>
							<text class="c-txt">{{ postDetail.content }}</text>
							<text class="time">{{ postDetail.create_time | timeFrom }}</text>
						</view>
					</view>
					<view style="margin-bottom: 40rpx;" v-for="(item, index) in commentList" :key="index">
						<!-- 评论列表 -->
						<view class="comment-item" @longpress="delComment(item, index)">
							<image @click="jumpUser(item.userInfo.uid)" class="avatar" :src="item.userInfo.avatar">
							</image>
							<view class="c-content" @click="onReply(item)">
								<view class="user">
									<text>{{ item.userInfo.username }}</text>
									<block v-if="item.is_thumbs">
										<view @click.stop="cancelThumbs(item.id, index)" class="thumbs">
											<text class="num">{{ item.thumbs }}</text>
											<u-icon class="icon" size="40" name="heart-fill" color="#e62e00"></u-icon>
										</view>
									</block>
									<block v-else>
										<view @click.stop="onThumbs(item.id, index)" class="thumbs">
											<text class="num">{{ item.thumbs }}</text>
											<u-icon class="icon" size="40" name="heart-fill" color="#bfbfbf"></u-icon>
										</view>
									</block>
								</view>
								<text class="c-txt">{{ item.content }}</text>
								<text class="time">{{ item.create_time | timeFrom }}</text>
							</view>
						</view>
						<view @click="onReply(item2, index, index2)" v-if="item.children.length > 0"
							v-for="(item2, index2) in item.children" :key="item2.id"
							@longpress="delComment(item2, index, index2)" class="sub-comment-item">
							<view class="user">
								<u-avatar class="avatar" :size="40" :src="item2.userInfo.avatar"></u-avatar>
								<view class="u-head">
									<text>{{ item2.userInfo.username }}</text>
									<block v-if="item2.is_thumbs">
										<view class="thumbs" @click.stop="cancelThumbs(item2.id, index, index2)">
											<text class="num">{{ item2.thumbs }}</text>
											<u-icon class="icon" size="40" name="heart-fill" color="#e62e00"></u-icon>
										</view>
									</block>
									<block v-else>
										<view class="thumbs" @click.stop="onThumbs(item2.id, index, index2)">
											<text class="num">{{ item2.thumbs }}</text>
											<u-icon class="icon" size="40" name="heart-fill" color="#bfbfbf"></u-icon>
										</view>
									</block>
								</view>
							</view>
							<view class="reply">
								<text>回复</text>
								<navigator :url="'/pages/user/home?uid=' + item2.to_user.uid" hover-class="none"
									class="name">{{ item2.to_user.username }}</navigator>
								<text>：{{ item2.content }}</text>
								<view class="time">{{ item2.createtime | timeFrom }}</view>
							</view>
						</view>
					</view>
					<!-- 加载状态 -->
					<block v-if="commentList.length > 0">
						<view style="margin: 30rpx;">
							<u-loadmore :status="loadStatus" />
						</view>
					</block>
					<block v-else>
						<u-empty text="暂无评论" mode="message"></u-empty>
					</block>
					<view style="height: 100rpx;"></view>
				</view>
			</scroll-view>
			<!-- 评论输入框 -->
			<view class="comment-tool">
				<textarea :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
					v-model="form.content" auto-height="true" placeholder-class="txt-placeholder"></textarea>
				<u-button @click="addComment" :disabled="isSubmitD">发布</u-button>
			</view>
		</q-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				postDetail: {
					content: '',
					userInfo: {
						username: ''
					}
				},
				isSubmitD: false,
				commentPopup: false,
				commentList: [],
				focus: false,
				placeholder: '说点什么...',
				page: 1,
				form: {
					pid: 0,
					type: 1,
					to_uid: '',
					post_id: '',
					content: ''
				},
				loadStatus: 'loadmore'
			};
		},
		filters: {
			replace(str) {
				str = str.replace(/\n/g, '');
				if (str.length > 20) {
					str = str.substring(0, 20) + '...';
				}

				return str;
			}
		},
		onLoad(options) {
			this.postId = options.id;

			if (options.scene) {
				this.postId = options.scene;
			}

			this.form.post_id = this.postId;

			this.getPostDetail();
			this.getCommentList();
		},
		methods: {
			// 删除评论
			delComment(e, index, index2) {
				let that = this;
				let user = uni.getStorageSync("userInfo");

				if (e.uid != user.uid) {
					return;
				}

				uni.showModal({
					title: '提示',
					content: '确定删除该评论？',
					success: function(res) {
						if (res.confirm) {
							that.$H
								.post('comment/del', {
									id: e.id
								})
								.then(res2 => {
									if (res2.code == 200) {
										if (index2 || index2 === 0) {
											that.commentList[index].children.splice(index2, 1);
										} else {
											that.commentList.splice(index, 1);
										}
									}
								});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			onCopy() {
				let that = this;
				uni.setClipboardData({
					data: this.postDetail.content,
					success: function() {
						uni.hideToast();
						that.$q.toast('复制成功', 'success');
					}
				});
			},
			// 评论触底
			reachBottom() {
				this.page++;
				this.getCommentList();
			},
			jumpUser(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				});
			},
			// 点赞
			onThumbs(id, index, index2) {
				this.$H
					.post('comment/thumbs', {
						id: id
					})
					.then(res => {
						if (res.code == 200) {
							if (index2 || index2 == 0) {
								this.commentList[index].children[index2].is_thumbs = true;
								this.commentList[index].children[index2].thumbs++;
							} else {
								this.commentList[index].is_thumbs = true;
								this.commentList[index].thumbs++;
							}
						}
					});
			},
			// 取消点赞
			cancelThumbs(id, index, index2) {
				console.log(index + ',' + index2);
				this.$H
					.post('comment/cancelThumbs', {
						id: id
					})
					.then(res => {
						if (res.code == 200) {
							if (index2 || index2 == 0) {
								this.commentList[index].children[index2].is_thumbs = false;
								this.commentList[index].children[index2].thumbs--;
							} else {
								this.commentList[index].is_thumbs = false;
								this.commentList[index].thumbs--;
							}
						}
					});
			},
			// 回复评论
			onReply(e) {
				this.placeholder = '回复：' + e.userInfo.username;
				this.focus = true;

				let pid = e.pid;
				if (pid === 0) {
					this.form.pid = e.id;
				} else {
					this.form.pid = e.pid;
				}

				this.form.to_uid = e.userInfo.uid;
				this.form.post_id = this.postId;
			},
			// 输入框失去焦点时
			onBlur() {
				this.placeholder = '说点什么...';
				this.focus = false;
				this.pid = 0;
			},
			// 获取评论列表
			getCommentList() {
				this.loadStatus = 'loading';
				this.$H
					.get('comment/list', {
						post_id: this.postId,
						page: this.page
					})
					.then(res => {
						if (res.code == 200) {
							this.commentList = this.commentList.concat(res.result.data);

							if (res.result.current_page === res.result.last_page || res.result.last_page === 0) {
								this.loadStatus = 'nomore';
							} else {
								this.loadStatus = 'loadmore';
							}
						}
					});
			},
			cancelCollection() {
				this.$H
					.post('post/cancelCollection', {
						id: this.postId
					})
					.then(res => {
						if (res.code === 200) {
							this.postDetail.collection_count--;
							this.postDetail.is_collection = false;
						}
					});
			},
			addCollection() {
				this.$H
					.post('post/addCollection', {
						id: this.postId,
						uid: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 200) {
							this.postDetail.collection_count++;
							this.postDetail.is_collection = true;
						}
					});
			},
			addComment() {
				this.isSubmitD = true;
				if (this.form.content == '') {
					this.$u.toast('评论不能为空');
					this.isSubmitD = false;
					return;
				}

				uni.showLoading({
					mask: true,
					title: '发布中'
				});

				this.$H.post('post/addComment', this.form).then(res => {
					if (res.code == 200) {
						this.form.content = '';
						this.$u.toast('评论成功');
						this.page = 1;
						this.commentList = [];
						this.getCommentList();
					}
					this.isSubmitD = false;
					uni.hideLoading();
				});
			},
			getPostDetail() {
				this.$H
					.get('post/detail', {
						id: this.postId
					})
					.then(res => {
						this.postDetail = res.result;
					});
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				console.log(res.target);
			}
			let imgURL;
			if (this.postDetail.media.length > 0) {
				imgURL = this.postDetail.media[0];
			}
			return {
				title: this.postDetail.content,
				path: '/pages/post/video-detail?id=' + this.postId
			};
		},
		onShareTimeline() {
			let imgURL = (imgURL = this.postDetail.media[0]);
			return {
				title: this.postDetail.content,
				query: 'id=' + this.postId
			};
		}
	};
</script>

<style lang="scss" scoped>
	.video_ {
		width: 100%;
		height: 100vh;
		display: block;
	}
	
	.tool-box {
		position: absolute;
		bottom: 100rpx;
		right: 30rpx;
		color: #fff;
		font-size: 24rpx;
		z-index: 999;
		.item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 30rpx;
			.iconfont {
				font-size: 60rpx;
			}
			image {
				width: 50rpx;
				height: 50rpx;
			}
		}
	}
	
	/* 评论tool */
	.comment-tool {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		z-index: 999;
	}
	
	.comment-tool textarea {
		padding: 20rpx;
		border-radius: 10rpx;
		min-height: 40rpx;
	}
	
	.comment-tool .u-btn {
		margin-left: 10rpx;
	}
	
	/*评论列表*/
	
	/*评论列表*/
	.comment-box {
		background-color: #ffffff;
		margin-top: 20rpx;
	}
	
	.comment-box > .title {
		margin: 20rpx;
	}
	
	.comment-item {
		display: flex;
		padding: 20rpx;
		&:active{
			background-color: #F5F5F5;
		}
		.c-content {
			display: flex;
			flex-direction: column;
			flex: 1;
	
			.time {
				color: #999;
				font-size: 10px;
			}
	
			.user {
				display: flex;
				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;
					.num {
						margin-right: 10rpx;
					}
				}
			}
		}
		.avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			border: 1px solid #dd524d;
			margin-right: 20rpx;
		}
	}
	
	.sub-comment-item {
		margin-left: 100rpx;
		padding: 20rpx;
		&:active{
			background-color: #F5F5F5;
		}
		.user {
			display: flex;
			align-items: center;
			.name {
				color: #616161;
			}
			.avatar {
				margin-right: 10rpx;
			}
	
			.u-head {
				flex: 1;
				display: flex;
				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;
					.num {
						margin-right: 10rpx;
					}
				}
			}
		}
		.reply {
			.time {
				margin-left: auto;
				font-size: 20rpx;
				color: #999;
			}
			.name {
				display: inline-block;
				color: #2b85e4;
				font-weight: 600;
			}
		}
	}
	
	// 底部内容框
	.footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		color: #fff;
		padding: 20rpx;
		.username {
			margin-bottom: 20rpx;
		}
	}
	
</style>
