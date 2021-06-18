import React,{useState, useEffect} from 'react';
import {Alert} from 'react-bootstrap';
import './EditableLabel.scss';

function EditableLabel({label, onSelect, selected}){

    const [visited, setVisited] = useState(false);

    useEffect(()=>{
        if (selected && !visited) {
            setVisited(true);
        }
    },[selected])

    const getLabelStyle = () => {
        if (selected) {
            return 'info';
        }

        if (visited) {
            return 'secondary';
        }

        return 'light';
    };

    return (
        <div className="editable-label">
            <Alert variant={getLabelStyle()} onClick={onSelect} className='fluid' >{label}</Alert>
        </div>
    )
}

EditableLabel.TYPES = {
    TOPIC: 'TOPIC',
    OPTION: 'OPTION'
}

export {EditableLabel};