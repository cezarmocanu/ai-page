import React, {useEffect, useState}  from 'react';
import {Row, Col, Button, Alert} from 'react-bootstrap';

import {EditableLabel} from '../editable-label/EditableLabel';

import {put, ENDPOINTS} from '../../constants';

import './PropertyEditForm.scss';

function PropertyEditForm({selectedOption, onCancelEdit, onMarkAsChecked, onSave}) {
    const {TOPIC} = EditableLabel.TYPES;
    const [value, setValue] = useState('');
    const [initialValue, setInitialValue] = useState('');

    useEffect(() => {
        const {type, label, title} = selectedOption;
        const val = type === TOPIC ? title : label;
        setValue(val);
        setInitialValue(val);
    }, [selectedOption]);

    const handleCancelEdit = (e) => {
        onCancelEdit(e);
        setValue('');
    };

    const handleOnChange = (e) => {
        setValue(e.target.value);
    };

    const handleOnSave = (e) => {
        const {id, type, formId, pageOrderNumber} = selectedOption;
        onSave(value);
        put({
            endpoint:ENDPOINTS.ANALYSIS_UPDATE,
            params:{
                formId,
                pageOrderNumber
            },
            body:{
                id,
                type,
                value
            }
        });
    };

    const handleOnMarkAsChecked = (e) => {
        const {id, type, formId, pageOrderNumber} = selectedOption;
        onMarkAsChecked(e);
        put({
            endpoint:ENDPOINTS.ANALYSIS_VERIFY,
            params:{
                formId,
                pageOrderNumber
            },
            body:{
                id,
                type
            }
        });
    };

    return (
        <Row className='edit-overlay bg-dark m-0'>
            {value ?
                <React.Fragment>
                    <Col xs={12} className='mb-2'>
                        <textarea onChange={handleOnChange} className='fluid' value={value} />
                    </Col>
                    <Col xs={6}>
                        {
                            initialValue === value ?
                            <Button className='fluid' variant='success' onClick={handleOnMarkAsChecked}> Mark as Checked </Button> :
                            <Button className='fluid' variant='info' onClick={handleOnSave}>Save</Button> 
                        }
                        
                    </Col>
                    <Col xs={6}>
                        <Button className='fluid' variant='danger' onClick={handleCancelEdit}>Cancel</Button>
                    </Col>
                </React.Fragment>
                :
                <Col xs={12} className='mb-2'>
                    <Alert className='m-0' variant='secondary'>Click on any label to toggle edit</Alert>
                </Col>
            }
        </Row>
    );

};

PropertyEditForm.defaultProps = {
    selectedOption: {},
    onCancelEdit: () => {},
    onSave: () => {}
};

export {PropertyEditForm};