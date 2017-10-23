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
        config : {},end : {},
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
        //快捷使用
        alert : function(content,options,yes){//yes为点击确定的回调函数
            var type = typeof options === 'function';
            if(type){yes = options};//两个入参

            return layer.open($.extend({
                content : content,
                yes : yes
            },type ? {} : options));
        },
        confirm : function(content,options,yes,cancel){//确认框
            var type = typeof options === 'function';
            if(type){//无选项参数时
                cancel = yes;
                yes = options;
            }
            return layer.open($.extend({
                content : content,
                yes : yes,
                btn : ready.btn,
                btn2 : cancel
            },type ? {} : options));//无选项参数传入空对象
        },
        msg : function(content,options,end){//msg
            var type = typeof options === 'function',rskin = ready.config.skin;//默认皮肤class
            var skin= (rskin ? rskin + ' ' + rskin + '-msg' : '') || 'layui-layer-msg';
            var anim = doms.anim.length - 1;//动画类型
            if(type){
                end = options;
            }
            return layer.open($.extend({
                content : content,
                time :3000,
                skin : skin,
                title : false,
                btn : false,
                shade : false,
                resize : false,
                closeBtn : false,
                end : end
            },(type && !ready.config.skin) ? {//含有回调函数时，使用shake
                    skin : skin + ' layui-layer-hui',
                    anim : anim
                } : function(){

                       options = options || {};
                       if(options.icon === -1 || options.icon === undefiend && !ready.config.skin){
                           options.skin = skin + ' ' + (options.skin || 'layui-layer-hui');
                       }

                       return options;
                }()));
        },
        tips : function(content,follow,options){
            return layer.open($.extend({
                type : 4,
                content : [content,follow],
                closeBtn : false,
                shade : false,
                time : 0,
                resize : false,
                fixed : false,
                maxWidth : 200
            },options));
        }
    }
    //缓存常用字符串
    var doms = ['layui-layer','.layui-layer-title','.layui-layer-main','.layui-layer-dialog','layui-layer-iframe','layui-layer-content','layui-layer-btn','layui-layer-close'];
    doms.anim = ['layer-anim-00','layer-anim-01', 'layer-anim-02', 'layer-anim-03', 'layer-anim-04', 'layer-anim-05', 'layer-anim-06'];//动画类型class
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
        title : '&#x4FE1;&#x606F;',//默认title(信息)
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
        moveOut : false,//是否允许移除窗口外
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
            '<div class="' + doms[0] + (' layui-layer-' +ready.type[config.type]) +(((config.type == 0 || config.type == 2) && !config.shade) ? ' layui-layer-border' : '')+ ' ' + (config.skin || '') + '" id="'+doms[0] + times +'" type="'+ready.type[config.type]+'" times="'+times+'" showtime="'+config.time+'" conType="'+(conType ? 'object' : 'string')+'" style="z-index:'+ zIndex +';width:'+ config.area[0]+';height:'+config.area[1] + (config.fixed ? '' : ';position:absoulte;')+'">'
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
            case  2://iframe
                var content = config.content = conType ? config.content : [config.content || 'http://layer.layui.com','auto'];
                config.content = '<iframe scrolling="'+(config.content[1] || 'auto')+'" allowtransparency="true" id="'+doms[4]+''+times+'" name="'+doms[4]+''+times+'" onload="this.className=\'\';" class="layui-layer-border" frameborder="0" src="'+config.content[0]+'"></iframe>';//构建iframe标签
                break;
            case 4 : //tips层
                conType || (config.content = [config.content,'body']);
                config.follow = config.content[1];//触发按钮对象
                config.content = config.content[0] + '<i class="layui-layer-TipsG"></i>';//内容文字+tip箭头
                delete config.titile;
                config.tips = typeof config.tips === 'object' ? config.tips : [config.tips,true];
                config.tipMore || layer.closeAll('tips');//是否允许添加多个tip
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
        }).auto(times);
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
    Class.pt.auto = function(index){//自适应
        debugger;
        var that = this,layero = $('#' + doms[0] + index),config = that.config;
        //ie下bug

        var area = [layero.innerWidth(),layero.innerHeight()],
            titleHeight = layero.find(doms[1]).outerHeight() || 0,
            btnHeight = layero.find('.' + doms[6]).outerHeight() || 0,
            setHeight = function(elem){
                elem = layero.find(elem);
                elem.height(area[1] - titleHeight - btnHeight - 2 * (parseFloat(elem.css('padding-top')) | 0));//设置iframe高度
            }

            switch (config.type){
                case 2 :
                    setHeight('iframe');
                    break;
                default:
                    if(config.area[1] === ''){
                        if(config.maxHeight > 0 && layero.outerHeight() > config.outerHeight()){
                            area[1] = config.maxHeight;
                            setHeight('.' + doms[5]);
                        }else if(config.fixed && area[1] >= win.height()){
                            area[1] = win.height();//不能超过屏幕高度
                            setHeight('.' + doms[5]);
                        }
                    }else{
                        setHeight('.' + doms[5]);
                    }
                    break;
            }

            return that;
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
    //tips坐标处理
    Class.pt.tips = function(){
        var that = this,config = that.config,layero = that.layero;
        var layArea = [layero.outerWidth(),layero.outerHeight()],follow = $(config.follow);//触发元素
        if(!follow[0]){
            follow = $('body');
        }

        //存储坐标信息对象
        var goal = {
            width : follow.outerWidth(),
            height : follow.outerHeight(),
            top : follow.offset().top,
            left : follow.offset().left,
        },tipsG = layero.find('.layui-layer-TipsG');//指示箭头

        var guide = config.tips[0];//位置类型
        config.tips[1] || tipsG.remove();


        goal.autoLeft = function(){
            //临界值判断
            if(goal.left + layArea[0] - win.width() > 0){//什么情况下
                goal.tipLeft = goal.left + goal.width - layArea[0];
                tipsG.css({right: 12, left: 'auto'});
            }else{
                goal.tipLeft = goal.left;
            }
        }
        //方向数组函数
        goal.where = [
            function(){//上
                goal.autoLeft();
                goal.tipTop = goal.top - layArea[1] - 10,//top值
                //设置箭头样式
                tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsT').css('border-right-color',config.tips[1]);
            },
            function(){//右
                goal.tipLeft = goal.left + goal.width + 10;
                goal.tipTop = goal.top;
                tipsG.removeClass('layui-layer-TipsL').addClass('layui-layer-TipsR').css('border-bottom-color',config.tips[1]);
            },
            function(){//下
                goal.autoLeft();
                goal.tipTop = goal.top + layArea[1] + 10//top值
                tipsG.removeClass('layui-layer-TipsT').addClass('layui-layer-TipsB').css('border-right-color',config.tips[1]);
            },
            function(){//左
                goal.tipLeft = goal.left - layArea[0] - 10;
                goal.tipTop = goal.top;
                tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsL').css('border-bottom-color',config.tips[1]);//后面css没看懂
            }
        ]

        //初始化坐标定位
        goal.where[guide - 1]();


        /* 8*2为小三角形占据的空间 */

        if(guide === 1){
            goal.top - (win.scrollTop() + layArea[1] + 8 * 2) < 0 && goal.where[2]();//下边显示(向上显示不下了)
        }else if(guide == 2){
            win.width() - (goal.left + goal.width + layArea[0] + 8 * 2) > 0 || goal.where[3]();//向左显示（右边显示不下了）
        }else if(guide == 3){
            goal.top + layArea[1] + 8 * 2 - (win.height() + win.scrollTop()) > 0 && goal.where[0]();//向上显示（底部显示不下了）
        }else if(guide == 4){
            layArea[0] + 8 * 2 - goal.left > 0 && goal.where[1]();
        }
        //是否设置关闭按钮
        layero.find('.' + doms[5]).css({
            'background-color' : config.tips[1],
            'padding-right' : (config.closeBtn ? '30px' : '')
        })
        //设置坐标
        layero.css({
            left : goal.tipLeft - (config.fixed ? win.scrollLeft() : 0),
            top : goal.tipTop - (config.fixed ? win.scrollTop() : 0)
        })
    }
    //拖拽(牛皮)
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
        moveElem.on('mousedown',function(e){//title拖拽
            e.preventDefault();
            if(config.move){
                dict.moveStart = true;
                dict.offset = [//计算鼠标点距离弹层的距离
                    e.clientX - parseFloat(layero.css('left')),
                    e.clientY - parseFloat(layero.css('top'))
                ]
                ready.moveElem.css('cursor','move');
            }
        })

        resizeElem.on('mousedown',function(e){//右下角拉伸
            e.preventDefault();
            dict.resizeStart = true;
            dict.offset = [e.clientX,e.clientY];
            dict.area = [layero.outerWidth(),layero.outerHeight()];

            ready.moveElem.css('cursor','se-resize');
        })
        _DOC.on('mousemove',function(e){
            if(dict.moveStart){//开启移动
                var X = e.clientX - dict.offset[0],//移动后弹层的left
                    Y = e.clientY - dict.offset[1],//移动后弹层的top
                    fixed = layero.css('position') === 'fixed';//是否固定在视口
                e.preventDefault();
                    //随页面滚动（需要加上滚动的距离）
                dict.stX = fixed ? 0 : win.scrollLeft();
                dict.stY = fixed ? 0 : win.scrollTop();
                //临界值判断(是否允许拖拽出窗口外)
                if(!config.moveOut){
                    var setRig = win.width() - layero.outerWidth() + dict.stX,//向右移动的最大距离
                        setBot = win.height() - layero.outerHeight() + dict.stY;//向下的最大距离
                    X < dict.stX && (X = dict.stX);
                    X > setRig && (X = setRig);
                    Y < dict.stY && (Y = dict.stY);
                    Y > setBot && (Y = setBot);
                }
                layero.css({left: X,top : Y});
            }
            //右下角拉伸缩放
            if(config.resize && dict.resizeStart){
                var X = e.clientX - dict.offset[0],
                    Y = e.clientY - dict.offset[1];

                e.preventDefault();

                //设置弹层样式
                layer.style(that.index,{//X,Y可能为负值
                    width : dict.area[0] + X,
                    height : dict.area[1] + Y
                })
                dict.isResize = true;
                config.resizing && config.resizing(layero);
            }
        }).on('mouseup',function(e){
            if(dict.moveStart){//关闭移动
                delete dict.moveStart;
                ready.moveElem.hide();//不明白这个元素的作用
                config.moveEnd && config.moveEnd(layero);
            }

            if(dict.resizeStart){//关闭拉伸
                delete dict.resizeStart;
                ready.moveElem.hide();
            }
        });
        return that;
    }
    //绑定事件
    Class.pt.callback = function(){
        var that = this,config = that.config,layero = that.layero;
        //按钮绑定事件
        layero.find('.' + doms[6]).children('a').on('click',function(){
            var index = $(this).index();
            if(index == 0){//第一个按钮处理事件
                if(config.yes){
                    config.yes(that.index,layero);
                }else if(config['btn1']){
                    config['btn1'](that.index,layero);
                }else{//取消
                    layer.close(that.index);
                }
            }else{//index+1按钮事件(callback使用 return false则不会关闭弹层)
                var close = config['btn' + (index + 1)] && config['btn' + (index + 1)](that.index,layero);
                close === false || layer.close(that.index);
            }
        })
        function cancel(){
            // var close = config.cancel && config.cancel(that.index,layero);
            layer.close(that.index);
        }
        //右上角关闭的回调
        layero.find('.' + doms[7]).on('click',cancel);
        //判断end事件是否存在
        config.end && (ready.end[that.index] = config.end)
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
            }else{
                layero[0].innerHTML = '';
                layero.remove();
            }
            typeof ready.end[index] === 'function' && ready.end[index]();

            delete ready.end[index];
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
    //关闭所有层
    layer.closeAll = function(){};
    //设置指定层的样式
    layer.style = function(index,options,limit){
        var layero = $("#" + doms[0] + index),
            contElem = layero.find('.layui-layer-content'),
            type = layero.attr('type'),
            titleHeight = layero.find(doms[1]).outerHeight() || 0,
            btnHeight = layero.find('.' + doms[6]).outerHeight() || 0,
            minLeft = layero.attr('minLeft');

        if(type === ready.type[3] || type === ready.type[4]){//loading层 tips层
            return;
        }

        if(!limit){
            if(parseFloat(options.width) <= 260){//最小宽度
                options.width = 260;
            }
            if(parseFloat(options.height) - titleHeight - btnHeight <= 64){//设置碳层的临界值
                options.height = 64 + titleHeight + btnHeight;
            }
        }

        layero.css(options);//设置content宽高
        btnHeight = layero.find('.' + doms[6]).outerHeight();

        contElem.css({//重新设置内容体高度(之前写在标签中)
            height : parseFloat(options.height) - titleHeight - btnHeight
            - parseFloat(contElem.css('padding-top')) - parseFloat(contElem.css('padding-bottom'))
        })
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
    window.layui && layui.define ? (//layuiJs加载
            layer.ready(),
                layui.define(['jquery'],function(exports){
                    layer.path = layui.cache.dir;
                    ready.run(layui.jquery);

                    window.layer = layer;
                    exports('layer',layer);
                })
        ) : (
            typeof define === 'function' ? define(['jquery'],function(){//requireJs加载
                    ready.run(window.jQuery)
                }) : function(){//普通js加载
                        ready.run(window.jQuery);
                        layer.ready();
                }()
        )
}(window)
