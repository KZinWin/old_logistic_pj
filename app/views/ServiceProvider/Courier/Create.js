import React, { useState, useEffect } from "React";
import { ScrollView, View, TouchableOpacity, Image, Text, Alert } from "react-native";
import { Icon, Picker, CheckBox, Toast } from "native-base";
import { OriginTextInput, TCPNTextInput, STComponent, ValidateForm, RNPicker } from "../../../components/form";
import { grey_color, primary_color, white_color, default_font, light_grey_color, API_URL, red_color, green_color, psw_min_length } from "../../../components/common";
import { HomePageBtn } from "../../../components/button";
import ImagePicker from 'react-native-image-picker';
import { getData, postData } from "../../../components/fetch";
import CityStore from "../../../mobx/cityStore";
import {styles} from "../../../components/styles";
import useValidAPiCall from "../../../components/validCallApi";
import { succRegister, validErrMesswithPhoto, pswNotMatch,State_label,conf_password_label, lengthValide, TandCMessage, Tsp_label, email_label, name_label, ph_label, password_label, home_st_label, ward_label, post_code_label, register_label, agree_label } from "../../../components/labels and messges";

const CourierRegister = (props) => {

    const [Cities, setCities] = useState([]);
    const [tsps, setTsps] = useState([]);
    const [Dcounter, setDcounter] = useState({
        avatar: '',
        name: '',
        ph: '',
        psw: '',
        confirmpsw: '',
        email: '',
        strNo: '',
        ward: '',
        postcode: '',
        city: '',
        tsp: '',
        agreeTC: false
    })
    const [init, setinit] = useState(0)
    const isValid = useValidAPiCall(Dcounter,init)
    const [mailValid ,setmailValid ] = useState('')

    useEffect(() => {
        CityStore.load()
        setCities(CityStore.cities)
    }, [])

    // useEffect(() => {
    //     if (Cities && Cities.length > 0) {
    //         onValueChange('city', Cities[0].name);
    //         tspsChange(Cities[0].id);
    //     }
    // }, [Cities])

    // useEffect(()=>{
    //     setDcounter({
    //         ...Dcounter,
    //         tsp: ''
    //     })
    // },[Dcounter.city])

    const logopicker = (index) => {
        const options = {
            title: "Select Logo",
            maxWidth: 400,
            maxHeight: 400
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            // base64 = response.data,
            if (!response.didCancel) {
                setDcounter({
                    ...Dcounter,
                    avatar: `data:image/jpeg;base64,${response.data}`
                })
            }
        })
    }

    const register = async () => {
        // console.log(Dcounter)

        setinit(init+1)
        if(isValid && mailValid == ''){
            if(Dcounter.psw != Dcounter.confirmpsw){
                Toast.show({
                    text: pswNotMatch,
                    textStyle: { color: red_color, fontFamily: default_font },
                    duration: 1000
                })
            }else if(Dcounter.psw.length < psw_min_length){
                Toast.show({
                    text: lengthValide,
                    textStyle: { color: red_color, fontFamily: default_font },
                    duration: 1000
                })
            }else{
                var response = await postData(`${API_URL}/api/v0.1/deliveries`, Dcounter)
                if (response.ok) {
                    Toast.show({
                        text: succRegister,
                        textStyle: { color: green_color, fontFamily: default_font },
                        duration: 1000
                    })
                    props.navigation.navigate('CourierList')
                } else {
                    Toast.show({
                        text: response.err,
                        textStyle: { color: red_color, fontFamily: default_font },
                        duration: 3000,
                    })
                }
            }
        }else{

            Toast.show({
                text: mailValid != ''? mailValid:Dcounter.agreeTC == false ? TandCMessage: validErrMesswithPhoto,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 2500,
            })
        }
    }

    const cityChange = async (value) =>{
        setDcounter({
            ...Dcounter,
            city: value,
            tsp: ''
        })
    }

    const tspsChange = async (index) => {
        var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`)
        var townships = []
        response.data.map((township, i) => {
            townships.push({ id: township._id, name: township.name, cityId: township.cityId })
        })
        setTsps(townships);
    }

    const onValueChange = async (key, value) => {
        setDcounter({
            ...Dcounter,
            [key]: value
        })
    }
    
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20, }}>
            <ScrollView>
                <View style={{ flexDirection: 'column', width: '100%', }}>
                    <View style={{ flexDirection: 'row', justifyContent: "center", marginBottom: 20 }} >
                        <TouchableOpacity onPress={() => logopicker()}>
                            {
                                Dcounter.avatar ?
                                    <Image source={{ uri: Dcounter.avatar }} style={{ width: 80, height: 80, borderRadius: 70 }} />
                                    :
                                    <View style={{ width: 80, height: 80, borderWidth: 0.25, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color }} />
                                    </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <OriginTextInput required label={name_label} onChangeText={(text) => onValueChange('name', text)} value={Dcounter.name} ></OriginTextInput>
                   
                    <OriginTextInput required label={email_label} onChangeText={(text) => onValueChange('email', text)} value={Dcounter.email} onBlur={(message)=>setmailValid(message)} email></OriginTextInput>
                    <TCPNTextInput required twoCol={true} label={ph_label} type={'number'} onChangeText={(text) => onValueChange('ph', text.toString())} value={Dcounter.ph} ></TCPNTextInput>
                    <OriginTextInput required secureTextEntry={true} label={password_label} words={psw_min_length} onChangeText={(text) => onValueChange('psw', text)} value={Dcounter.psw} ></OriginTextInput>
                    <OriginTextInput
                        required
                        secureTextEntry={true}
                        label={conf_password_label}
                        value={Dcounter.confirmpsw}
                        errormessage={Dcounter.psw == Dcounter.confirmpsw ? '' : pswNotMatch}
                        onChangeText={(text) => onValueChange('confirmpsw', text)} />
                    <OriginTextInput required label={home_st_label} onChangeText={(text) => onValueChange('strNo', text)} value={Dcounter.strNo} ></OriginTextInput>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingTop: 0 }}>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <OriginTextInput required label={ward_label} onChangeText={(text) => onValueChange('ward', text)} value={Dcounter.ward} ></OriginTextInput>
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <OriginTextInput required label={post_code_label} type={'number'} onChangeText={(text) => onValueChange('postcode', text)} value={`${Dcounter.postcode}`} ></OriginTextInput>
                        </View>
                    </View>

                    <STComponent
                        isSelectSingle={true}
                        popupTitle={State_label}
                        label={State_label}
                        title={Dcounter.city? Dcounter.city:State_label}
                        required 
                        value={Dcounter.city}
                        preSelectedItem={{ key: 'name', value: Dcounter.city }}
                        data={Cities}
                        searchPlaceHolderText={State_label}
                        onChangeSelect={data => {
                            cityChange(data.name)
                            tspsChange(data.id)
                            if(data.name == '') {
                                setTsps([])
                            }
                        }}
                    />
                   
                    <STComponent
                        required
                        value={Dcounter.tsp}
                        isSelectSingle={true}
                        popupTitle={Tsp_label}
                        label={Tsp_label}
                        title={Tsp_label}
                        data={tsps}
                        searchPlaceHolderText={Tsp_label}
                        onChangeSelect={data => {
                            onValueChange('tsp', data.name)
                        }}
                    />

                    <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 30 }}>
                        <View style={{ marginHorizontal: 15 }}>
                            <CheckBox
                                checked={Dcounter.agreeTC}
                                color={light_grey_color}
                                style={{ borderRadius: 5, borderWidth: 0.5 }}
                                onPress={() => setDcounter({
                                    ...Dcounter,
                                    agreeTC: !Dcounter.agreeTC
                                })}
                            />
                        </View>
                        <View style={{ flex: 1, }}>
                            <Text style={{ color: grey_color,fontFamily: default_font }}>{agree_label}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
                    <HomePageBtn onPress={() => register()}>{register_label}</HomePageBtn>
                </View>

            </ScrollView>
        </View>
    )
}

export default CourierRegister;