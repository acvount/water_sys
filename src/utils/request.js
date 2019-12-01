import axios from 'axios'
import Router from 'vue-router'
import {
    Message,
    MessageBox,
    Loading
} from 'element-ui'

const request = axios.create({
    baseURL: '/api',
    timeout: 20000,
})

request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

request.interceptors.response.use(
    response => {
        if (response.data.code == 6) {
            localStorage.removeItem("Authorization");
            localStorage.removeItem("userInfo");
            location.reload()
        } else {
            const res = response.data
            return res;
        }
    },
    error => {
        console.log('err' + error)
        Message({
            message: `${error.message}-[连接超时,请重新刷新]`,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default request;
