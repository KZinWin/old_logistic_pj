import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { getData, deleteData } from "../../../components/fetch";
import { API_URL, default_font, grey_color, primary_color, white_color, red_color, yellow_color, green_color } from "../../../components/common";
import { HomePageBtn } from "../../../components/button";
import QRCode from "react-native-qrcode-svg";
import { Toast } from "native-base";
import { succDelete, genError, package_information_label, 
    sender_label, pick_up_address_label, receiver_label, 
    receiver_email_label, nrc_label, pickUpDate_label, deliDate_label, 
    packageSize_label, size_label, weight_label, pickUp_images_label, delivered_images_label, 
    fleet_information_label, fleet_name_label, fleet_numb_label, deli_address_label, no_pickUp_image 
} from "../../../components/labels and messges";
import Loading from "../../../components/loading";
import { styles } from "../../../components/styles";
import { standard_font_size } from "../../../components/font";
import { MultiImageCard } from "../../../components/card";
import { getDateForDisplay } from "../../../components/date";

const PackageEntryDetailForCustomer = (props) =>{
    const [pgdetail, setpgDetail] = useState({})
    const [ID, setID]= useState(props.navigation.getParam('id'))
    const [ status, setStatus] = useState('')
    const [loading, setLoading] = useState(true)
    const [pickUpdate, setpickUpdate] = useState("")
    const [deliveredDate, setdeliveredDate] = useState("")
    const [deliverId, setDeliveryId] = useState(0)

    useEffect(()=>{
        // console.log(ID,'detail')
        if (ID){
            getDetailData()
        }
    },[])

    const getDetailData= async () =>{
        var response = await getData(`${API_URL}/api/v0.1/package-entries/${ID}`)
            if(response.ok){
                var pgStatus = response.data.status

                if(response.data.status == 'PICKED UP'){
                    if(Object.keys(response.data.packageAssign).length > 0 ){
                        getData(`${API_URL}/api/v0.1/customer/driver-assigns/first?date=${response.data.packageAssign.date}&fleetId=${response.data.packageAssign.fleet._id?response.data.packageAssign.fleet._id:'' }`)
                        .then(result=>{
                            setDeliveryId(result.data.deliveryId)
                        })
                    }else{
                        pgStatus= 'FAIL'
                    }
                }
                
                setStatus(pgStatus)
                setpickUpdate( response.data.pickedUpAt ? getDateForDisplay(new Date(response.data.pickedUpAt), 'YY-mm-dd') : response.data.pickUpDate)
                setdeliveredDate( response.data.deliveredAt? getDateForDisplay(new Date(response.data.deliveredAt), 'YY-mm-dd') : response.data.deliDate)
                setpgDetail(response.data)
            }else if(response.status == 502){
                getDetailData()
            }
            setLoading(false)
    }

    const deleteAction = () =>{
        deleteData(`${API_URL}/api/v0.1/customer/package-entries/${ID}` )
        .then(response=>{
            if(response.ok){
                Toast.show({
                    text: succDelete,
                    textStyle: {color: green_color,fontFamily: default_font},
                    duration: 3000
                })
            }else{
                Toast.show({
                    text: response.err? response.err: genError,
                    textStyle: {color: red_color, fontFamily: default_font},
                    duration: 3000
                })
            }
            props.navigation.navigate('PackageListForCustomer')
        })
    }

    const packageDetail = () =>{
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 20}}>
            {/* assign and delete buttons */}
                <View style={{ flex: 1,flexDirection :'row', marginTop: 5, justifyContent: 'center', marginHorizontal : 5}}>
                    <View style={{flex: 1,paddingRight: 5}}>
                    {
                        status == 'NEW' || status == 'FAIL'?
                            <HomePageBtn elevation={20} onPress={()=>props.navigation.navigate('PackageEntryEditForCustomer',{ID: pgdetail._id})}
                            btnBg={yellow_color} fontSize={standard_font_size}>Edit</HomePageBtn>
                            :
                            <></>
                    }
                    </View>
                        {
                            status == 'PICKED UP'?
                            <>
                            {/* {console.log(deliverId)} */}
                                <View style={{flex:1}}>
                                    <HomePageBtn elevation={20} onPress={()=>props.navigation.navigate('LiveTracking',{courier_id: deliverId})}
                                        btnBg={yellow_color} fontSize={standard_font_size}>Live Map</HomePageBtn>
                                </View>
                            </>
                            :
                            <View style={{flex: 1,paddingLeft: 5}}>
                                <HomePageBtn elevation={20} onPress={()=>deleteAction()} btnBg={red_color} fontSize={standard_font_size}>Delete</HomePageBtn>
                            </View>
                        }
                </View>
                {/* Package information */}
                <View style={styles.flexWrap}>
                    <View style={{width: '40%'}}>
                        <Text style={styles.standard_grey_text}>
                            Package ID
                        </Text>
                    </View>
                    <View style={{width: '60%'}}>
                        <Text style={styles.standard_grey_text}>
                            {pgdetail._id}
                        </Text>
                    </View>
                </View>
                <View style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color }}>
                    <Text style={{fontWeight: 'bold', color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
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
                                {pgdetail && pgdetail.senderInfo ? pgdetail.senderInfo.name: '-'}
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
                                {pgdetail && pgdetail.pickUpInfo ? pgdetail.pickUpInfo.strNo : '-'},
                                {pgdetail && pgdetail.pickUpInfo ? pgdetail.pickUpInfo.ward : '-'},
                                {pgdetail && pgdetail.pickUpInfo ? pgdetail.pickUpInfo.city : '-'},
                                {pgdetail && pgdetail.pickUpInfo ? pgdetail.pickUpInfo.tsp : '-'}
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
                                {pgdetail && pgdetail.receiverInfo? pgdetail.receiverInfo.strNo : '-'},
                                {pgdetail && pgdetail.receiverInfo? pgdetail.receiverInfo.ward : '-'},
                                {pgdetail && pgdetail.receiverInfo? pgdetail.receiverInfo.city : '-'},
                                {pgdetail && pgdetail.receiverInfo? pgdetail.receiverInfo.tsp : '-'}
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
                                {pgdetail && pgdetail.receiverInfo? pgdetail.receiverInfo.name : '-'}
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
                                {pgdetail && pgdetail.receiverInfo? pgdetail.receiverInfo.email : '-'}
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
                                {pgdetail && pgdetail.receiverInfo? pgdetail.receiverInfo.identification : '-'}
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
                                {/* {pgdetail?pgdetail.deliDate: ''} */}
                                {deliveredDate}
                            </Text>
                        </View>
                    </View>
                </View>
        
                {/* package size */}
                <View  style={{paddingVertical: 10 }}>
                    <View  style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color }}>
                        <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                            {packageSize_label}
                        </Text>
                        <View style={styles.flexWrap}>
                            <View style={{width: '40%'}}>
                                <Text style={styles.standard_grey_text}>
                                    {size_label}
                                </Text>
                            </View>
                            <View style={{width: '60%'}}>
                                <Text style={styles.standard_grey_text}>
                                    {pgdetail.packageSize.width} X {pgdetail.packageSize.height}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.flexWrap}>
                            <View style={{width: '40%'}}>
                                <Text style={styles.standard_grey_text}>
                                    {weight_label}
                                </Text>
                            </View>
                            <View style={{width: '60%'}}>
                                <Text style={styles.standard_grey_text}>
                                    {pgdetail.packageSize.weight}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                
                {/* package images */}
                <View  style={{paddingVertical: 10}}>
                {
                    pgdetail.pickedUpImgs ?
                            
                            <View  style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color }}>
                                <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                    {pickUp_images_label}
                                </Text>
                                {pgdetail.pickedUpImgs.length> 0?
                                    <MultiImageCard
                                        bearTokenEdit
                                        disabled
                                        images={pgdetail.pickedUpImgs}
                                        maxImage={pgdetail.pickedUpImgs.length}
                                    />
                                    :
                                    <View style={{ flexDirection: 'row'}}>
                                        <Text style={styles.standard_grey_text}>
                                            {no_pickUp_image}
                                        </Text>
                                    </View>
                                }
                        </View>
                        :
                        <></>
                }
                {
                    pgdetail.deliveredImgs ?
                        <View  style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color}}>
                            <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                {delivered_images_label} 
                            </Text>
                            {
                                pgdetail.deliveredImgs.length>0?
                                    <MultiImageCard
                                        bearTokenEdit
                                        images={pgdetail.deliveredImgs}
                                        disabled
                                        maxImage={pgdetail.deliveredImgs.length}
                                    />
                                    :
                                    <View style={{ flexDirection: 'row'}}>
                                        <Text style={styles.standard_grey_text}>
                                            No Delivered Images
                                        </Text>
                                    </View>
                            }
                        </View>
                        :
                        <></>
                }
                </View>

                {/* fleet information */}
                <View style={{paddingVertical: 10}}>
                    <Text style={{ fontWeight: 'bold', color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                        {fleet_information_label}
                    </Text>
                    {
                        pgdetail.packageAssign && pgdetail.packageAssign.fleet?
                        <>
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {fleet_name_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pgdetail.packageAssign ? pgdetail.packageAssign.fleet.name : ''}
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
                                    {pgdetail.packageAssign ? pgdetail.packageAssign.fleet.vRegNo: ''}
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
            

            </View>
        )
    }

    return(
        loading? 
        <Loading visible={loading}/>
        :
        <ScrollView>
            {
                packageDetail()
            }
        </ScrollView>
    )
}

export default PackageEntryDetailForCustomer;