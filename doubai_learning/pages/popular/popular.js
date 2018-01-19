/**
 * Created by Administrator on 2017/10/26.
 */
const config = require('../../config/config');
const app = getApp();
import {getDoubanFilms} from '../../service/getData'
Page({
    data : {
        bannerList : config.bannerList,
        // showLoading : true,//这里请求加载数据
        start : 0,
        hasMore : true,
        films : []//存储影片列表
    },
    onLoad(){
        let that = this;
        //设置顶部barloading状态
        wx.showNavigationBarLoading();
        //获取当前城市
        app.getCity((city) => {
            //存入config全局变量中
            city && (config.city = city);
            wx.hideNavigationBarLoading();//去除加载
            wx.setNavigationBarTitle({
                title : '正在热映 - ' + city
            })
            getDoubanFilms({
                data :{//处理影片列表
                    city : config.city,
                    start : that.data.start,
                    count : config.count
                }
            },that.optFilms)
        })
    },
    optFilms : function(res){//处理列表
        let that = this,filmsData = res.subjects;
        if(filmsData.length == 0){
            that.setData({
                hasMore : false
            })
        }else{
            //追加内容
            that.setData({
                films : [...that.data.films,...filmsData],
                start : that.data.start + filmsData.length
            })
        }
    },
    //下拉刷新内容
    onPullDownRefresh : function(){
        let that = this;
        that.setData({
            films : [],
            hasMore : true,
            start: 0
        })
        //重新请求数据(整个页面)
        that.onLoad();
    },
    viewFilmDetail : function(e){
        let data = e.currentTarget.dataset;
        wx.navigateTo({
            url : '../filmDetail/filmDetail?id=' + data.id
        })
    },
    //滑动到底部加载更多
    onReachBottom : function(){
        let that = this;
        //执行刷新filmList内容
        getDoubanFilms({
            data :{//处理影片列表
                city : config.city,
                start : that.data.start,
                count : config.count
            }
        },that.optFilms)
    },
    /*
     * @name bannerDetail
     * @param 
     * @description 跳转banner详细页面(search不知道)
     */
    viewBannerDetail : function (e) {
        //获取轮播类型
        let data = e.currentTarget.dataset;
        switch (data.type) {
            case 'film':
                wx.navigateTo({
                    url: '../filmDetail/filmDetail?id=' + data.id
                })
                break;
            case 'person':
                wx.navigateTo({
                    url: '../personDetail/personDetail?id=' + data.id
                })
                break;
        }
    },
    /*
     * @name search
     * @param
     * @description 跳转搜索影片页面
     */
    viewSearch : function () {
        wx.navigateTo({
            url : '../search/search'
        })
    }
})
