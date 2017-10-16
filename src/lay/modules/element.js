// debugger;
layui.define(['jquery'],function(exports){
    'use strict'
    var $ = layui.$,
        hint = layui.hint,
        device = layui.device(),

        MOD_NAME = 'element',THIS = 'layui-this',SHOW = 'layui-show',
        Element = function(){//构造函数
            this.config = {}
        };
    //自定义事件初始化
    Element.prototype.on = function(events,callback){
        return layui.onevent.call(this,MOD_NAME,events,callback);
    }
    //元素选择器(nav)
    var NAV_ELEM = '.layui-nav',NAV_BAR = 'layui-nav-bar',NAV_ITEM = 'layui-nav-item',
        NAV_TREE = 'layui-nav-tree',NAV_CHILD = 'layui-nav-child',NAV_MORE = 'layui-nav-more',
        NAV_ANIM = 'layui-anim layui-anim-upbit';
    //基础事件体
    var call = {
        //tab点击
        tabClick : function(e,index,liElem){
            var othis = liElem || $(this),
                index = index || othis.parent().children('li').index(othis),
                parents = othis.parents('.layui-tab').eq(0),
                item = parents.children('.layui-tab-content').children('.layui-tab-item'),
                elemA = othis.find('a'),
                filter = parents.attr('lay-filter');
                if(!(elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank')){//非新开窗口链接
                    othis.addClass(THIS).siblings().removeClass(THIS);//控制tab title切换
                    item.eq(index).addClass(SHOW).siblings().removeClass(SHOW);//控制tab对应 container显示隐藏
                }
                layui.event.call(this,MOD_NAME,'tab(' + filter + ')', {
                    elem : parents,
                    index : index
                })
        },
        //关闭当前tab
        tabDelete : function(e,othis){
            var li = othis || $(this).parent(),index = li.index();
            var parents = li.parents('.layui-tab').eq(0);
            var item = parents.children('.layui-tab-content').children('.layui-tab-item');//取到当前tab对应的所有下方content集

            if(li.hasClass(THIS)){//当前项是否选中（删除选中项,选中项向后移/如果是最后一项,则往前移动一位）
                if(li.next()[0]){
                    call.tabClick.call(li.next()[0],null,index + 1);
                }else if(li.prev()[0]){
                    call.tabClick.call(li.prev()[0],null,index - 1);
                }
            }

            li.remove();

            item.eq(index).remove();
            setTimeout(function(){
                call.tabAuto();
            },50);

        },
        //tab自适应
        tabAuto : function(){
            var SCROLL = 'layui-tab-scroll',MORE = 'layui-tab-more',BAR = 'layui-tab-bar',
                CLOSE = 'layui-tab-close',that = this;
            $(".layui-tab").each(function(){
                var othis = $(this),
                    title = othis.children('.layui-tab-title'),
                    item = othis.children('.layui-tab-content').children('.layui-tab-item'),
                    STOPE = 'lay-stope="tabmore"',//属性字符串
                    span = $("<span class='layui-unselect layui-tab-bar' "+STOPE+"><i "+STOPE+" class='layui-icon'>&#xe61a;</i></span>");

                //是否允许关闭
                if(othis.attr('lay-allowClose')){
                    title.find('li').each(function(){
                        var li = $(this);
                        if(!li.find('.' + CLOSE)[0]){//判断每个li是否有关闭元素
                            var close = $("<i class='layui-icon layui-unselect "+CLOSE+"'>&#x1006;</i>");

                            close.on('click',call.tabDelete);//绑定关闭事件
                            li.append(close);
                        }
                    })
                }

                //对于HTML元素本身就带有的固有属性，在处理时，使用prop方法。
                // 对于HTML元素我们自己自定义的DOM属性，在处理时，使用attr方法。
                //响应式
                if(title.prop('scrollWidth') > title.outerWidth() + 1){//元素的内容超过可视区，滚动条出现和可用的情况下
                    if(title.find('.' + BAR)[0]){return};
                    title.append(span);
                    othis.attr('overflow','');
                    span.on('click',function(){
                        title[this.title ? 'removeClass' : 'addClass'](MORE);//切换加载更多样式
                        this.title = this.title ? '' : '收缩'
                    })
                }else{
                    title.find('.' + BAR).remove();
                    othis.removeAttr('overflow');
                }
            })
        }
    }

    //初始化元素操作
    Element.prototype.init = function(type){
        var that = this,
            items = {//元素组件
                //tab选项卡
                tab : function(){
                    call.tabAuto.call({});
                },
                //导航菜单
                nav : function(){
                    var TIME = 200,timer = {},timerMore = {},timeEnd = {},
                        follow = function(bar,nav,index){
                            var othis = $(this),child = othis.find('.' + NAV_CHILD);

                            if(nav.hasClass(NAV_TREE)){//树形nav
                                bar.css({
                                    top : othis.position().top,
                                    height : othis.children('a').height(),
                                    opacity : 1
                                })
                            }else{
                                child.addClass(NAV_ANIM)//子项添加动画class
                                bar.css({
                                    left : othis.position().left + parseFloat(othis.css('marginLeft')),
                                    top : othis.position().top + othis.height() - 5
                                })

                                timer[index] = setTimeout(function(){//先去到位置,在执行过度效果
                                    bar.css({
                                        width : othis.width(),
                                        opacity:1
                                    })
                                },device.ie && device.ie < 10 ? 0 : TIME);//这里为什么区别ie10以下
                                //清楚定时器
                                clearTimeout(timeEnd[index]);

                                if(child.css('display') === 'block'){
                                    clearTimeout(timerMore[index]);
                                }
                                timerMore[index] = setTimeout(function(){//延迟显示执行动画
                                    child.addClass(SHOW);
                                    othis.find('.' + NAV_MORE).addClass(NAV_MORE + 'd');
                                },300);
                            }
                        }
                    $(NAV_ELEM).each(function(index){
                        var othis = $(this),
                            bar = $('<span class="' + NAV_BAR + '"></span>'),
                            itemElem = othis.find('.' + NAV_ITEM);

                        //hover滑动效果
                        if(!othis.find('.' + NAV_BAR)[0]){
                            othis.append(bar);
                            itemElem.on('mouseenter',function(){
                                follow.call(this,bar,othis,index);
                            }).on('mouseleave',function(){
                                if(!othis.hasClass(NAV_TREE)){
                                    clearTimeout(timerMore[index]);
                                    timerMore[index] = setTimeout(function(){
                                        othis.find('.' + NAV_CHILD).removeClass(SHOW);//再次隐藏
                                        othis.find('.'+NAV_MORE).removeClass(NAV_MORE+'d');
                                    },300);
                                }
                            })
                        }
                    })
                }
            }

            //初始化
            return layui.each(items,function(index,item){
                item();
            })
    }
    var element = new Element(),dom = $(document);

    var TITLE = '.layui-tab-title li';
    //初始tab切换
    dom.on('click',TITLE,call.tabClick);
    //初始化
    element.init();
    exports(MOD_NAME,element);//暴露给layui实例
})
