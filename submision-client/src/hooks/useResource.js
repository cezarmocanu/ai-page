import {useState, useEffect} from 'react';

const useResource = (url, defaultValue = []) => {
    const [loaded, setLoaded] = useState(false);
    const [resource, setResource] = useState(defaultValue);

    useEffect(()=> {
        const fetchResource = async () => {
            const response = await fetch(url);
            const json = await response.json();
            setResource(json);
            setLoaded(true);
        }
        fetchResource();
    },[url])

    return [resource, loaded, setResource];
};

export default useResource;