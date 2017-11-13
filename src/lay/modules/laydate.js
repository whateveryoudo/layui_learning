/**
 * Created by lenovo on 2017/11/7.
 */
;!function(){
    'use strict'
    var isLayui = window.layui && layui.define,
        ready = {
        //获取指定节点的属性值
            getStyle : function(node,name){
                //node.currentStyle  ie ,是一个可以获取当前元素所有最终使用的CSS属性值。返回的是一个CSS样式声明对象([object CSSStyleDeclaration])，只读
                var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node,null);

                return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'][name];
            },
        getPath : function(){
            var js = document.scripts,script = js[js.length - 1],jsPath = script.src;
            if(script.getAttribute('merge')){return};
            return jsPath.substring(0,jsPath.lastIndexOf('/') + 1);//去除/作当前js的路径
        }(),//获取当前js的路径
        //载入css配件
        link : function(href,fn,cssname){
                if(!laydate.path){return}

                //构建link元素加载css
                var head = document.getElementsByTagName('head')[0],link = document.createElement('link');
                //处理无回调参数
                if(typeof fn === 'string'){cssname = fn};

                var app = (cssname || href).replace(/\.|\//g,'');//去除所有的.与\作为link的id
                var id = 'layuicss-' + app,timeout = 0;

                link.rel = 'stylesheet';
                link.href = href;
                link.id = id;

                if(!document.getElementById(id)){
                    head.appendChild(link);
                }

                if(typeof fn !== 'function'){return}

                //轮询判断css是否加载完毕
                (function poll(){
                    if(++timeout > 8 * 1000 / 100){//8s
                        //css加载超时
                        return window.console && console.error('laydate.css:Invalid');
                    };
                    parseInt(ready.getStyle(document.getElementById(id),'width')) === 1989 ? fn() : setTimeout(poll,100);
                })()
            }
        },
        laydate = {
            v : '5.0.7',
            index : (window.laydate && window.laydate.v) ? 100000 : 0,
            path : ready.getPath,
            //主体css等待事件
            ready : function(fn){
                var cssname = 'laydate',ver = '',
                    path = (isLayui ? 'modules/laydate/' : 'theme/') + 'default/laydate.css?v=' + laydate.v + ver;//css路径
                isLayui ? layui.addcss(path,fn,cssname) : ready.link(path,fn,cssname);
                return this;
            },
            render : function(){}
        },//默认信息
        //DOM查找
        lay = function(selector){
            return new LAY(selector);
        },
        //字符串常量
        MOD_NAME = 'laydate',ELEM_STATIC = 'layui-laydate-static',ELEM_FOOTER = '.laydate-btns-confirm',
    //构造器
    Class = function(options){
        var that = this;
        that.index = ++laydate.index;
        this.config = lay.extend({},that.config,options);//整合参数

        laydate.ready(function(){
            that.init();
        })
    },
    //DOM构造器
    LAY = function(selector){
        var index = 0,
            nativeDOM = typeof selector === 'object' ? [selector] :
                document.querySelectorAll(selector || null);//获取nodeList类对象数组
        for(;index < nativeDOM.length;index++){
            this.push(nativeDOM[index])
        }
    };
    //lay对象操作
    LAY.prototype = [];
    //将原型只会LAY
    LAY.prototype.constructor = LAY;
    //添加/获取属性
    LAY.prototype.attr = function(key,value){

        var that = this;
        return value == undefined ? function(){
                if(that.length > 0) {
                    return that[0].getAttribute(key);//获取属性值
                }
            }() : that.each(function(index,item){
                item.setAttribute(key,value);
            })
    }
    //普通对象的深度扩展
    lay.extend = function(){
        var ai = 1,args = arguments,
            clone = function (target,obj) {
                target = target || (obj.constructor === Array ? [] : {});
                //值为对象,则递归深度合并
                for(var i in obj){
                    target[i] = (obj[i] && (obj[i].constructor === Object)) ?
                        clone(target[i],obj[i]) : obj[i];
                }

                return target;
            };

        args[0] = typeof args[0] === 'object' ? args[0] : {};

        for(;ai < args.length;ai++){//跳过[0]项,args[0]作为目标对象
            if(typeof args[ai] === 'object'){
                clone(args[0],args[ai]);
            }
        }

        return args[0];//返回整合后的对象
    }
    //对象遍历
    lay.each = function(obj,fn){
        var key,that = this;
        if(typeof fn !== 'function'){return that;}
        if(obj.constructor === Object){//关联数组遍历
            for(key in obj){
                if(fn.call(obj[key],key,obj[key])){
                    break;
                }
            }
        }else{//索引数组遍历
            for(key = 0;key < obj.length;key ++){
                if(fn.call(obj[key],key,obj[key])){break;}
            }
        }

        return that;
    }
    //创建元素
    lay.elem = function(elemName,attr){
        var elem = document.createElement(elemName);
        lay.each(attr || {},function(key,val){
            elem.setAttribute(key,val);
        })

        return elem;
    }
    /*******封装类似jq基本操作*******/
    //DOM遍历
    LAY.prototype.each = function(fn){
        return lay.each.call(this,this,fn);
    }
    LAY.prototype.on = function(eventName,fn){

    }
    //默认配置项
    Class.prototype.config = {
        type : 'date',//控件的类型 year/month/date/time/datetime
        position : null,
        lang : 'cn',
        range : false,//是否开启日期范围选择
        format : 'yyyy-MM-dd',//默认为日期格式
        trigger : 'focus',//触发方式
        min : '1990-1-1',//最小日期
        max : '2099-12-31',//最大日期
        show : false,//是否直接显示控件
        zIndex : null,//控件的层级
    };
    //多语言
    Class.prototype.lang = function(){
        var that = this,
            options = that.config,
            text = {
                cn : {//中文文字对象
                    weeks : ['日','一','二','三','四','五','六'],
                    time : ['时','分','秒'],
                    timeTips : '选择时间',
                    startTime : '开始时间',
                    endTime : '结束时间',
                    dateTips : '返回日期',
                    month : ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                    tools : {
                        confirm : '确定',
                        clear : '清空',
                        now : '现在'
                    }
                },
                en : {//英文对象
                    weeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
                    ,time: ['Hours', 'Minutes', 'Seconds']
                    ,timeTips: 'Select Time'
                    ,startTime: 'Start Time'
                    ,endTime: 'End Time'
                    ,dateTips: 'Select Date'
                    ,month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    ,tools: {
                        confirm: 'Confirm'
                        ,clear: 'Clear'
                        ,now: 'Now'
                    }
                }
            }

            return text[options.lang] || text['cn'];//默认显示中文
    }
    //判断元素是否是input|textarea
    Class.prototype.isInput = function(elem){
        return /input|textarea/.test(elem.tagName.toLocaleLowerCase());
    }
    //初始准备
    Class.prototype.init = function(){
        var that = this,
            options = that.config,
            dateType = 'yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s',
            isStatic = options.position === 'static',
            format = {
                year : 'yyyy',
                month : 'yyyy-MM',
                date : 'yyyy-MM-dd',
                time : 'HH:mm:ss',
                datetime : 'yyyy-MM-dd HH:mm:ss'
            };
        options.elem = lay(options.elem);//触发元素

        if(!options.elem[0]){return}

        if(options.range === true){options.range = '-'};//时间范围选择符
        //初始化默认format(format为date时会去根据type重新取对应的format)
        if(options.format === format.date){
            options.format = format[options.type];
        }
        //将日期格式转化为数组(例如yyyy-MM-dd 则为[yyyy,-,MM,-,dd])
        that.format = options.format.match(new RegExp(dateType + '|.','g')) || [];

        //生成正则表达式
        that.EXP_IF = '';
        that.EXP_SPLIT = '';
        lay.each(that.format,function(i,item){//不是太清楚(拼接正则字符串)
            var EXP = new RegExp(dateType).test(item)
            ? '\\d{' + function(){
                if(new RegExp(dateType).test(that.format[i == 0 ? i + 1 : i - 1] || '')){
                    if(/^yyyy|y$/.test(item)){
                        return 4;
                    }
                    return item.length;
                }
                if(/^yyyy$/.test(item)){return '1,4'};//长度4位
                    if(/^y$/.test(item)){return '1,308'};
                    return '1,2';
                }() + '}': '\\' + item;
                that.EXP_IF = that.EXP_IF + EXP;
                that.EXP_SPLIT  = that.EXP_SPLIT + '(' + EXP + ')';
        })
        that.EXP_IF = new RegExp('^' + (
            options.range ? that.EXP_IF + '\\s\\' + options.range + '\\s' + that.EXP_IF//含有日期范围
                : that.EXP_IF
            ) + '$');
        that.EXP_SPLIT = new RegExp('^' + that.EXP_SPLIT + '$');

        //判断触发元素是否是input|textarea，不是则采用click事件
        if(!that.isInput(options.elem[0])){
            if(options.trigger == 'focus'){
                options.trigger = 'click';
            }
        }

        //设置唯一的key
        if(!options.elem.attr('lay-key')){
            options.elem.attr('lay-key',that.index);
        }

        //纪录重要日期（开启日历需要）

        //获取限制日期(正则的匹配规则)
        //^ 匹配一个输入或一行的开头，/^a/匹配"an A"，而不匹配"An a"
        //$ 匹配一个输入或一行的结尾，/a$/匹配"An a"，而不匹配"an A"
        //* 匹配前面元字符0次或多次，/ba*/将匹配b,ba,baa,baaa
        //+ 匹配前面元字符1次或多次，/ba+/将匹配ba,baa,baa
        // ? 匹配前面元字符0次或1次，/ba?/将匹配b,ba
        lay.each(['min','max'],function(i,item){
            var ymd = [],hms = [];
            if(typeof options[item] === 'number'){

            }else{//字符串处理
                ymd = (options[item].match(/\d+-\d+-\d+/) || [''])[0].split('-');//获取年月日按照-处理成数组
                hms = (options[item].match(/\d+:\d+:\d+/) || [''])[0].split(':');//获取时分秒-处理成数组
            }
            //将其值存储到对象中(|其实单竖杠“|”就是转换为2进制之后相加得到的结果)
            options[item] = {
                year : ymd[0] | 0 || new Date().getFullYear(),
                month : ymd[1] ? (ymd[1] | 0) - 1 : new Date().getMonth(),
                date : ymd[2] | 0 || new Date().getDate(),
                hours : hms[0] | 0 ,
                minutes : hms[1] | 0 ,
                seconds : hms[2] | 0
            }
        })
        that.elemID = 'layui-laydate' + options.elem.attr('lay-key');
        if(options.show || isStatic){that.render();}

        isStatic || that.events();

        //默认赋值
        if(options.value){
            if(options.value.constructor === Date){
                that.setValue(that.parse(0,that.systemDate(options.value)));
            }else{
                that.setValue(options.value);
            }
        }
    }
    //主体渲染
    Class.prototype.render = function(){
        var that = this,
            options = that.config,
            lang = that.lang(),
            isStatic = options.positions === 'static',

            //主面板
            elem = that.elem = lay.elem('div',{
                id : that.elemID,
                'class' : [
                    'layui-laydate',
                    options.range ? 'layui-laydate-range' : '',
                    isStatic ? (' ' + ELEM_STATIC) : '',
                    options.theme && options.theme !== 'default' && !/^#/.test(options.theme) ? ('laydate-theme-' + options.theme) : ''
                ].join('')}),

            //主区域
            elemMain = that.elemMain = [],
            elemHeader = that.elemHeader = [],
            elemCont = that.elemCont = [],
            elemTable = that.elemTable = [],

            //底部区域
            divFooter = that.footer = lay.elem('div',{ 'class' : ELEM_FOOTER});

            if(options.zIndex) {elem.style.zIndex = options.zIndex};

            //日历区域（单/双）
            lay.each(new Array(2),function(i){
                if(!options.range && i > 0){return true}//单日历控件,只初始化i=0
                //头部区域
                var divHeader = lay.elem('div',{
                    'class' : 'layui-laydate-header'
                }),
                    //左右切换
                   headerChild = [
                       function(){//上一年
                        var elem = lay.elem('i',{
                            'class' : 'layui-icon laydate-icon laydate-prev-y'
                        });
                        elem.innerHTML = '&#xe65a;';//左箭头
                        return elem;
                       }(),
                       function () {//上一月
                           var elem = lay.elem('i',{
                               'class' : 'layui-icon laydate-icon laydate-prev-m'
                           })
                           elem.innerHTML = '&#xe603;';
                           return elem;
                       }(),
                       function () {//年月选择
                           var elem = lay.elem('div',{
                               'class' : 'laydate-set-ym'
                           }),spanY = lay.elem('span'),spanM = lay.elem('span');
                            elem.appendChild(spanY);
                            elem.appendChild(spanM);
                           return elem;
                       }(),
                       function(){
                           var elem = lay.elem('i',{
                               'class' : 'layui-icon laydate-icon laydate-next-m'
                           })
                           elem.innerHTML = '&#xe602;';
                           return elem;
                       }(),
                       function(){//下一年
                           var elem = lay.elem('i',{
                               'class' : 'layui-icon laydate-icon laydate-next-y'
                           });
                           elem.innerHTML = '&#xe65b;';//左箭头
                           return elem;
                       }()
                   ],
                    //日历内容区域
                    divContent = lay.elem('div',{
                        'class' : 'layui-laydate-content'
                    }),
                    table = lay.elem('table'),
                    thead = lay.elem('thead'),
                    theadTr = lay.elem('tr');

                    //生成年月选择
                    lay.each(headerChild,function(i,item){
                        divHeader.append(item);
                    })

                    //生成表格
                    thead.appendChild(theadTr);
                    //6x7表格
                    lay.each(new Array(6),function(i){//表体
                        //每次在最前面插入一行(insertRow() 方法用于在表格中的指定位置插入一个新行。)
                        var tr = table.insertRow(0);
                        lay.each(new Array(7),function(j){
                            if(i == 0){//表头,thead
                                var th = lay.elem('th');
                                th.innerHTML = lang.weeks[j];//th为周1-周天
                                theadTr.appendChild(th);
                            }
                            tr.insertCell(j);//方法用于在 HTML 表的一行的指定位置插入一个空的 <td> 元素。
                        })
                    })
                    table.insertBefore(thead,table.children[0]);//将thead插入到tbody前面

                    divContent.appendChild(table);

                    elemMain[i] = lay.elem('div',{//构建日期list容器元素
                        'class' : 'layui-laydate-main laydate-main-last-' + i
                    })
                    elemMain[i].appendChild(divHeader);
                    elemMain[i].appendChild(divContent);

                    elemHeader.push(headerChild);
                    elemCont.push(divContent);
                    elemTable.push(table);
            })

        //插入到主区域中
        lay.each(elemMain,function(i,main){
            elem.appendChild(main);
        })


        //静态定位插入到指定容器内,否则插入到body中
        isStatic ? options.elem.appendChild(elem) :
            document.body.appendChild(elem);
    }
    //绑定元素处理事件
    Class.prototype.events = function(){

    }
    //系统消息
    Class.prototype.systemDate = function(){

    }
    //赋值
    Class.prototype.setValue = function(){

    }
    //入口
    laydate.render = function(options){
        var inst = new Class(options);

    }
    //暴露lay函数（lay函数包含获取元素,一系列扩展方法）;
    window.lay = window.lay || lay;
    //加载方式
    isLayui ? (
            laydate.ready(),layui.define(function(exports){
                laydate.path = layui.cache.dir;
                exports(MOD_NAME,laydate);
            })
        ):(typeof define === 'function' && define.amd) ? define(function(){
            return laydate;
            }) : function(){
                laydate.ready();
                window.laydate = laydate;
            }();
}()