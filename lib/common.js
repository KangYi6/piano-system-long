var platform = uni.getSystemInfoSync().platform;
//获取设备MAC地址（设备序列号）
function serial() {
	var serial = "xxx-xxx-xxx-xxx"
	if (platform == 'ios') {
		return serial
	} else if (platform == 'android') {
		var Build = plus.android.importClass("android.os.Build");
		var Manifest = plus.android.importClass("android.Manifest");
		var MainActivity = plus.android.runtimeMainActivity();
		var SystemProperties = plus.android.importClass("android.os.SystemProperties")
		var serial = ''				
	   	if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) { //9.0+
			var ArrPermissions = [
				Manifest.permission.READ_PHONE_STATE,
			];
			function PermissionCheck(permission) {
				if (Build.VERSION.SDK_INT >= 23) {
					if (MainActivity.checkSelfPermission(permission) == -1) {
						return false;
					} 
				}
				return true;
			}
			function PermissionChecks(Arr) {
				var HasPermission = true;
				for (var index in Arr) { 
					var permission = Arr[index];
						//如果此处没有权限,则是用户拒绝了
					if (!PermissionCheck(permission)) {
						HasPermission = false;
						break;
					}
				}
				return HasPermission;
			}
			function PermissionRequest(Arr) {
				var REQUEST_CODE_CONTACT = 101;
				if (Build.VERSION.SDK_INT >= 23) {
					MainActivity.requestPermissions(Arr, REQUEST_CODE_CONTACT);
				}
			}
			//如果没有权限，则申请权限
			if (!PermissionChecks(ArrPermissions)) {
				PermissionRequest(ArrPermissions);//此处申请权限，会弹出一个让你授权可获取设备号信息权限框
			} else { //如果拥有权限
				serial = Build.getSerial()
			}
		} else if (Build.VERSION.SDK_INT > Build.VERSION_CODES.N) { //8.0+
			if (Build.SERIAL) {
				serial = Build.SERIAL;
			}
		} else {
			if (SystemProperties.get('ro.serialno')) {
				serial = SystemProperties.get('ro.serialno')
			}
		}
		//转大写，用分号分隔
		var aaa = serial.toUpperCase()
		var bbb = [...aaa];
		var ccc = aaa.split('');
		var a, b;
		var aIndex = 0;
		var bIndex = 1;
		var arr = [];
		bbb.forEach((str, index) => {
			if (index % 2 === 0) {
				a = str;
				aIndex += 1 
			} else {
				b = str
				bIndex += 1
			}
			if (a&&b&&(bIndex-aIndex === 1)) {
				arr.push(a+b)
			}
		});
		serial = arr.join(':')
		return serial
	} else {
		serial = 'windows'
	}
	return serial
}

//总存储
function totalMemorySize() {
	var internalMemSize = 0;
	if (platform == 'android') {
		var environment = plus.android.importClass("android.os.Environment")
		var statFs = plus.android.importClass("android.os.StatFs")
		var files = plus.android.importClass("java.io.File")
		var Files = environment.getDataDirectory()
		var StatFs = new statFs(Files.getPath())
		var blockSize = parseFloat(StatFs.getBlockSize())
		var blockCount = parseFloat(StatFs.getBlockCount())
		internalMemSize = blockSize * blockCount
		internalMemSize = Math.floor(internalMemSize/1024/1024/1024)
	}
	return internalMemSize;
}

//可用存储
function memorySize(unit = 'g') {
	var FreeSize = 0;
	if (platform == 'android') {
		var internalMemSize = 0;
		var FreeSize = 0;
		     var environment = plus.android.importClass("android.os.Environment");  
		     var statFs = plus.android.importClass("android.os.StatFs");  
		     plus.android.importClass("java.io.File");
		     var Files = environment.getDataDirectory();  
		     var StatFs = new statFs(Files.getPath());  
		     var blockAva = parseFloat(StatFs.getAvailableBlocks());
					var blockSize= parseFloat(StatFs.getBlockSize());
		     internalMemSize = blockSize*blockAva;   
		 FreeSize = unit == 'm' ? internalMemSize/1024/1024 : internalMemSize/1024/1024/1024;
	} else {
		var BundleClass = plus.ios.importClass("NSBundle");
		var BundleObj = BundleClass.mainBundle();
		var filenamagerobj = plus.ios.newObject("NSFileManager");
		var FileAttr = plus.ios.invoke(filenamagerobj, "attributesOfFileSystemForPath:error:", BundleObj.bundlePath(), null);
		var FreeSize = plus.ios.invoke(FileAttr, "objectForKey:", "NSFileSystemFreeSize");
		var numberFormatterObj = plus.ios.newObject("NSNumberFormatter");
		var FreeSizeStr = plus.ios.invoke(numberFormatterObj, "stringFromNumber:", FreeSize);
		var FreeSize = unit == 't' ? FreeSizeStr / 1024 / 1024 : FreeSizeStr / 1024 / 1024/ 1024;
	}
	return FreeSize.toFixed(1);
}

//总内存
function totalRamSize() {  
    var memInfo = '/proc/meminfo';  
    var temp = '',  
        ramSize = '',  
        arrays, initMemory;  
    var fileReader = plus.android.importClass("java.io.FileReader");  
    var bufferedReader = plus.android.importClass("java.io.BufferedReader");  
    var FileReader = new fileReader(memInfo);  
    var BufferedReader = new bufferedReader(FileReader, 8192);  
    while ((temp = BufferedReader.readLine()) != null) {  
        if (-1 != temp.indexOf('MemTotal:')) {  
            var value = temp.replace(/[^0-9]/ig, "");  
            ramSize = Math.ceil(parseInt(value) / (1024) / (1024));  
        }  
    }  
    return ramSize;  
}

