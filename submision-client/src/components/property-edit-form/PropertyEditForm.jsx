import React, {useEffect, useState,useRef, useContext}  from 'react';
import {Row, Col, Button, Alert} from 'react-bootstrap';

import {EditableLabel} from '../editable-label/EditableLabel';
import { KeyboardContext } from '../Context';

import {put, ENDPOINTS, KEYS} from '../../constants';

import './PropertyEditForm.scss';

function PropertyEditForm({selectedOption, onCancelEdit, onMarkAsChecked, onSave}) {
    const {TOPIC} = EditableLabel.TYPES;
    const [value, setValue] = useState('');
    const [initialValue, setInitialValue] = useState('');

    const [focused, setFocused] = useState(false);
    const inputRef = useRef();
    const keyEvent = useContext(KeyboardContext);

    useEffect(() => {
        const {code} = keyEvent;

        if (code === KEYS.ENTER) {

            if (Object.values(selectedOption).length > 0) {

                if (focused) {
                    if (initialValue === value) {
                        handleOnMarkAsChecked({preventDefault: ()=>{}})
                    }
                    else {
                        handleOnSave({preventDefault: ()=>{}})
                    }
                }
                else {
                    inputRef.current.focus(); 
                    inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length; 
                    setFocused(true);   
                }
            }
        }

    }, [keyEvent]);

    useEffect(() => {
        const {type, label, title} = selectedOption;
        const val = type === TOPIC ? title : label;
        setValue(val);
        setInitialValue(val);
        setFocused(false);

        if (inputRef.current) {
            inputRef.current.blur();
        }
        
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
                <div className='fluid edit-form displayed'>
                    <Col xs={12} className='mb-2'>
                        <textarea ref={inputRef} onChange={handleOnChange} className='fluid' value={value} />
                    </Col>
                    <Col xs={6}>
                        {
                            initialValue === value ?
                            <Button className='fluid' variant='success' onClick={handleOnMarkAsChecked}> Mark as Checked (Enter) </Button> :
                            <Button className='fluid' variant='info' onClick={handleOnSave}>Save (Enter)</Button> 
                        }
                        
                    </Col>
                    <Col xs={6}>
                        <Button className='fluid' variant='danger' onClick={handleCancelEdit}>Cancel (Esc)</Button>
                    </Col>
                </div>
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