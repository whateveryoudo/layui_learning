/**
 * @fileName : searchResult.js
 * @author : ykx
 * @createTime : 2018/1/13
 * @desc : 搜索结果界面
 */
const config = require('../../config/config');

import {searchFilmList} from '../../service/getData'
Page({
    data : {
        isNull : true,
        films : [],
        hasMore : true,
        apiUrl : '',
        nullObj : {
            desText : 'sorry，没有找到您要的内容，换个关键词试试吧',
            actionText : '返回',
            backUrl : '../../pages/search/search'
        },
        start : 0
    },
    onLoad(options){

        var that = this;
        // var options = {type : 'keyword',keyword : '啊啊啊'};
        //获取数据
        let {type,keyword} = options;

        keyword = decodeURIComponent(keyword);
        let tempUrl = 'movie/search' + (type == 'keyword' ? '?q=' : '?tag=')+ keyword;
        tempUrl && (() => {
            that.setData({
                apiUrl : tempUrl
            })
        })()
        that.getData();
    },
    /*
     * @name
     * @param
     * @description 请求数据
     */
    getData(){
        searchFilmList(this.data.apiUrl,{
            data :{//处理影片列表
                start : this.data.start,
                count : config.count
            }
        },this.optFilms)
    },
    /*
     * @name optFilms
     * @param
     * @description 处理搜索结果
     */
    optFilms : function(res){
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
        wx.stopPullDownRefresh();//关闭刷新
    },
    //滑动到底部加载更多
    onReachBottom : function(){
        //执行刷新filmList内容
        this.getData();
    },
    /*
     * @name onPullDownRefresh
     * @param
     * @description 下拉刷新内容
     */
    onPullDownRefresh(){
        //先清除之前的内容
        this.setData({
            films : [],
            hasMore : true,
            start : 0
        })
        this.getData();
    },
    /*
     * @name viewFilmDetail
     * @param
     * @description 跳转影片详情
     */
    viewFilmDetail : function(e){
        let data = e.currentTarget.dataset;
        wx.navigateTo({
            url : '../filmDetail/filmDetail?id=' + data.id
        })
    }
})
