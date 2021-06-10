import {useState, useEffect, useRef} from 'react';
import useResource from './useResource';


//TODO!!! de verificat daca se poate face cu mai putine ref
const useFormImageArray = (formId) => {
    const loadedImages = useRef(0);
    const imageArray = useRef([]);
    const [loaded, setLoaded] = useState(false);
    const [form ,formLoaded] = useResource(`http://localhost:5000/analysis/${formId}`, {});

    const handleImageOnload = (e) => {
        loadedImages.current += 1;
        if (form.pages && loadedImages.current === form.pages.length) {
            imageArray.current.sort((a, b) => a.pageNumber - b.pageNumber)
            setLoaded(true);
        }
        
    }

    const fetchImage = async (url, pageNumber) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const img = new Image();
        img.src = URL.createObjectURL(blob);;
        img.onload = handleImageOnload;
        // setImageArray([...imageArray, {image: img, pageNumber}]);
        if(imageArray.current.length < form.pages.length) {
            imageArray.current.push({image:img, pageNumber})
        }
    }

    useEffect(()=>{
        if(formLoaded) {
            for(let image = 0; image < form.pages.length; image++) {
                const url = `http://localhost:5000/analysis/${form.id}/image/${image}?aspect=25`;
                fetchImage(url, image);
            }
        }
    }, [formLoaded]);

    return [imageArray.current, loaded, form];
}

export default useFormImageArray;