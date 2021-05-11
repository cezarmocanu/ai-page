import {useState} from 'react';
import {Alert} from 'react-bootstrap';
import './EditableLabel.scss';

function EditableLabel({label, onSelect}){
    return (
        <div className="editable-label">
            <Alert variant="secondary" onClick={() => onSelect(label)} className="fluid">{label}</Alert>
        </div>
    )
}

export {EditableLabel};