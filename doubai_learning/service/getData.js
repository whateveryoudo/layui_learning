/**
 * Created by lenovo on 2017/10/27.
 */
import api from '../config/api'
export const getDoubanFilms = (params,cb,fail_cb) => api('movie/in_theaters',params,cb,fail_cb);//出错了接口
export const getLocation = (params,cb,fail_cb) => api('geocoder/v2/',params,cb,fail_cb);
export const getFilmDetailInfo = (params,cb,fail_cb) => api('movie/subject/',params,cb,fail_cb);


export const searchFilmList = (url,params,cb,fail_cb) => api(url,params,cb,fail_cb);