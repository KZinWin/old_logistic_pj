import React, { useEffect, useState } from "React";
import { TCPNTextInput, OriginTextInput } from "../../components/form";
import { View, Text, Alert,ScrollView } from "react-native";
import { HomePageBtn } from "../../components/button";
import { postData } from "../../components/fetch";
import { API_URL, default_font, red_color, yellow_color, green_color, psw_min_length } from "../../components/common";
import { Toast } from "native-base";
import { conf_password_label, lengthValide, pswNotMatch, save_label } from "../../components/labels and messges";

export default ChgPassword =(props)=> {
    const [ data, setData ] = useState({})
    const [ psw, setpsw ] = useState({})

    const onValueChange = (key,e) =>{
        setData({
            ...data,
            [key] : e
        })
    }

    useEffect(() => {
        if(data.confirm){
            if(data.newPsw != data.confirm){
                setpsw({bool: false, msg:pswNotMatch})
            }else{
                setpsw({bool: true, msg:''})
            }
        }
    }, [data])

    const closefunct = () => {
        props.navigation.openDrawer()
        Toast.hide()
    }

    const save = async() =>{
        if(data.newPsw.length >= psw_min_length){
            if(psw.bool){
                var response = await postData(`${API_URL}/api/v0.1/change/password`,data)
                if(response.ok){
                    setData({})
                    setpsw({})
                    Alert.alert('Change Password', 'Successfully.');
                    // Toast.show({
                    //     text: "password Changed!",
                    //     textStyle: { color: green_color,fontFamily: default_font },
                    //     buttonText: "Okay",
                    //     duration: 3000,
                    //     onClose : () => closefunct()
                    // })
                    // props.navigation.navigate('Dashboard')
                }else{
                    Toast.show({
                        text: response.err,
                        textStyle: { color: red_color,fontFamily: default_font },
                        duration: 2000,
                    })
                }
            }else{
                Toast.show({
                    text: pswNotMatch,
                    textStyle: { color: yellow_color },
                    duration: 2000
                })
            }
        }else{
            Toast.show({
                text: lengthValide,
                textStyle: { color: red_color },
                duration: 2000
            })
        }
    }

        return(
            <View style={{flex: 1,flexDirection: 'column', width : '100%', height: '100%'}}>
                 <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems : 'center'}}>
                    <Text style={{textAlign: 'center'}}>Logo</Text>
                </View>
                <View style={{flex: 2, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
                <ScrollView>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <OriginTextInput 
                                secureTextEntry={true} 
                                label={'Old Password'} 
                                value={data.oldPsw} 
                                onChangeText={(text)=>onValueChange('oldPsw',text)}
                            />

                            <OriginTextInput 
                                secureTextEntry={true} 
                                label={'New Password'} 
                                value={data.newPsw} 
                                onChangeText={(event)=>onValueChange('newPsw',event)} 
                                words={6}
                            />

                            <OriginTextInput 
                                onFocus= {() => setpsw({})} 
                                secureTextEntry={true} 
                                label={conf_password_label} 
                                value={data.confirm} 
                                onChangeText={(text)=>onValueChange('confirm',text)} 
                                errormessage={psw.msg}
                            />

                            <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 10}}>
                                <HomePageBtn onPress={()=>save()}>{save_label}</HomePageBtn>
                            </View>
                        </View>
                </ScrollView>
                </View>
            </View>
        )
    }

