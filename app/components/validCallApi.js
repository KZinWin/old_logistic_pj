import React, { useState, useEffect } from "react";

const useValidAPiCall = (checklist,init) =>{
    // const [ checklist, setChecklist ] = useState(obj)
    const [ Res, setResponse ] = useState(undefined)

    async function check () {
        var valid = true
        for(const i in checklist){
            if(checklist[i] == ''){
                valid = false
            }
            setResponse(valid)
        }
        // setLoading(false)
        // console.log(valid, checklist)
    }
    useEffect(()=>{
        check()
    },[checklist,init])

    return Res
}

export default useValidAPiCall ;

export const useNestedObjCheck = (object , init) =>{
    const [response , setResponse] = useState(undefined)

    useEffect(()=>{
        var valid = true
        for (const i in object){
            if(typeof(object[i]) == 'object'){
                for (const j in object[i]){
                    if(object[i][j] == ''){
                        valid = false
                    }
                }
            }else{
                if(object[i] == ''){
                    valid = false
                }
            }
            setResponse(valid)
        }
    },[object, init])

    return response
}