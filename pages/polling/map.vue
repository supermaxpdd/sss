<template>
	<view >
	<u-navbar title-color="#fdffff" :is-back="false" title="二维码巡检" :background="background">
		<u-icon @click="sideslip()"  name="account-fill" style="margin-left: 35rpx" size="36"></u-icon>
	</u-navbar>
	<map class="map"
		 id="map1"
	     :latitude="latitude"
		 :longitude="longitude"
		 :markers="markers"
		 :scale="scale"
		 :polyline="polyline"
		 enable-zoom="false"
		 :show-location="true"
		 @markertap="markertap">
	 <cover-view class="cover-view"  @click="onControltap()"></cover-view>
	</map>
	</view>
</template>
<script>
	//路线规划文件
	import map from '../../js_sdk/json-draw-map/draw-map/draw-map.js';
	export default{
		data(){
			return{
				map1:0,
				title:'map1',
				latitude:this.latitude,
				longitude:this.longitude,
				scale:16,
				juli:this.juli,
				markers:[{},{},{}],
				polyline:[{
					points:[
						{},
					],
				}],
				background: {
				  backgroundImage:
				    "linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))",
				}
			}
		},
		onShow() {
			var that=this;
			this.getLocation();
			// #ifdef APP-PLUS
				//动态指针
				const lp=uni.getSubNVueById('lp');
				lp.show();
				//按钮
				const menu=uni.getSubNVueById('menu');
				menu.show();
				//机器信息
				const macinfo=uni.getSubNVueById('macinfo');
				macinfo.hide();
				//扫描信息
				const prompt=uni.getSubNVueById('prompt');
				prompt.hide();
			// #endif
		},
		methods:{
			//获取当前位置
			getLocation(){
				const that=this;
				uni.getLocation({
				    type: 'wgs84',
				    success: function (res) {
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.polyline[0].points[0].latitude=res.latitude;
						that.polyline[0].points[0].longitude=res.longitude;
						let arr =[
						    {
						        id:1,
						        longitude:res.longitude,
						        latitude:res.latitude,
						        name:res.address
						    }
						]
						let markers = []
						let tpimg='../../static/png/map_png/mac.png'
						for (var i=0;i<arr.length;i++){
						    markers=markers.concat({
						        id:arr[i].id,
						        latitude: arr[i].latitude,//纬度
						        longitude: arr[i].longitude,//经度
								iconPath: '../../static/png/map_png/zb.png'
								// color:'#ffffff'
						    },
							{	
								id:2,
								latitude:37.867317,
								longitude:113.632957,
								iconPath: tpimg,
								title:'巡检二号',
							},
							{
								id:3,
								latitude:37.862317,
								longitude:113.637957,
								iconPath: tpimg,
								title:'巡检三号'
							},
							{
								id:4,
								latitude:37.861317,
								longitude:113.631957,
								iconPath: tpimg,
								title:'巡检四号'
							},
							{
								id:5,
								latitude:37.862317,
								longitude:113.627957,
								iconPath: tpimg,
								title:'巡检五号'
							},
							{
								id:6,
								latitude:37.865317,
								longitude:113.621957,
								iconPath: tpimg,
								title:'巡检六号'
							},
							{
								id:7,
								latitude:37.866017,
								longitude:113.629957,
								iconPath: tpimg,
								title:'巡检七号'
							},
							{
								id:8,
								latitude:37.861317,
								longitude:113.621957,
								iconPath: tpimg,
								title:'巡检八号'
							},
							{
								id:9,
								latitude:37.863217,
								longitude:113.620957,
								iconPath:tpimg,
								title:'巡检九号'
							},
							{
								id:10,
								latitude:37.863517,
								longitude:113.615957,
								iconPath: tpimg, 
								title:'巡检十号'
							})
						}
						that.markers=markers;
				    },
				});
			},
			//点击返回当前位置
			onControltap(control) {
				   var that=this;
			      uni.createMapContext("map1", this).moveToLocation({
			        longitude: this.longitude,
			        latitude: this.latitude
				});
			},
			//路线规划
			lxgh(lat,lon){
				var that=this;
				this.polyline = [{
					points:[
						{latitude:this.latitude,longitude:this.latitude},
					],
				}];
				//开始经纬度
				const origin ={
					latitude: this.latitude,
					longitude: this.longitude
				};
				//结束经纬度
				const destination = {
					latitude: lat,
					longitude: lon,
				};
				map.drawRoute(this,origin,destination);
			},
			//点击计算距离并形成路线规划
			markertap(e) {
				var that=this;
				let markers = [];
				// console.log(this.markers[e.detail.markerId-1]);
				//计算距离
				 var lon1 = (Math.PI / 180) * this.longitude;//开始经度
				 var lon2 = (Math.PI / 180) * this.markers[e.detail.markerId-1].longitude;//结束经度
				 var lat1 = (Math.PI / 180) * this.latitude;//开始纬度
				 var lat2 = (Math.PI / 180) * this.markers[e.detail.markerId-1].latitude;//结束纬度
				 // 地球半径
				 var R = 6371;
				 // 两点间距离 km，如果想要米的话，结果*1000就可以
				 var d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R;
				 var d1=d*1000;
				 // console.log(d1);
				 const subNVue1=uni.getSubNVueById('macinfo');
				 subNVue1.show();
				 //根据原生子窗体id给页面传值
				 uni.$emit('macinfo', {
					 id:this.markers[e.detail.markerId-1].id,
				     title: this.markers[e.detail.markerId-1].title,  
				     jl: d1,
					 lat:this.latitude,
					 lat1:this.markers[e.detail.markerId-1].latitude,
					 lon:this.longitude,
					 lon1:this.markers[e.detail.markerId-1].longitude
				 });
				 var la1=this.markers[e.detail.markerId-1].latitude;
				 var lo1=this.markers[e.detail.markerId-1].longitude;
				 this.lxgh(la1,lo1);
				 uni.$on('juli',(data)=>{
				 	// console.log(data.ju)
				 	that.juli=data.ju;
				 	// console.log(that.juli)
				 })
				 // console.log(this.juli)
			},
			//侧滑菜单
			sideslip(){
				const sideslip_menu=uni.getSubNVueById('drawer');
				sideslip_menu.show('slide-in-left',350);
			}
		}
	}
</script>

<style>
.map{
	width: 750rpx;
	height: 1474rpx;
}
.cover-view {
	width: 85rpx;
	height: 85rpx;
	border-radius: 60%;
	background: #ffffff;
	position: absolute;
	bottom: 21px;
	right: 27px;
}


</style>
