import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { Icon, Picker, CheckBox, Toast } from 'native-base';
import { grey_color, light_grey_color,red_color, default_font, white_color, API_URL, primary_color, randomStr, green_color} from '../../../components/common';
import { OriginTextInput, TCPNTextInput, STComponent ,SmallHighTextInput, RNPicker } from '../../../components/form';
import { HomePageBtn } from '../../../components/button';
import ImagePicker from 'react-native-image-picker'
import { postData, getData, putData,deleteData, form_data_upload } from '../../../components/fetch';
import CityStore from '../../../mobx/cityStore';
import AppStore from '../../../mobx/AppStore';
import {styles} from "../../../components/styles";
import useValidAPiCall from '../../../components/validCallApi';
import { succUpdate, succDelete, genError, validErrMesswithPhoto, Tsp_label, name_label, ph_label, home_st_label, ward_label, post_code_label, delete_label, update_label } from '../../../components/labels and messges';
import { xxS } from '../../../components/font';
import { State_label } from "../../../components/labels and messges";

const SenderEdit = (props) => {
    const [userToken, setUserToken] = useState(AppStore.token)
    const [cities, setCities] = useState([]);
    const [tsps, setTsps] = useState([]);
    const [Agree, setAgree] = useState(false);
    const [Sender, setSender] = useState({
            img: '',
            name: '',
            ph: '',
            strNo: '',
            ward: '',
            post: '',
            tsp: ''
    })
    const [image, setImage] = useState('')
    const [counter, setCounter] = useState(0)
    const [init, setinit] = useState(0)
    const isValid = useValidAPiCall(Sender,init)

    // const addmorDeliv = () =>{
    //     const values = [...Dcounter];
    //     values.push({image: {uri: '', base64: ''}});
    //     setDcounter(values);
    // }

    useEffect(() => {
        async function callcitymobx() {

            await CityStore.load()
            setCities(CityStore.cities)
            var response = await getData(`${API_URL}/api/v0.1/senders/${props.navigation.getParam('Id')}`)
            if (response.ok) {
                var obj = response.data
                // setImage(obj.img.Key)
                if (typeof (obj.img) == 'object') {
                    obj.img.Location = `${API_URL}/api/v0.1/files?filename=${obj.img.Key}&random=${Math.random().toString(36).substring(7)}`
                }
                setSender(obj)
            } else {
                console.log(response.data)
            }
        }
        callcitymobx()
    }, [])

    // useEffect(()=>{
    //     setSender({
    //         ...Sender,
    //         tsp: ''
    //     })
    // },[Sender.city])

    useEffect(() => {
        if (Sender.city) {
            var obj = cities.find(x => x.name == Sender.city)
            changeTwsp(obj.id)
        }
    }, [Sender])

    const logopicker = () => {
        const options = {
            title: "Select Logo",
            maxWidth: 400,
            maxHeight: 400
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                setSender({
                    ...Sender,
                    img: {Location:`data:image/jpeg;base64,${response.data}`,Key: Sender.img.Key},
                })
                setCounter(counter+1)
               
            }
        })
    }

    const onValueChange = (key, value) => {
        setSender({
            ...Sender,
            [key]: value
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

    const cityChange = async (value) =>{
        setSender({
            ...Sender,
            city: value,
            tsp: ''
        })
    }

    const Edit = async () => {
        setinit(init+1)
        if(isValid){
            if(Sender.img.Location.includes('base64')){
                var result = await putData(`${API_URL}/api/v0.1/files?filename=${Sender.img.Key}`,{file: Sender.img.Location })
            }
            delete Sender['img']
            var response = await putData(`${API_URL}/api/v0.1/senders/${props.navigation.getParam('Id')}`, Sender)
            if (response.ok) {
                Toast.show({
                    text: succUpdate,
                    textStyle: { color: green_color, fontFamily: default_font },
                    duration: 1000,
                })
                props.navigation.navigate('SenderList')
            } else {
                Toast.show({
                    text: response.err ? response.err : genError,
                    textStyle: { color: red_color, fontFamily: default_font },
                    duration: 3000,
                })
            }
        }else{
            Toast.show({
                text: validErrMesswithPhoto,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 1000,
            })
        }
    }
      
    const deleteAction = () =>{
        deleteData(`${API_URL}/api/v0.1/senders/${[Sender._id]}` )
        .then(response=>{
            if(response.ok){
                Toast.show({
                    text: succDelete,
                    textStyle: {color: green_color,fontFamily: default_font}
                })
                props.navigation.navigate('SenderList')
            }
        })
    }

    return(
        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20, }}>
            <ScrollView>
                <View style={{ flexDirection: 'column', width: '100%', }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: "center", marginVertical: 30 }} >
                            <TouchableOpacity onPress={() => logopicker()}>
                                {
                                    Sender.img ?
                                        <Image source={{
                                            uri: Sender.img.Location ,
                                            headers: { Authorization: `Bearer ${userToken}` }
                                        }} style={{ width: 80, height: 80, borderRadius: 70 }} />
                                        :
                                        <View style={{ width: 80, height: 80, borderWidth: 0.25, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color }} />
                                        </View>
                                }
                            </TouchableOpacity>
                        </View>
                        <OriginTextInput required label={name_label} edit={true} value={Sender.name} onChangeText={(text) => onValueChange('name', text)} />
                        {/* <OriginTextInput label={'email address'} onChangeText={(text)=>onValueChange('email',text)} /> */}
                        <TCPNTextInput required twoCol={true} label={ph_label} edit={true} value={Sender.ph} type={'number'} onChangeText={(text) => onValueChange('ph', text.toString())} />
                        <OriginTextInput required label={home_st_label} edit={true} value={Sender.strNo} onChangeText={(text) => onValueChange('strNo', text)} />
                        <View style={styles.fw_with_spaceAR_mb}>
                            <View style={{ width: '50%' }}>
                                <Text style={{ fontSize: xxS, paddingBottom: 5, fontFamily: default_font, color: grey_color }}>{ward_label}</Text>
                                <SmallHighTextInput required width={'90%'} marginBottom={5} edit={true} value={Sender.ward} onChangeText={(text) => onValueChange('ward', text)} />
                            </View>

                            <View style={{ width: '50%' }}>
                                <Text style={{ fontSize: xxS, paddingBottom: 5, fontFamily: default_font, color: grey_color }}>{post_code_label}</Text>
                                <SmallHighTextInput required width={'90%'} type={'number'} edit={true} value={`${Sender.post}`} marginBottom={5} onChangeText={(text) => onValueChange('post', text)} />
                            </View>
                        </View>
                        {/* <View style={{flexDirection: 'row', width: '100%', height: 50,justifyContent: 'space-between', marginBottom: 15}}>
                                <OriginTextInput label={'Ward'} width={'45%'} onChangeText={(text)=>onValueChange('ward',text)}/>
                                <OriginTextInput label={'Postcode'} keyboardType={'number-pad'} width={'45%'} onChangeText={(text)=>onValueChange('post',text)}/>
                            </View> */}
                        <Text style={{ fontSize: xxS, marginVertical: 5, fontFamily: default_font, color: grey_color }}>{State_label}</Text>
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

                        <Text style={{ fontSize: xxS, marginVertical: 5, fontFamily: default_font, color: grey_color }}>{Tsp_label}</Text>
                        <STComponent
                            required
                            value={Sender.tsp}
                            isSelectSingle={true}
                            preSelectedItem={{ key: 'name', value: Sender.tsp }}
                            popupTitle={Tsp_label}
                            title={Sender.tsp? Sender.tsp: Tsp_label}
                            data={tsps}
                            edit={true}
                            searchPlaceHolderText={Tsp_label}
                            onChangeSelect={data => {
                                onValueChange('tsp', data.name)
                            }}
                        />
                    </View>
                    {/* <View style={{width: '100%',flexDirection: 'row', height: 40}}>
                            <Text style={{color: grey_color, marginHorizontal: 5, fontFamily: default_font}}>Register Delivery</Text>
                            <TouchableOpacity onPress={()=>addmorDeliv()}>
                                <Icon type={'Feather'} name={'plus-circle'} style={{color: light_grey_color, fontSize:  S}}/>
                            </TouchableOpacity>
                        </View> */}

                    {/* <View style={{width: '100%',flexDirection: 'row', paddingHorizontal :30}}>
                            <View style={{marginHorizontal :15}}>
                                <CheckBox 
                                checked={Agree}
                                color={light_grey_color}
                                style={{ borderRadius: 5, borderWidth: 0.5}}
                                onPress={()=>setAgree(!Agree)}
                                />
                            </View>
                            <View style={{flex:1,}}>
                                <Text style={{ color: grey_color, fontFamily: default_font}}>Agree Terms & Conditions</Text>
                            </View>
                        </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                        <HomePageBtn width={'45%'} btnBg={red_color} onPress={()=>deleteAction()}>{delete_label}</HomePageBtn>
                        <HomePageBtn width={'45%'} onPress={() => Edit()}>{update_label}</HomePageBtn>
                    </View>
                </View>

            </ScrollView>
        </View>
    )
}

export default SenderEdit;