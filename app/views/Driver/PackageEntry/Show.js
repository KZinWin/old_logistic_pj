import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { getData, deleteData, postData } from "../../../components/fetch";
import { API_URL, default_font, grey_color, primary_color, white_color, red_color, yellow_color, green_color } from "../../../components/common";
import { HomePageBtn } from "../../../components/button";
import QRCode from "react-native-qrcode-svg";
import { Toast } from "native-base";
import { succDelete, succpickedUp, succdelivered, package_information_label, sender_label, receiver_label, deliDate_label, pickUp_images_label, delivered_images_label, fleet_information_label, fleet_name_label, fleet_numb_label, pickup_label, delivery_label, no_pickUp_image } from "../../../components/labels and messges";
import { getToken } from "../../../services/storage";
import { styles } from "../../../components/styles";
import { standard_font_size } from "../../../components/font";
import AppStore from "../../../mobx/AppStore";
import { MultiImageCard } from "../../../components/card";

const PackageDetailForCourier = (props) =>{
    const [pgdetail, setpgDetail] = useState({})
    const [ID, setID]= useState(props.navigation.getParam('id'))
    const[ assignID, setAssignID] = useState(props.navigation.getParam('assignID'))
    const [ dataurl, setDataurl ] = useState('')
    const [pickedImgs, setpickedImgs] = useState([])
    const [deliveredImgs, setdeliveredImgs] = useState([])
    const [status , setStatus] = useState('')

    useEffect(()=>{
        if (ID){
            getData(`${API_URL}/api/v0.1/package-assigns/${ID}`)
            .then(response=>{
                setpgDetail(response.data)
                setStatus(response.data.packageEntry.status )
                if(response.data.packageEntry.pickedUpImgs){
                    imgs = response.data.packageEntry.pickedUpImgs.map((img, i) => {
                        return `${API_URL}/api/v0.1/files?filename=${img.Key}&random=${Math.random().toString(36).substring(7)}`
                    })
                    setpickedImgs(imgs)
                    
                }
                if(response.data.packageEntry.deliveredImgs){
                    imgs = response.data.packageEntry.deliveredImgs.map((img, i) => {
                        return `${API_URL}/api/v0.1/files?filename=${img.Key}&random=${Math.random().toString(36).substring(7)}`
                    })
                    setdeliveredImgs(imgs)
                }
            })
        }
        
    },[])

    const delivered = async(id) =>{
        var response = await postData(`${API_URL}/api/v0.1/courier/package-assigns/${id}/delivered`,{imgs: deliveredImgs})
        if (response.ok){
            Toast.show({
                text: succdelivered,
                textStyle: {color: green_color, fontFamily: default_font},
                duration: 3000
            })
            props.navigation.navigate('PackageListForCourier')
        }
    }
    
    const pickedUp = async(id)=>{
        var response = await postData(`${API_URL}/api/v0.1/courier/package-assigns/${id}/picked-up`,{imgs: pickedImgs})
        if (response.ok){
            Toast.show({
                text: succpickedUp,
                textStyle: {color: green_color, fontFamily: default_font},
                duration: 3000
            })
            props.navigation.navigate('PackageListForCourier')
        }
    }

    const imagePick = (data, type) =>{
        var pkimg = type == 'picked'? pickedImgs: deliveredImgs
        pkimg.push(data.base64)
        if(type == 'picked'){
            setpickedImgs(JSON.parse(JSON.stringify(pkimg)))
        }else{
            setdeliveredImgs(JSON.parse(JSON.stringify(pkimg)))
        }
    }

    const editImg = (response,type) =>{
        const SFimgs =type == 'picked'? pickedImgs: deliveredImgs
        SFimgs[response.id] = response.res.base64
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

    const packageDetail = () =>{
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
                                <QRCode
                                    value={API_URL+pgdetail.qr}
                                    size={70}
                                    getRef={(c) => (this.svg = c)}
                                />
                            </View>
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
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.senderInfo.senderId: ''}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        from
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.pickUpInfo.strNo : ''},
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.pickUpInfo.ward : ''},
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.pickUpInfo.city : ''},
                                        {pgdetail && pgdetail.packageEntry ? pgdetail.packageEntry.pickUpInfo.tsp : ''}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        to
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.strNo : ''},
                                        {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.ward : ''},
                                        {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.city : ''},
                                        {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.tsp : ''}
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
                                    {pgdetail && pgdetail.packageEntry? pgdetail.packageEntry.receiverInfo.name : ''}
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
                                    {pgdetail.packageEntry ? pgdetail.packageEntry.deliDate: ''}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* package images */}
                            <View  style={{paddingVertical: 10 }}>
                                
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
                                            status!= 'DELIVERED' || deliveredImgs.length>0?
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
                        <View style={{paddingVertical: 10}}>
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
                            
                        </View>
                        {
                            pgdetail.packageEntry&&pgdetail.packageEntry.status == 'NEW'?
                            <View style={{flexDirection: 'row',justifyContent:'center',alignContent: 'flex-end', marginVertical: 20}}>
                                <HomePageBtn onPress={()=>pickedUp(pgdetail._id)} width={'50%'}>{pickup_label}</HomePageBtn>
                            </View>
                            :
                            pgdetail.packageEntry&&pgdetail.packageEntry.status == 'PICKED UP'?
                                <View style={{flexDirection: 'row',justifyContent:'center',alignContent: 'flex-end', marginVertical: 20}}>
                                    <HomePageBtn onPress={()=>delivered(pgdetail._id)} width={'50%'}>{delivery_label}</HomePageBtn>
                                </View>
                                :
                                <></>
                        }
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
        </ScrollView>
    )
}

export default PackageDetailForCourier;