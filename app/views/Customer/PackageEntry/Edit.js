import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView, } from "react-native";
import { STComponent, OriginTextInput, SearchForm, RNPicker, DatePickerForm, PinLocationText } from "../../../components/form";
import { Icon, Picker, Toast, Spinner } from "native-base";
import { grey_color, light_grey_color, primary_color, white_color, default_font, API_URL, medium_grey_color, red_color, green_color } from "../../../components/common";
import ImagePicker from "react-native-image-picker";
import { HomePageBtn } from '../../../components/button';
import UserStore from "../../../mobx/userStore";
import CityStore from "../../../mobx/cityStore";
import { toJS } from "mobx";
import { getData, postData, putData, deleteData } from "../../../components/fetch";
import DatePicker from "react-native-datepicker";
import { NavigationEvents } from "react-navigation";
import { getDateForInput } from '../../../components/date'
import { styles } from '../../../components/styles'
import ModalWrapper from "react-native-modal-wrapper";
import useValidAPiCall, { useNestedObjCheck } from "../../../components/validCallApi";
import { succRegister, validErrormessage, succUpdate, conflictMess, req_field_with_pack_photo, Tsp_label, conflictErr, email_label, sender_name_label, home_st_label, ward_label, post_code_label,State_label,name_label, next_label, packageSize_label, width_height_label, packagingPhoto_label, select_deliDate_label, total_charge_label, back_label, update_label, sender_information_label, pickUp_information_label, receiver_information_label, nrc_label } from "../../../components/labels and messges";
import AppStore from "../../../mobx/AppStore";
import Loading from "../../../components/loading";
import { MultiImageCard } from "../../../components/card";
import { xL, standard_font_size, xxS } from "../../../components/font";
import PaginateView from "../../../components/paginatView";
import { MapModal } from "../../../components/modal";

