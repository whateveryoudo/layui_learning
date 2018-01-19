/**
 * @fileName : search.js
 * @author : ykx 
 * @createTime : 2018/1/13
 * @desc : 搜索页面
 */
import {$wuxToast} from '../../components/wux'
const configData = require('../../config/config');
Page({
    data : {
        searchKey : '',
        searchType : 'keyword',
        typeNames : ['默认','类型'],
        typeVals : ['keyword','tag'],
        hotKeyword : configData.hotKeyword,
        hotTag : configData.hotTag,
    },
    /*
     * @name changeSearchType
     * @param
     * @description 搜索类型切换
     */
    changeSearchType : function () {
        const that = this;
        wx.showActionSheet({
          itemList: that.data.typeNames,
          success:res => {
            !res.cancel && (()=> {
                that.setData({
                    searchType : that.data.typeVals[res.tapIndex]
                })
            })()
          }
        })
    },
    onLoad(){
        console.log(this);
    },
    /*
     * @name
     * @param
     * @description 点击搜索
     */
    toSearch(e){
        let keyword = e.detail.value.keyword;//获取输入的内容
        if(!keyword){
            $wuxToast.show({
                type: 'cancel',
                timer: 1500,
                color: '#fff',
                text: '请输入内容'
                // success: () => console.log('取消操作')
            })
            return;
        }
        wx.redirectTo({
          url: '../searchResult/searchResult?type=' +this.data.searchType + '&keyword=' + keyword
        })
    },
    /*
     * @name searchByWay
     * @param
     * @description  根据标签或者关键字搜索
     */
    searchByWay : function (e) {
        let data = e.currentTarget.dataset;
        let keyword = data.keyword;
        wx.redirectTo({
          url: '../searchResult/searchResult?type=' + data.type + '&keyword=' + keyword
        })


    }
})