var vm = avalon.define({
    $id: "duplex1",
    data: [{checked: false},  {checked: false},{checked: false}],
    allchecked: false,
    // selectedArr : [],
    // $computed : {
    //
    // },
    //不用计算属性,改用方法操作
    selectedArr : function () {
        var tempArr = [];

        this.data.forEach(function (item) {

            if(item.checked){
                tempArr.push(1);
            }
        })
        return tempArr;
    },
    checkAll: function (e) {
        var checked = e.target.checked
        vm.data.forEach(function (el) {
            el.checked = checked
        })
    },
    checkOne: function (el) {
        // var checked = e.target.checked
        el.checked = !el.checked;
        // this.data.set(index,{checked: !el.checked});
        console.log(this.data.$model);
        // if (checked === false) {
        //     vm.allchecked = false
        // } else {//avalon已经为数组添加了ecma262v5的一些新方法
        //     vm.allchecked = vm.data.every(function (el) {
        //         return el.checked
        //     })
        // }
    }
})

avalon.scan(document.body)


// var app = new Vue({
//     el: '#app',
//     data: function(){
//         return {
//             optData: [{checked: false},  {checked: false},{checked: false}]
//         }
//
//     },
//     computed : {
//         selectedArr : function () {
//             var tempArr = [];
//             this.optData.forEach(function (item) {
//
//                 if(item.checked){
//                     tempArr.push(1);
//                 }
//             })
//             return tempArr;
//         }
//     },
//
//     methods : {
//         checkOne: function (el) {
//         // var checked = e.target.checked
//         el.checked = !el.checked;
//         // this.data.set(index,{checked: !el.checked});
//         // if (checked === false) {
//         //     vm.allchecked = false
//         // } else {//avalon已经为数组添加了ecma262v5的一些新方法
//         //     vm.allchecked = vm.data.every(function (el) {
//         //         return el.checked
//         //     })
//         // }
//     }
//     }
// })