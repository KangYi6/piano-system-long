//封装请求参数
import md5 from 'blueimp-md5'
import { getInfo } from '@/lib/common.js'
async function request({ method = "get", url, data = {}, params = {} }) {
	// const baseUrl = 'https://testmusic.thedream.tech' //测试服务器接口
	// const baseUrl = 'http://192.168.101.77:81' //本地接口
	const baseUrl = 'https://music.thedream.tech' //正式服务器接口
	//如果url没有前缀，则为其拼上前缀，主要解决nvue不能获取main中的属性问题
	if (url.indexOf("http") == -1) {
		url = baseUrl+url
	}
	//1、是否有服务器时间
	let serverTime = ''
	try { 
		let value = uni.getStorageSync('serverTime')
		if (value) {
			serverTime = value
		}
	} catch (e) {
		// error
	}
    if (!serverTime) {
		//转vue2后，uni.request请求返回为数组，且第一个值为null，特重新封装成promise
		http(baseUrl+'/piano/server/gettime.html','GET','').then(res=>{
			//服务器时间
			uni.setStorageSync('serverTime',res.data.time)
			//客户端时间
			uni.setStorageSync('clientTime',Math.round(new Date().getTime()/1000).toString())
		}).catch(err=>{
			uni.showToast({
				title:'获取服务器时间失败',
				icon:'none'
			})
		})
	}
    //2、先检查一下token是否过期
    if ((Number(Math.round(new Date().getTime()/1000).toString()) - Number(uni.getStorageSync('tokenTime'))) > 5400) {
        //获取用户信息缓存，里面有token
		let user = uni.getStorageSync('user')
		if (user !== 'undefined' && user != null && user != '') {
		    if (!user) {
		        return false;
		    }
		    let appid = user.u_appid
		    let secret = user.u_secret
			http(baseUrl+'/piano/login/gettoken.html','POST',reqdata({appid:appid,secret:secret})).then(res=>{
				// if(res.code == 1000){
					user.token = res.data.data
					uni.setStorageSync('user',user)
					uni.setStorageSync('tokenTime',res.data.time)
				// }
			}).catch(err=>{
				uni.showToast({
					title:'获取TOKEN失败',
					icon:'none'
				})
			})
		}
    }
	//3、执行接口请求
	return http(url,method,reqdata(data))
}

// 配置参数
function reqdata(data){
	//获取设备分辨率，判断设备类型，默认为平板
	let screenWidth = 1920
	let screenHeight = 1080
	let platform = 'android_pad'
	uni.getSystemInfo({
		success: function (res) {
			screenHeight = res.screenHeight
			screenWidth = res.screenWidth
		}
	});
	if (screenWidth > 1920) {
		platform = 'android_pad_max'
	} else if (screenWidth < 750) {
		platform = 'android_phone'
	}
	//配置公共参数
	let user = uni.getStorageSync('user');
	if (user === 'undefined' || user == null || user == '') {
	    data.token = '';
	} else {
	   data.token = user.token 
	}
	data.timestamp = Number(Math.round(new Date().getTime()/1000).toString()) - Number(uni.getStorageSync('clientTime')) + Number(uni.getStorageSync('serverTime'))
	data.nonce = randomString(12)
	data.paltform = platform //设备类型
	data.version = uni.getSystemInfoSync().appVersionCode //软件版本号
	// data.version = 100
	data.device = getInfo('mac') //获取设备MAC地址
	data.signature = md5(objKeySort(data).toUpperCase())
	return data
}

// 随机字符串
function randomString(length) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
    }
    return result
}

// 业务参数以字母升序（A-Z），并拼接成字符串
function objKeySort(arys) { 
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();　　 
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    var str = '';
    for(var i = 0; i < newkey.length; i++) {
        if (newkey[i] == 'signature') {
            continue;
        }
        //遍历newkey数组
        newObj[newkey[i]] = arys[newkey[i]]; 
        //向新创建的对象中按照排好的顺序依次增加键值对
        str += newkey[i]+"="+arys[newkey[i]]+'&'
    }
    str += 'key=thedream';
    return str;
}

function http(url,method,data){
	return new Promise((resolve,reject)=>{
		uni.request({
			url: url,
			method: method || 'GET',
			sslVerify:false,
			data: data ? reqdata(data) : '',
			header: {
				'content-type': 'application/json',
			},
			success: (res) => {
				resolve(res)
			},
			fail: (res) => {
				reject(res)
			}
		})
	})
}

export default request