/**
 * @fileName : commonFormat.js
 * @author : ykx 
 * @createTime : 2018/1/19
 * @desc : 集中处理某些formate
 */
const sexFormate = (val) => {
    switch(parseInt(val)){
        case 0:
            return '男士';
        case 1:
            return '女士';
    }
}

export {
    sexFormate
}
