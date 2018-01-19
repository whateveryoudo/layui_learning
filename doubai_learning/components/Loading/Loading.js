/**
 * Created by Administrator on 2017/10/28.
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
            text : '加载中...'
        }
    },
    /*
     * @name show
     * @param
     * @description 显示toast
     */
    show(opts = {}){
        //合并参数
        const options = Object.assign({},this.setDefault(),opts);
        //实例化组件
        this.component = new Component({
            scope : `$wux.loading`,
            data : options,
            methods : {
                show(){
                    this.setVisible();
                },
                hide(){
                    this.setHidden();
                }
            }
        });
        this.component.show();//显示
    },
    hide(){
        if (this.component) {
            this.component.hide()
        }
    }
}