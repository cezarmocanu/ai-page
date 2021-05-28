import useCanvas from '../../hooks/useCanvas';
import {EDIT_MODES} from '../../constants.js';

function Canvas({draw, handlers, editMode, ...props}){
    const canvasRef = useCanvas(draw, handlers);
    const cursor = () => {
        switch(editMode) {
            case EDIT_MODES.PAN:
                return "move";
            default:
                return "default";
        }
    }
    return <canvas style={{border:"1px solid black", cursor:cursor()}}ref={canvasRef} {...props} />
}

export {Canvas};