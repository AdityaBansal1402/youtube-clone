import Themecontext from "./Theme";
import React,{ useState,useEffect } from "react";
const Themestate =(props)=>{
    const[light,themechange]=useState((localStorage.getItem('lighted'))?localStorage.getItem('lighted'):true);
    const update=()=>{
        themechange(
            (light)?false:true
        )
        // localStorage.setItem('theme',light)
    }
    useEffect(()=>{
        const lightstored=localStorage.getItem('lighted')==='true';
        themechange(lightstored);
    },[])
    useEffect(()=>{
        localStorage.setItem('lighted',light);
    },[light])
    return(
        <Themecontext.Provider value={{light,update}}>
            {props.children}
        </Themecontext.Provider>
    )
}

export default Themestate;