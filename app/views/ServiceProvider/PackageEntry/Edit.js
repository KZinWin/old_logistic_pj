import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { STComponent, OriginTextInput, RNPicker, DatePickerForm, PinLocationText } from "../../../components/form";
import { Icon, Picker, Toast } from "native-base";
import { grey_color, light_grey_color, primary_color, default_font, API_URL, red_color, yellow_color, green_color } from "../../../components/common";
import ImagePicker from "react-native-image-picker";
import { HomePageBtn } from '../../../components/button';
import UserStore from "../../../mobx/userStore";
import CityStore from "../../../mobx/cityStore";
import { toJS } from "mobx";
import { getData, postData, deleteData, putData, form_data_upload } from "../../../components/fetch";
import DatePicker from "react-native-datepicker";
import { NavigationEvents } from "react-navigation";
import AppStore from "../../../mobx/AppStore";
import { getDateForInput } from '../../../components/date'
import {styles} from '../../../components/styles'
import ModalWrapper from "react-native-modal-wrapper";
import { succUpdate, succDelete, genError, conflictMess, validErrormessage, Tsp_label, email_label, packageSize_label, width_height_label, packagingPhoto_label, pickUpDate_label, deliDate_label, total_charge_label, back_label, update_label, select_sender_label, home_st_label, ward_label, post_code_label, name_label, nrc_label, next_label, req_field_with_pack_photo } from "../../../components/labels and messges";
import Loading from "../../../components/loading";
import useValidAPiCall, { useNestedObjCheck } from "../../../components/validCallApi";
import { MultiImageCard } from "../../../components/card";
import { xL, standard_font_size, xxS } from "../../../components/font";
import { State_label } from "../../../components/labels and messges";
import { MapModal } from "../../../components/modal";

