import React, { useState, useEffect, useRef, createRef } from "react";
import { View, Text, Picker, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { type_three_color, grey_color, default_font, light_grey_color, API_URL, primary_color, red_color, green_color } from "../../components/common";
import { Icon, CheckBox, Form, Toast } from "native-base";
import { OriginTextInput, MultilineTextInput, TCPNTextInput, SmallHighTextInput, STComponent, RNPicker } from "../../components/form";
import { HomePageBtn } from "../../components/button";
import ImagePicker from 'react-native-image-picker';
import Select2 from "react-native-select-two";
import DatePicker from "react-native-datepicker";
import { useVerifyCode, useConfirmCode } from "../../auth/firebase";
import moment from "moment";
import { postData, getData, putData } from "../../components/fetch";
import AsyncStorage from "@react-native-community/async-storage";
import Loading from "../../components/loading";
import CityStore from "../../mobx/cityStore";
import { toJS } from "mobx";
import bankStore from "../../mobx/banks";
import VehicleStore from "../../mobx/VehicleStore";
import UserStore from "../../mobx/userStore";
import { getToken } from "../../services/storage";
import AppStore from "../../mobx/AppStore";
import { NavigationEvents } from "react-navigation";
import {styles} from "../../components/styles";
import { succUpdate, genError, TandCMessage, Tsp_label, 
    ph_label, email_label, name_label, driver_license, 
    driver_nrc_label, register_fleet_label, driver_register_num_label, 
    driver_plate_num_label, year_of_production_label, driver_select_cartype_label, 
    driver_cartype_label, select_bank_label, acc_num_label, register_paymentacc_label, 
    busi_days, busi_from, busi_to, busi_about, busi_hour, agree_label, back_label, 
    update_label, home_st_label, post_code_label, next_label, ward_label,
    general_information_label, busi_information_label, busi_name_label, busi_ph_label,
    busi_email_label, busi_reg_num_label, busi_cate_label, busi_subcate_label, busi_address_label, your_address_label
} from "../../components/labels and messges";
import { xxxS, xxS, L } from "../../components/font";
import { State_label } from "../../components/labels and messges";

//create custom hook
const useForceUpdate = () => useState()[1]


const UserEdit = (props) => {
    const [userDetail, setUserDetail] = useState({postcode: ''});
    const [userToken, setUserToken] = useState(AppStore.token)
    //phone registration
    const [count, setcount] = useState(0);
    const [codeInput, setValidPh] = useState('');
    const [ToverifyPh, setVerifyPh] = useState()
    const [verificationId, setverificationId] = useState('')
    const verifyResponse = useVerifyCode(ToverifyPh, count)
    const { confirmStatus, message, user } = useConfirmCode(verificationId, codeInput)

    const [cities, setCities] = useState([]);
    const [subcategories, setsubcategories] = useState([]);
    const [busiTwsps, setbusiTwsp] = useState([]);
    const [ Twsp, setTwsp ] = useState([]);
    const [vehicalType, setvehicalType] = useState([])
    const [banks, setbanks]=useState([])
    const [busicat, setbusicat] = useState([]);
    const [EmailErr, setEmailErr] = useState('')
    const [BusiemailErr, setBusiemailErr] = useState('')
    const [pherror, setpherror] = useState('');

    const[isLoading, setLoading]=useState(false)
    const[Links, setLinks] = useState([])                          // nrc front photo
    const [editable,setEditable] = useState(false)
    const [step, setStep] = useState(0)
    // const { navigation } = props;
        
    const FromRef = useRef([...Array(7)].map(() => createRef()));
    const ToRef = useRef([...Array(7)].map(() => createRef()));

    // call custom hooks
    const forceUpdate = useForceUpdate();
    const handleClick = () => {
        forceUpdate()
        initialstage()
        props.navigation.openDrawer()
        setStep(0)

    };
    
    //initial state
    useEffect(()=>{
        initialstage()
        setTimeout(() => {
            setEditable(true)
        }, 100)
    },[])

    const initialstage = async () =>{
        UserStore.load(props)
        .then(res=>{
            EditInfos = UserStore.UserStore
            if(!EditInfos.busiPost){
                EditInfos['busiPost'] = ''
            }
            setUserDetail(EditInfos)
           
        })
        CityStore.load()
        bankStore.load()
        VehicleStore.load()
        
        setCities(CityStore.cities)
        setbanks(bankStore.banks)
        var typedata = VehicleStore.Vtypes.map((x,i)=>{
            return {id: i+1, name: x.name}
        })
       
        setvehicalType(typedata)
        getData(`${API_URL}/api/v0.1/business-categories/all`)
        .then(response=>{
            var data = response.data.map(x=>{
                return {id: x._id, name: x.name}
            })
            setbusicat(data)
        })
        .catch(error => console.log(error))
        
    }

    useEffect(()=>{
        loadRender()
    },[step])

    // useEffect(()=>{
    //     if (cities && cities.length > 0) {
    //         changeValue('city', cities[0].name);
    //     }
    // },[cities])

    useEffect(()=>{
        typeof(userDetail.avatar) == 'object'  ?
        setUserDetail({
            ...userDetail,
            avatar:  `${API_URL}/api/v0.1/files?filename=${userDetail.avatar.Key}&random=${Math.random().toString(36).substring(7)}`,
        })
        :
        <></>
        userDetail.busiLogo && typeof( userDetail.busiLogo) == 'object' ?
            setUserDetail({
                ...userDetail,
                busiLogo :  `${API_URL}/api/v0.1/files?filename=${userDetail.busiLogo.Key}&random=${Math.random().toString(36).substring(7)}`
            })
        :
        <></>

        userDetail.licFront && typeof( userDetail.licFront) == 'object' ?
            setUserDetail({
                ...userDetail,
                licFront :  `${API_URL}/api/v0.1/files?filename=${userDetail.licFront.Key}&random=${Math.random().toString(36).substring(7)}`
            })
        :
        <></>
        userDetail.licBack && typeof( userDetail.licBack) == 'object' ?
            setUserDetail({
                ...userDetail,
                licBack :  `${API_URL}/api/v0.1/files?filename=${userDetail.licBack.Key}&random=${Math.random().toString(36).substring(7)}`
            })
        :
        <></>

        userDetail.nrcFront && typeof( userDetail.nrcFront) == 'object' ?
            setUserDetail({
                ...userDetail,
                nrcFront : `${API_URL}/api/v0.1/files?filename=${userDetail.nrcFront.Key}&random=${Math.random().toString(36).substring(7)}`
            })
        :
        <></>

        userDetail.nrcBack && typeof( userDetail.nrcBack) == 'object' ?
            setUserDetail({
                ...userDetail,
                nrcBack : `${API_URL}/api/v0.1/files?filename=${userDetail.nrcBack.Key}&random=${Math.random().toString(36).substring(7)}`
            })
        :
        <></>

        if(userDetail.city){
            var obj = cities.find(x=>x.name == userDetail.city)
            changeTwsp('user',obj.id)
        }

        if(userDetail.busiCity){
            var busiObj = cities.find(x=>x.name == userDetail.busiCity)
            changeTwsp('busi',busiObj.id)
        }
    },[userDetail])

    //set time for business type register
    const settime = async (time, index, type) => {
        // console.log(time)
        hour = time.substring(0, 2)
        min = time.substring(3)
        let am_pm = 'am';
        

        if (hour > 11) {
            am_pm = 'pm';
            if (hour > 12) {
                hour = hour - 12;
            }
        }
        if (hour == 0) {
            hour = 12;
        }

        var busiHour = userDetail.busiHr
        if (type == 'from') {
            busiHour[index].from = `${hour}: ${min} ${am_pm}`
        } else {
            busiHour[index].to = `${hour}: ${min} ${am_pm}`
        }
        await setUserDetail({
            ...userDetail,
            busiHr: JSON.parse(JSON.stringify(busiHour))
        }) // change the whole obj of business hour
    }

    // image picked for all image 
    const pickImage = (param) => {
        var key = 'avatar'
        if(param == 'avatar'){
            key = 'avatar'
        }else if(param == 'business-logo'){
            key = 'busiLogo'
        }else if(param == 'license-front'){
            key = 'licFront'
        }else if(param == 'license-back'){
            key= 'licBack'
        }else if(param == 'nrc-front'){
            key = 'nrcFront'
        }else if(param == 'nrc-back'){
            key = 'nrcBack'
        }
        const options = {
            title: "Select Image",
            maxWidth: 400,
            maxHeight: 400
        };
        ImagePicker.launchImageLibrary(options, (response) => {

            if (!response.didCancel) {
                var imageroute = []
                imageroute.push({url: `${API_URL}/api/v0.1/me/${param}`, object: {[key]:`data:image/jpeg;base64,${response.data}`}})
                setLinks(imageroute)
                setUserDetail({
                    ...userDetail,
                    [key] :`data:image/jpeg;base64,${response.data}`
                    // [key] : `${API_URL}/api/v0.1/files?filename=${result.data.Key}`
                })
                
            }
        })
    }

    // change for all value in userDetail
    const changeValue = (key, value) => {
        if(key == 'ph'){
            if(value.length > 9 )
            {
                setpherror('invalid phone number')
            }else{
                setpherror('')
            }
        }
            setUserDetail({
                ...userDetail,
                [key]: value
            })
    }

    
    const cityChange = async (key,value) =>{
        var tsptype =( key == 'city')? 'tsp': 'busiTsp'
        setUserDetail({
            ...userDetail,
            [key] : value,
            [tsptype] : ''
        })  
    }

    
    const toStep1 = () =>{
        if(EmailErr != '' || pherror != ''){
            var error = ''
            if(EmailErr != ''){
                error = EmailErr
            }
            if(pherror != ''){
                erorr = pherror
            }
            Toast.show({
                text: error,
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: 'Okay',
                duration: 3000,
            })
        }else{
            setStep(1)
        } 
    }

    const toStep2 = () =>{
        if(BusiemailErr != ''){
            // alert(BusiemailErr)
            Toast.show({
                text: BusiemailErr,
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: 'Okay',
                duration: 3000,
                // onClose: () => Toast.hide()
            })

        }else{
            setStep(2)
        }
    }

    //township changing funct
    const changeTwsp = async (key,index) => {
        var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`)
        var townships = []
        response.data.map((township,i) =>{
            townships.push({id: township._id, name: township.name, cityId: township.cityId})
        })
        if(key == 'user'){
            setTwsp(townships)
        }else{
            setbusiTwsp(townships)
        }
    }

    // bank customize number box without use parseInt
    const bankCustomizeNumberBox = async(text) => {
        var value = text.replace( /^\D+/g, '')
        setUserDetail({...userDetail,accNo:value})
    }
    
    // step changing for render start

        // check render base on usertype
        const loadTypeRender = () => {
            return (
                userDetail.userType == 'DRIVER' ?
                DriverRegister():UserRegisterRender()
            )
        }

        // render for driver usertype
        const DriverRegister = () => {
            return (
                <View style={{ flex: 1 }}>
                    {/* Driver Register */}
                    <View style={{ width: '100%', height: 30 }}>
                        <Text style={{ fontFamily: default_font }}>{driver_license}</Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingBottom: 10 }}>
                            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                                <TouchableOpacity onPress={() => pickImage('license-front')}>
                                    {
                                         
                                        typeof(userDetail.licFront ) != 'object'?
                                            <Image source={{ uri: userDetail.licFront,
                                                headers: {Authorization: `Bearer ${userToken}`} }} style={{ borderRadius: 5, height: 70, width: '90%' }} />
                                            :
                                            <View style={{ borderRadius: 5, height: 70, width: '90%', borderWidth: 1, borderColor: grey_color, justifyContent: 'center' }}>
                                                <Text style={{ color: grey_color, textAlign: 'center', fontFamily: default_font }}>Front</Text>
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                                <TouchableOpacity onPress={() => pickImage('license-back')}>
                                    {
                                        
                                        typeof(userDetail.licBack ) != 'object'?
                                            <Image source={{ uri: userDetail.licBack,
                                                headers: {Authorization: `Bearer ${userToken}`} }} style={{ borderRadius: 5, height: 70, width: '90%', }} />
                                            :
                                            <View style={{ borderRadius: 5, height: 70, width: '90%', borderWidth: 1, borderColor: grey_color, justifyContent: 'center' }}>
                                                <Text style={{ color: grey_color, textAlign: 'center', fontFamily: default_font }}>Back</Text>
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: '100%', height: 30 }}>
                        <Text style={{ fontFamily: default_font }}>{driver_nrc_label}</Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingBottom: 10 }}>
                            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                                <TouchableOpacity onPress={() => pickImage('nrc-front')}>
                                    {
                                      
                                         typeof(userDetail.nrcFront ) != 'object'?
                                            <Image source={{ uri: userDetail.nrcFront,
                                                    headers:{Authorization: `Bearer ${userToken}`} }} style={{ borderRadius: 5, height: 70, width: '90%', }} />
                                            :
                                            <View style={{ borderRadius: 5, height: 70, width: '90%', borderWidth: 1, borderColor: grey_color, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontFamily: default_font }}>Front</Text>
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                                <TouchableOpacity onPress={() => pickImage('nrc-back')}>
                                    {
                                        typeof(userDetail.nrcBack ) != 'object'?
                                            <Image source={{ uri: userDetail.nrcBack ,
                                                headers:{Authorization: `Bearer ${userToken}`}}} style={{ borderRadius: 5, height: 70, width: '90%', }} />
                                            :
                                            <View style={{ borderRadius: 5, height: 70, width: '90%', borderWidth: 1, borderColor: grey_color, justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', fontFamily: default_font }}>Back</Text>
                                            </View>
                                        
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View>                        
                        <Text style={{ textAlign: 'center', borderTopWidth: 0.5,color: primary_color,fontWeight: 'bold',paddingVertical: 20 } } >{register_fleet_label}</Text>
                        <SmallHighTextInput placeholder={ driver_register_num_label } label={driver_register_num_label} value={userDetail.regNo} marginBottom={5} onChangeText={(text)=>setUserDetail({...userDetail,regNo:text})}/>
                        <SmallHighTextInput placeholder={ driver_plate_num_label } label={driver_plate_num_label} value={userDetail.platNo} marginBottom={5} onChangeText={(text)=>setUserDetail({...userDetail,platNo:text})} />
                            
                        {/* <Text style={{ fontSize: xxS, paddingBottom: 5, fontFamily: default_font }}>Type of Car</Text> */}
                            
                            <STComponent
                                isSelectSingle={true}
                                label={driver_cartype_label}
                                popupTitle={driver_select_cartype_label}
                                height={40}
                                style={{height: 40}}
                                title={userDetail.type? userDetail.type:driver_select_cartype_label}
                                value={userDetail.type}
                                preSelectedItem={{ key: 'name', value: userDetail.type }}
                                data={vehicalType}
                                searchPlaceHolderText={driver_select_cartype_label}
                                onChangeSelect={data => {
                                    setUserDetail({
                                        ...userDetail,
                                        type: data.name
                                    })
                                }}
                                
                            />
                    </View>

                    <SmallHighTextInput placeholder={ year_of_production_label } label={year_of_production_label} value={userDetail.year} onChangeText={(text)=>setUserDetail({...userDetail,year:text})} />
                        
                    <Text style={styles.PackageLabel } >{register_paymentacc_label}</Text>
                    <View style={{ borderTopWidth: 0.5, paddingTop: 5 }}>
                        <Text style={{ marginHorizontal: 5, fontFamily: default_font }}>{select_bank_label}</Text>
                        <STComponent
                            isSelectSingle={true}
                            popupTitle={select_bank_label}
                            height={40}
                            style={{height: 40}}
                            title={userDetail.bank? userDetail.bank:select_bank_label}
                            required 
                            value={userDetail.bank}
                            preSelectedItem={{ key: 'name', value: userDetail.bank }}
                            data={banks}
                            searchPlaceHolderText={select_bank_label}
                            onChangeSelect={data => {
                                setUserDetail({
                                    ...userDetail,
                                    bank: data.name
                                })
                            }}
                        />
                        <OriginTextInput label={acc_num_label} value={userDetail.accNo} placeholder={acc_num_label} keyboardType={'number-pad'} marginBottom={10} onChangeText={(text)=>bankCustomizeNumberBox(text)}/>
                    </View>

                </View>
            )
        }

        // render for normal and service provider usertype
        const UserRegisterRender = () => {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%', height: 50 }}>
                    <Text style={styles.PackageLabel}>{busi_hour}</Text>
                    </View>
                    <View style={{ width: '100%', paddingHorizontal: 30 }}>
                        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingBottom: 10 }}>
                            <View style={{ flex: 0.5 }}>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: grey_color, fontFamily: default_font }}>{busi_days}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: grey_color, fontFamily: default_font }}>{busi_from}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: grey_color, fontFamily: default_font }}>{busi_to}</Text>
                            </View>
                        </View>
                        {
                            userDetail.busiHr.map((busihr, index) => (
                                <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10 }} key={index}>
                                    <View style={{ flex: 0.5 }}>
                                        <CheckBox
                                            checked={busihr.check}
                                            color={light_grey_color}
                                            style={{ borderRadius: 5, borderWidth: 0.5 }}
                                            onPress={() => {
                                                var updateone = userDetail.busiHr
                                                updateone[index].check = !busihr.check
                                                if(updateone[index].check == false){
                                                    updateone[index].from = '--:-- am'
                                                    updateone[index].to = '--:-- pm'
                                                }else{
                                                    updateone[index].from = userDetail.busiHr[0].from
                                                    updateone[index].to = userDetail.busiHr[0].to
                                                }
                                                setUserDetail({
                                                    ...userDetail,
                                                    busiHr: updateone
                                                })
                                            }}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: grey_color, fontFamily: default_font }}>{busihr.day}</Text>
                                    </View>
                                    {
                                        busihr.check ? 
                                        <>
                                            <View style={{ flex: 1 }}>
                                            
                                                <TouchableOpacity onPress={() => {
                                                    FromRef.current[index].current.onPressDate()
                                                }}>
                                                    <Text style={{ color: grey_color, fontFamily: default_font }}> {busihr.from}</Text>

                                                    <DatePicker
                                                        mode={'time'}
                                                        showIcon={false}
                                                        date={busihr.from == '--:-- am'? '00:00 am':busihr.from}
                                                        style={{ width: 50, height: 10 }}
                                                        hideText={true}
                                                        is24Hour
                                                        ref={FromRef.current[index]}
                                                        androidMode={'spinner'}
                                                        onDateChange={async (time) => {
                                                            await settime(time, index, type = 'from')
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <TouchableOpacity onPress={() => {
                                                    ToRef.current[index].current.onPressDate()
                                                }}>
                                                    <Text style={{ color: grey_color, fontFamily: default_font }}>{busihr.to}</Text>

                                                    <DatePicker
                                                        mode={'time'}
                                                        showIcon={false}
                                                        date={busihr.to == '--:-- pm'? '00:00 pm':busihr.to}
                                                        style={{ width: 50, height: 10 }}
                                                        hideText={true}
                                                        is24Hour
                                                        ref={ToRef.current[index]}
                                                        androidMode={'spinner'}
                                                        onDateChange={async(time) => await settime(time, index, type = 'to')}
                                                    />

                                                </TouchableOpacity>
                                            </View>
                                        </>
                                        :
                                        <>
                                            <View style={{ flex: 1 }}>
                                                <View>
                                                    <Text style={{ color: grey_color, fontFamily: default_font }}> {busihr.from}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <View>
                                                    <Text style={{ color: grey_color, fontFamily: default_font }}>{busihr.to}</Text>
                                                </View>
                                            </View>
                                        </>
                                    }

                                </View>
                            ))
                        }
                    </View>
                    <Text style={{ fontFamily: default_font }}>{busi_about}</Text>
                    <MultilineTextInput placeholder={ 'Enter your business information here.' } value={userDetail.about} numberOfLines={10} onChangeText={(text) => changeValue('about',text)}/>

                </View>

            )
        }

        // show render base on usertype
        const TypeRegister = () => {
            return (
                <View style={{ flexDirection: 'column', width: '100%', borderTopWidth: 0.5, paddingVertical: 20, marginBottom: 10 }}>

                    {loadTypeRender()}

                    <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 30 }}>
                        <View style={{ marginHorizontal: 15 }}>
                            <CheckBox
                                checked={userDetail.agreeTC}
                                color={light_grey_color}
                                style={{ borderRadius: 5, borderWidth: 0.5 }}
                                onPress={() => setUserDetail({
                                    ...userDetail,
                                    agreeTC: !userDetail.agreeTC
                                })}
                            />
                        </View>
                        <View style={{ flex: 1, }}>
                            <Text style={{ color: grey_color,fontFamily: default_font }}>{agree_label}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,paddingVertical: 10 }}>
                        <HomePageBtn width={'45%'} onPress={()=>setStep(1)}>{back_label}</HomePageBtn>
                        <HomePageBtn width={'45%'} onPress={()=>Update()}>{update_label}</HomePageBtn>
                    </View>
                    
                </View>
            )
        }

        // step 1 (user information form)
        const UserInformation = () =>{
            return(
            <View style={{flex:1}}>

                <View style={{ flexDirection: 'column', width: '100%', }}>
                    <View style={{ flexDirection: 'row', justifyContent: "center", marginVertical: 30 }}>
                        <TouchableOpacity onPress={() => pickImage('avatar')}>
                            {
                               
                                (typeof(userDetail.avatar ) != 'object'?
                                <>
                                <Image source={{uri: userDetail.avatar,
                                            headers: {Authorization: `Bearer ${userToken}`}}}
                                    style={{ width: 80, height: 80, borderRadius: 70 }} />
                                </>
                                :
                                <View style={{ width: 80, height: 80, borderWidth: 0.25, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color }} />
                                </View>)

                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.PackageLabel } >{general_information_label}</Text>
                    <OriginTextInput label={ name_label } placeholder={name_label} onChangeText={(text) => changeValue("name", text)} required value={userDetail.name}/>
                    <OriginTextInput 
                        edit 
                        email 
                        required 
                        label={ email_label } 
                        editable={editable} 
                        placeholder={email_label} 
                        onBlur={(message)=>{setEmailErr(message)}} 
                        onChangeText={(text) =>{changeValue("email", text)}} 
                        value={userDetail.email}
                    />

                    <TCPNTextInput label={ ph_label } errormessage={pherror} twoCol={true} placeholder={ph_label} type={'number'} required  value={userDetail.ph} onChangeText={(text) => changeValue('ph', text.toString())}/>
                    
                    <Text style={styles.PackageLabel } >{your_address_label}</Text>
                    <OriginTextInput label={ home_st_label } placeholder={home_st_label} onChangeText={(text)=>changeValue('strNo',text)} required value={userDetail.strNo}/>
                    
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingTop: 0 }}>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <OriginTextInput label={ward_label} placeholder={ward_label} width={'90%'} onChangeText={(text) => changeValue('ward', text)} required  value={userDetail.ward} />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <OriginTextInput label={post_code_label} type={'number'} placeholder={post_code_label} width={'90%'} required  value={`${userDetail.postcode}`} onChangeText={(text) => changeValue('postcode', text)} />
                        </View>
                    </View>
                    <STComponent
                        isSelectSingle={true}
                        label={State_label}
                        popupTitle={State_label}
                        title={userDetail.city? userDetail.city:State_label}
                        required 
                        value={userDetail.city}
                        preSelectedItem={{ key: 'name', value: userDetail.city }}
                        data={cities}
                        searchPlaceHolderText={State_label}
                        onChangeSelect={data => {
                            cityChange('city',data.name)
                            changeTwsp('user',data.id)
                            if(data.name == '') {
                                setTwsp([])
                            }
                        }}
                    />

                    <STComponent
                        isSelectSingle={true}
                        label={Tsp_label}
                        popupTitle={Tsp_label}
                        title={userDetail.tsp? userDetail.tsp:Tsp_label}
                        required 
                        value={userDetail.tsp}
                        preSelectedItem={{ key: 'name', value: userDetail.tsp }}
                        data={Twsp}
                        searchPlaceHolderText={Tsp_label}
                        onChangeSelect={data => {
                            setUserDetail({
                                ...userDetail,
                                tsp: data.name
                            })
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10 }}>
                    <HomePageBtn onPress={()=>toStep1()}>{next_label}</HomePageBtn>
                </View>
            </View>

            )
        }


        // step 2 (business information form)
        const BusinessInformation = () => {
            return (
                <View style={{ flexDirection: 'column', width: '100%', borderTopWidth: 0, paddingVertical: 20 }}>
                    <View style={{ width: '100%', height: 50 }}>
                        <Text style={styles.PackageLabel}>{busi_information_label}</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: "center", paddingBottom: 30 }} onPress={() => pickImage('business-logo')}>
                        {
                            userDetail.busiLogo ?
                                <Image source={{ uri: `${userDetail.busiLogo}`,
                                    headers:{Authorization: `Bearer ${userToken}`} }} style={{ width: 80, height: 80, borderRadius: 70 }} />
                            :
                            <View style={{ width: 80, height: 80, borderWidth: 0.25, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color }} />
                            </View>
                        }
                    </TouchableOpacity>
                    <OriginTextInput label={ busi_name_label} placeholder={busi_name_label} value={userDetail.busiName} onChangeText={(text)=>changeValue('busiName',text)}/>
                    <TCPNTextInput label={ busi_ph_label }  value={userDetail.busiPh} placeholder={busi_ph_label} twoCol={true} type={'number'} onChangeText={(text)=>changeValue('busiPh',text.toString())} />
                    <OriginTextInput label={ busi_email_label } email edit placeholder={busi_email_label}  value={userDetail.busiEmail} onBlur={(message)=>setBusiemailErr(message)} onChangeText={(text)=>changeValue('busiEmail',text)} />
                    <OriginTextInput label={ busi_reg_num_label } placeholder={busi_reg_num_label}  value={userDetail.busiRegNo} onChangeText={(text)=>changeValue('busiRegNo',text)} />
                    
                        <STComponent
                            isSelectSingle={true}
                            label={busi_cate_label}
                            popupTitle={busi_cate_label}
                            title={userDetail.busiCat ? userDetail.busiCat: busi_cate_label}
                            data={busicat}
                            searchPlaceHolderText={busi_cate_label}
                            preSelectedItem={{ key: 'name', value: userDetail.busiCat }}
                            onChangeSelect={data => {
                                setUserDetail({
                                    ...userDetail,
                                    busiCat: data.name
                                })
                            }}
                        />


                        <STComponent
                            isSelectSingle={true}
                            label={busi_subcate_label}
                            popupTitle={busi_subcate_label}
                            title={userDetail.busiSubCat ? userDetail.busiSubCat: busi_subcate_label}
                            data={subcategories}
                            searchPlaceHolderText={busi_subcate_label}
                            preSelectedItem={{ key: 'name', value: userDetail.busiSubCat }}
                            onChangeSelect={data => {
                                setUserDetail({
                                    ...userDetail,
                                    busiSubCat: data.name
                                })
                            }}
                        />

                    <Text style={styles.PackageLabel } >{busi_address_label}</Text>
                    <OriginTextInput label={ home_st_label } placeholder={home_st_label} value={userDetail.busiStrNo} onChangeText={(text)=>changeValue('busiStrNo',text)}/>
                    
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingTop: 0 }}>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <OriginTextInput label={ward_label} placeholder={ward_label} width={'90%'}  value={userDetail.busiWard} onChangeText={(text) => changeValue('busiWard', text)} />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <OriginTextInput label={post_code_label} type={'number'}  value={`${userDetail.busiPost}`} placeholder={post_code_label} width={'90%'} onChangeText={(number) => changeValue('busiPost', number)} />
                        </View>
                    </View>

                    <STComponent
                        isSelectSingle={true}
                        popupTitle={State_label}
                        label={State_label}
                        title={userDetail.busiCity ? userDetail.busiCity: State_label}
                        data={cities}
                        searchPlaceHolderText={State_label}
                        preSelectedItem={{ key: 'name', value: userDetail.busiCity }}
                        onChangeSelect={data => {
                            cityChange('busiCity',data.name)
                            changeTwsp('busi',data.id)
                            if(data.name == '') {
                                setbusiTwsp([])
                            }
                        }}
                    />

                    <STComponent
                        isSelectSingle={true}
                        popupTitle={Tsp_label}
                        label={Tsp_label}
                        title={userDetail.busiTsp ? userDetail.busiTsp: Tsp_label}
                        data={busiTwsps}
                        searchPlaceHolderText={Tsp_label}
                        preSelectedItem={{ key: 'name', value: userDetail.busiTsp }}
                        onChangeSelect={data => {
                            setUserDetail({
                                ...userDetail,
                                busiTsp: data.name
                            })
                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <HomePageBtn width={'45%'} onPress={()=>setStep(0)}>{back_label}</HomePageBtn>
                        <HomePageBtn width={'45%'} onPress={()=>toStep2()}>{next_label}</HomePageBtn>
                    </View>
                </View>
            )
        }

        // for changing step 
        const loadRender = () =>{
            return(
                step == 0? 
                UserInformation()
                :(step == 1 ?
                    BusinessInformation()
                    :
                    TypeRegister()
                )
            )
        }
        
    // step changing finish

    //final register 
    const Update = async() =>{
        // var id = userDetail._id
        if(Links.length > 0){
            Links.map((link,i)=>{
                postData(link.url, link.object)
                .then(result=>{
                    if(!result.ok){
                        Toast.show({
                            text: 'image upload fail!',
                            textStyle: {color: red_color, fontFamily: default_font},
                            duration: 3000
                        })
                    }
                })
            })
        }
        var item = ['_id','avatar','licFront','licBack','nrcFront','nrcBack','busiLogo']
        item.map((x,i) => {
            delete userDetail[x]
        })
        typeof(userDetail["busiPost"]) == 'string' ? userDetail["busiPost"] = 0 : <></>
        if (userDetail.agreeTC == false) {
            Toast.show({
                text: TandCMessage,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 3000,
            })
        } else{
            putData(`${API_URL}/api/v0.1/me`,userDetail)
            .then(response=>{
                if(response.ok){
                    Toast.show({
                        text: succUpdate,
                        textStyle: { color: green_color ,fontFamily: default_font },
                        duration: 1000
                    })
                }else{
                    Toast.show({
                        text: response.err,
                        textStyle: { color: red_color,fontFamily: default_font },
                        duration: 1000,
                    })
                }
            })
        }
        
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20, }}>
                <NavigationEvents onDidFocus={()=>initialstage()} />
                <ScrollView>
                    {loadRender()}
                </ScrollView>
            </View>
        </View>

    )
}

export default UserEdit;
