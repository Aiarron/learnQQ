import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getSingerList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

    const data = Object.assign({} ,commonParams, {
        channel: 'singer',
        pagesize: 100,
        pagenum: 1,
        page: 'list',
        key: 'all_all_all',
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'
    })

    return jsonp(url, data, options)
}