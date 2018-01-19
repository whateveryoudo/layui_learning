export default {
    getTime(){//获取当前时间
        var time = new Date()
        var hours = time.getHours()
        hours = hours < 10 ? '0' + hours : hours
        var minute = time.getMinutes()
        minute = minute < 10 ? '0' + minute : minute
        var second = time.getSeconds()
        second = second < 10 ? '0' + second : second
        return [hours, minute, second].join(':')
    },
    getDate(sign){//获取当前日期
        sign = sign || '-';
        let time = new Date(),
            year = time.getFullYear(),
            month = time.getMonth() < 10 ? '0' + time.getMonth() : time.getMonth(),
            day = time.getDay() < 10 ? '0' + time.getDay() : time.getDay();
        return [year,month,day].join(sign);
    }
}
