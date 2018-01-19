/**
 * @fileName : SearchNull.js
 * @author : ykx 
 * @createTime : 2018/1/13
 * @desc : 搜索结果为空页面
 */
Component({
    options : {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties : {
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

        placeholder : {
            type : 'String',
            value : ''
        },
        fieldName : {
            type : 'String',
            value : ''
        },
        fieldType : {
            type : 'String',
            value : 'text'
        },
        fieldVal : {
            type : 'String',
            value : ''
        },
        //默认不限制
        maxLength : {
            type : 'Number',
            value : 9999
        },

    },
    methods : {
        /*myEventOption
         * bubbles	Boolean	否	false	事件是否冒泡
         *  composed	Boolean	否	false	事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
         *  capturePhase	Boolean	否	false	事件是否拥有捕获阶段
         */
        handleInput(e){
            let myEventDetail = e.currentTarget.dataset,myEventOption = {};
            let val = e.detail.value;
            val && (myEventDetail.value = val);
            this.triggerEvent('onchange',myEventDetail,myEventOption);
        }
    }
})