//可用内存
function ramSize() {
	var ramInfo = 0
	if (platform == 'android') {
		var Context = plus.android.importClass("android.content.Context")
		var ActivityManager = plus.android.importClass("android.app.ActivityManager")
		var mi = new ActivityManager.MemoryInfo()
		var activityService = plus.android.runtimeMainActivity().getSystemService(Context.ACTIVITY_SERVICE)
		activityService.getMemoryInfo(mi)
		ramInfo = (mi.plusGetAttribute("availMem") / 1024 / 1024 / 1024).toFixed(1)
	}
	return ramInfo
}

//IP地址
function ipAddr(){
	var ip = '127.0.0.1'
	// 导入网络接口类
	var NetworkInterface = plus.android.importClass("java.net.NetworkInterface")  
	// 导入InetAddress类  
	var InetAddress = plus.android.importClass("java.net.InetAddress")  
	// 导入Inet4Address类  
	var Inet4Address = plus.android.importClass("java.net.Inet4Address")  
	// 定义变量，获取网络接口  
	var networkInterface = NetworkInterface.getNetworkInterfaces()  
	// 遍历网络接口  
	while (plus.android.invoke(networkInterface, 'hasMoreElements')) {  
	    var networkInterfaceElement = plus.android.invoke(networkInterface, 'nextElement')  
	     // 获取各个网络接口的地址  
	    var inetAddresses = plus.android.invoke(networkInterfaceElement, 'getInetAddresses')  
	     // 遍历从各个网络接口获取的地址  
	    while (plus.android.invoke(inetAddresses, 'hasMoreElements')) {  
	        var inetAddressesElement = plus.android.invoke(inetAddresses, 'nextElement')  
	        // 判断获取的地址不是环回接口的地址并且属于IPv4地址  
	        if (!plus.android.invoke(inetAddressesElement, 'isLoopbackAddress') && inetAddressesElement instanceof Inet4Address) {  
	            // 获取主机地址  
	            ip = plus.android.invoke(inetAddressesElement, 'getHostAddress')  
	        }  
	    }  
	}
	return ip
}


/*获取CPU信息*/
function getCpuInfo() {
	var cpuInfo = '/proc/cpuinfo';
	var temp = '',
		cpuHardware;
	var fileReader = plus.android.importClass("java.io.FileReader");
	var bufferedReader = plus.android.importClass("java.io.BufferedReader");
	var FileReader = new fileReader(cpuInfo);
	var BufferedReader = new bufferedReader(FileReader, 8192);
	while ((temp = BufferedReader.readLine()) != null) {
		if (-1 != temp.indexOf('Hardware')) {
			cpuHardware = temp.substr(parseInt(temp.indexOf(":")) + 1);
		}
	}
	return cpuHardware;
}

/*获取CPU核数*/
function getCpuCount() {
	var Runtime = plus.android.importClass("java.lang.Runtime");
	var cpuCount = Runtime.getRuntime().availableProcessors();
	return cpuCount;
}

//版本号
function versionCode() {
	if (platform == 'ios') {
		return 0
	} else if (platform == 'android') {
		plus.runtime.getProperty(plus.runtime.appid, function(info) {
			// console.log(info)
			return info.versionCode
		});
	} else {
		return 0
	}
}
//版本名
function versionName(){
	// 获取本地应用资源版本号
	plus.runtime.getProperty(plus.runtime.appid, function(inf) {
		callback && callback({
			versionCode: inf.version.replace(/\./g, ""),
			version: inf.version
		});
	});
}

/**
 * 获取设备信息
 * mac MAC地址
 * memorysize 总内存
 * totalinternalmemorysize 总存储
 * ipAddr IP地址
 * 
 * totalramsize 获取总内存
 * cpuinfo CPU信息
 * cpucount CPU核数
 */
function getInfo(type) {
	switch (type){
		case 'totalRamSize': //总内存
			return totalRamSize()
			break;
		case 'ramSize': //可用内存
			return ramSize()
			break;
		case 'totalMemorySize': //总存储
			return totalMemorySize()
			break;
		case 'memorySize': //可用存储
			return memorySize()
			break;
		case 'mac': //MAC序列号
			return serial()
			break;
		case 'ipAddr': //IP地址
			return ipAddr()
			break;
		case 'versioncode': //版本号
			return versionCode()
			break;
		case 'versionname': //版本名
			return versionName()
			break;
		default:
			break;
	}
}

/*获取WIFI列表 获取wifi都需要添加两个位置权限*/
function loadWifiInfo() {
	var Context = plus.android.importClass("android.content.Context");
	var WifiManager = plus.android.importClass("android.net.wifi.WifiManager")
	var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
	var List = plus.android.importClass("java.util.List");
	var ArrayList = plus.android.importClass("java.util.ArrayList");
	var ScanResult = plus.android.importClass("android.net.wifi.ScanResult");
	var wifis = new ArrayList();
	wifis = wifiManager.getScanResults();
	return wifis;
}

/*打开网络设置*/
function netSet() {
	if (isIos) {
		return '待完善';
	} else {
		var main = plus.android.runtimeMainActivity();
		var Intent = plus.android.importClass("android.content.Intent");
		var mIntent = new Intent('android.settings.WIFI_SETTINGS');
		main.startActivity(mIntent);
	}
}

/**
 * 拼接参数
 */
function param(url,data){
	var path = '';
	if (Object.keys(data).length) {
		for (let key in data) {
			if (path) {
				path += '&'+key+'='+data[key]
			} else {
				path += url+'?'+key+'='+data[key]
			}
		}
	} else {
		path = url
	}
	return path
}

export {
	getInfo,
	loadWifiInfo,
	netSet,
	param
}
