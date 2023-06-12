import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { STComponent, OriginTextInput, RNPicker, DatePickerForm, PinLocationText } from "../../../components/form";
import { Icon, Picker, Toast } from "native-base";
import { grey_color, light_grey_color, primary_color, white_color, default_font, API_URL,medium_grey_color, red_color, green_color } from "../../../components/common";
import ImagePicker from "react-native-image-picker";
import { HomePageBtn } from '../../../components/button';
import UserStore from "../../../mobx/userStore";
import CityStore from "../../../mobx/cityStore";
import { set, toJS } from "mobx";
import { getData, postData } from "../../../components/fetch";
import { NavigationEvents } from "react-navigation";
import { getDateForInput } from '../../../components/date'
import {styles} from '../../../components/styles'
import useValidAPiCall, { useNestedObjCheck } from "../../../components/validCallApi";
import { validErrormessage, succRegister, req_field_with_pack_photo, Tsp_label, PackageSize, PackagingPhoto_label, email_label, width_height_label, packageSize_label, deliDate_label, pickUpDate_label, packagingPhoto_label, total_charge_label, register_label, back_label, qty_label, select_sender_label, home_st_label, ward_label, post_code_label, name_label, nrc_label, next_label } from "../../../components/labels and messges";
import { MultiImageCard } from "../../../components/card";
import { xL, standard_font_size, xxS, xxxS, S } from "../../../components/font";
import ModalWrapper from "react-native-modal-wrapper";
import { State_label, PackagingPhoto } from "../../../components/labels and messges";
import { TextInput } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapModal } from "../../../components/modal";
import Loading from "../../../components/loading";

