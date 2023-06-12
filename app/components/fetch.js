import { getToken } from '../services/storage.js';
import { API_URL } from './common.js';

export async function getData(url = '') {
    var token = await getToken();
    return await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'cache-control': 'no-cache'
        }
    }).then(async (response) => {
        if (response.ok) {
            // you can call response.json() here too if you want to return json
            var data = [];
            
            if (response.status !== 204) {
                var promise = response.json();
                await promise.then(x => data = x);
            }
            return {
                ok: response.ok,
                status: response.status,
                data: data,
            }
        } else {
            //handle errors in the way you want to
            // var data = null;
            var promise = response.json();
            // await promise.then(x => data = x);
            // console.log('promise', promise, 'url',url);
            var message = '';
            switch (response.status) {
                case 401:
                    message = "Unauthorized"
                    break;
                case 404:
                    message = 'Object not found';
                    break;
                case 500:
                    message = 'Internal server error';
                    break;
                default:
                    message = 'Some error occured';
                    break;
            }
            return {
                ok: response.ok,
                status: response.status,
                data: message,
            }
        }
    }).then(json => json);
}

export async function postData(url = '', data = {}) {
    return await fetchData(url, data);
}

export async function putData(url = '', data = {}) {
    return await fetchData(url, data, 'PUT');
}

export async function deleteData(url = '', data = {}) {
    return await fetchData(url, data, 'DELETE');
}

export async function fetchData(url = '', data = {}, method = 'POST') {
    var token = await getToken();
    return await fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token,
            'cache-control': 'no-cache'
        },  
        body: JSON.stringify(data),

    }).then(async (response) => {
        if (response.ok) {
            // you can call response.json() here too if you want to return json
            var data = [];
            if (response.status !== 204) {
                var promise = response.json();
                await promise.then(x => data = x);
            }
            return {
                ok: response.ok,
                status: response.status,
                data: data,
            }

        } else {

            var promise = await response.json();
            //handle errors in the way you want to
            var message = '';
            switch (response.status) {
                case 401:
                    message = "Access Denied"
                    break;
                case 403:
                    message = "Forbidden Access"
                    break;
                case 404:
                    message = 'Object not found';
                    break;
                case 500:
                    message = 'Internal server error';
                    break;
                default:
                    message = 'Some error occured';
                    break;
            }
            return {
                ok: response.ok,
                status: response.status,
                data: message,
                err: promise.message
            }
        }

    }).then(json => json);
}


export async function form_data_upload(url = '', data = {}, method = 'PUT') {
    var token = await getToken();
    body = new FormData();
    for (let key in data) {
        body.append(key, data[key]);
    }
    return await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'multipart/form-data',
            'authorization': 'Bearer ' + token,
            'cache-control': 'no-cache'
        },  
        body: body,

    }).then(async (response) => {
        if (response.ok) {

            // you can call response.json() here too if you want to return json
            var data = [];
            if (response.status !== 204) {
                var promise = response.json();
                await promise.then(x => data = x);
            }
            return {
                ok: response.ok,
                status: response.status,
                data: data,
            }

        } else {

            var promise = await response.json();
            //handle errors in the way you want to
            var message = '';
            switch (response.status) {
                case 401:
                    message = "Access Denied"
                    break;
                case 403:
                    message = "Forbidden Access"
                    break;
                case 404:
                    message = 'Object not found';
                    break;
                case 500:
                    message = 'Internal server error';
                    break;
                default:
                    message = 'Some error occured';
                    break;
            }
            return {
                ok: response.ok,
                status: response.status,
                data: message,
                err: promise.message
            }
        }

    }).then(json => json);
    // let options = {
    // headers: {
    //     'Content-Type': 'multipart/form-data',
    //     'Authorization':  `Bearer ${token}`
    // },
    // method: method
    // };

    // options.body = new FormData();
    // for (let key in data) {
    //     options.body.append(key, data[key]);
    // }
    // return await fetch(url, options)
    // .then(response => {
    //     console.log(response)
    // });
}