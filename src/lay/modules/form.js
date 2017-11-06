layui.define('jquery',function(exports){
    'use strict'
    console.log('我是form模块');
    var $ = layui.$,
        // layer = layui.layer,
        hint = layui.hint(),
        device = layui.device(),

        MOD_NAME = 'form',ELEM = '.layui-form',HIDE = 'layui-hide',SHOW = 'layui-show',
        Form = function(){
            this.config = {

            }
        };
    //表单事件监听
    Form.prototype.on = function(events,callback){
        return layui.onevent.call(this,MOD_NAME,events,callback);
    }
    Form.prototype.render = function(type,filter){
        var that = this,
            elemForm = $(ELEM + function(){
                return filter ? ('[lay-filter="'+filter+'"]'):'';
            }()),
            items = {
                //下拉选项
                select : function(){
                    var TIPS = '请选择',CLASS = 'layui-form-select',TITLE = 'layui-select-title',THIS = 'layui-this',
                        NONE = 'layui-select-none',DISABLED = 'layui-disabled',initValue = '',thatInput,
                        selects = elemForm.find('select'),hide = function(e,clear){
                            if(!$(e.target).parent().hasClass(TITLE) || clear){
                                $('.' + CLASS).removeClass(CLASS + 'ed ' + CLASS+ 'up');
                                thatInput && initValue && thatInput.val(initValue);
                            }
                            thatInput = null;
                        },
                        events = function(reElem,disabled,isSearch){
                            var select = $(this),
                                title = reElem.find('.' + TITLE),
                                input = title.find('input'),
                                dl = reElem.find('dl'),
                                dds = reElem.find('dd');

                            if(disabled){return}
                            //展开下拉事件
                            var showDown = function(){
                                var top = reElem.offset().top + reElem.outerHeight() + 5 - win.scrollTop(),
                                    dlHeight = dl.outerHeight();
                                reElem.addClass(CLASS + 'ed');
                                dds.removeClass(HIDE);

                                //窗口改变上下识别
                                if(top + dlHeight > win.height() && top >= dlHeight){
                                    reElem.addClass(CLASS + 'up');//上显示
                                }
                            },hideDown = function(choose){
                                reElem.removeClass(CLASS + 'ed ' + CLASS + 'up');
                                input.blur();
                                if(choose){return};

                                notOption(input.val(),function(none){
                                    if(none){
                                        initValue = dl.find('.' + THIS).html();
                                        input && input.val(initValue);
                                    }
                                })

                            }


                            //点击标题区域事件
                            title.on('click',function(e){
                                reElem.hasClass(CLASS + 'ed') ? (
                                        hideDown()
                                    ) : (
                                        hide(e,true),
                                            showDown()
                                    )
                                dl.find('.' + NONE).remove();
                            })
                            //点击监右边监听获取焦点
                            title.find('.layui-edge').on('click',function(){
                                input.focus();
                            })
                            //键盘事件(切换下拉显示隐藏)
                            input.on('keyup',function(e){//按键按期
                                var keyCode = e.keyCode;
                                if(keyCode == 9){//tab
                                    //显示dl
                                    showDown();
                                }
                            }).on('keydown',function(e){
                                var keyCode = e.keyCode;
                                if(keyCode == 9){
                                    hideDown();
                                }
                            })
                            //检查值是否不属于select项
                            var notOption = function(value,callback,origin){
                                var num = 0;
                                layui.each(dds,function(){
                                    var othis = $(this),
                                        text = othis.text(),
                                        not = text.indexOf(value) === -1;//包含字段（失去焦点需要全部相同）
                                    if(value === '' || (origin === 'blur' ? value !== text : not)){num++};
                                    origin === 'keyup' && othis[not ? 'addClass' : 'removeClass'](HIDE);//隐藏/显示dd项
                                })
                                var none = num === dds.length;
                                return callback(none),none;
                            }

                            //dd选择
                            dds.on('click',function(){
                                var othis = $(this),value = othis.attr('lay-value');
                                var filter = othis.attr('lay-filter');

                                if(othis.hasClass(DISABLED)){return false}

                                if(othis.hasClass('layui-select-tips')){
                                    input.val('')
                                }else{
                                    input.val(othis.text());
                                    othis.addClass(THIS);
                                }

                                othis.siblings().removeClass(THIS);
                                select.val(value).removeClass('layui-form-danger');
                                //绑定回调函数
                                layui.event.call(this,MOD_NAME,'select(' + filter + ')',{
                                    elem : select[0],
                                    value : value,
                                    othis : reElem
                                })
                                hideDown(true);

                                return false;
                            })
                            //搜索匹配
                            var search = function(e){
                                var value = this.value,keyCode = e.keyCode;
                                if(keyCode === 9 || keyCode === 13 || keyCode === 37 || keyCode === 38
                                    || keyCode === 39 || keyCode === 40){
                                    return false;
                                }

                                notOption(value,function(none){
                                    if(none){
                                        dl.find('.' + NONE)[0] || dl.append('<p class="' + NONE + '">无匹配项</p>')
                                    }else{
                                        dl.find('.' + NONE).remove();
                                    }
                                },'keyup');
                            }
                            if(isSearch){
                                //绑定keyup事件
                                input.on('keyup',search).on('blur',function(e){
                                    thatInput = input;
                                    initValue = dl.find('.' + THIS).html();
                                    setTimeout(function(){
                                        notOption(input.val(),function(none){
                                            if(none && !initValue){
                                                input.val('');
                                            }
                                        },'blur');
                                    },200)
                                })
                            }

                            //点击文档其他区域关闭下拉
                            $(document).off('click',hide).on('click',hide);
                        }

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
                        var reElem = $(['<div class="'+(isSearch ? '' : 'layui-unselect ')+ CLASS + (disabled ? ' layui-layer-disabeld' : '') +'">'
                            ,'<div class="'+TITLE+'"><input type="text" placeholder="'+placeholder+'" value="'+(value ? selected.html() : '')+'" ' +(isSearch ? '' : 'readonly')+' class="layui-input' +(isSearch ? '' : ' layui-unselect') + (disabled ? ' ' + DISABLED : '')+'">'
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
                                        arr.push('<dd lay-value="'+item.value+'" class="'+(value == item.value ? THIS : '')+(item.disabled ? (' ' + DISABLED) : '') + '">'+item.innerHTML+'</dd>')
                                    }
                                })
                                arr.length == 0 && arr.push('<dd lay-value="" class="'+ DISABLED+ '">没有选项</dd>');
                                return arr.join('');//返回字符串
                            }(othis.find('*')) +
                            '</dl>'
                        ,'</div>'].join(''));
                        hasRender[0] && hasRender.remove();//已经渲染 重新渲染
                        othis.after(reElem);
                        events.call(this,reElem,disabled,isSearch);//初始化事件
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
