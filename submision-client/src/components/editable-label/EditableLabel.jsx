import React,{useState, useEffect, useRef} from 'react';
import {Alert} from 'react-bootstrap';
import {FiCheckCircle} from 'react-icons/fi';

import './EditableLabel.scss';

function EditableLabel({label, onSelect, selected, verified}){
    const labelRef = useRef();
    const getLabelStyle = () => {
        if (selected) {
            labelRef.current.scrollIntoView({behavior: "smooth", block: "center"});
            return 'selected';
        }

        return '';
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
        <div className="editable-label" ref={labelRef}>
            <Alert className={'fluid ' + getLabelStyle()} onClick={onSelect} >
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