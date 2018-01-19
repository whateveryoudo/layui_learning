/**
 * Created by Administrator on 2017/10/26.
 */

import {$wuxToast,$wuxLoading} from '../components/wux'
//简易封装wx网络请求
export default (url,paramsList = {},cb,failCb) => {
    let apiPrefix = (paramsList.urlType && paramsList.urlType == 'baidu')? 'https://api.map.baidu.com/' : 'https://api.douban.com/v2/',//默认地址前缀
        type = paramsList.type || 'GET',
        data = paramsList.data || {},
        isLoading = typeof paramsList.isLoading == 'boolean' ? paramsList.isLoading : true;
        type == 'GET' && function(){//get 拼接参数(微信自己会拼接参数)
            let paramStr = '';
            if(paramsList.isRestful){
                Object.keys(data).forEach(key => {
                    paramStr += data[key];
                })
                url = url + paramStr;
                data = {};//清空参数
            }else{
                Object.keys(data).forEach(key => {
                    paramStr += key + '=' + data[key] +'&';
                })
                if(paramStr !== ''){//凭借到url后面
                    paramStr = paramStr.substr(0,paramStr.lastIndexOf('&'));
                    url = url + '?' + paramStr;
                }
            }

        }();
    if(!isLoading){
        //调用自定义loading组件
        $wuxLoading.show();
    }
    //微信请求
    wx.request({
        url: apiPrefix + url, //仅为示例，并非真实的接口地址
        data: data,
        method : type,
        header: {//为什么这样写才能返回数据??
            "Content-Type": "application/json,application/json"
        },
        success: function(res) {//某些接口无状态码 这里不做请求错误的判断
            // if(res.statusCode == 200){
            //     typeof cb === 'function' && cb(res.data);
            // }else{//提示错误
            //     $wuxToast.show({
            //         type: 'cancel',
            //         timer: 1500,
            //         color: '#fff',
            //         text: '服务器异常...'
            //         // success: () => console.log('取消操作')
            //     })
            // }
            $wuxLoading.hide();

            typeof cb === 'function' && cb(res.data || res);
        },
        fail : function(){
            $wuxLoading.hide();
                $wuxToast.show({
                    type: 'cancel',
                    timer: 1500,
                    color: '#fff',
                    text: '服务器异常...',
                    success: () => {typeof failCb == 'function' && failCb()}
                })
        }
    })

}

