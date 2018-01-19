/**
 * Created by Administrator on 2017/10/29.
 */
import {getFilmDetailInfo} from '../../service/getData'
import util from '../../util/util'
Page({
    data : {
        filmDetail : {}
    },
    onLoad(options){
        let that = this,id = options.id;
        //获取到对应影片详情
        getFilmDetailInfo({
            isRestful : true,
            data : {
                id
            }
        },getDetailSuc);
        function getDetailSuc(data) {
            // data = {"rating": {"max": 10, "average": 6.4, "stars": "35", "min": 0}, "reviews_count": 181, "wish_count": 8498, "douban_site": "", "year": "2017", "images": {"small": "https://img3.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2501769525.jpg", "large": "https://img3.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2501769525.jpg", "medium": "https://img3.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2501769525.jpg"}, "alt": "https:\/\/movie.douban.com\/subject\/22266012\/", "id": "22266012", "mobile_url": "https:\/\/movie.douban.com\/subject\/22266012\/mobile", "title": "\u5168\u7403\u98ce\u66b4", "do_count": null, "share_url": "https:\/\/m.douban.com\/movie\/subject\/22266012", "seasons_count": null, "schedule_url": "https:\/\/movie.douban.com\/subject\/22266012\/cinema\/", "episodes_count": null, "countries": ["\u7f8e\u56fd"], "genres": ["\u52a8\u4f5c", "\u79d1\u5e7b", "\u707e\u96be"], "collect_count": 14429, "casts": [{"alt": "https:\/\/movie.douban.com\/celebrity\/1040500\/", "avatars": {"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p4940.jpg", "large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p4940.jpg", "medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p4940.jpg"}, "name": "\u6770\u62c9\u5fb7\u00b7\u5df4\u7279\u52d2", "id": "1040500"}, {"alt": "https:\/\/movie.douban.com\/celebrity\/1053559\/", "avatars": {"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p28071.jpg", "large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p28071.jpg", "medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p28071.jpg"}, "name": "\u5409\u59c6\u00b7\u65af\u7279\u5409\u65af", "id": "1053559"}, {"alt": "https:\/\/movie.douban.com\/celebrity\/1040985\/", "avatars": {"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p20016.jpg", "large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p20016.jpg", "medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p20016.jpg"}, "name": "\u827e\u6bd4\u00b7\u8003\u5c3c\u4ec0", "id": "1040985"}, {"alt": "https:\/\/movie.douban.com\/celebrity\/1040688\/", "avatars": {"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p27283.jpg", "large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p27283.jpg", "medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p27283.jpg"}, "name": "\u4e9a\u5386\u5c71\u5fb7\u62c9\u00b7\u739b\u4e3d\u4e9a\u00b7\u62c9\u5a1c", "id": "1040688"}], "current_season": null, "original_title": "Geostorm", "summary": "\u300a\u5168\u7403\u98ce\u66b4\u300b\u7684\u6545\u4e8b\u53d1\u751f\u5728\u672a\u6765\uff0c\u73af\u5883\u6076\u5316\u5bfc\u81f4\u81ea\u7136\u707e\u5bb3\u6108\u6f14\u6108\u70c8\uff0c\u56e0\u6b64\u4e16\u754c\u5404\u56fd\u901a\u529b\u5408\u4f5c\uff0c\u521b\u9020\u4e86\u80fd\u63a7\u5236\u5929\u6c14\u7684\u5f3a\u5927\u6c14\u8c61\u536b\u661f\u7f51\u7edc\u3002\u4f46\u662f\u536b\u661f\u7f51\u7edc\u7a81\u53d1\u6545\u969c\u5f00\u59cb\u653b\u51fb\u5730\u7403\uff0c\u6467\u6bc1\u4e00\u5207\u7684\u6c14\u8c61\u5927\u707e\u53d8\u5e2d\u5377\u4e16\u754c\u3002\u800c\u968f\u7740\u4e8b\u6001\u53d1\u5c55\uff0c\u6d69\u52ab\u80cc\u540e\u7684\u9634\u8c0b\u4eba\u7978\u4e5f\u5f00\u59cb\u6d6e\u51fa\u6c34\u9762\uff0c\u4ee4\u4e3b\u4eba\u516c\u7684\u6551\u4e16\u4e4b\u65c5\u9762\u4e34\u66f4\u4e25\u5cfb\u8003\u9a8c\u3002", "subtype": "movie", "directors": [{"alt": "https:\/\/movie.douban.com\/celebrity\/1050031\/", "avatars": {"small": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1390371397.56.jpg", "large": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1390371397.56.jpg", "medium": "https://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1390371397.56.jpg"}, "name": "\u8fea\u5b89\u00b7\u5fb7\u592b\u6797", "id": "1050031"}], "comments_count": 7066, "ratings_count": 13663, "aka": ["\u4eba\u9020\u5929\u52ab(\u6e2f)", "\u6c14\u8c61\u6218(\u53f0)", "\u5929\u964d\u6d69\u52ab", "\u5730\u78c1\u98ce\u66b4", "\u536b\u661f\u98ce\u66b4"]};//防止多次请求
            that.setData({
                filmDetail: data
            })
            wx.setNavigationBarTitle({
                title: data.title
            })
            wx.stopPullDownRefresh()//关闭下拉刷新
            //判断是否收藏
            that.isStored(data);
        }
    },
    favoriteFilm(){
        let that = this;
        //判断收藏数据中是否存在,是则删除掉，否则添加
        wx.getStorage({
          key: 'film_favorite',
          success: res => {
              let film_favorite = res.data;
              if(that.data.isFilmFavorite){//点击的为取消收藏
                  film_favorite.forEach((item,index) => {
                      if(item.id == that.data.filmDetail.id){
                          film_favorite.splice(index,1);
                          that.setData({
                              isFilmFavorite : false
                          })
                      };
                  })
              }else{//新增收藏
                  film_favorite.push(that.data.filmDetail);
                  wx.setStorage({
                      key: 'film_favorite',
                      data : film_favorite,
                      success : res => {
                          that.setData({
                              isFilmFavorite : true
                          })
                      }
                  })
              }
          }
        });
    },
    isStored : function(data){
        let that = this,upDateHistoryFilms = function(){
            //更新历史存储
            let date = util.getDate(),time = util.getTime(),film_history = [];
            wx.getStorage({
                key : 'film_history',
                success : res => {
                    film_history = res.data;
                    let now_data = {//当前数据
                            time : time,data : data
                        },
                        sub_data = {
                            date : date,
                            films : []
                        };
                    sub_data.films.push(now_data);
                    if(film_history.length == 0){//历史没有数据,则存入金泰的数据
                        film_history.push(sub_data);
                    }else if(film_history[0].date == date){//判断第一个是否是今天
                        //判断历史films中当前影片详情,更新时间
                        film_history[0].films.forEach((index,item) => {
                            item.data.id == data.id && film_history[0].films.splice(index,1);
                        })
                        film_history[0].films.push(now_data);
                    }else{//不为今天
                        film_history.push(sub_data);
                    }
                    console.log(sub_data);
                    //重新设置本地存储
                    wx.setStorage({
                      key:"film_history",
                      data:film_history,
                        success : res => {
                          console.log(res);
                        }
                    });
                }
            })
        }
        wx.getStorage({
          key: 'film_favorite',
          success: res => {
            res.data.forEach((item) => {
                item.id == data.id && function(){//收藏数据中存在当前影片
                    that.setData({
                        isFilmFavorite : true
                    })
                }()
                upDateHistoryFilms();//存入历史数据中
            })
          } 
        });
    },
    /*
     * @name onPullDownRefresh
     * @param
     * @description 下拉刷新
     */
    onPullDownRefresh : function () {
        this.onLoad();
    }
})