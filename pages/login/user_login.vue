<template>
  <view class="content">
	  
    <view class="header">
		<u-image width="160rpx" height="160rpx" border-radius="80" src="/static/png/login_png/logo.png"></u-image>
      <!-- <image src="../../static/shilu-login/logo.png"></image> -->
    </view>
    <view class="list">
      <view class="list-call">
        <u-image class="img" width="40rpx" height="40rpx" src="/static/png/login_png/admin.png"></u-image>
        <u-input class="sl-input" v-model="admin" type="number" maxlength="11" placeholder="输入账号" />
      </view>
      <view class="list-call">
        <u-image class="img" width="40rpx" height="40rpx" src="/static/png/login_png/pwd.png"></u-image>
        <u-input class="sl-input" v-model="password" type="number" maxlength="11" placeholder="输入密码" password="true" />
      </view>
    </view>
	<!-- <navigator url="../polling/map"> -->
    <view class="button-login" hover-class="button-hover"@tap="fingerprint()">
      <text>登录</text>
    </view>
	<!-- </navigator> -->
  </view>
</template>
<script>

// import{login} from '../../api/employee-controller.js'
// import { Encrypt,Decrypt } from '../../js_sdk/cryptojs/secret.js'
  export default {
    data() {
      return {
        admin: null,
        password: null,
		employee:null,
		data1:null,
		result:"",
		disabled:true
      };
    },
	onLoad() {
		// #ifdef APP-PLUS
		if (!plus.fingerprint.isSupport()) {
			this.result = '此设备不支持指纹识别';
			this.disabled = true;
		}
		else if (!plus.fingerprint.isKeyguardSecure()) {
			this.result = '此设备未设置密码锁屏，无法使用指纹识别';
			this.disabled = true;
		}
		else if (!plus.fingerprint.isEnrolledFingerprints()) {
			this.result = '此设备未录入指纹，请到设置中开启';
			this.disabled = true;
		}
		else {
			this.result = '此设备支持指纹识别';
			this.disabled = false;
		}
		// #endif
		// #ifdef MP-WEIXIN
		this.disabled = false;
		this.result = '请在微信真机中使用，模拟器不支持';
		// #endif
		// #ifndef APP-PLUS || MP-WEIXIN
		this.result = '此平台不支持指纹识别';
		// #endif
	},
    methods: {
		//登录接口
		async login(employee){
			var that= this;
			let res=await login(employee);
			if(res.code==200 || res.data=='重复登录'){
				uni.showToast({
				  icon: 'none',
				  title: '登录成功'
				});
				uni.navigateTo({
				    url: '/pages/polling/map',
				});
			}
			else{
				console.log('登录失败');
				uni.showToast({
				  icon: 'none',
				  title: '账号或密码错误'
				});
			}
		},
		//登录判断
        bindLogin() {			
        if (this.admin == null || this.password ==null) {
          uni.showToast({
            icon: 'none',
            title: '请输入账号或密码'
          });
          return;
        }
		else{
			var that=this;
			that.employee={eaccount:this.admin,epassword:this.password};
			// this.login(that.employee);			
		}
      },
	  fingerprint: function() {
	  	// #ifdef APP-PLUS
	  	plus.fingerprint.authenticate(function() {
	  		plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
	  		uni.navigateTo({
	  		    url: '/pages/polling/map',
	  		});
	  	}, function(e) {
	  		switch (e.code) {
	  			case e.AUTHENTICATE_MISMATCH:
	  				plus.nativeUI.toast('指纹匹配失败，请重新输入');
	  				break;
	  			case e.AUTHENTICATE_OVERLIMIT:
	  				plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
	  				plus.nativeUI.alert('指纹识别失败次数超出限制，请使用其它方式进行认证');
	  				break;
	  			case e.CANCEL:
	  				plus.nativeUI.toast('已取消识别');
	  				break;
	  			default:
	  				plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
	  				plus.nativeUI.alert('指纹识别失败，请重试');
	  				break;
	  		}
	  	});
	  	// Android平台手动弹出等待提示框 
	  	if ('Android' == plus.os.name) {
	  		plus.nativeUI.showWaiting('指纹识别中...').onclose = function(){
	  			plus.fingerprint.cancel();
	  		}
	  	}
	  	// #endif
	  	
	  	// #ifdef MP-WEIXIN
	  	wx.startSoterAuthentication({
	  		requestAuthModes: ['fingerPrint'],
	  		challenge: '123456',
	  		authContent: '请用指纹解锁',
	  		success(res) {
	  			uni.showToast({
	  				title: '识别成功',
	  				mask: false,
	  				duration: 1500
	  			});
	  		}
	  	})
	  	// #endif
	  }
    }
  }
</script>
<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .header {
    width: 161rpx;
    height: 161rpx;
    background: rgba(63, 205, 235, 1);
    box-shadow: 0rpx 12rpx 13rpx 0rpx rgba(63, 205, 235, 0.47);
    border-radius: 50%;
    margin-top: 30rpx;
    margin-left: auto;
    margin-right: auto;
  }

  .header image {
    width: 161rpx;
    height: 161rpx;
    border-radius: 50%;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
    padding-left: 70rpx;
    padding-right: 70rpx;
  }

  .list-call {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    color: #333333;
    border-bottom: 0.5px solid #e2e2e2;
  }

  .list-call .img {
    width: 40rpx;
    height: 40rpx;
  }

  .list-call .sl-input {
    flex: 1;
    text-align: left;
    margin-left: 20rpx;
  }

  .button-login {
    color: #FFFFFF;
    font-size: 34rpx;
    width: 470rpx;
    height: 100rpx;
    background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
    box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
    border-radius: 50rpx;
    line-height: 100rpx;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100rpx;
  }

  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
  }

  .agreenment {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    margin-top: 80rpx;
    color: #FFA800;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }

  .agreenment text {
    font-size: 24rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
  }
</style>