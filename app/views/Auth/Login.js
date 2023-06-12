import React,{ useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TCPNTextInput, OriginTextInput } from "../../components/form";
import { HomePageBtn } from "../../components/button";
import { white_color, grey_color, default_font, API_URL, primary_color, red_color } from "../../components/common";
import AsyncStorage from "@react-native-community/async-storage";
import JwtDecode from "jwt-decode";
import { postData, getData } from "../../components/fetch";
import { password_label, ph_label } from "../../components/labels and messges";

const Login = (props) => {
    const [login , setLogin ] = useState({
        email: '',
        psw: ''
    });
    const [loginError, setError] = useState()

    useEffect(()=>{
        // async function decodeObj(){
        //     var token = await AsyncStorage.getItem('registerToken')
        //     var obj = JwtDecode(token)
        //     console.log(obj)
        //     setuserDetail(obj)
        // }
        // decodeObj()
    },[])

    const changeValue = (key, value) =>{
        setLogin({
            ...login,
            [key]: value
        })
        
    }

    const loginRoute = async() =>{
        if(login.email == '' || login.psw == ''){
            setError('Fill your phone number and password')
        }else{
            var response = await postData(`${API_URL}/api/v0.1/login`,login)
            if(response.ok){
                AsyncStorage.setItem('access_token',response.data.token)
                const { navigation } = props
                navigation.navigate('AuthLoading')
            }else{
                // console.log(response)
                setError(response.err)
            }
        }

    }

    return(
        <View style={{flex: 1,flexDirection: 'column', width : '100%', height: '100%'}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems : 'center'}}>
                <Text style={{textAlign: 'center', fontFamily: default_font}}>Logo</Text>
            </View>
            <View style={{flex: 2, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <Text style={{color: red_color, fontFamily: default_font}}>{loginError}</Text>
                    <TCPNTextInput twoCol={true} value={login.email} placeholder={ph_label} type={'number'} onChangeText={(text) => changeValue('email',text.toString())}/>

                    <OriginTextInput secureTextEntry={true} value={login.psw} placeholder={password_label} onChangeText={(text)=>changeValue('psw',text)}/>
                    <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 10}}>
                        <HomePageBtn onPress={()=>loginRoute()}>LOGIN</HomePageBtn>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent:'center', paddingTop: 10}}>
                        <Text style={{color: grey_color, fontFamily: default_font}}>Not account yet ? Sign In</Text>
                        <TouchableOpacity onPress={()=>props.navigation.navigate("ChooseUser")}>
                            <Text style={{color: primary_color, fontFamily: default_font}}> Here!</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent:'center' , paddingTop: 15}}>
                        <TouchableOpacity onPress={()=>props.navigation.navigate('ForgetPassword')}>
                            <Text style={{color: primary_color, fontFamily: default_font}}>Forgot Password ? </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Login;