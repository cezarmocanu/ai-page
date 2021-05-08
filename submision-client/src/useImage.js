import {useState, useEffect} from 'react';

const useImage = (url) => {
    const [loaded, setLoaded] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageOnload = (e) => {
        setLoaded(true);
    }

    useEffect(()=>{
        const fetchImage = async () => {
            const response = await fetch(url);
            const blob = await response.blob()
            const img = new Image();
            img.src = URL.createObjectURL(blob);;
            img.onload = handleImageOnload;
            setImage(img);
        }
        fetchImage();
    }, []);



    return [image, loaded];
}

export default useImage;