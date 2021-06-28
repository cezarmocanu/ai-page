import React,{createContext} from "react";

const CollectedImagesContext = createContext({collected:[], setCollected:()=>{}});

export {
    CollectedImagesContext
};