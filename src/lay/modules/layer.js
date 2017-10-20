/**
 * Created by lenovo on 2017/10/18.
 */

;!function(window,undefiend){
    'use strict'
    var isLayui = window.layui && layui.define,$,win,ready = {
        getStyle : function(node,name){
            var style = node.currentStyle ? node.currentStyle : node.getComputedStyle(node,null);
            return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
        },
        config : {},
        btn : ['&#x786E;&#x5B9A;', '&#x53D6;&#x6D88;'],
        type : ['dialog','page','iframe','loading','tips'],//原始层形式
        link : function(href,fn,cssname){
            //未设置路径,则不主动加载css
            if(!layer.path){return}

            var head = document.getElementsByTagName('head')[0],link = document.createElement('link');
            if(typeof fn === 'string'){cssname = fn}

            var app = (cssname || href).replace(/\.|\//g,'');

            var id = 'layuicss-' + app,timeout = 0;

            link.rel = 'stylesheet';
            link.href = layer.path + href;
            link.id = id;

            if(!document.getElementById(id)){
                head.appendChild(link);
            }

            if(typeof fn !== 'function'){return}

            (function poll(){
                if(++timeout > 8 * 1000 / 100){
                    return window.console && window.console.error('layer.css: Invalid');
                };
                //为什么能这样判断
                parseInt(ready.getStyle(document.getElementById(id),'width')) === 1989 ? fn() : setTimeout(poll,100);
            }())
        },
        getPath : function(){
            var js = document.scripts,script = js[js.length - 1],jsPath = script.src;
            if(script.getAttribute('merge')){return}
            return jsPath.substring(0,jsPath.lastIndexOf('/') + 1);//获取当前js路径
        }()
    }
    //内置方法
    var layer = {
        v : '3.1.0',
        //css等待事件
        ready : function(callback){
            var cssname = 'layer',ver = '',
                path = (isLayui ? 'modules/layer/' : 'theme/') + 'default/layer.css?v=' + layer.v + ver;
            isLayui ? layui.addcss(path,callback,cssname) : ready.link(path,callback,cssname);
            return this;
        },
        index : window.layer && window.layer.v ? 100000 : 0,
        path : ready.getPath,
    }
    //缓存常用字符串
    var doms = ['layui-layer','.layui-layer-title','.layui-layer-main','.layui-layer-dialog','layui-layer-iframe','layui-layer-content','layui-layer-btn','layui-layer-close'];
    doms.anim = ['layer-anim-00'];//动画类型class
    var Class = function(setings){
        var that = this;
        that.index = ++layer.index;
        that.config = $.extend({},that.config,setings);

        document.body ? that.creat() : setTimeout(function(){that.creat()},30)
    }
    Class.pt = Class.prototype;
    //添加默认参数项
    Class.pt.config = {
        type : 0,//弹层类型
        shade : 0.3,//遮罩透明度
        fixed : true,//是否随页面滚动
        area : 'auto',//弹层区域大小
        closeBtn : 1,//默认显示关闭按钮
        move : doms[1],//drag区域classname
        time : 0,//默认不自动消失
        zIndex : 19891014,
        maxWidth : 360,
        anim : 0,//默认动画效果(bounceIn)
        isOutAnim : true,//是否添加离开动画效果
        icon : -1,
        moveType : 1,
        resize : true,
        scrollbar : true,
        tips : 2
    }
    //容器
    Class.pt.vessel = function(conType,callback){
        var that = this,config = that.config,times = that.index;
        var zIndex = config.zIndex + times,titype = typeof config.title === 'object';
        var ismax = config.maxmin && (config.type == 1 || config.type == 2);

        var titleHTML = (config.title ? '<div class="layui-layer-title" style="'+(titype ? config.title[1] : '')+'">'+
                (titype ? config.title[0] : config.title)+'</div>' : '');//title传入数组 [0]为title内容/[1]为添加样式

        config.zIndex = zIndex;
        callback([
            //遮罩
            config.shade ? ('<div class="layui-layer-shade" id="layui-layer-shade'+times+'" times="'+times+'" style="'+('z-index:' + (zIndex - 1))+'"></div>') : '',//遮罩为弹层index-1
            //弹层主体
            '<div class="' + doms[0] + (' layui-layer-' +ready.type[config.type]) +(((config.type == 0 || config.type == 2) && !config.shade) ? 'layui-layer-border' : '')+ ' ' + (config.skin || '') + '" id="'+doms[0] + times +'" type="'+ready.type[config.type]+'" times="'+times+'" showtime="'+config.time+'" conType="'+(conType ? 'object' : 'string')+'" style="z-index:'+ zIndex +';width:'+ config.area[0]+';height:'+config.area[1] + (config.fixed ? '' : ';position:absoulte;')+'">'
            // '<div class="' + doms[0] + (' layui-layer-' +ready.type[config.type]) +(((config.type == 0 || config.type == 2) && !config.shade) ? 'layui-layer-border' : '')+ ' ' + (config.skin || '') + '" id="'+doms[0] + times +'">'+
                +(conType && config.type != 2 ? '' : titleHTML)
                +'<div id="'+(config.id || '')+'" class="layui-layer-content'+((config.type == 0 && config.icon !== -1) ? 'layui-layer-padding' : '') + (config.type == 3 ? ' layui-layer-loading' + config.icon : '') +'">'
                +(config.type == 1 && conType ? '' : (config.content || ''))
            +'</div>'
                +'<span class="layui-layer-setwin">' + function(){
                    var closeBtn = ismax ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : '';
                    config.closeBtn && (closeBtn += '<a class="layui-layer-ico '+doms[7]+' '+doms[7] + (config.title ? config.closeBtn : (config.type == 4 ? '1' : '2'))+'" href="javascript:;"></a>');
                    return closeBtn;
                }() + '</span>'
                +(config.btn ? function(){
                    var button = '';
                    typeof config.btn == 'string' && (config.btn = [config.btn]);
                    //拼接按钮字符串
                    for(var i = 0,len = config.btn.length;i < len;i++){
                        button += '<a class="'+doms[6]+''+i+'">'+config.btn[i]+'</a>';
                    }
                    //返回底部操作按钮
                    return '<div class="'+doms[6]+' layui-layer-btn-'+(config.btnAlign || '')+'">'+button+'</div>'
                }() : '')
                +(config.resize ? '<span class="layui-layer-resize"></span>' : '')//放大缩小
            +'</div>'
        ],titleHTML,$('<div class="layui-layer-move"></div>'));
        return that;
    }
    //创建骨架
    Class.pt.creat = function(){
        var that = this,
            config = that.config,
            times = that.index,
            nodeIndex,
            content = config.content,
            conType = typeof content === 'object',
            body = $('body');
        if(config.id && $('#' + config.id)[0]){return}

        if(typeof config.area === 'string'){
            config.area = config.area == 'auto' ? ['','']:[config.area,''];
        }
        switch (config.type){
            case 0:
                config.btn = ('btn' in config) ? config.btn : ready.btn[0];
                break;
        }

        /*
         * @name
         * @param html 内容模板
         * @param titleHTML title模板
         * @param moveElem 触发拖拽元素
         * @description
         */
        that.vessel(conType,function(html,titleHTML,moveElem){
            body.append(html[0]);//添加遮罩
            conType ? function(){
                    (config.type == 2 || config.type == 4) ? function(){
                        $('body').append(html[1]);
                        }() : function(){
                            if(!content.parents('.' + doms[0])[0]){//显示content内容
                                content.data('display',content.css('display')).show().addClass('layui-layer-wrap').wrap(html[1]);//用layui-layer-content包含每个content
                                $('#' + doms[0] + times).find('.' + doms[5]).before(titleHTML)//添加title
                            }
                        }();
                }() :  body.append(html[1]);//直接添加弹层内容
            $('.layui-layer-move')[0] || body.append(ready.moveElem = moveElem);//添加触发移动元素
            that.layero = $('#' + doms[0] + times);//当前弹层元素(追加到实例对象中)
        })
        //处理遮罩样式
        $("#layui-layer-shade" + that.index).css({
            'background-color' : config.shade[1] || '#000',
            'opacity' : config.shade[0] || config.shade
        })
        //坐标自适应窗口大小
        config.type == 4 ? that.tips() : that.offset();
        //监听页面大小变化
        if(config.fixed){
            win.on('resize',function(){
                that.offset();//跟新坐标
            })
        }
        //是否是自动消失
        config.time <= 0 || setTimeout(function(){
            layer.close(that.index);
        },config.time);
        //启用拖拽初始事件
        that.move().callback();

        //动画设置
        if(doms.anim[config.anim]){//默认bounceIn类型
            var animClass = 'layer-anim ' + doms.anim[config.anim];
            that.layero.addClass(animClass).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                //动画执行完毕移除class
                $(this).removeClass(animClass);
            })
        }

        //记录关闭动画
        if(config.isOutAnim){
            that.layero.data('isOutAnim',true);
        }
    }
    //坐标计算(居中)
    Class.pt.offset = function(){
        var that = this,config = that.config,layero = that.layero;
        var area = [layero.outerWidth(),layero.outerHeight()];
        var type = typeof config.offset === 'object';
        that.offsetTop = (win.height() - area[1]) / 2;
        that.offsetLeft = (win.width() - area[0]) / 2;

        if(type){//传入数组/单个字符串
            that.offsetTop = config.offset[0]
            that.offsetLeft = config.offset[1] || that.offsetLeft;
        }else if(config.offset !== 'auto'){
            //判断显示位置

        }
        //判断是否固定在可视区域
        if(!config.fixed){
            //百分比输入处理
            that.offsetTop = /%$/.test(that.offsetTop) ?
                win.height() * parseFloat(that.offsetTop) : parseFloat(that.offsetTop);//(顶部距离)获取数值
            that.offsetLeft = /%$/.test(that.offsetLeft) ?
                win.width() * parseFloat(that.offsetLeft) : parseFloat(that.offsetLeft);//(距离左边距离)
            //加上页面滚动的距离
            that.offsetTop += win.scrollTop();
            that.offsetLeft += win.scrollLeft();
        }
        //设置坐标
        layero.css({
            'top' : that.offsetTop,
            'left' : that.offsetLeft,
        })
    }
    //拖拽
    Class.pt.move = function(){
        var that = this,
            config = that.config,
            _DOC = $(document),
            layero = that.layero,
            moveElem = layero.find(config.move),//触发元素
            resizeElem = layero.find('.layui-layer-resize'),
            dict = {};
        if(config.move){
            moveElem.css('cursor','move');
        }
        moveElem.on('mousedown',function(e){

        })
        _DOC.on('mousemove',function(e){

        }).on('mouseup',function(e){});

        return that;
    }
    //绑定事件
    Class.pt.callback = function(){
        var that = this,config = that.config,layero = that.layero;
        function cancel(){
            // var close = config.cancel && config.cancel(that.index,layero);
            layer.close(that.index);
        }
        //右上角关闭的回调
        layero.find('.' + doms[7]).on('click',cancel);
    }
    /***内置成员***/
    window.layer = layer;
    //关闭的总方法
    layer.close = function(index){
        var layero = $('#' + doms[0] + index),type = layero.attr('type'),closeAnim = 'layer-anim-close';
        if(!layero[0]){return}
        var WRAP = 'layui-layer-wrap',remove = function(){
            if(type === ready.type[1] && layero.attr('conType') === 'object'){//page类型
                //移除layui-layer-content以外的元素
                layero.children(":not(."+doms[5]+")").remove();
                //找到内容体(去除两层父级元素,只留下本身)
                var wrap = layero.find('.' + WRAP);
                for(var i = 0;i < 2;i ++){
                    wrap.unwrap();
                }
                //设置为原来的css样式,并去掉容器class
                wrap.css('display',wrap.data('display')).removeClass(WRAP);
            }
        }
        //是否添加消失动画
        if(layero.data('isOutAnim')){
            layero.addClass('layer-anim ' + closeAnim);
        }
        //去除shade 触发移动元素
        $('#layui-layer-moves,#layui-layer-shade' + index).remove();

        //去除主体
        if((layer.ie && layer.ie < 10) || !layero.data('isOutAnim')){
            remove();
        }else{
            setTimeout(function(){
                remove();
            },200)
        }
    }
    //主入口
    ready.run = function(_$){
        $ = _$;
        win = $(window);
        doms.html = $('html');
        layer.open = function(deliver){

            var o = new Class(deliver);
            return o.index;
        }
    }
    //加载方式
    window.layui && layui.define ? (
            layer.ready(),
                layui.define(['jquery'],function(exports){
                    layer.path = layui.cache.dir;
                    ready.run(layui.jquery);


                    window.layer = layer;
                    exports('layer',layer);
                })

        ) : (
            typeof define === 'function' ? define(['jquery'],function(){
                    ready.run(window.jQuery)
                }) : function(){
                        ready.run(window.jQuery);
                        layer.ready();
                }()
        )
}(window)