export default packageEntryEdit = (props) => {
    const [id, setID] = useState(props.navigation.getParam('id'))
    const [assignID, setAssignID] = useState(props.navigation.getParam('assignID'))
    const [userToken, setUsertoken] = useState(AppStore.token)
    const [cities, setcities] = useState([]);
    const [ pickCiites, setPickCities ] = useState([]);
    const [recCities, setRecCities] = useState([]);
    const [pgSize, setpgSize] = useState([])
    const [imgindex, setindex] = useState(0)
    const [isOpen, setisOpen] = useState(false)
    const [pgPrice, setPgPrice] = useState(0)
    const [charges, setCharge] = useState(0)

    const [senderlist, setSenderList] = useState([])
    const [senderTsp, setsenderTsp] = useState([])
    const [recTsp, setRecTsp] = useState([])
    const [ pickUpTsp, setPickUpTsp] = useState([])
    const [senderInfo, setSenderinfo] = useState({post: ''})
    const [recInfo, setRecinfo] = useState({post: '', nrc: ''})
    const [pickUpInfo, setPickUpInfo] = useState({post: ''})
    const [obj, setObj] = useState({
        packSizeId: "",
        pickUpDate: "",
        deliDate: "",
        imgs: []
    })
    const [ init, setinit ] = useState(0)
    const [ Nstep , setNstep ] = useState(0)
    const nextValid = useNestedObjCheck(Object.assign({},{sender: senderInfo},{reciverInfo: recInfo}), Nstep)
    const isValid = useValidAPiCall(obj,init)
    const [deleteimages, setDeleteImages] = useState([])
    const [mailValid,setMailValid]= useState('')
    const [reccoordinate, setrecCoordinate] = useState({latitude: 16.855146,longitude: 96.175649})
    const [pickUpCoordinate, setpickUpCoordinate] = useState({latitude:16.855146,longitude: 96.175649})
    const [recPinLocation, setrecPinLocation] = useState(false)
    const [pickUpPinLocation, setpickUpPinLocation]= useState(false)
    const [deliverablelist, setdeliverablelist] = useState([])
    const [avaliableRecCities, setAvaliableRecCities] = useState([])

    
    const [step, setStep] = useState(0)

    const [isLoading, setLoading] = useState(false)

    const unmounted = useRef(false)

    useEffect(() => {
        if(!unmounted){
            callmobx()
        }
    }, [])
    
    // call api route and call mobx data load
    async function callmobx() {

        setLoading(true)
        // get states for sender
        await CityStore.load()
        setcities(toJS(CityStore.cities))

        // get states for receiver
        var result = await getData(`${API_URL}/api/v0.1/service-areas/deli/cities`)
        if (result.ok) {
            var data = result.data.map((resdata, i) => {
                return { id: i, name: resdata }
            })
            setRecCities(data)
            setAvaliableRecCities(data)
        }

         // get states for pickup
        var result = await getData(`${API_URL}/api/v0.1/service-areas/pickUp/cities`)
        if(result.ok){
            var data=result.data.map((res,i) =>{
                return {id: i, name: res}
            })
            setPickCities(data)  
            
        }

        // get old data for package entry
        getData(`${API_URL}/api/v0.1/package-entries/${id}`)
        .then(response => {
            let sender = Object.assign({},response.data.senderInfo.sender,{senderId: response.data.senderInfo.senderId})
            setSenderinfo(sender)
            setPickUpInfo(response.data.pickUpInfo)
            setpickUpCoordinate({
                latitude:response.data.pickUpInfo.lat? parseFloat(response.data.pickUpInfo.lat): 16.855146,
                longitude: response.data.pickUpInfo.long? parseFloat(response.data.pickUpInfo.long): 96.1756497
            })
            setRecinfo(response.data.receiverInfo) 
            setrecCoordinate({
                latitude:response.data.receiverInfo.lat? parseFloat(response.data.receiverInfo.lat): 16.855146,
                longitude: response.data.receiverInfo.long? parseFloat(response.data.receiverInfo.long): 96.1756497
            })
                
            setObj({
                packSizeId: response.data.packSizeId,
                pickUpDate: response.data.pickUpDate,
                deliDate: response.data.deliDate,
                imgs: response.data.imgs,
                // keys: key,
                updatedAt: response.data.updatedAt,
            })
            setPgPrice(response.data.packageSize != null ?response.data.packageSize.price +response.data.packageSize.laborFee + response.data.packageSize.insurance : 0)
        })
        setStep(0)

        //get package size start
        var response = await getData(`${API_URL}/api/v0.1/package-sizes`)
        if (response.ok) {
            var pglist = []
            response.data.map((pgsize, i) => {

                var pg = { id: pgsize._id, name: `${pgsize.weight} kg(${pgsize.width} cmx ${pgsize.height} cm) `, price: pgsize.price, laborFee: pgsize.laborFee, insurance: pgsize.insurance }

                pglist.push(pg)
            })
            setpgSize(pglist)

            // get sender list
            var result = await getData(`${API_URL}/api/v0.1/senders`)
            if (result.ok) {
                var obj = result.data.data.map((data, i) => {
                    return ({
                        id: data._id,
                        name: data.name,
                        ph: data.ph,
                        strNo: data.strNo,
                        ward: data.ward,
                        post: data.post,
                        city: data.city,
                        tsp: data.tsp,
                        userId: data.userId
                    })
                })
                setSenderList(obj)
            } else {
                console.log(result.data)
            }
        } else {
            console.log(response)
        }
        setLoading(false)
    }
    
    useEffect(()=>{
        unmounted.current = true
    },[])

    useEffect(() => {
        if (cities && cities.length > 0 && senderInfo) {
            onValueChange('city', senderInfo.city);
            if (cities.find(x => x.name == senderInfo.city)) {
                changeTwsp(cities.find(city => city.name == senderInfo.city).id);
            }
        }
    }, [cities, senderInfo.city])

    useEffect(() => {
       
        if (recInfo.tsp && pickUpInfo.tsp) {
            findCharges()
        }
       
    }, [recInfo, pickUpInfo])

    function findCharges(){
        getData(`${API_URL}/api/v0.1/service-areas`)
        .then(response => {
            if (response.ok) {
                var data = response.data.data
                var select1 = data.find(x=>(x.pickUp.tsp == pickUpInfo.tsp && x.deli.tsp == recInfo.tsp) )
                setCharge(select1.price)
            }
        })
    }

    // change receiver city /tsp as service area
    useEffect(() => {
        if (recInfo.city && deliverablelist.length>0 ) {
            getData(`${API_URL}/api/v0.1/service-areas/deli/cities/${recInfo.city}/townships`)
            .then(response => {
                if (response.ok) {
                    const data = []
                    response.data.map((resdata,i)=>{
                        if(deliverablelist.find(city => city.deli.tsp == resdata)){
                            data.push ({id: i, name: resdata})
                        }
                    })
                    setRecTsp(data)
                } else {
                    console.log(response)
                }
            })
        }
    }, [recInfo, deliverablelist])

    // change pick up city/ tsp as service area 
    useEffect(() => {
        setRecinfo({
            ...recInfo,
            city : '',
            tsp: ''
        })

        if(pickUpInfo.city ){
            getData(`${API_URL}/api/v0.1/service-areas/pickUp/cities/${pickUpInfo.city}/townships`)
            .then(response=>{
                if(response.ok ){
                    var data =response.data.map((resdata,i)=>{
                        return {id: i, name: resdata}
                    })
                    setPickUpTsp(data)
                }
            })
        }
        if(pickUpInfo.city && pickUpInfo.tsp){
            getData(`${API_URL}/api/v0.1/service-areas/pickUp/cities/${pickUpInfo.city}/townships/${pickUpInfo.tsp}`)
            .then(response=>{
                if(response.ok ){
                    var data = []
                    recCities.map((city,i)=>{
                        if (response.data.find(j => j.deli.city == city.name)){
                            data.push({id: i, name: city.name})
                        }
                    })
                    setAvaliableRecCities(data)
                    setdeliverablelist(response.data)
                }
            })
        }
    }, [pickUpInfo])

    // get sender detail
    const callsenderDetail = (id) => {
        getData(`${API_URL}/api/v0.1/senders/${id}`)
            .then(response => {
                setSenderinfo({
                    senderId: response.data._id,
                    name: response.data.name,
                    strNo: response.data.strNo,
                    ward: response.data.ward,
                    post: response.data.post,
                    city: response.data.city,
                    tsp: response.data.tsp
                })
            })
    }

    useEffect(() => {
        if (senderInfo.city) {
            var obj = cities.find(city => city.name == senderInfo.city)
            changeTwsp(obj.id)
        }
    }, [senderInfo])

    // image picking initial
    const imagePick = (response) => {
        const Sixfours = obj.imgs
        Sixfours.push({Location:response.base64,Key: ''})
        setObj({
            ...obj,
            imgs: Sixfours
        })
    }

    // image editing
    const editImg =(response) => {
        const SFimgs = obj.imgs;
        SFimgs[response.id] = { Location: response.res.base64 , Key: SFimgs[response.id].Key}
        setObj({
            ...obj,
            imgs: SFimgs,
        })
    }
    
    // image deleting
    const imageDelAction = async (index) =>{
        var imgs = obj.imgs
        var delarr = deleteimages
        if(imgs[index]){
            delarr.push(imgs[index].Key)
            imgs.splice(index,1)
            setDeleteImages(delarr)
            setObj({
                ...obj,
                imgs: imgs
            })
        }else{
            imgs.splice(index,1)
            setObj({
                ...obj,
                imgs: imgs,
            })
        }
    }

    // township changing after state change
    const changeTwsp = async (index) => {
        var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`)
        if(response.ok){
            var townships = []
            response.data.map((township,i) =>{
                townships.push({id: township._id, name: township.name, cityId: township.cityId})
            })
            setsenderTsp(townships) 
        }

    }

    // input value text change 
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
        }
    }

    const objChange = (key, value) => {
        setObj({
            ...obj,
            [key]: value
        })
    }
    
    // for skip next page 
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

    // update api
    const update = async () => {
        setinit(init+1)
        if(isValid){
        var pass = true
        var images = []
        obj.imgs.map((img,i)=>{
            if(img.Key != '' && img.Location.includes('base64')){
               putData(`${API_URL}/api/v0.1/files?filename=${img.Key}`, { file: img.Location })
            }else{
                postData(`${API_URL}/api/v0.1/package-entries/${id}/imgs`,{imgs: img.Location})

            }
           
        })
        
      
        delete obj['packSize']
        // // delete obj['keys']a
        // if(images.length >0){
        //     var result = await postData(`${API_URL}/api/v0.1/package-entries/${id}/imgs`,{imgs: images})
        // }
        var postObj = Object.assign({}, { senderInfo: senderInfo }, 
            {receiverInfo: Object.assign({},
                recInfo, {identification: recInfo.identification == ""? "" : recInfo.identification, lat: reccoordinate.latitude,
                long: reccoordinate.longitude }
            )},
            {pickUpInfo: Object.assign({},pickUpInfo,{lat: pickUpCoordinate.latitude, long: pickUpCoordinate.longitude})},
            obj,
        )
            setLoading(true)
            var response = await putData(`${API_URL}/api/v0.1/package-entries/${id}`, postObj)
            if (response.ok) {
                if(deleteimages.length > 0 ){
                    deleteimages.map(x=>{
                        // console.log(x)
                        deleteData(`${API_URL}/api/v0.1/package-entries/${id}/imgs`,{keys: [x]})
                        .then(response =>{
                            if(!response.ok){
                                Toast.show({
                                    text: response.err,
                                    textStyle: { color: red_color, fontFamily: default_font },
                                    duration: 1000
                                })
                            }
                        })
                    })
                }
                Toast.show({
                    text: succUpdate,
                    textStyle: { color: green_color, fontFamily: default_font },
                    duration: 1000,
                    onClose: () => props.navigation.navigate('packageList')
                })
                
    
            }else if(response.status == 409){
                Toast.show({
                    text: conflictMess,
                    textStyle: {color: red_color, fontFamily: default_font, fontSize: xxS},
                    duration: 3000,
                    onClose: () => {callmobx(), setStep(0)}
                })
            } else {
                Toast.show({
                    text: response.err ? response.err : genError,
                    textStyle: { color: red_color, fontFamily: default_font },
                    duration: 1000,
                })
            }
        }else{
            Toast.show({
                text: req_field_with_pack_photo,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 3000
            })
        }
        setLoading(false)
    }

    // render page one
    const pageOne = () => {
        return (
            <>
                <View style={{ padding: 10 }}>
                    <Text style={styles.PackageLabel}>{packageSize_label}</Text>
                    {/* <Text style={{textAlign: 'center', color: light_grey_color}}>Package Size</Text> */}
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flex: 1 }}>
                        <STComponent
                            required
                            value={obj.packSizeId}
                            isSelectSingle={true}
                            preSelectedItem={{ key: 'id', value: obj.packSizeId}}
                            popupTitle={width_height_label}
                            label={`Select ${packageSize_label}`}
                            title={obj.packSize ? `${obj.packSize.weight} kg(${obj.packSize.width} cm x ${obj.packSize.height} cm)` : packageSize_label}
                            data={pgSize}
                            onChangeSelect={data => {
                                setObj({
                                    ...obj,
                                    packSizeId: data.id
                                })
                                setPgPrice(data.price+ data.laborFee + data.insurance)
                            }}
                        />
                    </View>

                </View>
                <View style={{ padding: 10 }}>
                    <Text style={styles.FleetLabel}>{packagingPhoto_label}</Text>
                </View>
                            
                    <MultiImageCard
                        bearTokenEdit
                        images={obj.imgs}
                        initPick={(response)=>imagePick(response)}
                        editPick = { (response) => editImg(response)}
                        ondelete = { res => imageDelAction(res)}
                    />
                 
                <View style={{ flexDirection: 'row' }}>

                    <DatePickerForm
                        height={50}
                        required 
                        minDate={getDateForInput(new Date())}
                        label={`Select ${pickUpDate_label}`} 
                        value={obj.pickUpDate}
                        onDateChange={(date) => {
                            objChange('pickUpDate', date)
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <DatePickerForm
                        height={50}
                        required 
                        label={`Select ${deliDate_label}`}
                        value={obj.deliDate}
                        minDate={obj.pickUpDate}
                        onDateChange={(date) => {
                            objChange('deliDate', date)
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <Text style={{ color: grey_color, fontSize: standard_font_size }} >{total_charge_label} {charges + pgPrice} ks</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                    <HomePageBtn width={'45%'} onPress={() => setStep(0)}>{back_label}</HomePageBtn>
                    <HomePageBtn  width={'45%'} onPress={() => update()}>{update_label}</HomePageBtn>
                </View>
            </>
        )
    }

    // render page two
    const pageZero = () => {
        return (
            <>
                <View style={{ flex: 3, flexDirection: 'column' }}>

                    {/* sender info */}
                    <Text style={styles.PackageLabel}>Sender Information</Text>
                    <View style={{ flex: 1 }}>
                        <STComponent
                            required
                            value={senderInfo && senderInfo.sender ? senderInfo.sender.name: senderInfo.name } 
                            isSelectSingle={true}
                            preSelectedItem={{ key: 'name', value: senderInfo && senderInfo.sender ? senderInfo.sender.name: senderInfo.name }}
                            popupTitle={select_sender_label}
                            title={senderInfo && senderInfo.sender ? senderInfo.sender.name : senderInfo.name}
                            data={senderlist}
                            searchPlaceholderText={select_sender_label}
                            onChangeSelect={data => {
                                onValueChange('sender','senderId',data.userId)
                                callsenderDetail(data.id)
                            }}
                        />

                        <OriginTextInput required label={home_st_label} value={senderInfo.strNo} onChangeText={(text) => onValueChange('sender', 'strNo', text)} />
                        <View style={styles.fw_with_spaceAR_mb}>
                            <View style={{ width: '50%'}}> 
                                <OriginTextInput width={'90%'} required value={senderInfo.ward} label={ward_label} onChangeText={(text) => onValueChange('sender', 'ward', text)} />
                            </View>
                            <View style={{ width: '50%'}}> 
                                <OriginTextInput width={'90%'} required value={`${senderInfo.post}`} type={'number'} label={post_code_label} onChangeText={(text) => onValueChange('sender', 'post', text)} />
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
                                changeTwsp('sender', data.name)
                                setSenderinfo({
                                    ...senderInfo,
                                    city : data.name,
                                    tsp: ''
                                })
                                if(data.name == '') {
                                    setsenderTsp([])
                                }
                            }}
                        />
                        
                        <Text style={styles.FleetLabel}>{Tsp_label}</Text>

                        <STComponent
                            required
                            value={senderInfo.tsp}
                            isSelectSingle={true}
                            preSelectedItem={{ key: 'name', value: senderInfo.tsp }}
                            popupTitle={Tsp_label}
                            title={senderInfo.tsp ? senderInfo.tsp : Tsp_label}
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
                    <Text style={styles.PackageLabel}>Pick Up Information</Text>
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

                        <Text style={styles.FleetLabel}>{State_label}</Text>
                        <STComponent
                            isSelectSingle={true}
                            popupTitle={State_label}
                            title={pickUpInfo.city? pickUpInfo.city:State_label}
                            required 
                            value={pickUpInfo.city}
                            preSelectedItem={{ key: 'name', value: pickUpInfo.city }}
                            data={pickCiites}
                            searchPlaceHolderText={State_label}
                            onChangeSelect={data => {
                                changeTwsp('pickUp',data.id)
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
                        
                        <Text style={styles.FleetLabel}>{Tsp_label}</Text>
                        <STComponent
                            required
                            value={pickUpInfo.tsp}
                            isSelectSingle={true}
                            popupTitle={Tsp_label}
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
                    <Text style={styles.PackageLabel}>Receiver Information</Text>
                    <View style={{ flex: 1.2 }}>
                        <OriginTextInput required label={name_label} value={recInfo.name} onChangeText={(text) => onValueChange('receiver', 'name', text)} />
                        <OriginTextInput label={email_label} onChangeText={(text)=>onValueChange('receiver','email',text)} email value={recInfo.email} onBlur={(message)=>setMailValid(message)} edit/>
                        {/* <OriginTextInput required label={'House Number/Street'} value={recInfo.strNo} onChangeText={(text) => onValueChange('receiver', 'strNo', text)} /> */}
                        <PinLocationText required label={home_st_label} value={recInfo.strNo} onChangeText={(text) => onValueChange('receiver', 'strNo', text)} onPress={()=>mapmodel('receiver')}/>

                        <View style={styles.fw_with_spaceAR_mb}>
                            <View style={{ width: '50%'}}> 
                                <OriginTextInput width={'90%'} required value={recInfo.ward} label={ward_label} onChangeText={(text) => onValueChange('receiver', 'ward', text)} />
                            </View>
                            <View style={{ width: '50%'}}> 
                                <OriginTextInput width={'90%'} required value={`${recInfo.post}`} type={'number'} label={post_code_label} onChangeText={(text) => onValueChange('receiver', 'post', text)} />
                            </View>
                        </View>

                        <Text style={styles.FleetLabel}>{State_label}</Text>
                        <STComponent
                            isSelectSingle={true}
                            popupTitle={State_label}
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
                        
                        <Text style={styles.FleetLabel}>{Tsp_label}</Text>

                        <STComponent
                            required
                            value={recInfo.tsp}
                            isSelectSingle={true}
                            preSelectedItem={{ key: 'name', value: recInfo.tsp }}
                            popupTitle={Tsp_label}
                            title={recInfo.tsp ? recInfo.tsp : Tsp_label}
                            data={recTsp}
                            onSelect={data => {
                                if(data.length>0){
                                    var id = recTsp.find(x=>x.id == data[0])
                                    if(id){
                                        setRecinfo({
                                            ...recInfo,
                                            tsp:id.name
                                        })
                                    }
                                }
                            }}
                        />

                        <OriginTextInput label={nrc_label} value={recInfo.identification} onChangeText={(text)=>onValueChange('receiver','identification',text)} />

                    </View>

                    <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
                        <HomePageBtn onPress={() => nextStep()}>{next_label}</HomePageBtn>
                    </View>
                </View>

            </>
        )
    }

    // condition for render method
    const loadRender = () => {
        return (
            <>
                {
                    step == 0 ? 
                        pageZero()
                    :
                        pageOne()
                }
            </>
        )
    }

    // const deleteAction = () => {
    //     deleteData(`${API_URL}/api/v0.1/package-entries/${[id]}`)
    //         .then(response => {
    //             if (response.ok) {
    //                 Toast.show({
    //                     text: succDelete,
    //                     textStyle: { color: green_color, fontFamily: default_font }
    //                 })
    //                 props.navigation.navigate('packageList')
    //             }
    //         })
    // }

    // for show map model
    const mapmodel = (text) =>{
        text == 'receiver' ? setrecPinLocation(true): setpickUpPinLocation(true)
    }

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 10 }}>
            {
            isLoading ?
                <Loading visible={isLoading} />
                :
                <>
                    <NavigationEvents onDidFocus={() => callmobx()} />
                    <ScrollView>
                        {/* <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10, justifyContent: 'flex-end' }}>
                            <View style={{ flex: 1, paddingRight: 5 }}>
                                <HomePageBtn elevation={20} onPress={() => props.navigation.navigate('PackageAssign', { ids: [id] })}
                                    btnBg={yellow_color} fontSize={standard_font_size}>Assign</HomePageBtn>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 5 }}>
                                <HomePageBtn elevation={20} onPress={() => deleteAction()} btnBg={red_color} fontSize={standard_font_size}>Delete</HomePageBtn>
                            </View>
                        </View> */}
                        {
                            loadRender()
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
                </>
            }
        </View>
    )
}

