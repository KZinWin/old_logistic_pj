import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { getData, deleteData, postData } from "../../../components/fetch";
import { API_URL, default_font, grey_color, primary_color, white_color, red_color, yellow_color, green_color, light_grey_color } from "../../../components/common";
import { HomePageBtn } from "../../../components/button";
import QRCode from "react-native-qrcode-svg";
import { Toast } from "native-base";
import { succDelete, succpickedUp, succdelivered, undelivered, 
    failed, package_information_label, sender_label, pick_up_address_label, 
    deli_address_label, receiver_label, receiver_email_label, nrc_label, 
    pickUpDate_label, deliDate_label, pickUp_images_label, delivered_images_label, 
    fleet_information_label, fleet_name_label, fleet_numb_label, pickup_label, undeliver_label,
    delivered_label, 
    no_pickUp_image
} from "../../../components/labels and messges";
import { getToken } from "../../../services/storage";
import { styles } from "../../../components/styles";
import { standard_font_size } from "../../../components/font";
import AppStore from "../../../mobx/AppStore";
import { MultiImageCard } from "../../../components/card";
import { getDateForDisplay } from "../../../components/date";
import ModalWrapper from "react-native-modal-wrapper";
import { MultilineTextInput } from "../../../components/form";

const PackageDetailForCourier = (props) =>{
    const [pgdetail, setpgDetail] = useState({})
    const [ID, setID]= useState(props.navigation.getParam('id'))
    const[ assignID, setAssignID] = useState(props.navigation.getParam('assignID'))
    const [ dataurl, setDataurl ] = useState('')
    const [pickedImgs, setpickedImgs] = useState([])
    const [deliveredImgs, setdeliveredImgs] = useState([])
    const [status , setStatus] = useState('')
    const [pickUpdate, setpickUpdate] = useState('')
    const [deliveredDate, setdeliveredDate] = useState('')
    const [ShowModel, setShowModel] = useState(false)
    const [reason, setreason] = useState('')

    useEffect(()=>{
        if (ID){
            getData(`${API_URL}/api/v0.1/package-assigns/${ID}`)
            .then(response=>{
                // console.log(response,'gg')
                setpickUpdate( response.data.packageEntry.pickedUpAt ? getDateForDisplay(new Date(response.data.packageEntry.pickedUpAt), 'YY-mm-dd') : response.data.packageEntry.pickUpDate)
                setdeliveredDate( response.data.packageEntry.deliveredAt? getDateForDisplay(new Date(response.data.packageEntry.deliveredAt), 'YY-mm-dd') : response.data.packageEntry.deliDate)
                setpgDetail(response.data)
                setStatus(response.data.packageEntry.status )
                if(response.data.packageEntry.pickedUpImgs){
                    imgs = response.data.packageEntry.pickedUpImgs.map((img, i) => {
                        return `${API_URL}/api/v0.1/files?filename=${img.Key}&random=${Math.random().toString(36).substring(7)}`
                    })
                    setpickedImgs(response.data.packageEntry.pickedUpImgs)
                    
                }
                if(response.data.packageEntry.deliveredImgs){
                    imgs = response.data.packageEntry.deliveredImgs.map((img, i) => {
                        return `${API_URL}/api/v0.1/files?filename=${img.Key}&random=${Math.random().toString(36).substring(7)}`
                    })
                    setdeliveredImgs(response.data.packageEntry.deliveredImgs)
                }
            })
        }
        
    },[])

    const delivered = async(id) =>{
        var response = await postData(`${API_URL}/api/v0.1/courier/package-assigns/${id}/delivered`,{imgs: deliveredImgs.map(x=>x.Location)})
        if (response.ok){
            Toast.show({
                text: succdelivered,
                textStyle: {color: green_color, fontFamily: default_font}
            })
            props.navigation.navigate('PackageListForCourier')
        }
    }
    
    const pickedUp = async(id)=>{
        var response = await postData(`${API_URL}/api/v0.1/courier/package-assigns/${id}/picked-up`,{imgs: pickedImgs.map(x=>x.Location)})
        if (response.ok){
            Toast.show({
                text: succpickedUp,
                textStyle: {color: green_color, fontFamily: default_font}
            })
            props.navigation.navigate('PackageListForCourier')
        }
    }

    const imagePick = (data, type) =>{
        var pkimg = type == 'picked'? pickedImgs: deliveredImgs
        pkimg.push({Location: data.base64, Key: ''})
        if(type == 'picked'){
            setpickedImgs(JSON.parse(JSON.stringify(pkimg)))
        }else{
            setdeliveredImgs(JSON.parse(JSON.stringify(pkimg)))
        }
    }

    const editImg = (response,type) =>{
        const SFimgs =type == 'picked'? pickedImgs: deliveredImgs
        SFimgs[response.id] = {Location: response.res.base64, Key: SFimgs[response.id].Key}
        if(type == 'picked'){
            setpickedImgs(SFimgs)
        }else{
            setdeliveredImgs(SFimgs)
        }
    }

    const imageDelAction = async (index,type) =>{
        var imageArr = type == 'picked'? pickedImgs: deliveredImgs
        imageArr.splice(index,1)
        if(type == 'picked'){
            setpickedImgs(imageArr)
        }else{
            setdeliveredImgs(imageArr)
        }
    }

    const undeliver = async()=>{
        setShowModel(false)
        postData(`${API_URL}/api/v0.1/courier/package-assigns/${ID}/undeliver`,{reason :reason})
        .then(response => {
            if(response.ok){
                Toast.show({
                    text: undelivered,
                    textStyle: {color: green_color, fontFamily: default_font}
                })
                props.navigation.navigate('PackageListForCourier')
            }else{
                Toast.show({
                    text: failed,
                    textStyle: {color: red_color, fontFamily: default_font}
                })
            }
        })
    }

    const packageDetail = () =>{
        const Qr = API_URL+pgdetail.qr
        
        return(
            <ScrollView>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 20}}>
                    <View style={{flex:3}}>
                        {/* Package information */}
                        <View style={styles.fw_with_pv10}>
                            <View style={{width: '40%'}}>
                                <Text style={{color: '#000', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                    Package ID
                                </Text>
                            </View>
                            <View style={{width: '60%'}}>
                                <Text style={{color: '#000', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                    {pgdetail.packageId}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.fw_with_pv10}>
                            <View style={{width: '40%'}}>
                                <Image
                                    style={{
                                        width: 100,
                                        height: 100,
                                    }}
                                    source={{
                                        uri: Qr,
                                    }}
                                />
                            {/* <View style={{width: '60%', justifyContent: 'center'}} >
                                <HomePageBtn marginHorizontal={10} height={35} width={'80%'} onPress={()=>alert('gg')}>Print QR</HomePageBtn>
                            </View> */}
                        </View>
                        <View style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color }}>
                            <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                {package_information_label}
                            </Text>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {sender_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.senderInfo.name: '-'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pick_up_address_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.pickUpInfo.strNo : '-'},
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.pickUpInfo.ward : '-'},
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.pickUpInfo.city : '-'},
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.pickUpInfo.tsp : '-'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {deli_address_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.strNo : '-'},
                                        {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.ward : '-'},
                                        {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.city : '-'},
                                        {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.tsp : '-'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {receiver_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                    {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.name : '-'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {receiver_email_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                    {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.email : '-'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {nrc_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                    {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.identification : '-'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pickUpDate_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {/* {pgdetail?pgdetail.pickUpDate: '-'} */}
                                        {pickUpdate}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {deliDate_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                    {deliveredDate}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* package images */}
                            <View style={{width: '100%'}}>
                                
                                <View  style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color }}>
                                    <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                        {pickUp_images_label} 
                                    </Text>
                                    {status =='NEW' || pickedImgs.length> 0?
                                        <MultiImageCard
                                            bearTokenEdit
                                            disabled={status !='NEW'? true:false}
                                            images={pickedImgs}
                                            maxImage={status !='NEW'? pickedImgs.length: undefined}
                                            initPick={(response)=>imagePick(response, 'picked')}
                                            editPick={response =>editImg(response, 'picked') }
                                            ondelete={res=>imageDelAction(res, 'picked')}
                                        />
                                        :
                                        <View style={{ flexDirection: 'row'}}>
                                            <Text style={styles.standard_grey_text}>
                                                {no_pickUp_image}
                                            </Text>
                                        </View>
                                    }
                                </View>
                                {
                                    status == 'NEW'?
                                    <></>
                                    :
                                    <View  style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color}}>
                                        <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                            {delivered_images_label} 
                                        </Text>
                                        {
                                            status !='DELIVERED' || deliveredImgs.length>0?
                                                <MultiImageCard
                                                    bearTokenEdit
                                                    images={deliveredImgs}
                                                    disabled={status =='DELIVERED'? true:false}
                                                    maxImage={status =='DELIVERED'? deliveredImgs.length: undefined}
                                                    initPick={(response)=>imagePick(response, 'delivered')}
                                                    editPick={response =>editImg(response, 'delivered') }
                                                    ondelete={res=>imageDelAction(res, 'delivered')}
                                                />
                                                :
                                                <View style={{ flexDirection: 'row'}}>
                                                    <Text style={styles.standard_grey_text}>
                                                        No Delivered Images
                                                    </Text>
                                                </View>
                                        }
                                    </View>
                                }           
                            </View>

                        {/* fleet information */}
                        <View style={{paddingVertical: 10, width: '100%'}}>
                            <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                {fleet_information_label}
                            </Text>
                            {
                                pgdetail.fleet?
                                <>
                                    <View style={styles.flexWrap}>
                                        <View style={{width: '40%'}}>
                                            <Text style={styles.standard_grey_text}>
                                                {fleet_name_label}
                                            </Text>
                                        </View>
                                        <View style={{width: '60%'}}>
                                            <Text style={styles.standard_grey_text}>
                                                {pgdetail.fleet? pgdetail.fleet.name : ''}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.flexWrap}>
                                        <View style={{width: '40%'}}>
                                            <Text style={styles.standard_grey_text}>
                                                {fleet_numb_label}
                                            </Text>
                                        </View>
                                        <View style={{width: '60%'}}>
                                            <Text style={styles.standard_grey_text}>
                                                {pgdetail.fleet? pgdetail.fleet.vRegNo : ''}
                                            </Text>
                                        </View>
                                    </View>
                                
                                </>
                                :
                                <View style={{ flexDirection: 'row'}}>
                                    <Text style={styles.standard_grey_text}>
                                        Not Assigned
                                    </Text>
                                </View>
                            }
                            
                            {
                                pgdetail.packageEntry&&pgdetail.packageEntry.status == 'NEW'?
                                <View style={{flex:1,flexDirection: 'row', padding: 10, justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                        <HomePageBtn onPress={()=>pickedUp(pgdetail._id)} width={'100%'}>{pickup_label}</HomePageBtn>
                                    </View>
                                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                        <HomePageBtn onPress={()=>setShowModel(true)} width={'100%'}>{undeliver_label}</HomePageBtn>
                                    </View>
                                </View>
                                :
                                pgdetail.packageEntry&&pgdetail.packageEntry.status == 'PICKED UP'?
                                    <View style={{flex:1,flexDirection: 'row', padding: 10, justifyContent: 'space-between'}}>
                                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                            <HomePageBtn onPress={()=>delivered(pgdetail._id)} width={'100%'}>{delivered_label}</HomePageBtn>
                                        </View>
                                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                            <HomePageBtn onPress={()=>setShowModel(true)} width={'100%'}>{undeliver_label}</HomePageBtn>
                                        </View>
                                    </View>
                                    :
                                    <></>
                            }
                        </View>
                    </View>
                    </View>
                </View>
            </ScrollView>
        )
    }


    return(
        <ScrollView>
            {
                packageDetail()
            }
            <ModalWrapper 
                containerStyle={{flexDirection: 'row', alignItems: 'flex-end'}}
                onRequestClose={()=>setShowModel(false)}
                style={{ flex: 1}}
                visible={ShowModel}
                backdropColor={'rgba(225,225,225,0.5)'}
                overlayStyle={light_grey_color}
            >
                <View style={{ backgroundColor: light_grey_color, height:'50%', paddingHorizontal: 10, flexDirection: 'column',borderRadius: 10, alignItems: 'center', justifyContent: 'flex-start', margin: 20, paddingTop: 5 }}>
                    <MultilineTextInput
                        label="Reason"
                        placeholder="Reason for package undeliver"
                        numberOfLines={10}
                        value={reason}
                        onChangeText={(text)=>setreason(text)}
                    />
                    <View style={{flexDirection: 'row',justifyContent:'center',alignContent: 'flex-end', marginVertical: 20}}>
                        <HomePageBtn onPress={()=>undeliver()} width={'50%'}>Submit</HomePageBtn>
                    </View>
                </View>
            </ModalWrapper>
        </ScrollView>
    )
}

export default PackageDetailForCourier;