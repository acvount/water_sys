import axios from 'axios'
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
        const res = response.data
        return res;
    },
    error => {
        console.log('err' + error)
        Message({
            message: `${error.message}-[连接超时,请重新刷新]`,
            type: 'error',
            duration: 5 * 1000
        })
        hideLoading();
        return Promise.reject(error)
    }
)

export default request;
