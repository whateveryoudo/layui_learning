/**
 * @fileName : storageInitData.js
 * @author : ykx 
 * @createTime : 2018/1/16
 * @desc : 默认值（本地存储）
 */

export const initStorageData = [
    //收藏电影默认值
    {
        key : 'film_favorite',
        data : []
    },
    //皮肤默认值
    {
        key : 'avatarSkin',
        data : ''
    },
    //默认编辑个人信息值
    {
        key : 'personInfo',
        data : {
            name: '',
            nickName: '',
            gender: '',
            age: '',
            birthday: '',
            constellation: '',
            company: '',
            school: '',
            tel: '',
            email:'',
            intro: ''
        }
    }
]
