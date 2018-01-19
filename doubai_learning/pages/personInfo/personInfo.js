/**
 * @fileName : personInfo.js
 * @author : ykx 
 * @createTime : 2018/1/19
 * @desc : 个人信息编辑/查看
 */

const config = require('../../config/config');
const app = getApp();
//有映射模板 不需要操作
import {sexFormate} from '../../util/commonFormate'
Page({
    data : {
        genderIndex : 0,
        constellationIndex : 0,
        date: '2016-09-01',
        //性别数组
        genderArray : ['男士','女士'],
        genderArrayObj : [
            {
                id: 0,
                name: '男士'
            },
            {
                id: 1,
                name: '女士'
            }
        ],
        constellationArray: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        personInfo : {},
        isEnable : false,//是否能够编辑
        //验证规则
        verifyRule : {
            name: {
                required: true,
                minlength: 2,
                maxlength: 10,
            },
            nickName : {
                required: true
            },
            gender : {
                required: true
            },
            age : {
                required: true
            },
            birthday : {
                required: true
            },
            constellation : {
                required: true
            },
            company : {
                required: true
            },
            school : {
                required: true
            },
            tel : {
                required: true,
                tel: true,
            },
            email : {
                required: true,
                email : true
            },
            intro : {
                required: true
            },
        },

        //验证规则对应的提示信息
        verifyMsg : {
            name: {
                required: '请输入您的姓名'
            },
            nickName : {
                required: '请输入您的昵称'
            },
            gender : {
                required: '请选择你的性别'
            },
            age : {
                required: '请输入您的年龄'
            },
            birthday : {
                required: '请选择你的生日'
            },
            constellation : {
                required: '请选择你的星座'
            },
            company : {
                required: '请输入公司名称'
            },
            school : {
                required: '请输入学校名称'
            },
            tel : {
                required: '请输入手机号码'
            },
            mail : {
                required: '请输入你的邮箱'
            },
            intro: {
                required: '请输入你的签名'
            }
        },
    },
    onLoad(){
        //获取本地存储内容
        wx.getStorage({
            key : 'personInfo',
            success : res => {
                this.setData({
                    personInfo:res.data
                })
                //初始化信息
            }
        })

        //初始化表单验证类
        this.wxValidate = app.wxValidate(this.data.verifyRule,this.data.verifyMsg);
    },
    /*
     * @name bindKeyInput
     * @param
     * @description 监听输入框变化
     */
    bindKeyInput({detail}){
        let {value,type} = detail;
        let {personInfo} = this.data;
        value && (() => {
            this.setData({
                personInfo : Object.assign(personInfo,{[type] : value})
            })
        })();
    },
    //性别formate
    sexFormate(val){
        switch(parseInt(val)){
            case 0:
                return '男士';
            case 1:
                return '女士';
        }
    },
    /*
     * @name handleSubmit
     * @param
     * @description 提交表单 (注意默认不使用自定义组件e.datail.value中会包含所有field字段,这里直接获取data中的值当做value)
     */
    handleSubmit(e){
        let {personInfo} = this.data;
        e.detail.value = personInfo;
        //这里进行校验
        if(!this.wxValidate.checkForm(e)){
            const error = this.wxValidate.errorList[0];
            app.$wuxToast.show({
                type: 'cancel',
                timer: 1500,
                color: '#fff',
                text: error.msg
            })
            return false;
        };
    },
    /*
     * @name bindPickerChange
     * @param {keytype} 映射数组名字
     * @param {key} 对应信息对象key名
     * @description 单个picker操作
     */
    bindPickerChange(e){
        debugger;
        let {personInfo} = this.data;
        let {keytype,key} = e.currentTarget.dataset;
        let value = e.detail.value;

        if(!keytype || !key){return}
        //这里有的取id,有的取值 传给后台
        let chooseId = '';
        //规避0 对||运算影响
        if(this.data[keytype][value].id == undefined){
            chooseId = this.data[keytype][value]
        }else{
            chooseId = this.data[keytype][value].id;
        }
        //更新选中值(设置本次选中值)
        this.setData({
            personInfo : Object.assign(personInfo,{[key] : chooseId,[key + 'Index'] : value})
        })
    },
    /*
     * @name bindDateChange
     * @param
     * @description 时间picker操作
     */
    bindDateChange(e){
        let {personInfo} = this.data;
        let {key} = e.currentTarget.dataset;
        let value = e.detail.value;

        if(!key){return}
        //更新选中值
        this.setData({
            personInfo : Object.assign(personInfo,{[key] : value})
        })
    }
})