export default PackageEntryForCustomer = (props) => {
    const [userToken, setUsertoken] = useState(AppStore.token)
    const [cities, setcities] = useState([]);
    const [pickUpCities, setpickUpCities] = useState([]);
    const [recCities, setRecCities] = useState([]);
    const [pgSize, setpgSize] = useState([])

    const [id, setId] = useState(props.navigation.getParam("ID"))
    const [senderTsp, setsenderTsp] = useState([])
    const [recTsp, setRecTsp] = useState([])
    const [ pickUpTsp, setPickUpTsp] = useState([])
    const [senderInfo, setSenderinfo] = useState({name: '', strNo: '', ward: '', post: '', city: '', tsp: '' })
    const [servicelist, setServicelist] = useState([])
    const [serviceInfo, setServiceinfo] = useState({ id: '',name: '' })
    const [recInfo, setRecinfo] = useState({ name: '', strNo: '', ward: '', post: '', city: '', tsp: '' })
    const [pickUpInfo, setPickUpInfo] = useState({post: ''})
    const [ Nstep , setNstep ] = useState(0)
    const nextValid = useNestedObjCheck(Object.assign({},{sender: senderInfo},{reciverInfo: recInfo}), Nstep)
    const [images, setimages] = useState({imgs:[],keys:[]})
    const [obj, setObj] = useState({
        packSizeId: "",
        pickUpDate: "",
        deliDate: "",
        imgs: images.imgs
    })
    const [ init, setinit ] = useState(0)
    const isValid = useValidAPiCall(obj,init)
    const [modalVisible, setModalVisible] = useState(false)
    const [isOpen, setisOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [nextPage, setnextPage] = useState(0)
    const [endOfResult, setEndOfResult] = useState(true)
    const [loading, setLoading] = useState(true)
    const [pgPrice, setPgPrice] = useState(0)
    const [charges, setCharge] = useState(0)
    const [mailValid,setMailValid]= useState('')
    const [reccoordinate, setrecCoordinate] = useState({latitude: 16.855146,longitude: 96.175649})
    const [pickUpCoordinate, setpickUpCoordinate] = useState({latitude: 16.855146,longitude: 96.175649})
    const [recPinLocation, setrecPinLocation] = useState(false)
    const [pickUpPinLocation, setpickUpPinLocation]= useState(false)
    const [deliverablelist, setdeliverablelist] = useState([])
    const [avaliableRecCities, setAvaliableRecCities] = useState([])
    const [deleteimages, setDeleteImages] = useState([])
    
    useEffect(() => {
        callmobx()
    }, [])

    
    const mapmodel = (text) =>{
        text == 'receiver' ? setrecPinLocation(true): setpickUpPinLocation(true)
    }

    // call api route and call mobx data load
    async function callmobx() {
        await CityStore.load()          // get cites
        setcities(toJS(CityStore.cities))   // store all cities
        
        // get all registered service providers
        var result = await getData(`${API_URL}/api/v0.1/customer/service-providers`)
        if (result.ok) {
            var list = []
            result.data.data.map((data, i) => {
                list.push({ id: data._id, name: data.name })
            })
            setServicelist(list)
            setnextPage(result.data.links.next)
        }

        // get all package entries 
        var response = await getData(`${API_URL}/api/v0.1/customer/package-entries/${id}`)
        if(response.ok){
            setServiceinfo({
                ...serviceInfo, 
                id: response.data.providerId
            })
            setSenderinfo(response.data.senderInfo)
            
            setPickUpInfo(response.data.pickUpInfo)
            setpickUpCoordinate({
                latitude:response.data.pickUpInfo.lat? parseFloat(response.data.pickUpInfo.lat): 16.855146,
                longitude: response.data.pickUpInfo.long? parseFloat(response.data.pickUpInfo.long): 96.1756497
            })
            // changepicktsps()

            setRecinfo(response.data.receiverInfo)
            setrecCoordinate({
                latitude:response.data.receiverInfo.lat? parseFloat(response.data.receiverInfo.lat): 16.855146,
                longitude: response.data.receiverInfo.long? parseFloat(response.data.receiverInfo.long): 96.1756497
            })

            setObj({
                packSize: `${response.data.packSize.weight} kg(${response.data.packSize.width} cmx ${response.data.packSize.height} cm) ` ,
                packSizeId: response.data.packSizeId,
                pickUpDate: response.data.pickUpDate,
                deliDate: response.data.deliDate,
                imgs:response.data.imgs,
                updatedAt: response.data.updatedAt,
            })
            
            setPgPrice(response.data.packSize.price + response.data.packSize.laborFee +response.data.packSize.insurance)
                
        }
        setLoading(false)
        setStep(0)
    }

    useEffect(()=>{
        if(serviceInfo.id){
            var provider = servicelist.find(x=>x.id == serviceInfo.id)
            setServiceinfo(provider)
            // get states for receiver
            getData(`${API_URL}/api/v0.1/customer/service-providers/${serviceInfo.id}/deli/cities`)
            .then(result => {
                if (result.ok) {
                    var data = result.data.map((x, i) => {
                        return { id: i, name: x }
                    })
                    setRecCities(data)
                    setAvaliableRecCities(data)
                }
            }) 

            // get states for pickup
            getData(`${API_URL}/api/v0.1/customer/service-providers/${serviceInfo.id}/pickUp/cities`)
            .then(result => {
                if (result.ok) {
                    var data = result.data.map((x, i) => {
                        return { id: i, name: x }
                    })
                    setpickUpCities(data)
                }
            }) 

            // get package size from service provider
            getData(`${API_URL}/api/v0.1/customer/service-providers/${serviceInfo.id}/package-sizes`)
            .then(response => {
                if (response.ok) {
                    var pglist = []
                    response.data.map((pgsize, i) => {
                        var pg = { id: pgsize._id, name: `${pgsize.weight} kg(${pgsize.width} cmx ${pgsize.height} cm) `, price: pgsize.price, laborFee: pgsize.laborFee, insurance: pgsize.insurance }
                        pglist.push(pg)
                    })
                    setpgSize(pglist)
                }
            })
        }
    },[serviceInfo])

    useEffect(() =>{
        if(pickUpInfo.city){
            getData(`${API_URL}/api/v0.1/customer/service-providers/${serviceInfo.id}/pickUp/cities/${pickUpInfo.city}/townships`)
            .then(response => {
                if (response.ok) {
                    var data = response.data.map((x, i) => {
                        return { id: i , name: x }
                    })
                    setPickUpTsp(data)
                    
                } else {
                    console.log(response)
                }
            })
        }
        if(pickUpInfo.city && pickUpInfo.tsp){
            
            getData(`${API_URL}/api/v0.1/customer/service-providers/${serviceInfo.id}/pickUp/cities/${pickUpInfo.city}/townships/${pickUpInfo.tsp}/service-areas`)
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

    },[pickUpInfo, recCities])

    useEffect(() => {
        if(recInfo.tsp){
            getData(`${API_URL}/api/v0.1/customer/service-providers/${serviceInfo.id}/service-areas/first?deliCity=${recInfo.city}&deliTsp=${recInfo.tsp}&pickUpTsp=${pickUpInfo.tsp}&pickUpCity=${pickUpInfo.city}`)
            .then(response=>{
                if(response.ok){
                    setCharge(response.data.price)
                }
            })
        }

        // get townships for receiver when city is changed
        if(recInfo.city){
            getData(`${API_URL}/api/v0.1/customer/service-providers/${serviceInfo.id}/deli/cities/${recInfo.city}/townships`)
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

    closeModal = () => {
        setModalVisible(false);
    }

    // the first pick image
    const imagePick = (response) => {
        // const Array=[]
        const Sixfours = obj.imgs
        Sixfours.push({Location: response.base64, Key: ''})
        setObj({
            ...obj,
            imgs: Sixfours
        })
    }

    // edit image 
    const editImg = (response) => {
        
        const newArr = obj.imgs;
        newArr[response.id] = {Location:response.res.base64, Key: newArr[response.id].Key}
        setObj({
            ...obj,
            imgs:newArr
        })
    }
   
    // image delete
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

    useEffect(() => {
        if (senderInfo.city) {
            var index = cities.find(x => x.name == senderInfo.city)
            changeTwsp('sender',index.id)
        }

    }, [senderInfo])

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

    // for all input form value change
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
            setServiceinfo({
                ...serviceInfo,
                [key]: value
            })
        }
    }

    // change value for obj object
    const objChange = (key, value) => {
        setObj({
            ...obj,
            [key]: value
        })
    }

    const serviceChange = (service) => {
        setObj({
            ...obj,
            packSize: '',
            packSizeId: ''
        })
        setRecinfo({
            ...recInfo,
            city: '',
            tsp :''
        })
        setPickUpInfo({
            ...pickUpInfo,
            city: '',
            tsp :''
        })
        setPgPrice(0)
        setServiceinfo(service)
        setModalVisible(!modalVisible)
    }

    const nextStep = () =>{
        setNstep(Nstep+1)
        if(mailValid != ''){
            Toast.show({
                text: mailValid,
                textStyle: {color: red_color, fontFamily: default_font},
                duration: 1000
            }) 
        }else if(nextValid){
            setStep(1)
        }else{
            Toast.show({
                text: validErrormessage,
                textStyle: {color: red_color, fontFamily: default_font},
                duration: 1000
            })
        }
    }
    
    const scrollEnd= async(data) =>  {
        var list = servicelist
        data.data.map((x, i) => {
            var obj = servicelist.find(d=>d._id == x._id)
            if(!obj){
                // list.push(x)
                list.push({ id: x._id, name: x.name })
            }
        })
        setServicelist(list)
        setnextPage(data.links.next)

    }

    const pageOne = () => {
        return (
            <>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <STComponent
                            required
                            label={packageSize_label}
                            value={obj.packSizeId}
                            isSelectSingle={true}
                            popupTitle={width_height_label}
                            preSelectedItem={{key: 'id', value: obj.packSizeId}}
                            title={obj.packSize ? obj.packSize :width_height_label}
                            data={pgSize}
                            onChangeSelect={data => {
                                if(data.name == ''){
                                    setObj({
                                        ...obj,
                                        packSizeId: '',
                                        packSize: ''
                                    })
                                }else{
                                    setObj({
                                        ...obj,
                                        packSizeId: data.id,
                                        packSize: data.name
                                    })
                                }
                                setPgPrice(data.price + data.laborFee + data.insurance)
                            }}
                        ></STComponent>
                    </View>
                </View>
                <View style={{ padding: 10 }}>
                    <Text style={{ color: grey_color }}>{packagingPhoto_label}</Text>
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
                        minDate={ getDateForInput(new Date())}
                        height={50}
                        label={"Select Pick Up Date"}
                        value={obj.pickUpDate}
                        onDateChange={(date) => {
                            objChange('pickUpDate', date)
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row' }}>

                    <DatePickerForm 
                        height={50}
                        minDate={ getDateForInput(new Date())}
                        value={obj.deliDate}
                        label={select_deliDate_label}
                        onDateChange={(date) => {
                            objChange('deliDate', date)
                        }}
                    />
                    
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <Text style={{ color: grey_color, fontSize: standard_font_size }} >{total_charge_label} {charges + pgPrice} ks</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }} >
                    <HomePageBtn width={'45%'} onPress={() => setStep(0)}>{back_label}</HomePageBtn>
                    <HomePageBtn width={'45%'} onPress={() => register()}>{update_label}</HomePageBtn>
                </View>
            </>
        )
    }

    const pageZero = () => {
        
        return (
            <>

                {/* sender info */}
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true)
                    }}>
                        <OriginTextInput height={45} editable={false} value={serviceInfo.name} placeholder={"Select Service Provider"} width={'100%'} />
                    </TouchableOpacity>

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
                            label={State_label}
                            popupTitle={State_label}
                            title={senderInfo.city? senderInfo.city:State_label}
                            required 
                            value={senderInfo.city}
                            preSelectedItem={{ key: 'name', value: senderInfo.city }}
                            data={cities}
                            searchPlaceHolderText={State_label}
                            onChangeSelect={data => {
                                changeTwsp(data.name)
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
                                setRecinfo({
                                    ...recInfo,
                                    city: '',
                                    tsp: ''
                                })
                                if(data.name == '') {
                                    setPickUpTsp([])
                                }
                            }}
                        />
                        
                        <STComponent
                            required
                            label={Tsp_label}
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
                                setRecinfo({
                                    ...recInfo,
                                    city: '',
                                    tsp: ''
                                })
                            }}
                        />

                    </View>
                    
                    {/* receiver info */}
                    <Text style={styles.PackageLabel}>{receiver_information_label}</Text>
                    <View style={{ flex: 1.2 }}>
                        <OriginTextInput label={name_label} required onChangeText={(text) => onValueChange('receiver', 'name', text)} value={recInfo.name} />
                        <OriginTextInput 
                            label={email_label} 
                            onChangeText={(text)=>onValueChange('receiver','email',text)} 
                            email 
                            value={recInfo.email} 
                            onBlur={(message)=>setMailValid(message)}
                            edit
                        />
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
                            label={State_label}
                            popupTitle={recInfo.city? recInfo.city:State_label}
                            title={recInfo.city? recInfo.city: State_label}
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
                            label={Tsp_label}
                            value={recInfo.tsp}
                            isSelectSingle={true}
                            popupTitle={Tsp_label}
                            title={recInfo.tsp ? recInfo.tsp : Tsp_label}
                            preSelectedItem={{ key: 'name', value: recInfo.tsp }}
                            data={recTsp}
                            onChangeSelect={data => {
                                onValueChange('receiver', 'tsp', data.name)
                            }}
                        />

                        <OriginTextInput label={nrc_label} value={recInfo.identification} onChangeText={(text)=>onValueChange('receiver','identification',text)} />
                        
                    </View>

                    <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
                        <HomePageBtn onPress={() => nextStep()}>{next_label}</HomePageBtn>

                    </View>
                </View>
                <ModalWrapper
                    containerStyle={{ flexDirection: 'row', alignItems: 'flex-end' }}
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
                                servicelist.map((service, i) => (
                                    <TouchableOpacity onPress={() => serviceChange(service)}
                                        style={{ height: 30, marginTop: 10,width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start',paddingHorizontal: 20 }} key={i}
                                    >
                                        <Text style={{ fontFamily: default_font, fontSize: standard_font_size }}>{service.name}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                            
                        </PaginateView>
                    </View>
                </ModalWrapper>
            </>
        )
    }

    
    const register = async () => {
        setinit(init+1)
        if ( isValid) {
            obj.imgs.map((img,i)=>{
                if(img.Key != '' && img.Location.includes('base64')){
                    putData(`${API_URL}/api/v0.1/files?filename=${img.Key}`, { file: img.Location })
                    // .then(res => {
                    //     console.log(res, 'gg')
                    // })
                }else{
                    // newimgs.push(img.Location)
                     postData(`${API_URL}/api/v0.1/package-entries/${id}/imgs`,{imgs: [img.Location]})
                    // .then(res => {
                    //     console.log(res, 'postimg')
                    // })
                }
            })

            
        setLoading(true)
        var postObj = Object.assign({}, 
            { senderInfo: senderInfo }, 
            {receiverInfo: Object.assign({},
                recInfo, {identification: recInfo.identification == ""? "" : recInfo.identification, lat: reccoordinate.latitude,
                long: reccoordinate.longitude }
            )},
            {pickUpInfo: Object.assign({},pickUpInfo,{lat: pickUpCoordinate.latitude, long: pickUpCoordinate.longitude})},
            obj,
            {providerId: serviceInfo.id}
        )
                var response = await putData(`${API_URL}/api/v0.1/customer/package-entries/${id}`, postObj)
                if(response.status == 409){
                    Toast.show({
                        text: conflictErr,
                        textStyle: {color: green_color, fontFamily: default_font},
                        duration: 1000,
                        onclose: ()=> callmobx()
                    })
                }else if (response.ok) {
                    
                    if(deleteimages.length > 0 ){
                        deleteimages.map(x=>{
                            // console.log(x)
                            deleteData(`${API_URL}/api/v0.1/package-entries/${id}/imgs`,{keys: [x]})
                            .then(response =>{
                                if(!response.ok){
                                    pass = false
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
                        textStyle: {color: green_color, fontFamily: default_font},
                        duration: 1000
                    })
                    props.navigation.navigate('PackageListForCustomer')
                } else if(response.status == 409) {
                    Toast.show({
                        text: conflictMess,
                        textStyle: {color: red_color, fontFamily: default_font, fontSize: xxS},
                        duration: 3000,
                        onClose: () =>{callmobx() , setStep(0) }
                    })
                }else {
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
        setLoading(false)
    }


    return (
        loading? 
        <Loading visible={loading}/>
        :
        <View style={{ flexDirection: 'column', justifyContent: 'center', padding: 20, paddingHorizontal: 30 }}>
            <NavigationEvents onDidFocus={() => callmobx()} />
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
        </View>
    )
}

