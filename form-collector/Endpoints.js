// const HOST = 'http://192.168.1.105:5000';

//GGG
const SERVER_IP = '192.168.1.106';

//CCC
// const SERVER_IP = '192.168.0.190';
const HOST = `http://${SERVER_IP}:5000`;

const ENDPOINTS = {
    COLLECTOR: (id) => HOST + `/collector/${id}`,
    FORMS: HOST + '/analysis?status=VERIFIED',
    FORM_PAGES: (id) => HOST + `/analysis/${id}`,
    PAGE_IMAGE: (formId, image_no, quality=25) => HOST + `/analysis/${formId}/image/${image_no}?aspect=${quality}`
}


export {ENDPOINTS};