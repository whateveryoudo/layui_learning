/**
 * Created by Administrator on 2017/10/26.
 */
const config = require('./config/config');
import {getLocation} from 'service/getData'
import wxValidate from 'util/wxValidate'
import {$wuxToast,$wuxLoading} from './components/wux'//添加插件
import {initStorageData} from './util/storageInitData'
//为啥只有这两个生命周期能进入
App({
    globalData : {
        userInfo : null
    },
    onLaunch() {
        //获取用户信息
        this.getUserInfo();
        //初始化缓存信息
        this.initStorage();
    },
    onShow() {
        console.log('onShow')
    },

    /*
     * @name getUserInfo
     * @param
     * @description 获取用户信息
     */
    getUserInfo(cb){
        wx.login({
            success : res => {
                wx.getUserInfo({
                    success : res => {
                        this.globalData.userInfo = res.userInfo;
                        //存入本地存储中
                        wx.setStorage({
                          key : "userInfo",
                          data : res.userInfo
                        });
                        typeof cb === 'function' && cb(res.userInfo);
                    }
                })
            }
        })
    },
    initStorage(){

        //添加数组中是否包含某个元素的方法
        Array.prototype.contains = function(needle){
            for(var i in this){
                if(this[i] == needle){return true}
            }
            return false;
        }

        //初始化所有存储默认值
        initStorageData.forEach(item => {
            let {key,data} = item;
            key && (() => {
                wx.getStorageInfo({
                    success: res => {
                        !(res.keys.contains[key]) && (() => {
                            wx.setStorage({
                                key,
                                data
                            })
                        })()
                    }
                });
            })()
        })

    },
    getCity(cb){
        const that = this;
        wx.getLocation({
            type : 'gcj02',
          success: res => {
              const locationParam = res.latitude + ',' + res.longitude + '1';
              //获取当前城市（调用百度地图api）
              getLocation({
                  urlType : 'baidu',
                  isLoading : false,
                  data : {
                      ak: config.baiduAK,
                      location: locationParam,
                      output: 'json',
                      pois: '1'
                  }
              },function(res){
                    let city = res.result.addressComponent.city.slice(0,-1);
                    typeof cb === 'function' && cb(city);
              },function(){
                  that.getCity();//重新获取
              })
          }
        })
    },
    //添加插件集(需要引用的地方引入app对象即可)
    $wuxToast,$wuxLoading,
    /*
     * @name
     * @param
     * @description 构建验证插件类
     */
    wxValidate: (rules, messages) => {

        return new wxValidate(rules, messages)
    },
})