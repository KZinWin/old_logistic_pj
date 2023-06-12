import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { getData, deleteData, postData } from "../../../components/fetch";
import { API_URL, default_font, grey_color, primary_color, white_color, red_color, yellow_color, green_color } from "../../../components/common";
import { HomePageBtn } from "../../../components/button";
import QRCode from "react-native-qrcode-svg";
import { Toast, Icon } from "native-base";
import { succDelete, sender_label, pick_up_address_label, 
    deli_address_label, pickUpDate_label, deliDate_label,nrc_label, 
    receiver_email_label, fleet_name_label, fleet_numb_label, 
    pickUp_images_label, delivered_images_label, receiver_label, weight_label, size_label, package_information_label, no_pickUp_image
} from "../../../components/labels and messges";
import { styles } from "../../../components/styles";
import { standard_font_size } from "../../../components/font";
import {MultiImageCard} from "../../../components/card";
import { getDateForDisplay } from "../../../components/date";
import UserStore from "../../../mobx/userStore";
import Loading from "../../../components/loading";
import { RadioButton, STComponent } from "../../../components/form";
import AppStore from "../../../mobx/AppStore";

const PackageDetail = (props) =>{
    const token = useState(AppStore.token)
    const [pgdetail, setpgDetail] = useState({})
    const [ID, setID]= useState(0)
    const[ assignID, setAssignID] = useState(0)
    const [ dataurl, setDataurl ] = useState('')
    const [status, setStatus] = useState('')
    const [pickUpdate, setpickUpdate] = useState('')
    const [deliveredDate, setdeliveredDate] = useState('')
    const [showReason, setShowReson] = useState(false)
    const [reason, setReason] = useState('')
    const [Reasons, setReasons] = useState([
        {id:"Address not found",name:"Address not found"}, 
        {id:"Operation Cancel",name:"Operation Cancel"}, 
        {id:"Not able to delivery package",name:"Not able to delivery package"}, 
        {id:"Cash Collection Fail",name:"Cash Collection Fail"}, 
        {id:"Wrong Assign",name:"Wrong Assign"}, 
        {id:"N/A",name:"N/A"}])

    useEffect(() => {
        if(props.navigation.getParam('id')){
            setID(props.navigation.getParam('id'))
        }
        if(props.navigation.getParam('assignID')){
            setAssignID(props.navigation.getParam('assignID'))
        }
    }, [props])
    // get assigned package
    useEffect(()=>{
        if(assignID){
            const pgassign =()=>{
                getData(`${API_URL}/api/v0.1/package-assigns/${assignID}`)
                .then(response =>{
                    if(response.ok){
                        var packagedetail = Object.assign({},{qr: response.data.qr},response.data.packageEntry, {fleet: response.data.fleet},{assignId: response.data._id})
                        setpickUpdate( response.data.packageEntry.pickedUpAt ? getDateForDisplay(new Date(response.data.packageEntry.pickedUpAt), 'YY-mm-dd') : response.data.packageEntry.pickUpDate)
                        setdeliveredDate( response.data.packageEntry.deliveredAt? getDateForDisplay(new Date(response.data.packageEntry.deliveredAt), 'YY-mm-dd') : response.data.packageEntry.deliDate)
                        setStatus(response.data.packageEntry.status)
                        setpgDetail(packagedetail)
                    }
                    
                })
            }
            pgassign()
        }
        if(ID){
            const pgentry = () =>{
                getData(`${API_URL}/api/v0.1/package-entries/${ID}`)
                .then(response =>{
                    if(response.ok){
                        setpickUpdate( response.data.pickedUpAt ? getDateForDisplay(new Date(response.data.pickedUpAt), 'YY-mm-dd') : response.data.pickUpDate)
                        setdeliveredDate( response.data.deliveredAt? getDateForDisplay(new Date(response.data.deliveredAt), 'YY-mm-dd') : response.data.deliDate)
                        setStatus(response.data.status)
                        setpgDetail(response.data)
                    }
                })
            }
            pgentry()
        }
    },[assignID, ID])

    // unassign function
    const deleteAction = () =>{
        deleteData(`${API_URL}/api/v0.1/package-entries/${pgdetail._id}`)
        .then(response=>{
            if(response.ok){
                Toast.show({
                    text: succDelete,
                    textStyle: {color: green_color,fontFamily: default_font},
                    duration: 1000,
                })
                props.navigation.navigate('packageList')
            }
        })
    }

    const assignDelete = (val) =>{
        const reason = {reason: val}
        setShowReson(false)
            postData(`${API_URL}/api/v0.1/package-assigns/${pgdetail.assignId}/unassign`,reason)
            .then(response => {
                if (response.ok) {
                    Toast.show({
                        text: succDelete,
                        textStyle: { color: green_color, fontFamily: default_font },
                        duration: 1000,
                    })
                    props.navigation.navigate('packageList')
                }
            })
    }

    

    //render for package assign
    const PackageDetail = () =>{
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 20}}>
                    <View style={{flex:3}}>
                        {/* Package information */}
                        <View style={styles.fw_with_pv10}>
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
                        <View style={styles.fw_with_pv10}>
                            {
                                pgdetail.qr?
                                <View style={{width: '40%'}}>
                                        <Image
                                            source={{uri : API_URL+pgdetail.qr}}
                                            style={{
                                                width: 100,
                                                height: 100,
                                            }}
                                        />
                                </View>
                                :<></>
                            }
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
                                        Status
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pgdetail.status}
                                    </Text>
                                </View>
                            </View>
                            {
                                pgdetail.status == 'FAILED'?
                                <View style={styles.fw_with_pv10}>
                                    <View style={{width: '40%'}}>
                                        <Text style={styles.standard_grey_text}>
                                            Reason
                                        </Text>
                                    </View>
                                    <View style={{width: '60%'}}>
                                        <Text style={styles.standard_grey_text}>
                                            {pgdetail.failReason? pgdetail.failReason: 'No Reason'}
                                        </Text>
                                    </View>
                                </View>
                                :<></>
                            }
                            <View style={styles.flexWrap}>
                                <View style={{width: '40%'}}>
                                    <Text style={styles.standard_grey_text}>
                                       {sender_label}
                                    </Text>
                                </View>
                                <View style={{width: '60%'}}>
                                    <Text style={styles.standard_grey_text}>
                                        {pgdetail.senderInfo ? pgdetail.senderInfo.name: '-'}
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
                                        {/* {console.log(pgdetail.packageEntry,'gg')} */}
                                        {pgdetail.pickUpInfo ? pgdetail.pickUpInfo.strNo : '-'},
                                        {pgdetail.pickUpInfo ? pgdetail.pickUpInfo.ward : '-'},
                                        {pgdetail.pickUpInfo ? pgdetail.pickUpInfo.city : '-'},
                                        {pgdetail.pickUpInfo ? pgdetail.pickUpInfo.tsp : '-'}
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
                                        {pgdetail.receiverInfo? pgdetail.receiverInfo.strNo : '-'},
                                        {pgdetail.receiverInfo? pgdetail.receiverInfo.ward : '-'},
                                        {pgdetail.receiverInfo? pgdetail.receiverInfo.city : '-'},
                                        {pgdetail.receiverInfo? pgdetail.receiverInfo.tsp : '-'}
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
                                    {pgdetail.receiverInfo? pgdetail.receiverInfo.name : '-'}
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
                                    {pgdetail? pgdetail.receiverInfo.email : '-'}
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
                                    {pgdetail.receiverInfo.identification ? pgdetail.receiverInfo.identification : '-'}
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
                                    {/* {pgdetail ?( pgdetail.pickedUpAt ? new Date(pgdetail.picketUpAt) : pgdetail.pickUpDate ): ''} */}
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
                                    {/* {pgdetail?( pgdetail.deliveredAt ? new Date(pgdetail.deliveredAt) : pgdetail.deliDate ): ''} */}
                                    {deliveredDate}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* package size */}
                        <View  style={{paddingVertical: 10 }}>
                            <View  style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color }}>
                                <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                    Package Size
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
                        <View  style={{paddingVertical: 10 }}>
                                    
                            <View  style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color }}>
                                <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                    {pickUp_images_label} 
                                </Text>
                                {pgdetail.pickedUpImgs && pgdetail.pickedUpImgs.length> 0?
                                    <>
                                        <MultiImageCard
                                            bearTokenEdit
                                            disabled
                                            images={pgdetail.pickedUpImgs}
                                            maxImage={pgdetail.pickedUpImgs.length}
                                        />
                                    </>
                                    :
                                    <View style={{ flexDirection: 'row'}}>
                                        <Text style={styles.standard_grey_text}>
                                           {no_pickUp_image}
                                        </Text>
                                    </View>
                                }
                            </View>
                            {
                                status != 'DELIVERED'?
                                <></>
                                :
                                <View  style={{paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: primary_color}}>
                                    <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                        {delivered_images_label} 
                                    </Text>
                                    {
                                        pgdetail.deliveredImgs&& pgdetail.deliveredImgs.length>0?
                                        
                                            <MultiImageCard
                                                bearTokenEdit
                                                images={pgdetail.deliveredImgs}
                                                disabled
                                                maxImage={pgdetail.deliveredImgs.length}
                                            />
                                            :
                                            <View style={{ flexDirection: 'row'}}>
                                                <Text style={styles.standard_grey_text}>
                                                    No Delivery Images
                                                </Text>
                                            </View>
                                    }
                                </View>
                            }
                        </View>
                        
                        {/* fleet information */}
                            <View style={{paddingVertical: 10}}>
                                <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                                    Fleet Information
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

                    </View>
                    
            </View>
        )
    }

    // const loadRender = () =>{
    //     return(
    //         <>
    //         {
    //             ID? 
    //             packageDetail() 
    //             :
    //             assignedPackageDetail()
    //         }
    //         </>
    //     )
    // }
   
    return(
        <ScrollView>
        {
            Object.keys(pgdetail).length != 0 ?
            <>
                
                <View style={{ flex: 1,flexDirection :'row', marginTop: 5, justifyContent: 'flex-end', marginHorizontal : 5}}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignContent: 'space-between'}}>
                        {
                            status == 'DELIVERED'?
                            <>
                                {/* <View style={{flex: 1,paddingRight: 5}}></View> */}
                                <View style={{flex: 1}}></View>
                                <View style={{flex: 1}}></View>
                                <View style={{flex: 1}}>
                                    <HomePageBtn elevation={20} onPress={()=>deleteAction()} btnBg={red_color} fontSize={standard_font_size}>Delete</HomePageBtn>
                                </View>
                            </>
                            :
                            <>
                            {
                                status == 'PICKED UP'?
                                <>
                                    
                                </>
                                :
                                <>
                                    
                                    <View style={{flex: 2}}>
                                        {
                                            pgdetail.assignId ?
                                            <View style ={{flexDirection:'row'}}>
                                                <View style={{flex:1}}>
                                                </View>
                                                <View style={{flex: 1}}>    
                                                    <HomePageBtn width={'95%'} elevation={20} onPress={()=>props.navigation.navigate('AssignPackageEdit',{id: pgdetail._id, assignID: pgdetail.assignId })}
                                                    btnBg={yellow_color} fontSize={standard_font_size}>Reassign</HomePageBtn>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <HomePageBtn width={'95%'} elevation={20} onPress={()=>setShowReson(true)} btnBg={red_color} fontSize={standard_font_size}>Unassign</HomePageBtn>
                                                </View>
                                            </View>
                                            
                                            :
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{flex: 1}}>    
                                                {pgdetail.userId == UserStore.UserStore._id? 
                                                    <HomePageBtn width={'95%'} elevation={20} onPress={()=>props.navigation.navigate('PackageEntryEdit',{id: pgdetail._id})}
                                                    btnBg={green_color} fontSize={standard_font_size}>Edit</HomePageBtn>
                                                    :<></>
                                                }
                                                </View>
                                                <View style={{flex: 1}}>    
                                                    <HomePageBtn width={'95%'} elevation={20} onPress={()=> status == 'FAILED'? props.navigation.navigate('AssignPackageEdit',{id: pgdetail._id}): props.navigation.navigate('PackageAssign',{ids: [pgdetail._id]})}
                                                    btnBg={yellow_color} fontSize={standard_font_size}>Assign</HomePageBtn>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <HomePageBtn width={'95%'} elevation={20} onPress={()=>deleteAction()} btnBg={red_color} fontSize={standard_font_size}>Delete</HomePageBtn>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </>
                            }
                            </>
                        }
                    </View>
                </View>
                {
                    showReason?
                    <View style={{paddingHorizontal: 10, paddingTop: 5}}>
                       <STComponent
                        isSelectSingle={true}
                        popupTitle={"Select Reason for unassign"}
                        title={reason? reason:'Select Reason for unassign'}
                        value={reason}
                        preSelectedItem={{ key: 'name', value: reason }}
                        data={Reasons}
                        searchPlaceHolderText={"Select Reason for unassign"}
                        onSelect={data => {
                            assignDelete(data[0])
                        }}
                       />
                    </View>
                    :<></>
                        
                }
                    {
                        PackageDetail()
                    }
            </>    
            :
            <>
                <Loading/>
            </>
        }
        </ScrollView>
    )
}

export default PackageDetail;