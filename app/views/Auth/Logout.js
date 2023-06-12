import React, { useState, useEffect } from "React";
import AsyncStorage from "@react-native-community/async-storage";
import { Toast } from "native-base";
import { default_font } from "../../components/common";
import { standard_font_size } from "../../components/font";

const Logout = (props) =>{

    useEffect(()=>{
        try{
            AsyncStorage.clear()
            const {navigation} = props
            Toast.show({
                text: 'logged out',
                textStyle: {fontFamily: default_font, fontSize: standard_font_size}
            })
            navigation.navigate('AuthLoading')
        }catch (error){

        }

    },[])
    
    return(
        <></>
    )
}

export default Logout;