import {useState, useEffect} from 'react';

const useResource = (url) => {
    const [loaded, setLoaded] = useState(false);
    const [resource, setResource] = useState([]);

    useEffect(()=> {
        const fetchResource = async () => {
            const response = await fetch(url);
            const json = await response.json();
            setResource(json);
            setLoaded(true);
        }
        fetchResource();
    },[])

    return [resource, loaded];
};

export default useResource;