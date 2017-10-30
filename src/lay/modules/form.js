layui.define('layer',function(exports){
    'use strict'
    var $ = layui.$,
        layer = layui.layer,
        hint = layui.hint(),
        device = layui.device(),

        MOD_NAME = 'form',ELEM = '.layui-form',
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
                    var TIPS = '请选择',CLASS = 'layui-form-select',TITLE = 'layui-select-title',
                        NONE = 'layui-select-none',DISABLED = 'layui-disabled',initValue = '',thatInput,
                        selects = elemForm.find('select');

                    //初始化所有的select
                    selects.each(function(index,select){
                        var othis = $(this),
                            hasRender = othis.next('.' + CLASS),
                            disabled = this.disabled,//是否禁用属性
                            value = this.value,
                            selected = $(select.options[select.selectedIndex]),//获取当前选中的option
                            optionFirst = select.options[0];//第一个option
                        var isSearch = typeof othis.attr('lay-search') === 'string',
                            placeholder = optionFirst ? (optionFirst.value ? TIPS : (optionFirst.innerHTML || TIPS)) : TIPS;//默认取第一个option的innerHTML 否则取默认TIPS
                        //构建替代元素
                        var resElem = $(['<div class="'+(isSearch ? '' : 'layui-unselect')+ CLASS + (disabled ? ' layui-layer-disabeld' : '') +'">'
                            ,'<div class="'+TITLE+'"><input type="text" placeholder="'+placeholder+'" value="'+(value ? selected.html() : '')+'" '+(isSearch ? '' : ' layui-unselect')+(disabled ? ' ' + DISABLED : '')+'">'
                            ,'<i class="layui-edge"></i></div>'
                            //模拟子项
                            ,'<dl class="layui-anim layui-anim-upbit' + (othis.find('optgroup')[0] ? ' layui-select-group' : '') + '">' + function(options){
                                var arr = [];
                                layui.each(options,function(index,item){
                                    if(index == 0 && !item.value){
                                        arr.push('<dd lay-vaule="" class="layui-select-tips">'+(item.innerHTML || TIPS)+'</dd>');//第一项
                                    }else if(item.tagName.toLowerCase() === 'optgroup'){//下拉组
                                        arr.push('<dt>'+item.label+'</dt>');
                                    }else{
                                        arr.push('<dd lay-value="'+item.value+' class="'+(value == item.value ? THIS : '')+(item.disabled ? (' ' + DISABLED) : '') + '">'+item.value+'</dd>')
                                    }
                                })
                                arr.length == 0 && arr.push('<dd lay-value="" class="'+ DISABLED+ '">没有选项</dd>');
                                return arr.join('');//返回字符串
                            }(othis.find('*')) +
                            '</dl>'
                        ,'</div>'].join(''));
                        hasRender[0] && hasRender.remove();//已经渲染 重新渲染
                        othis.after(resElem);
                        events.call(this,reElem,disabled,isSearch);
                    })
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
