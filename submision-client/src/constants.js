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
    ANALYSIS_VERIFY: '/analysis/verify',
    ANALYSIS_UPDATE: '/analysis/update'
}

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

const COLORS = {
    STATUS_COLORS: {
        NEW: 'info',
        ANALYSED: 'primary',
        VERIFIED: 'success'
    }
}


export {EDIT_MODES, RANDOM_COLORS, COLORS, ENDPOINTS, get, post, put};