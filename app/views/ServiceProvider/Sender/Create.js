import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { Icon, Picker, CheckBox, Toast } from 'native-base';
import { grey_color, light_grey_color, default_font, white_color, red_color, API_URL, green_color } from '../../../components/common';
import { OriginTextInput, TCPNTextInput, STComponent, SmallHighTextInput, RNPicker } from '../../../components/form';
import { HomePageBtn } from '../../../components/button';
import ImagePicker from 'react-native-image-picker'
import { postData, getData } from '../../../components/fetch';
import CityStore from '../../../mobx/cityStore';
import {styles} from "../../../components/styles";
import { succRegister, Tsp_label, validErrMesswithPhoto, State_label, name_label, ph_label, home_st_label, ward_label, post_code_label, register_label } from '../../../components/labels and messges';
import useValidAPiCall from '../../../components/validCallApi';

const SenderRegister = (props) => {

    const [cities, setCities] = useState([]);
    const [tsps, setTsps] = useState([]);
    const [Agree, setAgree] = useState(false);
    const [Sender, setSender] = useState({name: '', ph: '', strNo:'', ward: '', post: '',city: '', post: ''})
    const [initial, setinitial] = useState(0)
    const isValid = useValidAPiCall(Sender, initial)

    useEffect(() => {
        async function callcitymobx() {
            await CityStore.load()
            setCities(CityStore.cities)
        }
        callcitymobx()
    }, [])

    const logopicker = () => {
        const options = {
            title: "Select Logo",
            maxWidth: 400,
            maxHeight: 400
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            setSender({
                ...Sender,
                img: `data:image/jpeg;base64,${response.data}`,
                uri: response.uri
            })
        })
    }

    const onValueChange = (key, value) => {
        setSender({
            ...Sender,
            [key]: value
        })
    }

    const cityChange = async (value) =>{
        setSender({
            ...Sender,
            city: value,
            tsp: ''
        })
    }

    const changeTwsp = async (index) => {
        var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`)
        var townships = []
        response.data.map((township, i) => {
            townships.push({ id: township._id, name: township.name, cityId: township.cityId })
        })
        setTsps(townships)
    }

    const Register = async () => {
        setinitial(initial +1)
        // console.log(Sender)
        if (isValid) {
            var response = await postData(`${API_URL}/api/v0.1/senders`, Sender)
            if (response.ok) {
                Toast.show({
                    text: succRegister,
                    textStyle: { color: green_color, fontFamily: default_font },
                    duration: 1000
                })
                props.navigation.navigate('SenderList')
            } else {
                Toast.show({
                    text: response.err,
                    textStyle: { color: red_color, fontFamily: default_font },
                    duration: 3000,
                })
            }
        } else {
            Toast.show({
                text: validErrMesswithPhoto,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 1000,
            })
        }
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20, }}>
            <ScrollView>
                <View style={{ flexDirection: 'column', width: '100%', }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: "center", marginVertical: 30 }} >
                            <TouchableOpacity onPress={() => logopicker()}>
                                {
                                    Sender.uri ?
                                        <Image source={{ uri: Sender.uri }} style={{ width: 80, height: 80, borderRadius: 70 }} />
                                        :
                                        <View style={{ width: 80, height: 80, borderWidth: 0.25, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color }} />
                                        </View>
                                }
                            </TouchableOpacity>
                        </View>
                        <OriginTextInput required value={Sender.name} label={name_label} onChangeText={(text) => onValueChange('name', text)} />
                        {/* <OriginTextInput label={'email address'} onChangeText={(text)=>onValueChange('email',text)} /> */}
                        <TCPNTextInput  required value={Sender.ph} twoCol={true} label={ph_label} type={'number'} onChangeText={(text) => onValueChange('ph', text.toString())} />
                        <OriginTextInput required value={Sender.strNo} label={home_st_label} onChangeText={(text) => onValueChange('strNo', text)} />
                        <View style={styles.fw_with_spaceAR_mb}>
                            <View style={{ width: '50%' }}>
                                <SmallHighTextInput required label={ward_label} value={Sender.ward} width={'90%'} marginBottom={5} onChangeText={(text) => onValueChange('ward', text)} />
                            </View>

                            <View style={{ width: '50%' }}>
                                <SmallHighTextInput required label={post_code_label} value={`${Sender.post}`} width={'90%'} marginBottom={5} type={'number'} onChangeText={(text) => onValueChange('post', text)} />
                            </View>
                        </View>
                        <Text style={styles.FleetLabel}>{State_label}</Text>
                        <STComponent
                            isSelectSingle={true}
                            popupTitle={State_label}
                            title={Sender.city? Sender.city:State_label}
                            required 
                            value={Sender.city}
                            preSelectedItem={{ key: 'name', value: Sender.city }}
                            data={cities}
                            searchPlaceHolderText={State_label}
                            onChangeSelect={data => {
                                cityChange(data.name)
                                changeTwsp(data.id)
                                if(data.name == '') {
                                    setTsps([])
                                }
                            }}
                        />

                        <Text style={styles.FleetLabel}>{Tsp_label}</Text>
                        <STComponent
                            required 
                            value={Sender.tsp}
                            isSelectSingle={true}
                            popupTitle={Tsp_label}
                            title={Tsp_label}
                            data={tsps}
                            searchPlaceHolderText={Tsp_label}
                            onChangeSelect={data => {
                                onValueChange('tsp', data.name)
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
                        <HomePageBtn onPress={() => Register()}>{register_label}</HomePageBtn>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default SenderRegister;