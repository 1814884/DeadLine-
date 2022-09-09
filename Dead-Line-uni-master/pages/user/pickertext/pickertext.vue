<template>
	<view class="address">
	  <view class="address-left">地区：</view>
	  <view bindtap="showPicker" class="address-right {{flag?'':'placeholder'}}">
	    <block wx:if="{{flag}}">{{address}}</block>
	    <block wx:else>请选择所在地</block>
	  </view>
	</view>
	 
	<form bindsubmit="inputValue">
	  <input name="addressValue" hidden="t" value="{{provinceName[provinceIndex]}} {{cityName[cityIndex]}} {{countyName[countyIndex]}}"></input>
	  <button form-type="submit"  disabled="{{!flag}}" class="add-btn" type="primary">提交</button>
	</form>
	 
	<view class="picker-content" hidden="{{show}}">
	  <view class="picker-btn">
	    <view bindtap="cansel">取消</view>
	    <view bindtap="sure">确定</view>
	  </view>
	  <picker-view class="picker-list" bindchange="pickerChange">
	    <picker-view-column><view class="item" wx:for="{{provinceName}}" wx:key="item">{{item}}</view></picker-view-column>
	    <picker-view-column><view class="item" wx:for="{{cityName}}" wx:key="item">{{item}}</view></picker-view-column>
	    <picker-view-column><view class="item" wx:for="{{countyName}}" wx:key="item">{{item}}</view></picker-view-column>
	  </picker-view>
	</view>
	 
	<view bindtap="cansel" class="mask" hidden="{{show}}"></view>
</template>

<script>
	// pages/pickertext/pickertext.js
	Page({
	 
	  /**
	   * 页面的初始数据
	   */
	  data: {
	    flag:false,
	    show:true,
	    provinceName:[],
	    provinceIndex:'',
	 
	    cityName:[],
	    cityIndex:'',
	 
	    countyName:[],
	    countyIndex:'',
	 
	    address:'',
	 
	    pro:0,
	    cit:0,
	    cou:0
	  },
	 
	  /**
	   * 生命周期函数--监听页面加载
	   */
	  onLoad: function (options) {
	    this.setSource();
	  },
	 
	  setSource:function(pro,cit){
	    var pro = pro || 0;
	    var cit = cit || 0;
	    var source = {
	      100000: { 110000: "北京", 120000: "天津", 130000: "河北", 140000: "海南", 150000: "上海" },
	      110000: { 110100: "北京市辖区", 110200: "北京市外辖区" },
	      140000: { 140100: "海口", 140200: "三亚" },
	      150000: { 150100: "浦东区"},
	      110100: { 110101: "东城区", 110102: "西城区" },
	      140100: { 140101: "秀英", 140102: "美兰" }
	    };
	    var province = source[100000];
	    // console.log(province);
	    var provinceName = [];
	    var provinceCode = [];
	 
	    for(var i in province){
	      provinceCode.push(i);
	      provinceName.push(province[i]);
	    }
	 
	    var city = source[provinceCode[pro]];
	    var cityName = [];
	    var cityCode = [];
	    for(var i in city){
	      cityCode.push(i);
	      cityName.push(city[i]);
	    }
	    
	    var county = source[cityCode[cit]];
	    var countyName = [];
	    var countyCode = [];
	    for(var i in county){
	      countyCode.push(i);
	      countyName.push(county[i]);
	    }
	 
	    this.setData({
	      provinceName:provinceName,
	      cityName:cityName,
	      countyName:countyName
	    })
	  },
	 
	  showPicker:function(){
	    this.setData({
	      show:false
	    })
	  },
	 
	  pickerChange:function(e){
	    console.log(e);
	    var pro = e.detail.value[0];
	    var cit = e.detail.value[1];
	    var cou = e.detail.value[2];
	    this.setSource(pro,cit);
	    this.setData({
	      pro:pro,
	      cit:cit,
	      cou:cou
	    })
	  },
	 
	  sure:function(){
	    var myProvince = this.data.provinceName[this.data.pro];
	    var myCity = this.data.cityName[this.data.cit];
	    var myCounty = this.data.countyName[this.data.cou];
	    var address = '';
	    
	    if (myProvince != undefined & myCity != undefined & myCounty != undefined){
	      address = myProvince + myCity + myCounty;
	    }
	    if (myProvince != undefined & myCity == undefined & myCounty == undefined) {
	      address = myProvince;
	    }
	    if (myProvince != undefined & myCity != undefined & myCounty == undefined) {
	      address = myProvince + myCity;
	    }
	    
	 
	    this.setData({
	      //这个会出现undefind
	      // provinceIndex:this.data.provinceName[this.data.pro],
	      // cityIndex: this.data.cityName[this.data.cit],
	      // countyIndex: this.data.countyName[this.data.cou],
	 
	      //会导致按钮没按，地区那里也会变
	      // provinceIndex:this.data.pro,
	      // cityIndex:this.data.cit,
	      // countyIndex:this.data.cou,
	 
	      address: address,
	      flag: true,
	      show: true
	    });
	    // this.cansel();
	  },
	 
	  cansel:function(){
	    this.setData({
	      show:true
	    })
	  },
	 
	  inputValue:function(e){
	    console.log(e.detail);
	  }
	 
	  
	})
</script>

<style>
	page{
	  background-color: rgb(245, 245, 245);
	}
	.address{
	  padding:5px 10px;
	  background-color: #fff;
	  display: flex;
	  justify-content: space-between;
	}
	.address-right{
	  flex-grow: 1;
	  padding-left:10px;
	}
	.placeholder{
	  color: #aaa;
	}
	.add-btn{
	  margin-top:100rpx;
	}
	.picker-content{
	  position:fixed;
	  bottom: 0;
	  width: 750rpx;
	  z-index: 10;
	}
	.picker-btn{
	  line-height: 31px;
	  background-color: skyblue;
	  display: flex;
	  justify-content: space-between;
	  color: #fff;
	  padding:0 10px;
	}
	.picker-list{
	  height: 500rpx;
	  background: #fff;
	}
	.item{
	  text-align: center;
	  line-height: 34px;
	}
	.mask{
	  position: absolute;
	  top:0;
	  left:0;
	  right:0;
	  bottom: 0;
	  background-color: rgba(0, 0, 0, .5)
	}
</style>