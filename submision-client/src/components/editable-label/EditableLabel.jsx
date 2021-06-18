import React,{useState, useEffect} from 'react';
import {Alert} from 'react-bootstrap';
import {FiCheckCircle} from 'react-icons/fi';

import './EditableLabel.scss';

function EditableLabel({label, onSelect, selected, verified}){
    const getLabelStyle = () => {
        if (selected) {
            return 'info';
        }

        return 'light';
    };

    const renderVerification = () => {
        if (verified) {
            return (
                <div className='verification-box'>
                    <FiCheckCircle/>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="editable-label">
            <Alert variant={getLabelStyle()} onClick={onSelect} className='fluid' >
                {renderVerification()}
                <span>{label}</span>
            </Alert>
        </div>
    )
}

EditableLabel.TYPES = {
    TOPIC: 'TOPIC',
    OPTION: 'OPTION'
}

export {EditableLabel};