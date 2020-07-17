import request from '@/utils/request';

export function getCategory(data) {
    return request.get('/getCategory',{
        data
    })
}