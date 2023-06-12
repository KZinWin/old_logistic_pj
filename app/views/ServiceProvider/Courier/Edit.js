import React, { useState, useEffect } from "React";
import { ScrollView, View, TouchableOpacity, Image, Text } from "react-native";
import { Icon, Picker, CheckBox, Toast } from "native-base";
import { OriginTextInput, TCPNTextInput, STComponent, RNPicker } from "../../../components/form";
import { grey_color, primary_color, white_color, default_font, yellow_color, light_grey_color, API_URL, red_color, green_color } from "../../../components/common";
import { HomePageBtn } from "../../../components/button";
import ImagePicker from 'react-native-image-picker';
import { getData, postData, putData, deleteData } from "../../../components/fetch";
import CityStore from "../../../mobx/cityStore";
import { toJS } from "mobx";
import AppStore from "../../../mobx/AppStore";
import {styles} from "../../../components/styles";
import { succUpdate, succDelete, genError, validErrMesswithPhoto, TandCMessage, Tsp_label, email_label, assign_label, State_label, delete_label, name_label, ph_label, home_st_label, post_code_label, ward_label, agree_label, update_label } from "../../../components/labels and messges";
import { standard_font_size } from "../../../components/font";
import useValidAPiCall from "../../../components/validCallApi";

const CourierEdit = (props) => {
    const [userToken, setUsertoken] = useState(AppStore.token)
    const [cities, setCities] = useState([]);
    const [tsps, setTsps] = useState([]);
    const [err, seterr] = useState('')
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
        img: '',
        agreeTC: false
    })
    const [init, setinit] = useState(0)
    const isValid = useValidAPiCall(Dcounter,init)
    const [mailValid, setmailValid] = useState('')

    useEffect(() => {
        async function callmobx() {
            var response = await getData(`${API_URL}/api/v0.1/deliveries/${props.navigation.getParam('Id')}`)
            if (response.ok) {
                obj = response.data

                if (typeof (obj.avatar) == 'object') {
                    obj["img"] = obj.avatar.Key
                    obj.avatar = `${API_URL}/api/v0.1/files?filename=${obj.avatar.Key}&random=${Math.random().toString(36).substring(7)}`
                }
                setDcounter(obj)
            } else {
                console.log(response.data)
            }
            await CityStore.load()
            setCities(toJS(CityStore.cities))
        }
        callmobx()
    }, [])

    useEffect(() => {
        if (cities && cities.length > 0) {
            onValueChange('city', Dcounter.city);
            tspsChange(cities.find(x => x.name == Dcounter.city).id);
        }
    }, [cities])

    const logopicker = (index) => {
        const options = {
            title: "Select Logo",
            maxWidth: 400,
            maxHeight: 400
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                setDcounter({
                    ...Dcounter,
                    avatar: `data:image/jpeg;base64,${response.data}`
                })
               
            }
        })
    }
    
    const cityChange = async (value) =>{
        setDcounter({
            ...Dcounter,
            city: value,
            tsp: ''
        })
    }

    const Edit = async () => {
        setinit(init+1)
        if(isValid && mailValid == ''){
           
            if(Dcounter.avatar.includes('base64')){
                var result = await putData(`${API_URL}/api/v0.1/files?filename=${Dcounter.img}`, { file: Dcounter.avatar })
                if(result.ok){
                    delete Dcounter["img"]
                    delete Dcounter["avatar"]
                }
            }
            var response = await putData(`${API_URL}/api/v0.1/deliveries/${props.navigation.getParam('Id')}`, Dcounter)
            if (response.ok) {
                Toast.show({
                    text: succUpdate,
                    textStyle: { color: green_color, fontFamily: default_font },
                    duration: 1000,
                })
                props.navigation.navigate('CourierList')

            } else {
                Toast.show({
                    text:response.err,
                    textStyle: { color: red_color, fontFamily: default_font },
                    duration: 3000
                })
            }
        }else{
            Toast.show({
                text: mailValid != ''? mailValid:Dcounter.agreeTC == false ? TandCMessage: validErrMesswithPhoto,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 2500
            })
        }
    }


    const tspsChange = async (index) => {
        var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`)
        var townships = []
        response.data.map((township, i) => {
            townships.push({ id: township._id, name: township.name, cityId: township.cityId })
        })
        setTsps(townships)
    }

    const onValueChange = (key, value) => {
            setDcounter({
                ...Dcounter,
                [key]: value
            })
    }

    const deleteAction = () => {
        deleteData(`${API_URL}/api/v0.1/deliveries/${[Dcounter._id]}`)
            .then(response => {
                if (response.ok) {
                    Toast.show({
                        text: succDelete,
                        textStyle: { color: green_color, fontFamily: default_font },
                        duration: 3000
                    })
                    props.navigation.navigate('CourierList')
                }
            })
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20, }}>
            <ScrollView>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end',marginBottom: 20 }}>
                    <View style={{ flex: 1, paddingRight: 5 }}>
                        <HomePageBtn elevation={20} onPress={() => props.navigation.navigate('CourierAssign', { id: Dcounter._id })}
                            btnBg={yellow_color} fontSize={standard_font_size}>{assign_label}</HomePageBtn>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 5 }}>
                        <HomePageBtn elevation={20} onPress={() => deleteAction()} btnBg={red_color} fontSize={standard_font_size}>{delete_label}</HomePageBtn>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', width: '100%', }}>
                    <View style={{ flexDirection: 'row', justifyContent: "center", marginBottom: 10 }} >
                        <TouchableOpacity onPress={() => logopicker()}>
                            {
                                Dcounter.avatar ?
                                    <Image source={{
                                        uri: Dcounter.avatar,
                                        headers: {
                                            Authorization: `Bearer ${userToken}`
                                        }
                                    }} style={{ width: 80, height: 80, borderRadius: 70 }} />
                                    :
                                    <View style={{ width: 80, height: 80, borderWidth: 0.25, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color }} />
                                    </View>
                            }
                        </TouchableOpacity>
                    </View>
                    <OriginTextInput required label={name_label} edit={true} value={Dcounter.name} onChangeText={(text) => onValueChange('name', text)} />
                    <OriginTextInput required label={email_label} email edit={true} value={Dcounter.email} onBlur={(message)=>setmailValid(message)} onChangeText={(text) => onValueChange('email', text)} />
                    <TCPNTextInput required twoCol={true} label={ph_label} edit={true} value={Dcounter.ph} type={'number'} onChangeText={(text) => onValueChange('ph', text.toString())} />
                   
                    <OriginTextInput required label={home_st_label} edit={true} value={Dcounter.strNo} onChangeText={(text) => onValueChange('strNo', text)} />
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingTop: 0 }}>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <OriginTextInput required label={ward_label} edit={true} value={Dcounter.ward} onChangeText={(text) => onValueChange('ward', text)} />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <OriginTextInput required label={post_code_label} type={'number'} edit={true} value={`${Dcounter.postcode}`} onChangeText={(text) => onValueChange('postcode', text)} />
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
                        data={cities}
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
                        style={{height: 50}}
                        value={Dcounter.tsp}
                        isSelectSingle={true}
                        preSelectedItem={{ key: 'name', value: Dcounter.tsp }}
                        popupTitle={Tsp_label}
                        label={Tsp_label}
                        title={Dcounter.tsp? Dcounter.tsp: Tsp_label}
                        data={tsps}
                        edit={true}
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
                    <HomePageBtn onPress={() => Edit()}>{update_label}</HomePageBtn>
                </View>

            </ScrollView>
        </View>
    )
}

export default CourierEdit;
