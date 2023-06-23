import axios from 'axios';

class Request {
    constructor(requeseConfig) {
        this.instance = axios.create(requeseConfig)
    }

    request(config) {
        return new Promise((resolve, reject) => {
            this.instance?.request(config)
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    get(url, params) {
        return new Promise((resolve, reject) => {
            this.instance?.get(url, { params: params })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err.data)
                })
        })
    }

    post(url, data = {}) {
        return new Promise((resolve, reject) => {
            this.instance?.post(url, data)
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err.data)
                })
        })
    }

}

export default Request
