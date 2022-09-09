<template>
	<view>
		<view class="read-tips">
			<text @click="readStatus">标记已读</text>
		</view>
		<block v-for="(item,index) in msgList" :key="index">
			<view class="comment-msg-item">
				<navigator :url="'/pages/user/home?uid='+ item.from_uid" hover-class="none">
					<u-avatar class="avatar" :src="item.userInfo.avatar"></u-avatar>
				</navigator>
				<view class="msg-c">
					<view class="msg-c-t">
						<text class="username">{{item.userInfo.username}}</text>
						<text class="time">{{item.create_time | timeFrom}}</text>
					</view>
					<view class="msg-c-txt">
						<text>{{item.content}}</text>
						<text v-if="item.status === 0" class="dot"></text>
					</view>
					<navigator v-if="msgType != 2" :url="'/pages/post/detail?id='+item.post_id" hover-class="none">
						<view class="post-c">
							<view class="post-c-txt">{{item.postInfo.content}}</view>
						</view>
					</navigator>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msgType: 0,
				msgList: []
			};
		},
		onLoad(options) {
			this.msgType = options.type;
			this.getMsgList();
		},
		methods: {
			getMsgList() {
				this.$H.get("message/list", {
					type: this.msgType
				}).then(res => {
					this.msgList = res.result;
				})
			},
			readStatus() {
				let that = this;
				this.$H.get("message/status", {
					type: this.msgType
				}).then(res => {
					this.msgList.forEach(function(item, index) {
						that.msgList[index].status = 1;
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment-msg-item {
		display: flex;
		background-color: #fff;
		border-bottom: 1px solid #f5f5f5;
		padding: 20rpx;
	}
	.comment-msg-item .msg-c{
		width: 100%;
	}
	.comment-msg-item .avatar {
		margin-right: 10rpx;
	}
	
	.comment-msg-item .post-c {
		background-color: #eee;
		margin-top: 20rpx;
		padding: 20rpx;
		font-size: 12px;
		line-height: 1.8;
		border-radius: 10rpx;
	}
	
	.comment-msg-item .post-c .post-c-txt {
		text-overflow: ellipsis;
		display: -webkit-box;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
	}
	
	.comment-msg-item .msg-c {
		display: flex;
		flex-direction: column;
	}
	.comment-msg-item .msg-c .msg-c-t{
		display: flex;
	}
	
	.comment-msg-item .msg-c .msg-c-t .time{
		font-size: 10px;
		color: #999;
		margin-left: auto;
	}
	.comment-msg-item .msg-c .username {
		margin-bottom: 20rpx;
		color: #2B85E4;
	}
	.comment-msg-item .msg-c .msg-c-txt{
		display: flex;
		align-items: center;
	}
	.comment-msg-item .msg-c .msg-c-txt .dot{
		width: 10rpx;
		height: 10rpx;
		background-color: #FA3534;
		border-radius: 50%;
		display: block;
		margin-left: 20rpx;
	}
	
	/*标记已读*/
	.read-tips{
		padding: 20rpx;
		background-color: #ffffff;
		display: flex;
	}
	
	.read-tips text{
		margin-left: auto;
	}
</style>
