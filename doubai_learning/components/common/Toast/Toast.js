/**
 * Created by Administrator on 2017/10/27.
 */

import Component from '../components'

export default {
    /*
     * @name setDefault
     * @param
     * @description 默认参数
     */
    setDefault(){
        return {
            type : `success`,
            timer : 1500,
            color : `#fff`,
            text : '已完成',
            success(){}
        }
    },
    data(){
        return [
            {type : `success`,icon : `success_no_circle`,className : `weui-toast-success`},
            {
                type: `cancel`,
                icon: `cancel`,
                className: `weui-toast-cancel`,
            },
            {
                type: `forbidden`,
                icon: `warn`,
                className: `weui-toast-forbidden`,
            },
            {
                type: `text`,
                icon: ``,
                className: `weui-toast-text`,
            },
        ]
    },
    /*
     * @name show
     * @param
     * @description 显示toast
     */
    show(opts = {}){
        //合并参数
        const options = Object.assign({},this.setDefault(),opts);
        const TOAST_TYPES = this.data();//toast图标类型

        //根据入参类型,获取对应的图标

        TOAST_TYPES.forEach((value,key) => {
            if(value.type == opts.type){
                options.type = value.icon;//获取对应图标
                options.className = value.className;//获取对应类名
            }
        })
        //实例化组件
        const component = new Component({
            scope : `$wux.toast`,
            data : options,
            methods : {
                show(){
                    this.setVisible();
                },
                hide(cb){
                    setTimeout(() => {
                        this.setHidden();
                    },options.timer)
                }
            }
        });
        component.show();
        component.hide(opts.success);//自动消失
    }
}
