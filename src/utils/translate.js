
// 封装百度翻译api
import Vue from 'vue'
import App from '../../src/App.vue'
import { MD5 } from '../utils/md5'
import store from '../store/index'
import axios from 'axios'
import { MessageBox , Loading  } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// from 传入参数为 String  -- 被转换的语言

// to 传入参数为 String  -- 需要转换的语言

// query 传入参数为 any类型  -- 内容
export let  translate = async function ( from , to , query ) {
    // console.log(store.state.translateForm)

    let appid = '20211126001010602'

    var  from =  from || 'zh'

    query || ''

    var  to  =  store.state.translateForm ||  'en'


    let salt = (new Date).getTime();

    let key = 'sZ9rkbsKViqfyqElAqP3'

    // let loadingInstance = Loading.service('正在努力翻译中...');
    

    let sign = MD5(appid + query + salt + key)
    /* return await axios({
        url:'https://api.fanyi.baidu.com/api/trans/vip/translate',
        method: 'get',
        data: {
            q: query,
            from: from,
            to: to,
            appid: appid,
            salt: salt,
            sign: sign
        }
      }).then((res) => {
        // loadingInstance.close();
        console.log(res)
        if(res.status == 200){
            return  res.data.trans_result[0].dst
        }else{
            return '翻译出错啦，请稍后再试！'
        }
        
    }) */
    
    return await axios.get(`/baidu?q=${query}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`).then((res) => {
        // loadingInstance.close();
        console.log(res)
        if(res.status == 200){
            return  res.data.trans_result[0].dst
        }else{
            return '翻译出错啦，请稍后再试！'
        }
        
    })
}