export default  PackageEntry = (props) => {
    const [ cities, setcities ] = useState([]);
    const [ recCities, setRecCities ] = useState([]);
    const [ pickCiites, setPickCities ] = useState([]);
    const [pgSize, setpgSize] = useState([])
    const [Logo , setLogo] = useState([])
    const [ Scroll , setScroll ] = useState(false)

    const [senderlist, setSenderList] = useState([])
    const [ senderTsp, setsenderTsp] = useState([])
    const [ pickUpTsp, setPickUpTsp] = useState([])
    const [ recTsp, setRecTsp] = useState([])
    const [senderInfo , setSenderinfo] = useState({senderId: '', name: '', strNo: '', ward: '', post: '', city: '',tsp: ''})
    const [recInfo, setRecinfo] = useState({name: '',strNo: '',ward: '', post: '', city: '', tsp: ''})
    const [pickUpInfo, setPickUpInfo] = useState({name: '',strNo: '',ward: '', post: '', city: '', tsp: ''})
    const [ Nstep , setNstep ] = useState(0)
    const nextValid = useNestedObjCheck(Object.assign({},{sender: senderInfo},{reciverInfo: recInfo}), Nstep)
    const [ obj, setObj] = useState({
        packSizeId:"",
        pickUpDate:"",
        deliDate:"",
        imgs: [],
        qty: ''
    })
    const [ init, setinit ] = useState(0)
    const isValid = useValidAPiCall(obj,init)
    const [imgindex, setindex] = useState(0)
    const [isOpen, setisOpen] = useState(false)
    const [ charge, setCharge ] = useState(0)
    const [ pgPrice, setpgPrice] = useState(0)
    const [step, setStep] = useState(0)
    const [mailValid, setMailValid] = useState('')
    const [pinLocation, setPinLocation] = useState(false)
    const [reccoordinate, setrecCoordinate] = useState({latitude: 16.855146,longitude:  96.175649})
    const [pickUpCoordinate, setpickUpCoordinate] = useState({latitude: 16.855146,longitude:  96.175649})
    const [recPinLocation, setrecPinLocation] = useState(false)
    const [pickUpPinLocation, setpickUpPinLocation]= useState(false)
    const [deliverablelist, setdeliverablelist] = useState([])
    const [avaliableRecCities, setAvaliableRecCities] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(()=>{
        callmobx()
    },[])

    useEffect(()=>{
        if (recInfo.tsp && pickUpInfo.tsp){
            getData(`${API_URL}/api/v0.1/service-areas`)
            .then(response=>{
                if(response.ok){
                    var data =response.data.data
                    var select1 = data.find(x=>(x.pickUp.tsp == pickUpInfo.tsp && x.deli.tsp == recInfo.tsp ))
                    setCharge(select1.price)
                }else{
                    // console.log(response)
                }
            })
        }

    },[recInfo, pickUpInfo])

    useEffect(()=>{

        if(recInfo.city){
            
            getData(`${API_URL}/api/v0.1/service-areas/deli/cities/${recInfo.city}/townships`)
            .then(response=>{
                if(response.ok ){
                    const data = []
                    response.data.map((x,i)=>{
                        deliverablelist.find(j=>j.deli.tsp == x)?
                          data.push({  id: i, name: x })
                        :
                            <></>
                    })
                    setRecTsp(data)
                }
            })
        }
    },[recInfo.city])
    
    useEffect(()=>{
        setRecinfo({
            ...recInfo,
            city: '',
            tsp: ''
        })
        if(pickUpInfo.city && pickUpInfo.tsp == ''){
            getData(`${API_URL}/api/v0.1/service-areas/pickUp/cities/${pickUpInfo.city}/townships`)
            .then(response=>{
                if(response.ok ){
                    var data =response.data.map((x,i)=>{
                        return {id: `${Math.random().toString(36).substring(7)}`, name: x}
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
                        if (response.data.find(x => x.deli.city == city.name)){
                            data.push({id: i, name: city.name})
                        }
                        
                    })
                    setAvaliableRecCities(data)
                    setdeliverablelist(response.data)
                }
            })
        }
    },[pickUpInfo])

    const callsenderDetail =(id)=>{
        getData(`${API_URL}/api/v0.1/senders/${id}`)
        .then(response=>{
            setSenderinfo({
                senderId: response.data._id,
                name: response.data.name,
                strNo: response.data.strNo,
                ward: response.data.ward,
                post: response.data.post,
                city: response.data.city,
                tsp: response.data.tsp
            })
            var id = cities.find(x=>x.name == response.data.city).id
            changeTwsp(id)

        })
    }


    // call api route and call mobx data load
    async function callmobx () {
        await UserStore.load(props)
        await CityStore.load()
        setcities(toJS(CityStore.cities))   // get states for sender

        // get states for receiver
        var result = await getData(`${API_URL}/api/v0.1/service-areas/deli/cities`)
        if(result.ok){
            var data=result.data.map((x,i) =>{
                return {id: i, name: x}
            })
            setRecCities(data)  
            setAvaliableRecCities(data)
        }

         // get states for pickup
        var result = await getData(`${API_URL}/api/v0.1/service-areas/pickUp/cities`)
        if(result.ok){
            var data=result.data.map((x,i) =>{
                return {id: i, name: x}
            })
            setPickCities(data)  
            
        }

        //get package size start
        var response = await getData(`${API_URL}/api/v0.1/package-sizes`)

        if(response.ok){
            var pglist =[]
            response.data.map((pgsize,i)=>{
                var pg = {id : pgsize._id, name: `${pgsize.weight} kg(${pgsize.width} cmx ${pgsize.height} cm) `, price: pgsize.price, laborFee : pgsize.laborFee, insurance: pgsize.insurance}
                
                pglist.push(pg)
            })
            setpgSize(pglist)
        //

        // get sender list
            var result = await getData(`${API_URL}/api/v0.1/senders`)
            if(result.ok){
                var obj = result.data.data.map((data, i)=>{
                return ({id: data._id,  
                        name: data.name,
                        ph: data.ph,
                        strNo: data.strNo,
                        ward: data.ward,
                        post: data.post,
                        city: data.city,
                        tsp: data.tsp,
                        userId: data.userId})
                })
                setSenderList(obj)
            }else{
                // console.log(result.data)
            }
        }else{
            console.log(response)
        }

    }
 

    const imagePick = (response) => {
        const Sixfours = obj.imgs
        Sixfours.push(response.base64)
        setObj({
            ...obj,
            imgs: Sixfours
        })
    }

    const editImg = (response) =>{
        const SFimgs = obj.imgs;
        SFimgs[response.id] = response.res.base64
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

    const onValueChange = (type, key, value) =>{
        if(type == "sender"){
            setSenderinfo({
                ...senderInfo,
                [key]: value
            })
        }else if(type=='receiver'){
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

    const objChange = (key, value) =>{
        setObj({
            ...obj,
            [key]: value
        })
    }

    const nextStep = () =>{
        setNstep(Nstep+1)
        if(mailValid != ''){
            Toast.show({
                text: mailValid,
                textStyle: {color: red_color, fontFamily: default_font},
                duration: 3000,
            }) 
        }else if(nextValid){
            setStep(1)
        }else {
            Toast.show({
                text: validErrormessage,
                textStyle: {color: red_color, fontFamily: default_font},
                duration: 3000,
            })
        }
    }
    
    const register = async() =>{
        setloading(true)
       setinit(init+1)
        var postObj = Object.assign({},
            {senderInfo:senderInfo},
            {receiverInfo: Object.assign({},
                recInfo, {identification: recInfo.identification == ""? "" : recInfo.identification, lat: reccoordinate.latitude,
                long: reccoordinate.longitude }
            )},
            {pickUpInfo: Object.assign({},pickUpInfo,{lat: pickUpCoordinate.latitude, long: pickUpCoordinate.longitude})},
            obj
            )
            if(isValid){
                var response = await postData(`${API_URL}/api/v0.1/package-entries`,postObj)
                if(response.ok){
                    Toast.show({
                        text: succRegister,
                        textStyle: {color: green_color, fontFamily: default_font},
                        duration: 1000
                    })
                    props.navigation.navigate('packageList')
                }else{
                    Toast.show({
                        text: response.err,
                        textStyle: {color: red_color, fontFamily: default_font},
                        duration: 1000
                    })
                }
            }else{
                Toast.show({
                    text: req_field_with_pack_photo,
                    textStyle: {color: red_color, fontFamily: default_font},
                    duration: 3000
                })
            }
        setloading(false)
    }

    const action = (index) =>{
        setindex(index)
        setisOpen(true)
    }

    const mapmodel = (text) =>{
       text == 'receiver' ? setrecPinLocation(true): setpickUpPinLocation(true)
    }

    const pageOne=()=>{
        return(
            <>
                <View style={{padding:10 }}> 
                    <Text style={{ flex: 1, height: 50,textAlign: 'center', fontSize: standard_font_size,color: primary_color }}>{packageSize_label}</Text>
                </View>
                <View style={{ flexDirection: 'column' }}>

                    <View style={{flex: 1 }}>
                        <STComponent
                            required
                            value={obj.packSizeId}
                            isSelectSingle={true}
                            label={packageSize_label}
                            popupTitle={width_height_label}
                            title={ width_height_label}
                            data={pgSize}
                            onChangeSelect={data => {
                                setObj({
                                    ...obj,
                                    packSizeId: data.id
                                })
                                setpgPrice(data.price + data.insurance + data.laborFee)
                            }}
                            
                        />
                    </View>
                    
                </View>
                <View style={{padding:10 }}> 
                    <Text style={styles.FleetLabel}>{packagingPhoto_label}</Text>
                </View>

                <MultiImageCard 
                    images={obj.imgs}
                    maxImage={5}
                    initPick={(response)=>imagePick(response)}
                    editPick = { (response) => editImg(response)}
                    ondelete = { res => imageDelAction(res)}
                />
                
                <View style={{flexDirection: 'row'}}>
                   
                    <DatePickerForm
                        height={50}
                        required 
                        label={pickUpDate_label}
                        value={obj.pickUpDate}
                        minDate={getDateForInput(new Date())}
                        onDateChange={(date) => {
                            objChange('pickUpDate',date)
                        }}
                    />
                </View>
                        
                <View style={{flexDirection: 'row'}}>

                    <DatePickerForm
                        height={50}
                        required 
                        label={deliDate_label}
                        minDate={obj.pickUpDate}
                        value={obj.deliDate}
                        onDateChange={(date) => {
                            objChange('deliDate',date)
                        }}
                    />
                </View>

                <OriginTextInput required type={'number'} placeholder="Quantity" label={qty_label} value={`${obj.qty}`} onChangeText={(text)=>objChange('qty',text)} />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Text style={{ color: grey_color, fontSize: standard_font_size}} >{total_charge_label} {pgPrice + charge} ks</Text>
                </View>
                <View style={{flexDirection: 'row',justifyContent:'space-between', marginVertical: 20}} >
                    <HomePageBtn width={'45%'} onPress={() => setStep(0)}>{back_label}</HomePageBtn>
                   <HomePageBtn width={'45%'} onPress={()=>register()}>{register_label}</HomePageBtn>
                </View>
                 
            </>
        )
    }

    const pageZero=()=>{
        return(
            <>
               
                <View style={{flex:3, flexDirection: 'column'}}>

                    {/* sender info */}
                    <Text style={{ flex: 1, height: 50,textAlign: 'center', fontSize: standard_font_size,color: primary_color }}>Sender Information</Text>
                    <View style={{flex:1}}>
                        <STComponent
                            required
                            value={senderInfo.name} 
                            isSelectSingle={true}
                            popupTitle={select_sender_label}
                            title={senderInfo.name? senderInfo.name:select_sender_label}
                            data={senderlist}
                            searchPlaceholderText={select_sender_label}
                            onChangeSelect={data => {
                                callsenderDetail(data.id)
                            }}
                        />
                        <OriginTextInput required label={home_st_label} value={senderInfo.strNo} onChangeText={(text)=>onValueChange('sender','strNo',text)} />
                        <View style={styles.fw_with_spaceAR_mb}>
                            <View style={{ width: '50%'}}> 
                                <OriginTextInput required  width={'90%'} value={senderInfo.ward} label={ward_label} onChangeText={(text)=>onValueChange('sender','ward',text)} />
                            </View>
                            <View style={{ width: '50%' }}>
                                <OriginTextInput required width={'90%'} value={`${senderInfo.post}`} type={'number'} label={post_code_label} onChangeText={(text)=>onValueChange('sender','post',text)} />
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
                                changeTwsp(data.id)
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
                        
                        <STComponent
                            required
                            value={senderInfo.tsp}
                            isSelectSingle={true}
                            popupTitle={Tsp_label}
                            label={Tsp_label}
                            title={ senderInfo.tsp? senderInfo.tsp: Tsp_label}
                            preSelectedItem={{key :'name', value:senderInfo.tsp}}
                            data={senderTsp}
                            onChangeSelect={data => {
                                setSenderinfo({
                                    ...senderInfo,
                                    tsp : data.name
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

                        <STComponent
                            isSelectSingle={true}
                            popupTitle={State_label}
                            label={State_label}
                            title={pickUpInfo.city? pickUpInfo.city:State_label}
                            required 
                            value={pickUpInfo.city}
                            preSelectedItem={{ key: 'name', value: pickUpInfo.city }}
                            data={pickCiites}
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
                    <Text style={styles.PackageLabel}>Receiver Information</Text>
                    <View style={{ flex: 1.2 }}>
                        <OriginTextInput required label={name_label} value={recInfo.name} onChangeText={(text) => onValueChange('receiver', 'name', text)} />
                        <OriginTextInput label={email_label} onChangeText={(text)=>onValueChange('receiver','email',text)} email value={recInfo.email} edit onBlur={(message)=> setMailValid(message)}/>
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
                                    city : data.name,
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
                            popupTitle={Tsp_label}
                            label={Tsp_label}
                            title={ recInfo.tsp? recInfo.tsp: Tsp_label}
                            preSelectedItem={{key :'name', value:recInfo.tsp}}
                            data={recTsp}
                            onChangeSelect={data => {
                                setRecinfo({
                                    ...recInfo,
                                    tsp : data.name
                                })
                            }}
                        />

                        <OriginTextInput label={nrc_label} value={recInfo.identification} onChangeText={(text)=>onValueChange('receiver','identification',text)} />
                    </View>
                    
                    <View style={{flex: 0.5, justifyContent: 'flex-end'}}>
                        <HomePageBtn onPress={()=>nextStep()}>{next_label}</HomePageBtn>
                       
                    </View>  
                </View>
                
            </>
        )
    }


    return(
        <View style={{flexDirection: 'column', justifyContent: 'center', padding: 20,paddingHorizontal: 30}}>
            <NavigationEvents onDidFocus={()=>callmobx()} />
            {loading?
            <Loading visible={loading}/>
            :
            <ScrollView>
                {
                    step == 0 ? 
                    pageZero()
                    :
                    pageOne ()
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

