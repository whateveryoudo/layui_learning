layui.define('layer',function(exports){
    'use strict'
    var $ = layui.$,
        layer = layui.layer,
        hint = layui.hint(),
        device = layui.device(),

        MOD_NAME = 'form',ELEM = '.layui-form'
        Form = function(){
            this.config = {

            }
        };
    Form.prototype.render = function(type,filter){
        var that = this,
            elemForm = $(ELEM + function(){
                return filter ? ('[lay-filter="'+filter+'"]'):'';
            }()),
            items = {
                //下拉选项
                select : function(){

                }
            };
        type ? items[type] ? items[type]() : hint.err('不支持的'+type+'表单渲染') : layui.each(items,function(index,item){
                item();
            })

        return that;
    }
    var form = new Form(),dom = $(document),win = $(window);
    form.render();//自动执行渲染，控件
    exports(MOD_NAME,form);
})
