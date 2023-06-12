import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView, } from "react-native";
import { STComponent, OriginTextInput, SearchForm, RNPicker, DatePickerForm, PinLocationText } from "../../../components/form";
import { Icon, Picker, Toast, Spinner } from "native-base";
import { grey_color, light_grey_color, primary_color, white_color, default_font, API_URL, medium_grey_color, red_color, green_color } from "../../../components/common";
import ImagePicker from "react-native-image-picker";
import { HomePageBtn } from '../../../components/button';
import UserStore from "../../../mobx/userStore";
import CityStore from "../../../mobx/cityStore";
import { toJS } from "mobx";
import { getData, postData } from "../../../components/fetch";
import { NavigationEvents } from "react-navigation";
import { getDateForInput } from '../../../components/date'
import { styles } from '../../../components/styles'
import Modal from "react-native-modal"
import ModalWrapper from "react-native-modal-wrapper";
import useValidAPiCall, { useNestedObjCheck } from "../../../components/validCallApi";
import { succRegister, validErrormessage, req_field_with_pack_photo, 
    Tsp_label, name_label, email_label, packageSize_label, 
    width_height_label, packagingPhoto_label, State_label, 
    select_pickUpDate_label, select_deliDate_label, qty_label, 
    total_charge_label, back_label, register_label, sender_name_label, 
    home_st_label, ward_label, post_code_label, nrc_label, next_label,
    receiver_information_label, pickUp_information_label, sender_information_label
} from "../../../components/labels and messges";
import { MultiImageCard } from "../../../components/card";
import { xL, standard_font_size } from "../../../components/font";
import PaginateView from '../../../components/paginatView';
import { MapModal } from "../../../components/modal";
import AppStore from "../../../mobx/AppStore";
import Loading from "../../../components/loading";

