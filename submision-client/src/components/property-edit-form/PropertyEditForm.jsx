import React, {useEffect, useState}  from 'react';
import {Row, Col, Button, Alert} from 'react-bootstrap';

import {EditableLabel} from '../editable-label/EditableLabel';

import {post} from '../../constants';

function PropertyEditForm({selectedOption, onCancelEdit, onSave}) {
    const {TOPIC} = EditableLabel.TYPES;

    const [value, setValue] = useState('');

    useEffect(() => {
        const {type, label, title} = selectedOption;
        setValue(type === TOPIC ? title : label)
    }, [selectedOption]);

    const handleCancelEdit = (e) => {
        onCancelEdit(e);
        setValue('');
    };

    const handleOnChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <Row className='edit-overlay bg-dark'>
            {value ?
                <React.Fragment>
                    <Col xs={12} className='mb-2'>
                        <textarea onChange={handleOnChange} className='fluid' value={value} />
                    </Col>
                    <Col xs={6}>
                        <Button className='fluid' variant='info'>Save</Button>
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