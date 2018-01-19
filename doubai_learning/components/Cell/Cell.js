/**
 * @fileName : SearchNull.js
 * @author : ykx 
 * @createTime : 2018/1/13
 * @desc : 搜索结果为空页面
 */
Component({
    properties : {
        //是否显示左边图标
       labelIcon : {
           type : 'String',
           value : ''
       },
       isNeedBorderTop : {
           type : 'Boolean',
           value : true
       },
        labelText : {
            type : 'String',
            value : ''
        },
        cellRightText : {
            type : 'String',
            value : ''
        },
        linkUrl : {
            type : 'String',
            value : ''
        },
        isShowArrow : {
            type : 'Boolean',
            value : false
        },//是否显示箭头
        arrowType : {
            type : 'String',
            value : ''
        }
    },
    methods : {
        /*myEventOption
         * bubbles	Boolean	否	false	事件是否冒泡
         *  composed	Boolean	否	false	事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
         *  capturePhase	Boolean	否	false	事件是否拥有捕获阶段
         */
        onChangeVal(e){
            let myEventDetail = e.currentTarget.dataset,myEventOption = {};
            this.triggerEvent('onclick',myEventDetail,myEventOption);
        }
    }
})