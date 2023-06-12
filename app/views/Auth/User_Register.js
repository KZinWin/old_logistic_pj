

import React, { useState, useEffect, useRef, createRef } from "react";
import { View, Text, Picker, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { type_three_color, grey_color, default_font, light_grey_color, API_URL, primary_color, red_color, white_color, green_color, psw_min_length } from "../../components/common";
import { Icon, CheckBox, Form, Toast } from "native-base";
import { OriginTextInput, MultilineTextInput, TCPNTextInput, SmallHighTextInput, STComponent, ValidateForm, RNPicker, SearchForm } from "../../components/form";
import { HomePageBtn } from "../../components/button";
import ImagePicker from 'react-native-image-picker';
import Select2 from "react-native-select-two";
import DatePicker from "react-native-datepicker";
import { useVerifyCode, useConfirmCode } from "../../auth/firebase";
import moment from "moment";
import { postData, getData } from "../../components/fetch";
import AsyncStorage from "@react-native-community/async-storage";
import Loading from "../../components/loading";
import CityStore from "../../mobx/cityStore";
import { toJS, comparer } from "mobx";
import bankStore from "../../mobx/banks";
import VehicleStore from "../../mobx/VehicleStore";
import {styles} from "../../components/styles";
import { validErrormessage, validErrMesswithPhoto, lengthValide, pswNotMatch, pswMatch, pswEmptyValid, TandCMessage, Tsp_label, email_label, name_label, driver_license_label, driver_register_num_label, register_fleet_label, driver_plate_num_label, driver_cartype_label, driver_select_cartype_label, year_of_production_label, register_paymentacc_label, select_bank_label, acc_num_label, busi_hour, busi_days, busi_from, busi_to, busi_about, agree_label, back_label, register_label, general_information_label, ph_label, enter_otp_label, password_label, conf_password_label, your_address_label, home_st_label, ward_label, post_code_label, next_label, busi_information_label, busi_name_label, busi_ph_label, busi_email_label, busi_reg_num_label, busi_cate_label, busi_subcate_label, busi_address_label } from "../../components/labels and messges";
import useValidAPiCall, { useNestedObjCheck } from "../../components/validCallApi";
import { xxS, xxxS, standard_font_size } from "../../components/font";
import ModalWrapper from "react-native-modal-wrapper";
import Spinner from "react-native-loading-spinner-overlay";
import { State_label } from "../../components/labels and messges";

const UserRegister = (props) => {
    const [userDetail, setUserDetail] = useState({
        avatar: '', name: '', email: '', ph: '', psw: '', confirmPass: '', strNo: '', ward: '', postcode: '', city: '', tsp: '', userType: '', otpVerified : false,
        //business
        busiLogo: '', busiName: "", busiPh: "", busiEmail: "", busiRegNo: "", busiCat: "", busiSubCat: "", busiStrNo: "", busiWard: "", busiPost: '', busiCity: "", busiTsp: "",
        //
        about: '',

    });
    const [agreeTC, setAgree] = useState(false)

    //phone registration
    const [count, setcount] = useState(0);
    const [codeInput, setValidPh] = useState('');
    const [ToverifyPh, setVerifyPh] = useState()
    const [verificationId, setverificationId] = useState('')
    const verifyResponse = useVerifyCode(ToverifyPh, count)
    const { confirmStatus, message, user } = useConfirmCode(verificationId, codeInput)

    const [subcategories, setsubcategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [busiTwsps, setbusiTwsp] = useState([]);
    const [Twsp, setTwsp] = useState([]);
    const [vehicalType, setvehicalType] = useState([])
    const [banks, setbanks] = useState([])

    const [isLoading, setLoading] = useState(false)
    const [pherror, setpherror] = useState();
    const [passwordError, setpasswordError] = useState('');
    const [mailErrMess, setMailErrMess] = useState('')
    const [EmailErr, setEmailErr] = useState('')

    const [busicat, setbusicat] = useState([]);
    const [Avatar, setAvatar] = useState('');
    const [logo, setLogo] = useState('');
    const [DLF, setDLF] = useState('');                                   //driver lincense front photo
    const [DLB, setDLB] = useState('');                                   //driver lincense front photo
    const [NRCF, setNRCF] = useState('');                                 // nrc front photo
    const [NRCB, setNRCB] = useState('');                                 // nrc back photo
    const [servicelist, setServicelist] = useState({ id: '',name: '' })
    const [driverRg, setDriverRg] = useState({ nrcFront: '', nrcBack: '', licFront: '', licBack: '', regNo: '', type: '', platNo: '',  accNo: '' , bank: '', year: ''});
    const [busiHr, setbusiHr] = useState([
        { day: 'MON', from: '--:-- am', to: '--:-- pm', check: false },
        { day: 'TUE', from: '--:-- am', to: '--:-- pm', check: false },
        { day: 'WED', from: '--:-- am', to: '--:-- pm', check: false },
        { day: 'THU', from: '--:-- am', to: '--:-- pm', check: false },
        { day: 'FRI', from: '--:-- am', to: '--:-- pm', check: false },
        { day: 'SAT', from: '--:-- am', to: '--:-- pm', check: false },
        { day: 'SUN', from: '--:-- am', to: '--:-- pm', check: false },
    ])

    const [phload, setPhLoad] = useState(undefined)
    // const [obj, setObj] = useState({})
    const [init, setInit] = useState(0)
    const isValid = useValidAPiCall(driverRg,init)
    
    const [modalVisible, setModalVisible] = useState(false)
    const [serviceInfo, setServiceinfo] = useState([])
    const [endOfResult, setEndOfResult] = useState(true)
    const [page, setPage] = useState(2)
    const [service, setService] = useState({})
    
    const [step, setStep] = useState(0)
    // const { navigation } = props;

    const FromRef = useRef([...Array(7)].map(() => createRef()));
    const ToRef = useRef([...Array(7)].map(() => createRef()));

    // const [userType, setUser] = useState(navigation.getParam('userType'));

    //initial state

    useEffect(() => {
        const loadData = async () => {
            await CityStore.load();
            await bankStore.load();
            await VehicleStore.load();
        }

        setUserDetail({
            ...userDetail,
            userType: props.navigation.getParam('userType')
        });

        loadData();

        setCities(CityStore.cities)
        setbanks(bankStore.banks)
        setvehicalType(VehicleStore.Vtypes)
        getData(`${API_URL}/api/v0.1/business-categories/all`)
            .then(response => {
                var data = response.data.map(x=>{
                    return {id: x._id, name: x.name}
                })
                setbusicat(data)
            })

        // getData(`${API_URL}/api/v0.1/customer/service-providers`)
        // .then(result=>{
        //     console.log(result)
        //     if (result.ok) {
        //         var list = []
        //         result.data.data.map((data, i) => {
        //             list.push({ id: data._id, name: data.name })
        //         })
        //         setServiceinfo(list)
        //     }
        // })
            
    }, [])

    useEffect(()=>{
        if(userDetail.userType == 'DRIVER'){
            getData(`${API_URL}/api/v0.1/service-providers`)
            .then(response=>{
                setServiceinfo(response.data.data)
            })
        }
    },[userDetail.userType])

    // useEffect(() => {
    //     loadRender()
    //     if(step == 2) {
    //         setDriverRg({
    //             ...driverRg,
    //             bank: banks[0].name
    //         })
    //     }
    // }, [step])

    //cities
    // useEffect(() => {
    //     if (toJS(cities) && toJS(cities).length > 0) {
    //         changeValue('city', cities[0].name);
    //         changeTwsp('busi', cities[0].id)
    //         changeTwsp('user', cities[0].id);
    //     }
    // }, [cities])

    useEffect(()=>{
        if(confirmStatus == 'success'){
            setUserDetail({
                ...userDetail,
                otpVerified: true 
            })
        }
    },[confirmStatus])

    useEffect(() => {
        if (userDetail.psw == '' || userDetail.confirmPass == '') {
            setpasswordError(pswEmptyValid)
        } else if (userDetail.psw == userDetail.confirmPass) {
            setpasswordError(pswMatch)
        } else {
            setpasswordError(pswNotMatch)
        }
    }, [userDetail.confirmPass])

    useEffect(() => {
        if (verifyResponse) {
            setverificationId(verifyResponse.verificationId)
            setPhLoad(false)
            setpherror('')
        } else {
            setpherror(verifyResponse)
        }
    }, [verifyResponse])

    useEffect(() => {
        
        if (userDetail.ph == '') {
            setVerifyPh('')
        }
    }, [userDetail])

    //set time for business type register
    const settime = async (time, index, type) => {
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

        var busiHour = busiHr
        if (type == 'from') {
            busiHour[index].from = `${hour}: ${min} ${am_pm}`
        } else {
            busiHour[index].to = `${hour}: ${min} ${am_pm}`
        }
        await setbusiHr(JSON.parse(JSON.stringify(busiHour))) // change the whole obj of business hour
    }

    // for driver type obj change values
    const driverChgVal = (key, val) => {
        setDriverRg({
            ...driverRg,
            [key]: val
        })
    }

    useEffect(() => {
        if (userDetail.ph == '') {
            setVerifyPh('')
            setPhLoad(false)
        }
    }, [userDetail.ph])

    // image picked for all image 
    const pickImage = (param) => {
        const options = {
            title: "Select Image",
            maxWidth: 400,
            maxHeight: 400
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                param == 'avatar' ?
                    (
                        setAvatar(response.uri), // get data for show image
                        changeValue('avatar', `data:image/jpeg;base64,${response.data}`)
                        // get data for save image
                    )
                    :
                    (
                        param == 'dlf' ?
                            (
                                setDLF(response.uri),
                                driverChgVal('licFront', `data:image/jpeg;base64,${response.data}`)
                            )
                            :
                            (
                                param == 'dlb' ?
                                    (
                                        setDLB(response.uri),
                                        driverChgVal('licBack', `data:image/jpeg;base64,${response.data}`)
                                    )
                                    :
                                    param == 'nrcf' ?
                                        (
                                            setNRCF(response.uri),
                                            driverChgVal('nrcFront', `data:image/jpeg;base64,${response.data}`)
                                        )
                                        :
                                        (
                                            setNRCB(response.uri),
                                            driverChgVal('nrcBack', `data:image/jpeg;base64,${response.data}`)
                                        )
                            )
                    )
            }

        })
    }

    // for changing business information's logo
    const logopicker = () => {
        const options = {
            title: "Select Logo",
            maxWidth: 400,
            maxHeight: 400
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            // base64 = response.data,
            if (!response.didCancel) {
                setLogo(response.uri)
                setUserDetail({
                    ...userDetail,
                    busiLogo: `data:image/jpeg;base64,${response.data}`
                })
            }
        })
    }

    // change for all value in userDetail
    const changeValue = (key, value) => {
        setUserDetail({
            ...userDetail,
            [key]: value
        })
    }

    // otp code set 
    const changeCode = (text) => {
        let code = text
        setUserDetail({
            ...userDetail,
            otp: text
        })
        if (code.length == 6) {
            setValidPh(code)
           
        }
    }

    // ph validation check
    const phoneVerify = () => {
        // const regexp = /^(\d{9})$/
        const regexp = /^[0-9]{9}$/
        if (regexp.test(userDetail.ph)) {
            setpherror('')
            getData(`${API_URL}/api/v0.1/check/phone?phone=${userDetail.ph}`)

                .then(response => {
                    if (!response.data.result) {
                        setVerifyPh(userDetail.ph)
                        setcount(count + 1)
                        setPhLoad(true)
                    } else {
                        setpherror('phone number aleady registered, forget password?')
                    }
                })
        } else {
            setpherror('phone number invalid')
        }
    }

    //township changing funct
    const changeTwsp = async (key, index) => {
        var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`)
        var townships = []
        response.data.map((township, i) => {
            townships.push({ id: township._id, name: township.name, cityId: township.cityId })
        })
        if (key == 'user') {
            setTwsp(townships)
        } else {
            setbusiTwsp(townships)
        }
    }


    // toStep One
    const toStepOne = async () => {
        // alert('tostepOne')
        if (userDetail.psw == '') {
            Toast.show({
                text: pswEmptyValid,
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: 'Okay',
                duration: 3000,
            })
        } else if(userDetail.psw.length < psw_min_length){
            Toast.show({
                text: lengthValide,
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: 'Okay',
                duration: 3000,
            })
        }
        else if (userDetail.confirmPass == '' || userDetail.psw != userDetail.confirmPass) {
            Toast.show({
                text: pswNotMatch,
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: 'Okay',
                duration: 3000,
            })
        } else if (userDetail.avatar == '') {
            Toast.show({
                text: 'select profile image for account registration!',
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: 'Okay',
                duration: 3000
            })
        }else if(EmailErr != ''){
            Toast.show({
                text: EmailErr,
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: 'Okay',
                duration: 3000,
            })
        } else {
            var valid = true;
            var values = [userDetail.avatar, userDetail.email, userDetail.name, userDetail.ph, userDetail.psw, userDetail.strNo, userDetail.postcode, userDetail.ward, userDetail.tsp, userDetail.city]
            values.map((err,i)=>{
                if (err == ''){
                    valid =false
                }
            })

            if (valid) {
                setStep(1)
            } else {
                Toast.show({
                    text: validErrormessage,
                    textStyle: { color: red_color, fontFamily: default_font },
                    // buttonText: 'Okay',
                    duration: 3000,
                })
            }
        }
    }

    // check render base on usertype
    const loadTypeRender = () => {
        return (
            userDetail.userType == 'DRIVER' ?
                DriverRegister()
                :
                UserRegisterRender()
        )
    }

    // service prvider change
    const serviceChange = (service) => {
        setDriverRg({
            ...driverRg,
            providerId : service._id})
        setService({id: service._id, name: service.name})
        setModalVisible(!modalVisible)
    }
    
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 0;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

        
    const scrollEnd= async() =>  {
        setPage(page+1)
        setEndOfResult(false)
        var result = await getData(`${API_URL}/api/v0.1/service-providers?page=${page}`)
        if (result.ok) {
        //    console.log(result)
           setServiceinfo(result.data.data)
            setEndOfResult(true)
        }else{
            setEndOfResult(true)
        }

    }

    // bank Customize Number Box
    const bankCustomizeNumberBox = async(text) => {
        var value = text.replace( /^\D+/g, '')
        setDriverRg({...driverRg,accNo:value})
    }


    // render for driver usertype
    const DriverRegister = () => {
        return (
            <View style={{ flex: 1 }}>
                {/* Driver Register */}

                 {/* for service provder list */}
                <TouchableOpacity onPress={() => {
                    setModalVisible(true)
                }}>
                    <OriginTextInput height={45} editable={false} value={service.name} placeholder={"Select Service Provider"} width={'100%'} />
                </TouchableOpacity> 


                <View style={{ width: '100%', height: 30 }}>
                    <Text style={{ fontFamily: default_font }}>{driver_license_label}</Text>
                </View>
                <View style={{ width: '100%' }}>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingBottom: 10 }}>
                        <View style={{ flex: 1, alignSelf: 'stretch' }}>
                            <TouchableOpacity onPress={() => pickImage('dlf')}>
                                {
                                    DLF ?
                                        <Image source={{ uri: DLF }} style={{ borderRadius: 5, height: 70, width: '90%', }} />
                                        :
                                        <View style={{ borderRadius: 5, height: 70, width: '90%', borderWidth: 1, borderColor: grey_color, justifyContent: 'center' }}>
                                            <Text style={{ color: grey_color, textAlign: 'center', fontFamily: default_font }}>Front</Text>
                                        </View>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'stretch' }}>
                            <TouchableOpacity onPress={() => pickImage('dlb')}>
                                {
                                    DLB ?
                                        <Image source={{ uri: DLB }} style={{ borderRadius: 5, height: 70, width: '90%', }} />
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
                    <Text style={{ fontFamily: default_font }}>NRC</Text>
                </View>
                <View style={{ width: '100%' }}>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingBottom: 10 }}>
                        <View style={{ flex: 1, alignSelf: 'stretch' }}>
                            <TouchableOpacity onPress={() => pickImage('nrcf')}>
                                {
                                    NRCF ?
                                        <Image source={{ uri: NRCF }} style={{ borderRadius: 5, height: 70, width: '90%', }} />
                                        :
                                        <View style={{ borderRadius: 5, height: 70, width: '90%', borderWidth: 1, borderColor: grey_color, justifyContent: 'center' }}>
                                            <Text style={{ textAlign: 'center', fontFamily: default_font }}>Front</Text>
                                        </View>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'stretch' }}>
                            <TouchableOpacity onPress={() => pickImage('nrcb')}>
                                {
                                    NRCB ?
                                        <Image source={{ uri: NRCB }} style={{ borderRadius: 5, height: 70, width: '90%', }} />
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
                    <Text style={styles.PackageLabel} >{register_fleet_label}</Text>
                        <SmallHighTextInput required value={driverRg.regNo} label={driver_register_num_label} placeholder={driver_register_num_label} onChangeText={(text) => driverChgVal('regNo', text)} />
                        <SmallHighTextInput required value={driverRg.platNo} label={driver_plate_num_label} placeholder={driver_plate_num_label} onChangeText={(text) => driverChgVal('platNo', text)} />
                    <STComponent
                        isSelectSingle={true}
                        label={driver_cartype_label}
                        required
                        popupTitle={driver_select_cartype_label}
                        height={40}
                        style={{height: 40}}
                        title={driverRg.type? driverRg.type: driver_select_cartype_label}
                        value={driverRg.type}
                        preSelectedItem={{ key: 'name', value: driverRg.type }}
                        data={vehicalType}
                        searchPlaceHolderText={driver_select_cartype_label}
                        onChangeSelect={data => {
                            setDriverRg({
                                ...driverRg,
                                type: data.name
                            })
                        }}
                    />
                </View>

                <SmallHighTextInput type={'number'} required value={driverRg.year} label={year_of_production_label} placeholder={year_of_production_label} onChangeText={(text) => driverChgVal('year', text.toString())} />

                <View style={{ borderTopWidth: 0.5, paddingTop: 5 }}>
                    
                    <STComponent
                        isSelectSingle={true}
                        label={register_paymentacc_label}
                        popupTitle={select_bank_label}
                        label={select_bank_label}
                        height={40}
                        style={{height: 40}}
                        title={driverRg.bank? driverRg.bank:select_bank_label}
                        required 
                        value={driverRg.bank}
                        preSelectedItem={{ key: 'name', value: driverRg.bank }}
                        data={banks}
                        searchPlaceHolderText={select_bank_label}
                        onChangeSelect={data => {
                            setDriverRg({
                                ...driverRg,
                                bank: data.name
                            })
                        }}
                    />
                    <OriginTextInput required value={driverRg.accNo} label={acc_num_label} keyboardType={'number-pad'} placeholder={acc_num_label} marginBottom={10} onChangeText={(text) =>bankCustomizeNumberBox(text)} />
                </View>
                <ModalWrapper
                    containerStyle={{flexDirection: 'row', alignItems: 'flex-end'}}
                    onRequestClose={()=>setModalVisible(false)}
                    style={{ flex: 1}}
                    visible={modalVisible}
                    backdropColor={'rgba(225,225,225,0.5)'}
                    overlayStyle={light_grey_color}>
                    
                    <View style={{ backgroundColor: light_grey_color, width: "90%",height:'50%', flexDirection: 'column',borderRadius: 10, alignItems: 'center', justifyContent: 'flex-start', margin: 20, paddingTop: 5 }}>
                        <ScrollView
                            style={{height: '100%'}}
                            ref={(scrollView) => { this.scrollView = scrollView }}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    scrollEnd()
                                }
                            }}>
                                <SearchForm />
                        
                                {
                                    serviceInfo.map((service, i) => (
                                        <TouchableOpacity onPress={() => serviceChange(service)}
                                        style={{ height: 30, marginTop: 10,width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start',paddingHorizontal: 20 }} key={i}
                                        >
                                            <Text style={{ fontFamily: default_font, fontSize: standard_font_size}}>{service.name}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                                {
                                    endOfResult ?
                                    // <View
                                    //     style={{ height: 30, marginTop: 10,width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start',paddingHorizontal: 20 }}
                                    // >
                                            <Text style={[styles.smallText,{textAlign: 'center'}]}>End of Result</Text> : <Spinner color={primary_color} />
                                    // </View>
                                }

                        </ScrollView>
                    </View>
                </ModalWrapper>
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
                        busiHr.map((busihr, index) => (
                            <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10 }} key={index}>
                                <View style={{ flex: 0.5 }}>
                                    <CheckBox
                                        checked={busihr.check}
                                        color={light_grey_color}
                                        style={{ borderRadius: 5, borderWidth: 0.5 }}
                                        onPress={() => {
                                            var updateone = busiHr
                                            updateone[index].check = !busihr.check
                                            updateone[index].from = updateone[index].check !=true ? '--:-- am ': busiHr[0].from
                                            updateone[index].to = updateone[index].check !=true ? '--:-- pm ':busiHr[0].to
                                            setbusiHr(JSON.parse(JSON.stringify(updateone)))
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
                                                        style={{ width: 50, height: 10 }}
                                                        hideText={true}
                                                        is24Hour={true}
                                                        ref={FromRef.current[index]}
                                                        androidMode={'spinner'}
                                                        onDateChange={(time) => settime(time, index, type = 'from')}
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
                                                        is24Hour={true}
                                                        showIcon={false}
                                                        style={{ width: 50, height: 10 }}
                                                        hideText={true}
                                                        ref={ToRef.current[index]}
                                                        timeZoneOffsetInMinutes={5}
                                                        androidMode={'spinner'}
                                                        onDateChange={(time) => settime(time, index, type = 'to')}
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
                <Text style={{ fontFamily: default_font }}> {busi_about} </Text>
                <MultilineTextInput placeholder={'Enter your business information here.'} value={userDetail.about} numberOfLines={10} onChangeText={(text) => changeValue('about', text)} />

            </View>

        )
    }

    // show render base on usertype
    const TypeRegister = () => {
        return (
            <ScrollView>
                <View style={{ flexDirection: 'column', width: '100%', paddingVertical: 10 }}>

                    {loadTypeRender()}

                    <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 30 }}>
                        <View style={{ marginHorizontal: 15 }}>
                            <CheckBox
                                checked={agreeTC}
                                color={light_grey_color}
                                style={{ borderRadius: 5, borderWidth: 0.5 }}
                                onPress={() => setAgree(!agreeTC)}
                            />
                        </View>
                        <View style={{ flex: 1, }}>
                            <Text style={{ color: grey_color, fontFamily: default_font }}>{agree_label}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <HomePageBtn width={'45%'} onPress={() => setStep(1)}>{back_label}</HomePageBtn>
                        <HomePageBtn width={'45%'} onPress={() => Register()}>{register_label}</HomePageBtn>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 30, justifyContent: 'center' }}>
                        <Text style={{ color: grey_color, fontFamily: default_font }}>Already registered ? Login</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
                            <Text style={{ color: primary_color, fontFamily: default_font }}> Here!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }

    // step 1 (user information form)
    const UserInformation = () => {
        return (
            <View style={{ flex: 1, marginBottom: 10 }}>
                <ScrollView>
                    <View style={{ flexDirection: 'column', width: '100%', marginBottom: 25 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "center", marginVertical: 30 }}>
                            <TouchableOpacity onPress={() => pickImage('avatar')}>
                                {
                                    Avatar ?
                                        <Image source={{ uri: Avatar }} style={{ width: 80, height: 80, borderRadius: 70 }} />
                                        :
                                        <View style={{ width: 80, height: 80, borderWidth: 0.25, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color }} />
                                        </View>
                                }
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.PackageLabel} >{general_information_label}</Text>
                        <OriginTextInput label={name_label} value={userDetail.name} placeholder={name_label} onChangeText={(text) => changeValue("name", text)} 
                            required />
                        <OriginTextInput 
                            required 
                            email 
                            label={email_label} 
                            placeholder={email_label} 
                            onChangeText={(text) => changeValue("email", text)}
                            value={userDetail.email}
                            onBlur={(data)=>setEmailErr(data)}/>

                        <TCPNTextInput 
                            label={ph_label} loading={phload} twoCol={false} placeholder={ph_label} type={'number'} value={userDetail.ph} onChangeText={(text) => changeValue('ph', text.toString())} onPress={() => phoneVerify()}>
                            {
                                <>
                                    <Text style={{ color: red_color, fontSize: xxxS, fontFamily: default_font }}>{pherror}</Text>
                                    {/* {error.ph ? <Text style={{ color: red_color, fontSize: xxxS, fontFamily: default_font }}>require *</Text> : <></>} */}
                                </>
                            }
                        </TCPNTextInput>
                        <View style={{ marginBottom: 15 }}>
                            {
                                verificationId != '' && pherror == '' ?
                                    <>
                                        {
                                            confirmStatus != 'success' ?
                                                <OriginTextInput label={enter_otp_label} placeholder={enter_otp_label}
                                                   value={userDetail.otp} keyboardType={'number-pad'} onChangeText={(text) => changeCode(text)}

                                                />
                                                :
                                                <></>
                                        }

                                        {
                                            codeInput ?
                                                (
                                                    confirmStatus == 'success' ?
                                                        <>
                                                            <Text style={{ color: green_color, fontSize: xxxS, fontFamily: default_font }}> Phone number confirmed !</Text>
                                                            <OriginTextInput 
                                                                label={password_label} 
                                                                value={userDetail.psw} 
                                                                secureTextEntry={true} 
                                                                placeholder={password_label} 
                                                                onChangeText={(text) => changeValue('psw', text)}
                                                                words={psw_min_length}
                                                            />
                                                            <OriginTextInput label={conf_password_label} errormessage={passwordError == pswMatch? '': pswNotMatch} value={userDetail.confirmPass} secureTextEntry={true} placeholder={conf_password_label} onChangeText={(text) => changeValue('confirmPass', text)} />
                                                            {/* <Text style={{ color: passwordError == pswMatch ? green_color : red_color, fontSize: xxxS, fontFamily: default_font }}>{passwordError}</Text> */}
                                                        </>
                                                        :
                                                        <Text style={{ color: red_color, fontSize: xxxS, fontFamily: default_font }}>{message}</Text>
                                                )
                                                :
                                                <Text style={{ color: green_color, fontSize: xxxS, fontFamily: default_font }}>We send code +95 (9) {userDetail.ph} .</Text>
                                        }
                                    </>
                                    :
                                    <></>
                            }
                        </View>
                        <Text style={styles.PackageLabel} >{your_address_label}</Text>
                        <OriginTextInput label={home_st_label} value={userDetail.strNo} placeholder={home_st_label} onChangeText={(text) => changeValue('strNo', text)}
                            required />

                        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingTop: 0 }}>
                            <View style={{ flex: 1, marginHorizontal: 5 }}>
                                <OriginTextInput label={ward_label} value={userDetail.ward} placeholder={ward_label} width={'90%'} onChangeText={(text) => changeValue('ward', text)}
                                    required />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 5 }}>
                                <OriginTextInput label={post_code_label} value={`${userDetail.postcode}`} type={'number'} placeholder={post_code_label} width={'90%'} onChangeText={(number) => changeValue('postcode', number)}
                                    required />
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
                                setUserDetail({
                                    ...userDetail,
                                    city: data.name,
                                    tsp: ''
                                })
                                changeTwsp('user', data.id)
                                if(data.name == '') {
                                    setTwsp([])
                                }
                            }}
                        />

                        <STComponent
                            required
                            label={Tsp_label}
                            value={userDetail.tsp}
                            isSelectSingle={true}
                            popupTitle={userDetail.tsp ? userDetail.tsp : Tsp_label}
                            title={Tsp_label}
                            data={Twsp}
                            searchPlaceHolderText={Tsp_label}
                            onChangeSelect={data => {
                                changeValue('tsp', data.name)
                            }}
                        />

                    </View>
                </ScrollView>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginVertical: 20 }}>
                    <HomePageBtn onPress={() => toStepOne()}>{next_label}</HomePageBtn>
                </View>
            </View>
        )
    }

    // step 2 (business information form)
    const BusinessInformation = () => {
        return (
            <View style={{ flex: 1, marginBottom: 10 }}>
                <ScrollView>
                    <View style={{ flexDirection: 'column', width: '100%', marginBottom: 25 }}>
                        <View style={{ width: '100%', height: 50 }}>
                            <Text style={styles.PackageLabel}>{busi_information_label}</Text>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: "center", paddingBottom: 30 }} onPress={() => logopicker()}>
                            {
                                logo ?
                                    <Image source={{ uri: logo }} style={{ width: 80, height: 80, borderRadius: 70 }} />
                                    :
                                    <View style={{ width: 80, height: 80, borderWidth: 0.25, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: grey_color }}>Logo</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                        <OriginTextInput label={busi_name_label} placeholder={busi_name_label} value={userDetail.busiName} onChangeText={(text) => changeValue('busiName', text)} />
                        <TCPNTextInput label={busi_ph_label} placeholder={busi_ph_label} value={userDetail.busiPh} twoCol={true} type={'number'} onChangeText={(text) => changeValue('busiPh', text.toString())} />
                        <OriginTextInput 
                            label={busi_email_label} 
                            email 
                            placeholder={busi_email_label} 
                            value={userDetail.busiEmail}
                            onChangeText={(text) => changeValue('busiEmail', text)} 
                        />
                        <OriginTextInput label={busi_reg_num_label} placeholder={busi_reg_num_label} value={userDetail.busiRegNo} onChangeText={(text) => changeValue('busiRegNo', text)} />
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

                        <Text style={styles.PackageLabel} >{busi_address_label}</Text>
                        <OriginTextInput label={home_st_label} placeholder={home_st_label} value={userDetail.busiStrNo} onChangeText={(text) => changeValue('busiStrNo', text)} />

                        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', paddingTop: 0 }}>
                            <View style={{ flex: 1, marginHorizontal: 5 }}>
                                <OriginTextInput label={ward_label} placeholder={ward_label} width={'90%'} value={userDetail.busiWard} onChangeText={(text) => changeValue('busiWard', text)} />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 5 }}>
                                <OriginTextInput label={post_code_label} type={'number'} value={`${userDetail.busiPost}`} placeholder={post_code_label} width={'90%'} onChangeText={(number) => changeValue('busiPost', number)} />
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
                                setUserDetail({
                                    ...userDetail,
                                    busiCity: data.name
                                })
                                changeTwsp('busi', data.id)

                                if(data.name == ''){
                                    setbusiTwsp([])
                                }
                                
                            }}
                        />


                        <STComponent
                            isSelectSingle={true}
                            label={Tsp_label}
                            popupTitle={Tsp_label}
                            title={userDetail.township ? userDetail.township : Tsp_label}
                            data={busiTwsps}
                            searchPlaceHolderText={Tsp_label}
                            onChangeSelect={data => {
                                setUserDetail({
                                    ...userDetail,
                                    busiTsp: data.name
                                })
                            }}
                        />
                    </View>
                </ScrollView>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginVertical: 20 }}>
                    <HomePageBtn width={'45%'} onPress={() => setStep(0)}>{back_label}</HomePageBtn>
                    <HomePageBtn width={'45%'} onPress={() => setStep(2)}>{next_label}</HomePageBtn>
                </View>
            </View>
        )
    }

    // for changing step 
    const loadRender = () => {
        return (
            step == 0 ?
                // TypeRegister()
                // BusinessInformation()
                UserInformation()
            : (step == 1 ?
                BusinessInformation()
                :
                // UserInformation()
                TypeRegister()
                )
        )
    }

    // step changing finish


    //final register 
    const Register = async () => {
        // console.log(valid)
        
        userDetail["agreeTC"] = agreeTC
        typeof(userDetail.busiPost) == 'string' ? userDetail['busiPost'] = 0: <></>
        if (verificationId == '') {
            Toast.show({
                text: "confirm your phone number first or check your otp again !",
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: "Okay",
                duration: 3000,
            })
        }else if (agreeTC == false) {
            Toast.show({
                text: TandCMessage,
                textStyle: { color: red_color, fontFamily: default_font },
                // buttonText: "Okay",
                duration: 3000,
            })
        } else if (userDetail.userType == "DRIVER") {
            setInit(init+1)
            // setObj(driverRg)
            // console.log(driverRg)
            if (isValid) {
                // alert('gg')
                setLoading(true)
                // userDetail["agreeTC"] = agreeTC
                postModel = Object.assign({}, userDetail, driverRg)
                var response = await postData(`${API_URL}/api/v0.1/register/driver`, postModel)
                if (response.ok) {
                    setLoading(false)
                    await AsyncStorage.setItem('registerToken', response.data.token)
                    props.navigation.navigate('Login')
                } else {
                    console.log(response.data)
                }
            } else {
                Toast.show({
                    text: validErrMesswithPhoto,
                    textStyle: { color: red_color, fontFamily: default_font },
                    // buttonText: "Okay",
                    duration: 3000,
                })
            }
            
        } else if (userDetail.userType == "BUSINESS") {
            setLoading(true)

            userDetail["busiHr"] = busiHr
            // userDetail["agreeTC"] = agreeTC
            postModel = userDetail
            delete postModel.confirmPass;
          
                var response = await postData(`${API_URL}/api/v0.1/register/business`, postModel)
                // console.log(response,postModel)
    
                if (response.ok) {
                    setLoading(false)
                    props.navigation.navigate('Login')
                } else {
                    console.log(response.data)
                }
            
        } else {
            setLoading(true)

            userDetail["busiHr"] = busiHr
            // userDetail["agreeTC"] = agreeTC
            postModel = userDetail
            delete postModel.confirmPass;
                var response = await postData(`${API_URL}/api/v0.1/register`, postModel)
                if (response.ok) {
                    setLoading(false)
                    props.navigation.navigate('Login')
                } else {
                    console.log(response.data)
                }
           
        }
    }


    return (
        <>
            {
            isLoading ?
                <Loading visible={isLoading} />
                :
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 20, }}>
                        {loadRender()}
                    </View>
                    <ModalWrapper
                        containerStyle={{flexDirection: 'row', alignItems: 'flex-end'}}
                        onRequestClose={()=>setModalVisible(false)}
                        style={{ flex: 1}}
                        visible={modalVisible}
                        backdropColor={'rgba(225,225,225,0.5)'}
                        overlayStyle={light_grey_color}>
                        
                        <View style={{ backgroundColor: light_grey_color, width: "90%",height:'50%', flexDirection: 'column',borderRadius: 10, alignItems: 'center', justifyContent: 'flex-start', margin: 20, paddingTop: 5 }}>
                            <ScrollView
                                style={{height: '100%'}}
                                ref={(scrollView) => { this.scrollView = scrollView }}
                                onScroll={({ nativeEvent }) => {
                                    if (isCloseToBottom(nativeEvent)) {
                                        scrollEnd()
                                    }
                                }}>
                                    <SearchForm />
                            
                                    {
                                        serviceInfo.map((service, i) => (
                                            <TouchableOpacity onPress={() => serviceChange(service)}
                                            style={{ height: 30, marginTop: 10,width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start',paddingHorizontal: 20 }} key={i}
                                            >
                                                <Text style={{ fontFamily: default_font, fontSize: standard_font_size}}>{service.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                    

                            </ScrollView>
                        </View>
                    </ModalWrapper>
                </View>
            }
        </>
    )
}

export default UserRegister;