import React  from 'react';
import {FiCheckCircle} from 'react-icons/fi';

import './PageBrowseIndicator.scss';

function PageBrowseIndicator({selectedPageIndex, index, image, maxLength, onBrowseItemClick, verified}){

    const getIndicatorStyle = () => {
        let classes = ['page-indicator'];

        if (index === selectedPageIndex) {
            classes.push('selected');
        }

        return classes.join(' ')
    }

    return (
        <div key={`$browse-item-${index}`} onClick={onBrowseItemClick} className={getIndicatorStyle()}>
            {verified && <div className='verified-indicator'><FiCheckCircle/></div>}
            <img src={image.currentSrc} alt=''/>
            <span>{index + 1} / {maxLength} </span>
        </div>
    );
}

export {PageBrowseIndicator};