export default PackageEntryForCustomer = (props) => {
    const [cities, setcities] = useState([]);
    const [recCities, setRecCities] = useState([]);  // store all deliverable cities from service area of service provider
    const [pickUpCities, setpickUpCities] = useState([]);
    const [pgSize, setpgSize] = useState([])
    const [Logo, setLogo] = useState([])
    const [Scroll, setScroll] = useState(false)

    const [senderlist, setSenderList] = useState([])
    const [senderTsp, setsenderTsp] = useState([])
    const [ pickUpTsp, setPickUpTsp] = useState([])
    const [recTsp, setRecTsp] = useState([])
    const [senderInfo, setSenderinfo] = useState({ name: '', strNo: '', ward: '', post: '', city: '', tsp: '' })
    const [serviceInfo, setServiceinfo] = useState([])
    const [servicelist, setServicelist] = useState({ id: '',name: '' })
    const [pickUpInfo, setPickUpInfo] = useState({name: '',strNo: '',ward: '', post: '', city: '', tsp: ''})
    const [recInfo, setRecinfo] = useState({ name: '', strNo: '', ward: '', post: '', city: '', tsp: ''})
    const [ Nstep , setNstep ] = useState(0)
    const nextValid = useNestedObjCheck(Object.assign({},{sender: senderInfo},{reciverInfo: recInfo}), Nstep)
    const [obj, setObj] = useState({
        packSizeId: "",
        pickUpDate: "",
        deliDate: "",
        imgs: [],
        qty: ''
    })
    const [ init, setinit ] = useState(0)
    const isValid = useValidAPiCall(obj,init)
    const [modalVisible, setModalVisible] = useState(false)
    const [complete, setcomplete] = useState(true)
    const [imgindex, setindex] = useState(0)
    const [isOpen, setisOpen] = useState(false)
    const [nextPage, setnextPage] = useState(0)
    const [step, setStep] = useState(0)
    const [charge, setCharge] = useState(0)
    const [pgPrice, setpgPrice] = useState(0)
    const [mailValid, setMailValid] = useState('')
    const [reccoordinate, setrecCoordinate] = useState({latitude: 16.855146,longitude:  96.175649})
    const [pickUpCoordinate, setpickUpCoordinate] = useState({latitude: 16.855146,longitude:  96.175649})
    const [recPinLocation, setrecPinLocation] = useState(false)
    const [pickUpPinLocation, setpickUpPinLocation]= useState(false)
    const token = useState(AppStore.token)
    const [deliverablelist, setdeliverablelist] = useState([]) // for store all deliverable receiver cities
    const [avaliableRecCities, setAvaliableRecCities] = useState([]) // for store non repeated receiver cities
    const [loading, setloading] = useState(false)

    useEffect(() => {
        callmobx()
        
    }, [])

    
    const mapmodel = (text) =>{
        text == 'receiver' ? setrecPinLocation(true): setpickUpPinLocation(true)
     }

    // call api route and call mobx data load
    async function callmobx() {
        await UserStore.load(props)
        await CityStore.load()
        setcities(toJS(CityStore.cities))   // get states for sender
        info = UserStore.UserStore
        sender={
             'name': info.name, 'strNo': info.strNo , 'ward': info.ward, 'post': info.postcode, 'city': info.city, 'tsp': info.tsp 
        }
        setSenderinfo(sender)
        var result = await getData(`${API_URL}/api/v0.1/customer/service-providers`)
        if (result.ok) {
            var list = []
            result.data.data.map((data, i) => {
                list.push({ id: data._id, name: data.name })
            })
            setServiceinfo(list)
            setnextPage(result.data.links.next)
        }
    }

    const scrollEnd= async(data) =>  {
        var list = serviceInfo
        data.data.map((x, i) => {
            var obj = serviceInfo.find(d=>d._id == x._id)
            if(!obj){
                // list.push(x)
                list.push({ id: x._id, name: x.name })
            }
        })
        setServiceinfo(list)
        setnextPage(data.links.next)
    }

    const imagePick = (response) => {
        const Sixfours = obj.imgs
        Sixfours.push(response.base64)
        setObj({
            ...obj,
            imgs: Sixfours
        })
           
    }

    useEffect(()=>{
        var isCancel = false
        if(!isCancel){
            if (servicelist.id) {
                // get states for receiver
                getData(`${API_URL}/api/v0.1/customer/service-providers/${servicelist.id}/deli/cities`)
                    .then(result => {
                    if (result.ok) {
                        var data = result.data.map((x, i) => {
                            return { id: i, name: x }
                        })
                        setRecCities(data)
                        setAvaliableRecCities(data)
                        
                    }
                })
                // get states for receiver
                getData(`${API_URL}/api/v0.1/customer/service-providers/${servicelist.id}/pickUp/cities`)
                    .then(result => {
                    if (result.ok) {
                        var data = result.data.map((x, i) => {
                            return { id: i, name: x }
                        })
                        setpickUpCities(data)
                        
                    }
                })
            }
        }
        return () =>{
            isCancel = true
        }
    },[servicelist])

    useEffect(() => {
        var isCancel = false
        if(!isCancel){

            if (senderInfo.city) {
                var index = cities.find(x => x.name == senderInfo.city)
                changeTwsp('sender',index.id)
            }
    
            // get service provider's registered package sizes
            getData(`${API_URL}/api/v0.1/customer/service-providers/${servicelist.id}/package-sizes`)
            .then(response => {
                if (response.ok) {
                    var pglist = []
                    response.data.map((pgsize, i) => {
                        var pg = { id: pgsize._id, name: `${pgsize.weight} kg(${pgsize.width} cmx ${pgsize.height} cm) `, price: pgsize.price , laborFee : pgsize.laborFee, insurance: pgsize.insurance }
                        pglist.push(pg)
                    })
                    setpgSize(pglist)
                }
            })
            
            // get states and townships of service providers's service area 
            if(recInfo.city ){
                getData(`${API_URL}/api/v0.1/customer/service-providers/${servicelist.id}/deli/cities/${recInfo.city}/townships`)
                .then(response => {
                    if (response.ok) {
                        const data = []
                        response.data.map((x,i)=>{
                            deliverablelist.find(j=>j.deli.tsp == x)?
                            data.push({  id: i, name: x })
                            :
                                <></>
                        })
                        setRecTsp(data)
                    } else {
                        setRecTsp([])
                    }
                })
            }

            if(recInfo.tsp && pickUpInfo.tsp){
                getData(`${API_URL}/api/v0.1/customer/service-providers/${servicelist.id}/service-areas/first?pickUpTsp=${pickUpInfo.tsp}&pickUpCity=${pickUpInfo.city}&deliCity=${recInfo.city}&deliTsp=${recInfo.tsp}`)
                .then(response=>{
                    if(response.ok){
                        if(response.data){
                            setCharge(response.data.price)
                        }
                    }else{
                        console.log(response)
                    }
                })
            }
        }

        return()=>{
            isCancel = true
        }
    }, [senderInfo,recInfo,pickUpInfo])

    useEffect(()=>{
        setRecinfo({
            ...recInfo,
            city: '',
            tsp: ''
        })
        // get states and townships of service providers's service area 
        if(pickUpInfo.city && pickUpInfo.tsp == ''){
            getData(`${API_URL}/api/v0.1/customer/service-providers/${servicelist.id}/pickUp/cities/${pickUpInfo.city}/townships`)
            .then(response => {
                if (response.ok) {
                    var data = response.data.map((x, i) => {
                        return { id: `${Math.random().toString(36).substring(7)}` , name: x }
                    })
                    setPickUpTsp(data)
                } else {
                    setPickUpTsp([])
                }
            })
        }

        if(pickUpInfo.city && pickUpInfo.tsp){
            getData(`${API_URL}/api/v0.1/customer/service-providers/${servicelist.id}/pickUp/cities/${pickUpInfo.city}/townships/${pickUpInfo.tsp}/service-areas`)
            .then(response=>{
                if(response.ok ){
                    var data = []
                    recCities.map((city,i)=>{
                        if (response.data.find(x => x.deli.city == city.name)){
                            data.push({id: i, name: city.name})
                        }
                        
                    })
                    setAvaliableRecCities(data)  // store no repeated avaliable receiver citites
                    setdeliverablelist(response.data) //store all avaliable receiver cities
                }
            })
        }
    },
    [pickUpInfo])
    // township changing after state change
    const changeTwsp = async (key,index) => {
        var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`)
        if(response.ok){
            var townships = []
            response.data.map((township,i) =>{
                townships.push({id: township._id, name: township.name, cityId: township.cityId})
            })
            setsenderTsp(townships)
        }
    }

    const onValueChange = (type, key, value) => {
        if (type == "sender") {
            setSenderinfo({
                ...senderInfo,
                [key]: value
            })
        } else if (type == 'receiver') {
            setRecinfo({
                ...recInfo,
                [key]: value
            })
        }else if(type=='pickUp'){
            setPickUpInfo({
                ...pickUpInfo,
                [key]: value
            })
        } else {
            setServiceInfo({
                ...serviceInfo,
                [key]: value
            })
        }
    }

    const objChange = (key, value) => {
        setObj({
            ...obj,
            [key]: value
        })
    }

    const serviceChange = (service) => {
        setObj({
            ...obj,
            providerId: service.id
        })
        setServicelist(service)
        setModalVisible(!modalVisible)
        setRecinfo({
            ...recInfo,
            tsp: ''
        })
    }

    const nextStep = () =>{
        setNstep(Nstep+1)
        if(mailValid != ''){
            Toast.show({
                text: mailValid,
                textStyle: {color: red_color, fontFamily: default_font},
                duration: 3000
            }) 
        }else if(nextValid){
            setStep(1)
        }else{
            Toast.show({
                text: validErrormessage,
                textStyle: {color: red_color, fontFamily: default_font},
                duration: 3000
            })
        }
    }

    // register stage
    const register = async () => {
        setloading(true)
        setinit(init+1)
        var postObj = Object.assign({}, 
            { senderInfo: senderInfo }, 
            {receiverInfo: Object.assign({},
                recInfo, {identification: recInfo.identification == ""? "" : recInfo.identification, lat: reccoordinate.latitude,
                long: reccoordinate.longitude }
            )},
            {pickUpInfo: Object.assign({},pickUpInfo,{lat: pickUpCoordinate.latitude, long: pickUpCoordinate.longitude})},
            obj
            )
        
        if (isValid) {
            var response = await postData(`${API_URL}/api/v0.1/customer/package-entries`, postObj)
            if (response.ok) {
                Toast.show({
                    text: succRegister,
                    textStyle: {color: green_color, fontFamily: default_font},
                    duration: 1000
                })
                props.navigation.navigate('PackageListForCustomer')
            } else {
                Toast.show({
                    text: response.err,
                    textStyle: {color: red_color, fontFamily: default_font},
                    duration: 3000,
                   
                })
            }
        } else {
            Toast.show({
                text: req_field_with_pack_photo,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 3000
            })
        }
        setloading(false)
    }

    const editImg = (response) =>{
        const SFimgs = obj.imgs;
        SFimgs[imgindex] = response.res.base64
        setObj({
            ...obj,
            imgs: SFimgs
        })
    }

    const imageDelAction = async (index) =>{

        var imageArr = obj.imgs
        imageArr.splice(index,1)
        setObj({
            ...obj,
            imgs: imageArr
        })
    }

    const pageOne = () => {
        return (
            <>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <STComponent
                            required
                            value={obj.packSizeId}
                            label={packageSize_label}
                            isSelectSingle={true}
                            popupTitle={width_height_label}
                            title={width_height_label}
                            data={pgSize}
                            onChangeSelect={data => {
                                setObj({
                                    ...obj,
                                    packSizeId: data.id
                                })
                                setpgPrice(data.price+ data.laborFee + data.insurance)
                            }}
                        />
                    </View>
                </View>
                
                <View style={{ padding: 10 }}>
                    <Text style={{ color: grey_color }}>{packagingPhoto_label}</Text>
                </View>
                
                <MultiImageCard
                    images={obj.imgs}
                    maxImage={5}
                    initPick={(response)=>imagePick(response)}
                    editPick = { (response) => editImg(response)}
                    ondelete = { res => imageDelAction(res)}
                />

                <View style={{ flexDirection: 'row' }}>

                    <DatePickerForm 
                        required
                        minDate={ getDateForInput(new Date())}
                        label={select_pickUpDate_label} 
                        height={50}
                        value={obj.pickUpDate}
                        onDateChange={(date) => {
                            objChange('pickUpDate', date)
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row' }}>

                    <DatePickerForm 
                        required
                        label={select_deliDate_label} 
                        height={50}
                        minDate={ getDateForInput(new Date())}
                        value={obj.deliDate}
                        onDateChange={(date) => {
                            objChange('deliDate', date)
                        }}
                    />
                </View>
                <OriginTextInput required type={'number'} placeholder="Quantity" label={qty_label} value={`${obj.qty}`} onChangeText={(text)=>objChange('qty',text)} />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <Text style={{ color: grey_color, fontSize: standard_font_size }} >{total_charge_label} {pgPrice + charge} ks</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }} >
                    <HomePageBtn width={'45%'} onPress={() => setStep(0)}>{back_label}</HomePageBtn>
                    <HomePageBtn width={'45%'} onPress={() => register()}>{register_label}</HomePageBtn>
                </View>
            
            </>
        )
    }

    const pageZero = () => {
       
        return (
            <>
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true)
                    }}>
                        <OriginTextInput height={45} editable={false} value={servicelist.name} placeholder={"Select Service Provider"} width={'100%'} />
                    </TouchableOpacity>

                    {/* sender info */}
                    <Text style={styles.PackageLabel}>{sender_information_label}</Text>
                    <View style={{ flex: 1 }}>
                        <OriginTextInput label={sender_name_label} onChangeText={(text) => onValueChange('sender', 'name', text)} required value={senderInfo.name} />
                        <OriginTextInput required label={home_st_label} value={senderInfo.strNo} onChangeText={(text) => onValueChange('sender', 'strNo', text)} />
                        <View style={styles.fw_with_spaceAR_mb}>
                            <View style={{ width: '50%' }}>
                                <OriginTextInput required width={'90%'} value={senderInfo.ward} label={ward_label} onChangeText={(text) => onValueChange('sender', 'ward', text)} />
                            </View>
                            <View style={{ width: '50%' }}>
                                <OriginTextInput required width={'90%'} value={`${senderInfo.post}`} type={'number'} label={post_code_label} onChangeText={(text) => onValueChange('sender', 'post', text)} />
                            </View>
                        </View>
                        <STComponent
                            isSelectSingle={true}
                            popupTitle={State_label}
                            label={State_label}
                            title={senderInfo.city? senderInfo.city:State_label}
                            required 
                            value={senderInfo.city}
                            preSelectedItem={{ key: 'name', value: senderInfo.city }}
                            data={cities}
                            searchPlaceHolderText={State_label}
                            onChangeSelect={data => {
                                setSenderinfo({
                                    ...senderInfo,
                                    city: data.name,
                                    tsp: ''
                                })
                                if(data.name == '') {
                                    setsenderTsp([])
                                }
                            }}
                        />

                        <STComponent
                            required
                            value={senderInfo.tsp}
                            label={Tsp_label}
                            isSelectSingle={true}
                            popupTitle={Tsp_label}
                            title={senderInfo.tsp ? senderInfo.tsp : Tsp_label}
                            preSelectedItem={{ key: 'name', value: senderInfo.tsp }}
                            data={senderTsp}
                            onChangeSelect={data => {
                                setSenderinfo({
                                    ...senderInfo,
                                    tsp: data.name
                                })
                            }}
                        />
                    </View>
                    
                    {/* pick up info */}
                    <Text style={styles.PackageLabel}>{pickUp_information_label}</Text>
                    <View style={{ flex: 1.2 }}>
                        <OriginTextInput required label={name_label} value={pickUpInfo.name} onChangeText={(text) => onValueChange('pickUp', 'name', text)} />

                        <PinLocationText required label={home_st_label} value={pickUpInfo.strNo} onChangeText={(text) => onValueChange('pickUp', 'strNo', text)} onPress={()=>mapmodel('pickup')}/>
                        <View style={styles.fw_with_spaceAR_mb}>
                            <View style={{ width: '50%'}}> 
                                <OriginTextInput width={'90%'} required value={pickUpInfo.ward} label={ward_label} onChangeText={(text) => onValueChange('pickUp', 'ward', text)} />
                            </View>
                            <View style={{ width: '50%'}}> 
                                <OriginTextInput width={'90%'} required value={`${pickUpInfo.post}`} type={'number'} label={post_code_label} onChangeText={(text) => onValueChange('pickUp', 'post', text)} />
                            </View>
                        </View>

                        <STComponent
                            isSelectSingle={true}
                            popupTitle={State_label}
                            label={State_label}
                            title={pickUpInfo.city? pickUpInfo.city:State_label}
                            required 
                            value={pickUpInfo.city}
                            preSelectedItem={{ key: 'name', value: pickUpInfo.city }}
                            data={pickUpCities}
                            searchPlaceHolderText={State_label}
                            onChangeSelect={data => {
                                setPickUpInfo({
                                    ...pickUpInfo,
                                    city : data.name,
                                    tsp: ''
                                })
                                if(data.name == '') {
                                    setPickUpTsp([])
                                }
                            }}
                        />
                        
                        <STComponent
                            required
                            value={pickUpInfo.tsp}
                            isSelectSingle={true}
                            popupTitle={Tsp_label}
                            label={Tsp_label}
                            title={ pickUpInfo.tsp? pickUpInfo.tsp: Tsp_label}
                            preSelectedItem={{key :'name', value:pickUpInfo.tsp}}
                            data={pickUpTsp}
                            onChangeSelect={data => {
                                setPickUpInfo({
                                    ...pickUpInfo,
                                    tsp : data.name
                                })
                            }}
                        />

                    </View>
                    
                    {/* receiver info */}
                    <Text style={styles.PackageLabel}>{receiver_information_label}</Text>
                    <View style={{ flex: 1.2 }}>
                        <OriginTextInput label={name_label} required onChangeText={(text) => onValueChange('receiver', 'name', text)} value={recInfo.name} />
                        <OriginTextInput label={email_label} onChangeText={(text)=>onValueChange('receiver','email',text)} email edit value={recInfo.email} onBlur={(message)=> setMailValid(message)}/>
                        {/* <OriginTextInput label={'House Number/Street'} onChangeText={(text) => onValueChange('receiver', 'strNo', text)} required value={recInfo.strNo} /> */}

                        <PinLocationText required label={home_st_label} value={recInfo.strNo} onChangeText={(text) => onValueChange('receiver', 'strNo', text)} onPress={()=>mapmodel('receiver')}/>

                        <View style={styles.fw_with_spaceAR_mb}>
                            <View style={{ width: '50%' }}>
                                <OriginTextInput width={'90%'} label={ward_label} onChangeText={(text) => onValueChange('receiver', 'ward', text)} required value={recInfo.ward} />
                            </View>
                            <View style={{ width: '50%' }}>
                                <OriginTextInput width={'90%'} type={'number'} label={post_code_label} onChangeText={(text) => onValueChange('receiver', 'post', text)} required value={`${recInfo.post}`} />
                            </View>
                        </View>
                        <STComponent
                            isSelectSingle={true}
                            popupTitle={State_label}
                            label={State_label}
                            title={recInfo.city? recInfo.city:State_label}
                            required 
                            value={recInfo.city}
                            preSelectedItem={{ key: 'name', value: recInfo.city }}
                            data={avaliableRecCities}
                            searchPlaceHolderText={State_label}
                            onChangeSelect={data => {
                                setRecinfo({
                                    ...recInfo,
                                    city: data.name,
                                    tsp: ''
                                })
                                if(data.name == '') {
                                    setRecTsp([])
                                }
                            }}
                        />

                        <STComponent
                            required
                            value={recInfo.tsp}
                            isSelectSingle={true}
                            label={Tsp_label}
                            popupTitle={Tsp_label}
                            title={recInfo.tsp ? recInfo.tsp : Tsp_label}
                            preSelectedItem={{ key: 'name', value: recInfo.tsp }}
                            data={recTsp}
                            onChangeSelect={data => {
                                onValueChange('receiver', 'tsp', data.name)
                            }}
                        ></STComponent>

                        <OriginTextInput label={nrc_label} value={recInfo.identification} onChangeText={(text)=>onValueChange('receiver','identification',text)} />

                    </View>
                    
                    <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
                        <HomePageBtn onPress={() => nextStep()}>{next_label}</HomePageBtn>

                    </View>
                </View>
                <ModalWrapper
                    containerStyle={{flexDirection: 'row', alignItems: 'flex-end'}}
                    onRequestClose={()=>setModalVisible(false)}
                    style={{ flex: 1}}
                    visible={modalVisible}
                    backdropColor={'rgba(225,225,225,0.5)'}
                    overlayStyle={light_grey_color}>
                    
                    <View style={{ backgroundColor: light_grey_color, width: "90%",height:'50%', flexDirection: 'column',borderRadius: 10, alignItems: 'center', justifyContent: 'flex-start', margin: 20, paddingTop: 5 }}>
                        <PaginateView
                            url={`${API_URL}/api/v0.1/customer/service-providers?page=`}
                            next={nextPage}
                            scrollEnd={(data)=>scrollEnd(data)}
                        >
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
                        </PaginateView>
                    </View>
                </ModalWrapper>
            </>
        )
    }

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', padding: 20, paddingHorizontal: 30 }}>
            <NavigationEvents onDidFocus={() => callmobx()} />
            {
                loading?
                <Loading visible={loading} />
                :
                <ScrollView>
                    {
                        step == 0 ?
                        pageZero()
                        :
                        pageOne()
                    }
                    <MapModal
                        coordinate={reccoordinate}
                        onRequestClose={()=>setrecPinLocation(false)}
                        onPressMap={(e)=>setrecCoordinate(e.nativeEvent.coordinate)}
                        MarkerDragEnd={(e)=>setrecCoordinate(e.nativeEvent.coordinate)}
                        visible={recPinLocation}
                    />
                    <MapModal
                        coordinate={pickUpCoordinate}
                        onRequestClose={()=>setpickUpPinLocation(false)}
                        onPressMap={(e)=>setpickUpCoordinate(e.nativeEvent.coordinate)}
                        MarkerDragEnd={(e)=>setpickUpCoordinate(e.nativeEvent.coordinate)}
                        visible={pickUpPinLocation}
                    />  
                    
                </ScrollView>
            }
        </View>
    )
}

