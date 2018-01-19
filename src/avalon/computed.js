// var vm = avalon.define({
//     $id: "duplex1",
//     data: [],
//     allchecked: false,
//     // selectedArr : [],
//     $computed : {
//
//     },
//     selectedArr : function () {
//         var tempArr = [];
//
//         this.data.forEach(function (item) {
//
//             if(item.checked){
//                 tempArr.push(1);
//             }
//         })
//         return tempArr;
//     },
//
//     init : function () {
//       this.data = [{checked: false},  {checked: false},{checked: false}];
//         console.log(this.data)
//     },
//     //不用计算属性,改用方法操作
//
//     checkAll: function (e) {
//         var checked = e.target.checked
//         vm.data.forEach(function (el) {
//             el.checked = checked
//         })
//     },
//     checkOne: function (el) {
//         // var checked = e.target.checked
//         el.checked = !el.checked;
//         // this.data.set(index,{checked: !el.checked});
//         console.log(this.data.$model);
//         // if (checked === false) {
//         //     vm.allchecked = false
//         // } else {//avalon已经为数组添加了ecma262v5的一些新方法
//         //     vm.allchecked = vm.data.every(function (el) {
//         //         return el.checked
//         //     })
//         // }
//     }
// })
//
// avalon.scan(document.body)
// avalon.ready(vm.init())


var app = new Vue({
    el: '#duplex1',
    data: function(){
        return {
            optData: []
        }

    },
    computed : {
        selectedArr : function () {
            var tempArr = [];
            this.optData.forEach(function (item) {

                if(item.checked){
                    tempArr.push(1);
                }
            })
            return tempArr;
        }
    },
    mounted : function () {
      this.optData = [{checked: false},  {checked: false},{checked: false}];
    },
    methods : {
        checkOne: function (el) {
        // var checked = e.target.checked
        el.checked = !el.checked;
        // this.data.set(index,{checked: !el.checked});
        // if (checked === false) {
        //     vm.allchecked = false
        // } else {//avalon已经为数组添加了ecma262v5的一些新方法
        //     vm.allchecked = vm.data.every(function (el) {
        //         return el.checked
        //     })
        // }
    }
    }
})