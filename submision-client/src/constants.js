import axios from 'axios';

const EDIT_MODES = {
    OBSERVE: 'OBSERVE',
    PAN: 'PAN'
}

const RANDOM_COLORS = [];

for(let i =0 ;i<20;i++) {
    RANDOM_COLORS.push(`hsl(${parseInt(Math.random() * 360)},100%,55%)`);
}

const HOST = 'http://localhost:5000';

const ENDPOINTS = {
    ANALYSIS_ALL: '/analysis/',
    ANALYSIS_ONE: '/analysis/$formId',
    ANALYSIS_VERIFY: '/analysis/$formId/page/$pageOrderNumber/verify',
    ANALYSIS_UPDATE: '/analysis/$formId/page/$pageOrderNumber/update',
    COLLECTOR: '/collector/$formId',
    COLLECTOR_JSON: '/collector/$formId/json',
    COLLECTOR_TOPIC_STATISTICS: '/collector/$formId/topic/$topicId'
}

//default 5000
const REFRESH_INTERVAL = 30000;

const KEYS = {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    ENTER: 'Enter',
    SPACE: 'Space',
    ESC: 'Escape',
    M: 'KeyM',
    O: 'KeyO'
};

const KEYS_VALUES = Object.values(KEYS);

const get = async (endpoint, params) => {
    if (endpoint === undefined) {
        throw new Error(`Endpoint ${endpoint} does not exist. Either you forgot to define the endpoint or the request was made wrong`);
    }

    let url = `${HOST}${endpoint}`;

    if (params) {    
        Object.keys(params).forEach(key => {
            url = url.split(`$${key}`).join(params[key]);
        })
    } 

    if (url.indexOf('$') !== -1) {
        throw new Error(`Not all parameters filled. For endpoint ${endpoint} you forgot to add parameters or misspelled one of the parameters`);
    }
    
    return await axios.get(url);
}

const post = async (endpoint, params, body) => {
    if (endpoint === undefined) {
        throw new Error(`Endpoint ${endpoint} does not exist. Either you forgot to define the endpoint or the request was made wrong`);
    }

    let url = `${HOST}${endpoint}`;

    if (params) {    
        Object.keys(params).forEach(key => {
            url = url.split(`$${key}`).join(params[key]);
        })
    } 

    if (url.indexOf('$') !== -1) {
        throw new Error(`Not all parameters filled. For endpoint ${endpoint} you forgot to add parameters or misspelled one of the parameters`);
    }
    
    return await axios.post(url, body);
}

//todo add object to ther request

const put = async ({endpoint, params, body}) => {
    if (endpoint === undefined) {
        throw new Error(`Endpoint ${endpoint} does not exist. Either you forgot to define the endpoint or the request was made wrong`);
    }

    let url = `${HOST}${endpoint}`;

    if (params) {    
        Object.keys(params).forEach(key => {
            url = url.split(`$${key}`).join(params[key]);
        })
    } 

    if (url.indexOf('$') !== -1) {
        throw new Error(`Not all parameters filled. For endpoint ${endpoint} you forgot to add parameters or misspelled one of the parameters`);
    }
    
    return await axios.put(url, body);
}


const remove = async ({endpoint, params}) => {
    if (endpoint === undefined) {
        throw new Error(`Endpoint ${endpoint} does not exist. Either you forgot to define the endpoint or the request was made wrong`);
    }

    let url = `${HOST}${endpoint}`;

    if (params) {    
        Object.keys(params).forEach(key => {
            url = url.split(`$${key}`).join(params[key]);
        })
    } 

    if (url.indexOf('$') !== -1) {
        throw new Error(`Not all parameters filled. For endpoint ${endpoint} you forgot to add parameters or misspelled one of the parameters`);
    }
    
    return await axios.delete(url);
}

const COLORS = {
    STATUS_COLORS: {
        NEW: 'info',
        ANALYSED: 'primary',
        VERIFIED: 'success'
    },
    CATEGORIES: [
        '#ea31ff',
        '#ff317d',
        '#ffd231',
        '#31a2ff',
        '#6131ff',
        '#c831ff',
        '#29ff9f',
        '#297bff',
        '#ff2954'
    ]
}




export {EDIT_MODES, RANDOM_COLORS, COLORS, KEYS, KEYS_VALUES, ENDPOINTS, REFRESH_INTERVAL, get, post, put, remove};