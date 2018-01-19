/**
 * Created by Administrator on 2017/10/26.
 */
const config = require('../../config/config');
const app = getApp();
import {getLocation} from '../../service/getData'
Page({
    data : {
        mapCtx : null,//创建并返回 map 上下文 mapContext 对象
        locaDesc : '',//当前地理位置信息
        latitude : '',
        longitude : '',
        markers : [],
        polyline  : [],
        controls : [],
        isLoading : false//重新定位 loading
    },
    onLoad(){
        this.initLocation();
    },
    onReady(){
        this.setData({
            mapCtx : wx.createMapContext('myMap')
        })
    },
    /*
     * @name getCenterLocation
     * @param
     * @description 获取中心点经纬度
     */
    getCenterLocation(){
        this.data.mapCtx.getCenterLocation({
            success : res => {
                console.log(res.longitude);
                console.log(res.latitude);
            }
        })
    },
    /*
     * @name moveToLocation
     * @param
     * @description 中心移动到当前定位点
     */
    moveToLocation(){
        this.data.mapCtx.moveToLocation()
    },
    /*
     * @name translateMarker
     * @param
     * @description 平移marker
     */
    translateMarker(){
        this.data.mapCtx.translateMarker({
            markerId : 0,
            autoRotate : true,
            duration : 1000,
            destination : {
                latitude : this.data.latitude + 0.001,
                longitude : this.data.longitude + 0.001,
            },
            animationEnd(){
                console.log("动画结束")
            }
        })
    },
    /*
     * @name includePoints
     * @param
     * @description 缩放视野所有的经纬度
     */
    includePoints(){
        this.data.mapCtx.includePoints({
            padding: [10],
            points: [{
                latitude:23.10229,
                longitude:113.3345211,
            }, {
                latitude:23.00229,
                longitude:113.3345211,
            }]
        })
    },
    /*
     * @name updateLocation
     * @param
     * @description 重新定位
     */
    updateLocation(){
        this.setData({
            isLoading : true
        })
        this.initLocation();
    },
    /*
     * @name initLocation
     * @param
     * @description 初始化/刷新地理位置信息
     */
    initLocation(){
        wx.getLocation({
            type: 'gcj02',//默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标(微信内置地图)
            success: res => {
                //跟新地图内容
                let {latitude,longitude} = res;
                this.setData({
                    latitude,
                    longitude
                })
                var locationParam = latitude + ',' + longitude + '1';
                //调用百度地图api,获取地理位置信息
                getLocation({
                    urlType : 'baidu',
                    isLoading : false,
                    data : {
                        ak: config.baiduAK,
                        location: locationParam,
                        output: 'json',
                        pois: '1'
                    }
                }, res => {
                    this.setData({
                        locaDesc : res.result.formatted_address,
                        isLoading : false
                    })
                })
                //初始化覆盖物

                let markerInfoArr = [{
                    iconPath : '/assets/icons/location.png',
                    id : 0,
                    latitude,
                    longitude,
                    width:32,
                    height:32,
                    callout : {
                        content : '我是测试气泡而已',
                        color:'#333',
                        display : 'ALWAYS',
                        borderRadius : 5,
                        bgColor : 'red',
                        textAlign : 'center'
                    },
                    label : {
                        content : '我是注标额',
                        color:'#333',
                        display : 'ALWAYS',
                        x : 0,
                        y : 0,
                        borderRadius : 5,
                        bgColor : 'red',
                        textAlign : 'center'
                    }
                }]
                this.setData({
                    markers : markerInfoArr
                })
                //测试路线
                this.setData({
                    polyline : [{
                        points: [{
                            latitude,
                            longitude,
                        }, {
                            longitude: latitude + 1,
                            latitude: longitude + 2
                        }],
                        color:"#47a86c",
                        width: 2,
                        dottedLine: true
                    }]
                })
                //测试控件
                this.setData({
                    controls : [{
                        id : 1 ,
                        iconPath : '/assets/icons/company.png',
                        position: {
                            left: 0,
                            top: 0,
                            width: 50,
                            height: 50
                        },
                        clickable: true
                    }]
                })

            },
            fail: res => {

            }
        })
    }
})
