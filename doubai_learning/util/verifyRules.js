import {$wuxToast} from '../../components/wux'

export const verifyRules =  {
    phone(val,noTip = false){
        if(val == ''){
            !noTip && $wuxToast.show({
                type: 'cancel',
                timer: 1500,
                color: '#fff',
                text: '请输入手机号'
            });
            return false;
        }
        if(!(/^(13[0-9]|14[5|7]|15[0-35-9]|17[0-8]|18[0-9])\d{8}$/).test(val)){
            !noTip && $wuxToast.show({
                type: 'cancel',
                timer: 1500,
                color: '#fff',
                text: '手机号格式错误'
            });
            return false;
        }
        return true;
    }
}