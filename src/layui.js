/**
 * Created by Administrator on 2017/10/13.
 * layui框架 学习
 */
;!(function(win){
    "use strict";
    var doc = document,config = {
        modules : {},//模块的物理路径
        timeout : 10,//模块的请求秒数
        status : {},//纪录模块的加载状态
        event : {}
    },
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',//判断是否是欧朋浏览器
        Layui = function(){//layui构造函数
        this.v = "1.1.0";
    },
        modules = {//内置模块路径
            element : 'modules/element',//常用元素模
            layer : 'modules/layer',//弹层模块
            jquery : 'modules/jquery'//jq模块
    },
    //获取layui.js所在的目录
        getPath = function(){
            var js = doc.scripts,//获取所有的script列表;
                jsPath = js[js.length - 1].src;//获取当前js引入路径
                return jsPath.substring(0,jsPath.lastIndexOf('/') + 1);//截取0 - 最后一个/的值
        }(),
    //异常提示
    error = function(msg){
            win.console && console.error &&  console.error('layui hint :' + msg);
    }
    //定义模块
    Layui.prototype.define = function(deps,callback){
            var that = this,
                type = typeof deps === 'function',
                mods = function(){
                    typeof callback === 'function' && callback(function(app,exports){
                        layui[app] = exports;//将实例对象添加到layui实例属性中
                        config.status[app] = true//当前模块加载完毕
                    })
                    return this;
                }
            type && (callback = deps,deps = []);
                that.use(deps,mods);//使用依赖模块
                return that;
    }
    //使用特定的模块
    Layui.prototype.use = function(apps,callback,exports){
        var that = this,
            dir = config.dir = config.dir ? config.dir : getPath,//当前js所在的路径
            head = doc.getElementsByTagName('head')[0];//用于动态添加script/css

            apps = typeof apps === 'string' ? [apps] : apps;//确保传入的为数组类型
            //判断页面是否已经存在jq
            if(window.jQuery && jQuery.fn.on){
                that.each(apps,function(index,item){
                    if(item == 'jquery'){//去除jq加载
                        apps.splice(index,1);
                    }
                })
                layui.jquert = layui.$ = jQuery;
            }

            var item = apps[0],
                timeout = 0,
                exports = exports || [];
            //静态资源host
            config.host = config.host || (dir.match(/\/\/([\s\S]+?)\//) || ['//' + location.host + '/'])[0];
            //这里先不判断是否使用了layui.all.js


            //js加载完毕
        function onScriptLoad(e,url){
            var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/;
            if(e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))){//判断是否加载成功
                config.modules[item] = url;
                head.removeChild(node);

                (function poll(){
                    if(++timeout > config.timeout * 1000 / 4){
                        return error(item + 'is not a valid module');//js加载超时
                    };
                    config.status[item] ? onCallback() : setTimeout(poll,4);
                })()
            }
        }
        //回调(暂时不明白)
        function onCallback(){
            exports.push(layui[item]);
            apps.length > 1 ?
                that.use(apps.slice(1),callback,exports) :
                (typeof callback == "function" && callback.apply(layui,exports));
        }
        //无依赖时,直接执行回调
        if(apps.length == 0){
            return onCallback(),that;
        }
        //首次加载模块
            if(!config.modules[item]){
                //构建引入模块的script标签
                var node = doc.createElement('script'),
                    url = (modules[item] ? (dir + 'lay/') : (config.base || '')) + //前面路径
                        (that.modules[item] || item) + '.js';//js文件名
                node.async = true;
                node.chartset = 'utf-8';
                node.src = url + function(){
                    var version = config.version === true ? //是否添加版本
                        (config.v || (new Date().getTime())) :
                        (config.version || '');
                        return version ? ('?v=' + version) : '';
                    }();
                    //引入对应script
                head.appendChild(node);

                //监听引入的script是否加载完毕(浏览器兼容)
                if(node.attachEvent && (node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code]') < 0) && !isOpera){

                }else{
                    node.addEventListener('load',function(e){

                        onScriptLoad(e,url);
                    },false)
                }
                config.modules[item] = url;
            }
        };
    //记录基础数据
    Layui.prototype.cache = config;
    //自定义模块事件
    Layui.prototype.onevent = function(modName,events,callback){
        if(typeof modName !== 'string' || typeof callback !== 'function'){return this};
        config.event[modName + '.' + events] = [callback];//添加到事件对象中,存入数组each遍历

        return this;
    }
    //执行自定义模块事件
    Layui.prototype.event = function(modName,events,params){
        var that = this,
            result = null,
            filter = events.match(/\(.*\)$/) || [],//提取filter名称
            set = (events = modName + '.' + events).replace(filter,''),//提取事件本体名称
            callback = function(_,item){
                var res = item && item.call(that,params);
                res === false && res === null && (result = false);
            };

        layui.each(config.event[set],callback);//事件本体
        //执行filter中函数
        filter[0] && layui.each(config.event[events],callback);
        return result;
    }
    //获取设备信息
    Layui.prototype.device = function(key){
        //返回浏览器代理（用于判断浏览器类型）
        var agent = navigator.userAgent.toLowerCase(),

        //获取版本号
        getVersion = function(label){
            var exp = new RegExp(label + '/([^\\s\\_\\-]+)');
            label = (agent.match(exp) || [])[1];

            return label || false;
        },
            result = {
            os : function(){//获取操作系统
                if(/windows/.test(agent)){
                    return 'windows';
                }else if(/linux/.test(agent)){
                    return 'linux';
                }else if(/iphone|ipod|ipad|ios/.test(agent)){
                    return 'ios';
                }else if(/mac/.test(agent)){
                    return 'mac';
                }
            }(),
            ie : function(){//获取ie版本
                    return (!!window.ActiveXObject || 'ActiveXObject' in win) ?
                        ((agent.match(/msie\s(\d+)/) || [])[1] || '11') : false //ie 11 没有msie标识
            }(),
            weixin : getVersion('micromessenger')//是否为微信
        };

        if(key && !result[key]){
            result[key] = getVersion(key);
        }

        result.android = /android/.test(agent);
        result.ios = result.os === 'ios';

        return result;
    }
    //获取节点的style属性值(外部样式)
    Layui.prototype.getStyle = function(node,name){
        var style = node.currentStyle ? node.currentStyle : win.getComputedStyle(node,null);//浏览器兼容（ie currentStyle）
        return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);//获取属性值(基本可以总结为attribute节点都是在HTML代码中可见的，而property只是一个普通的名值对属性。)
    }
    //css外部加载
    Layui.prototype.link = function(href,fn,cssname){
        var that = this,
            link = doc.createElement('link'),
            head = doc.getElementsByTagName('head')[0];

            if(typeof fn == 'string'){//当无回调函数参数时
                cssname = fn;
            }
            var app = (cssname || href).replace(/\.|\//g,''),
                id = link.id = 'layuicss-' + app,
                timeout = 0;
            link.rel = 'stylesheet';
            link.href = href + (config.debug ? '?v=' + new Date().getTime() : '');

            link.media = 'all';
            if(!doc.getElementById(id)){
                head.appendChild(link);
            }

            if(typeof fn !== 'function'){return that}

            //轮询css是否加载完毕
            (function poll(){
                if(++timeout > config.timeout * 1000 / 100){
                    return error (href + ' timeout');//加载css超时
                };
                parseInt(that.getStyle(doc.getElementById(id),'width')) === 1989 ? function(){
                        fn();
                    }() : setTimeout(poll,100)
            }())
            return that;
    }
    //加载样式(css内部加载)
    //config.dir + 'css/' + firename为css的绝对路径
    Layui.prototype.addcss = function(firename,fn,cssname){
        return layui.link(config.dir + 'css/' + firename,fn,cssname)
    }
    //遍历方法
    Layui.prototype.each = function(obj,fn){
        var key,that = this;
        if(typeof fn != 'function'){return that};
        obj = obj || [];
        if(obj.constructor === Object){//对象遍历
            for(key in obj){
                if(fn.call(obj[key],key,obj[key])){
                    break;
                }
            }
        }else{//数组遍历
            for(key = 0;key < obj.length;key ++){
                if(fn.call(obj[key],key,obj[key])){
                    break;
                }
            }
        }
        return that;
    },
        //提示
        Layui.prototype.hint = function(){
            return {
                error : error
            }
        }

    //全局配置
    Layui.prototype.modules = function(){
        var clone ={};//拷贝一份
        for(var o in modules){
            clone[o] = modules[o];
        }
        return clone;
    }()
    window.layui = new Layui();
})(window)
