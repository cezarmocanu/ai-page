import {useState} from 'react';
import {Dropdown, Button} from 'react-bootstrap';
import './EditableLabel.scss';

function EditableLabel({label}){
    const [value, setValue] = useState(label);

    const handleOnChange = (e) => {
        setValue(e.target.value);
    }

    
    

    // return isEditable ? <textarea value={value} onChange={handleOnChange} className='fluid'/> : <span onClick={handleEdit(true)}>{label}</span>;
    return (
        <Dropdown className="">
            <Dropdown.Toggle className="fluid dropdown-label">
                {label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>
                    <textarea value={value} onChange={handleOnChange} className='fluid'/>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Button className='fluid' variant="info">Save</Button>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Button className='fluid' variant="danger">Cancel</Button>
                </Dropdown.Item>
                
            </Dropdown.Menu>
        </Dropdown>
    )
}

export {EditableLabel};