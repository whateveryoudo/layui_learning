/**
 * Created by Administrator on 2017/10/26.
 */
const config = require('../../config/config');
const app = getApp();
import {getDoubanFilms} from '../../service/getData'
Page({
    data : {
        curSkinData : [],
        start : 0,
        pageSize : 5,
        curSkin : '',
        hasMore : true
    },
    onLoad(){
        this.getData();
        //显示选中背景墙样式
        wx.getStorage({
            key: 'avatarSkin',
            success: res => {
                let _avatarSkin = res.data || config.skinList[0].imgUrl;
                this.setData({
                    curSkin : _avatarSkin
                })
            },
            fail : res => {
            }
        });
    },
    /*
     * @name getData
     * @param
     * @description 请求数据
     */
    getData(){
        let {curSkinData,start,pageSize,hasMore} = this.data;
        if(!hasMore){
            wx.stopPullDownRefresh();//关闭刷新
            return;
        }
        //判断是否到了最后一页
        if((start + pageSize) > config.skinList.length){
            let _mo = config.skinList.length % pageSize;
            pageSize =  _mo == 0 ? pageSize : _mo;
            this.setData({
                hasMore : false
            })
        }
        //模拟初始化数据（分页）
        this.setData({
            curSkinData : [...curSkinData,...config.skinList.slice(start,start + pageSize)]
        })
        wx.stopPullDownRefresh();//关闭刷新
    },
    /*
     * @name onReachBottom
     * @param
     * @description 上滑加载更多
     */
    onReachBottom(){
        let {start,pageSize} = this.data;
        this.setData({
            start : start + pageSize
        })
        this.getData();
    },
    /*
     * @name
     * @param
     * @description 下拉刷新更多
     */
    onPullDownRefresh(){
        //重置数据
        this.setData({
            curSkinData : [],
            start : 0,
            hasMore : true
        })
        this.getData();
    },
    /*
     * @name chooseSkin
     * @param
     * @description 选择背景墙(data-自定义属性 无驼峰)
     */
    chooseSkin(e){
        let data = e.currentTarget.dataset;
        if(data.imgurl){
            //存入本地（没有vuex这种。。）
            wx.setStorage({
                key : 'avatarSkin',
                data : data.imgurl,
                success : res => {
                    //返回上级界面（1层）
                    wx.navigateBack({
                        delta : 1,
                        success : res => {}
                    })
                }
            })
        }
    }
})
