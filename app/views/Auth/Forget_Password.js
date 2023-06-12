import React, { useState, useEffect } from "React";
import { TCPNTextInput, OriginTextInput } from "../../components/form";
import { View, Text, ScrollView } from "react-native";
import { HomePageBtn } from "../../components/button";
import { useVerifyCode, useConfirmCode } from "../../auth/firebase";
import { postData, getData } from "../../components/fetch";
import { API_URL, default_font, red_color, green_color, psw_min_length } from "../../components/common";
import { Toast } from "native-base";
import { validErrormessage, pswNotMatch, lengthValide, ph_label, enter_otp_label, password_label, conf_password_label, save_label } from "../../components/labels and messges";
import useValidAPiCall from "../../components/validCallApi";
import { xxxS } from "../../components/font";

const ForgetPassword = (props) => {
    const [count, setcount] = useState(0);
    const [codeInput, setValidPh] = useState('');
    const [ToverifyPh, setVerifyPh] = useState(0)
    const [verificationId, setverificationId] = useState('')
    const verifyResponse = useVerifyCode(ToverifyPh, count)
    const { confirmStatus, message, user } = useConfirmCode(verificationId, codeInput)

    const [pherror, setpherror] = useState('');
    const [phload, setPhLoad] = useState(undefined)

    const [pswReset, setPswReset] = useState({
        otpVerified: false
    })
    const [init, setinit] = useState(0)
    const isValid = useValidAPiCall(pswReset,init)

    const [pswErr, setPswErr] = useState('')

    useEffect(() => {
        if (pswReset.ph == '') {
            setVerifyPh('')
            setPhLoad(false)
        }
    }, [pswReset.ph])

    // otp code set 
    const changeCode = (text) => {
        let code = text
        if (code.length == 6) {
            setValidPh(code)
            setPswReset({
                ...pswReset,
                otpVerified: true 
            })
        }
    }

    // ph validation check
    const phoneVerify = () => {
        const regexp = /^(\d{9})$/
        if (regexp.test(pswReset.email)) {
            getData(`${API_URL}/api/v0.1/check/phone?phone=${pswReset.email}`)
            .then(response => {
                if(response.data.result){
                    setVerifyPh(pswReset.email)
                    setcount(count + 1)
                    setPhLoad(true)
                }else{
                    setpherror('unregistered phone number!')
                }
            })
        } else {
            setpherror('phone number invalid')
        }
    }

    
    useEffect(() => {
        if (verifyResponse) {
            setverificationId(verifyResponse.verificationId)
            setPhLoad(false)
            setpherror('')
        } else {
            setpherror(verifyResponse)
        }
    }, [verifyResponse])
    
    const changeValue = (key,value) =>{
            setPswReset({
                ...pswReset,
                [key]: value
            })
    }


    useEffect(()=>{
        if(pswReset.psw != pswReset.confirmPsw){
            setPswErr(pswNotMatch)
        }else if(pswReset.psw == pswReset.confirmPsw){
            setPswErr('')
        }
    },[pswReset])

    const save = async () =>{
        setinit(init+1)
        if(pswReset.psw.length < psw_min_length){
            Toast.show({
                text: lengthValide,
                textStyle: {color:red_color, fontFamily: default_font},
            })
        }else if(pswReset.otpVerified == false){
            Toast.show({
                text: 'Verify your phone number first!',
                textStyle: {color:red_color, fontFamily: default_font},
            })
        }else if ( isValid ){
            var response = await postData(`${API_URL}/api/v0.1/password/reset`,pswReset)
            if(response.ok){
                props.navigation.navigate('Login')
            }
        }else{
            Toast.show({
                text: validErrormessage,
                textStyle: {color: red_color, fontFamily: default_font}
            })
        }
    }
    
    return(
        <View style={{flex: 1,flexDirection: 'column', width : '100%', height: '100%'}}>
             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems : 'center'}}>
                <Text style={{textAlign: 'center'}}>Logo</Text>
            </View>
            <ScrollView>
                <View style={{flex: 2, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <TCPNTextInput 
                            required 
                            errormessage={pherror} 
                            loading={phload} 
                            twoCol={false} 
                            value={pswReset.email} 
                            label={ph_label} 
                            type={'number'} 
                            onChangeText={(text)=>changeValue('email',text.toString())} 
                            onPress={()=>phoneVerify()}
                        />
                        {
                            verificationId != '' ? 
                                <>
                                    {
                                        confirmStatus != 'success' ?
                                        <>
                                            <OriginTextInput value={pswReset.code} type={"number"} onChangeText={(text)=>changeCode(text.toString())} label={enter_otp_label} />
                                            {
                                                codeInput != ''?
                                                <></>
                                                :
                                                <Text style={{ color: green_color, fontSize: xxxS, fontFamily: default_font }}>We send code +95 (9) {pswReset.email} .</Text>
                                            }
                                        </>
                                        :
                                        <></>
                                    }
                                </>
                                :
                                <></>
                        }
                        <OriginTextInput required 
                            value={pswReset.psw} 
                            secureTextEntry={true} 
                            label={password_label} 
                            onChangeText={(text)=>changeValue('psw',text)}
                            words={psw_min_length}
                        />
                        <OriginTextInput 
                            required 
                            errormessage={pswErr} 
                            value={pswReset.confirmPsw} 
                            secureTextEntry={true} 
                            label={conf_password_label} 
                            onChangeText={(text)=>changeValue('confirmPsw',text)} 
                        />
                        
                        <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 10}}>
                            <HomePageBtn onPress={()=>save()}>{save_label}</HomePageBtn>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default ForgetPassword;