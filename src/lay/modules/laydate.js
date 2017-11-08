/**
 * Created by lenovo on 2017/11/7.
 */
;!function(){
    'use strict'
    var isLayui = window.layui && layui.define,MOD_NAME = 'laydate',
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
    //普通对象的深度扩展
    lay.extend = function(){
        var ai = 1,args = arguments,
            clone = function (target,obj) {
                target = target || (obj.constructor === Array) ? [] : {};
                //值为对象,则递归深度合并
                for(var i in obj){
                    target[i] = (obj[i] && (obj[i].constructor === Object)) ?
                        clone(target[i],obj[i]) : obj[i];
                }

                return target;
            };

        args[0] = typeof args[0] === 'object' ? args : {};

        for(;ai < args.length;ai++){
            if(typeof args[ai] === 'object'){
                clone(args[0],args[ai]);
            }
        }

        return args[0];//返回整合后的对象
    }
    //构造器
    Class = function(options){
        var that = this;
        that.index = ++laydate.index;
        this.config = lay.extend({},that.config,options);//整合参数

        laydate.ready(function(){
            that.init();
        })
    };
    //默认配置项
    Class.prototype.config = {

    };
    //初始准备
    Class.prototype.init = function(){

    }
    //入口
    laydate.render = function(options){
        var inst = new Class(options);

    }

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