<template>
	<view>
		<block v-for="(item, index) in list" :key="item.id">
			<view @click="jump(item)">
				<view class="post-item">
				<view class="post-item-top-user">
					<view @click.stop="toUcenter(item.uid)">
						<u-avatar class="avatar" :src="item.userInfo.avatar" :show-level='item.userInfo.type == 1' level-bg-color="#8072f3"></u-avatar>
					</view>
					<view class="center">
						<view style="display: flex;align-items: center;">
							<text v-if="item.userInfo.type == 1" class="official">官方</text>
							<text class="username">{{ item.userInfo.username.substring(0, 12) }}</text>
						</view>
						<view>
							<text class="time">{{ item.create_time | timeFrom }}</text>
						</view>
					</view>
					<view class="right">
							<u-icon v-if="handle && sessionUid == uid" @tap.stop="onActive(item, index)" class="arrow-down" size="40" name="more-dot-fill"></u-icon>
							<u-icon v-else-if="admin" @tap.stop="onActive(item, index)" class="arrow-down" size="40" name="more-dot-fill"></u-icon>
							<u-icon v-else-if="sessionUid == item.uid" @tap.stop="onActive(item, index)" class="arrow-down" size="40" name="more-dot-fill"></u-icon>
					</view>
				</view>
					<text class="discuss-title" :data-id="item.discuss_id" v-if="item.discuss_id > 0"
						@tap.stop="toDiscuss">#{{ item.discuss_title }}</text>
					<view class="post-content">
						<rich-text class="post-text" :nodes="item.content"></rich-text>
						<!-- 帖子类型 -->
						<block v-if="item.type == 1">
							<!--一张图片-->
							<block v-if="item.media.length == 1">
								<image :lazy-load="true" mode="aspectFill" class="img-style-1" :src="item.media[0]"
									@tap.stop="previewImage(item.media[0], item.media)"></image>
							</block>
							<!--二张图片-->
							<block v-if="item.media.length == 2">
								<view class="img-style-2">
									<image :lazy-load="true" v-for="(mediaItem, index2) in item.media" :key="index2"
										@tap.stop="previewImage(mediaItem, item.media)" mode="aspectFill"
										:src="mediaItem"></image>
								</view>
							</block>
							<!--三张以上图片-->
							<block v-if="item.media.length > 2">
								<view class="img-style-3">
									<image :lazy-load="true" v-for="(mediaItem, index2) in item.media" :key="index2"
										@tap.stop="previewImage(mediaItem, item.media)" mode="aspectFill"
										:src="mediaItem"></image>
								</view>
							</block>
						</block>
						<!-- 视频 -->
						<view class="video-wrap" v-if="item.type == 2 && item.media.length > 0">
							<image class="icon" src="/static/play.png"></image>
							<image mode="aspectFill" :src="item.media[0] + '?x-oss-process=video/snapshot,t_0,f_jpg'">
							</image>
							<!-- <video :show-center-play-btn="false" :controls="false" :src="item.media[0]"></video> -->
						</view>
					</view>
					<!-- 投票 -->
					<view v-if="item.type === 4" class="vote-box">
						<view class="title">{{item.vote_info.title}}</view>
						<view class="expire-time">截止：{{item.vote_info.expire_time | date('yyyy年mm月dd日hh时MM分')}}</view>
						<view class="vote-item" v-for="(item2,index2) in item.vote_info.options" :key="index2">
							{{item2.content}}
						</view>
					</view>
					<!-- 位置 -->
					<view class="address" v-if="item.address">
						<u-icon class="icon" name="map-fill"></u-icon>
						<text>{{ item.address }}</text>
					</view>
					<!-- 底部 -->
					<view class="p-footer">
							<view class="p-item">
								<text class="iconfont icon-yuedu"></text>
								<text>{{item.read_count}}</text>
							</view>
							<view class="p-item">
								<text class="iconfont icon-pinglun"></text>
								<text>{{item.comment_count}}</text>
							</view>
							<view class="p-item">
								<text class="iconfont icon-dianzan1"></text>
								<text class="count">{{item.collection_count}}</text>
							</view>
					</view>
				</view>
			</view>
		</block>
		<!-- 操作弹窗 -->
		<u-action-sheet :list="actionList" v-model="showAction" @click="actionCon"></u-action-sheet>
		<!-- 加载状态 -->
		<block v-if="list.length === 0 && loadStatus == 'nomore'">
			<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
		</block>
		<block v-else>
			<view style="margin: 30rpx 0;">
				<u-loadmore :status="loadStatus" />
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'post-list',
		props: {
			list: Array,
			loadStatus: String,
			handle: {
				default: false,
				type: Boolean
			},
			showTopic: {
				default: true,
				type: Boolean
			},
			uid: Number,
			admin: {
				default: false,
				type: Boolean
			}
		},
		data() {
			return {
				showAction: false,
				indexPostAd: this.$c.indexPostAd,
				actionList: [{
						text: '关注TA',
						key: 'follow'
					},
					{
						text: '删除',
						color: 'red',
						key: 'delete'
					}
				],
				choosePost: '',
				chooseIndex: '',
				sessionUid: ''
			};
		},
		watch: {
			uid(n) {
				if (this.sessionUid == n) {
					this.actionList.unshift({
						text: '置顶',
						key: 'top'
					});
				}
			}
		},
		created() {
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.sessionUid = userInfo.uid;
			}
		},
		methods: {
			onShare() {},
			onActive(postInfo, index) {
				this.showAction = true;
				this.choosePost = postInfo;
				this.chooseIndex = index;
			},
			actionCon(index) {
				let key = this.actionList[index].key;
				if (key == 'follow') {
					this.follow();
				}

				if (key == 'delete') {
					this.postDel();
				}

				if (key == 'top') {
					this.postTop();
				}
			},
			cancelCollection(id, index) {
				this.$H
					.post('post/cancelCollection', {
						id: id
					})
					.then(res => {
						if (res.code === 200) {
							this.list[index].is_collection = false;
							this.list[index].collection_count--;
						}
					});
			},
			addCollection(id, index) {
				this.$H
					.post('post/addCollection', {
						id: id,
						uid: this.list[index].uid
					})
					.then(res => {
						if (res.code === 200) {
							this.list[index].is_collection = true;
							this.list[index].collection_count++;
						}
					});
			},
			// 置顶帖子
			postTop() {
				this.$H
					.post('post/setTop', {
						post_id: this.choosePost.id,
						topic_id: this.choosePost.topic_id
					})
					.then(res => {
						if (res.code == 200) {
							this.$q.toast('成功设为置顶', 'success');
						}
					});
			},
			postDel() {
				this.$H
					.post('post/del', {
						id: this.choosePost.id
					})
					.then(res => {
						if (res.code == 200) {
							this.list.splice(this.chooseIndex, 1);
						}
					});
			},
			follow() {
				this.$H
					.post('user/addFollow', {
						id: this.choosePost.uid
					})
					.then(res => {
						this.$u.toast(res.msg);
					});
			},
			previewImage(url, urls) {
				uni.previewImage({
					current: url, // 当前显示图片的http链接
					urls: urls // 需要预览的图片http链接列表
				});
			},
			jumpTopic(id) {
				uni.navigateTo({
					url: '/pages/topic/detail?id=' + id
				});
			},
			jump(e) {
				let url;

				// 图文
				if (e.type == 1 || e.type == 4) {
					url = '/pages/post/detail?id=' + e.id;
				}

				//视频
				if (e.type == 2) {
					url = '/pages/post/video-detail?id=' + e.id;
				}

				uni.navigateTo({
					url: url
				});
			},
			toDiscuss(e) {
				uni.navigateTo({
					url: '/pages/discuss/detail?id=' + e.currentTarget.dataset.id
				});
			},
			toUcenter(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.post-item {
		background: #fff;
		padding: 10rpx;
		margin-bottom: 10rpx;

		.post-content {
			margin-top: 10rpx;

			.img-style-1 {
				display: block;
				width: 100%;
				max-height: 600rpx;
				border-radius: 10px;
				overflow: hidden;
			}

			.img-style-2 {
				display: flex;
				image {
					margin: 5rpx;
					border-radius: 10px;
					width: 100%;
					height: 294rpx;
				}
			}
			.img-style-3 {
				display: flex;
				flex-wrap: wrap;
				image {
					width: 31.3%;
					height: 200rpx;
					margin: 1%;
					border-radius: 10px;
				}
			}
		}

		.address {
			display: flex;
			font-size: 20rpx;
			background-color: #F5F5F5;
			border-radius: 10rpx;
			display: inline-block;
			padding: 5rpx 20rpx;
			margin: 20rpx 0;

			.icon {
				margin-right: 5rpx;
			}
		}
	}

	.post-item-top-user {
		display: flex;
		align-items: center;
		.avatar {
			width: 85rpx;
			height: 85rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		
		.center{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24rpx;
			color: #999;
			.username{
				font-size: 32rpx;
				font-weight: 600;
				color: #616161;
			}
			
			.official{
				display: inline-block;
				font-size: 20rpx;
				color: #000;
				background-color: $themes-color;
				padding: 5rpx 10rpx;
				border-radius: 10rpx;
				margin-right: 10rpx;
			}
		}
		.right{
			height: 85rpx;
			.arrow-down{
				color: #999;
			}	
		}
	}

	.post-text {
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 10;
		white-space: pre-wrap;
		overflow: hidden;
	}

	.discuss-title {
		height: 30rpx;
		padding: 10rpx;
		line-height: 30rpx;
		border-radius: 20rpx;
		font-size: 12px;
		background: #f0f0f5;
		color: #68c778;
		text-align: center;
	}

	.p-footer {
		display: flex;
		margin: 10rpx 0;

		.p-item {
			margin: 0 auto;
			color: #616161;
			display: flex;
			align-items: center;

			.count {
				margin-left: 10rpx;
				font-size: 28rpx;
			}
		}

		.p-item[hidden] {
			display: none !important;
		}
	}

	.comment-wrap {
		font-size: 28rpx;
		padding-top: 20rpx;
		border-top: 1px solid #F5F5F5;
		.item{
			.name{
				color: #000;
				font-weight: 600;
			}
		}
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

	// 投票
	.vote-box {
		background-color: #F5F5F5;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: 20rpx;

		.title {
			font-weight: bold;
		}

		.expire-time {
			font-size: 24rpx;
			margin: 20rpx 0;
		}

		.vote-item {
			font-size: 24rpx;
			font-weight: bold;
			padding: 20rpx;
			border-radius: 20rpx;
			border: 1px solid #999;
			text-align: center;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
</style>
