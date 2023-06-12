import React, { useState, useEffect } from "React";
import { View, TouchableOpacity, Image, Picker, Text, ScrollView } from "react-native";
import { Icon, CheckBox, Toast } from "native-base";
import { grey_color, light_grey_color, default_font, primary_color, API_URL, yellow_color, red_color, green_color } from "../../../components/common";
import { SmallHighTextInput, OriginTextInput, MultilineTextInput, RNPicker, STComponent } from "../../../components/form";
import { HomePageBtn } from "../../../components/button";
import ImagePicker from 'react-native-image-picker';
import { postData, getData, putData, deleteData } from "../../../components/fetch";
import VehicleStore from "../../../mobx/VehicleStore";
import AppStore from "../../../mobx/AppStore";
import {styles} from "../../../components/styles";
import ModalWrapper from "react-native-modal-wrapper";
import useValidAPiCall from "../../../components/validCallApi";
import { succUpdate, succDelete, genError, validErrMesswithPhoto, fleet_name_label, register_label, plate_numb_label, select_type_label, type_label, year_label, cost_label, note_label, delete_label, update_label } from "../../../components/labels and messges";
import { xxxL, xxxS } from "../../../components/font";
import { MultiImageCard } from "../../../components/card";

export default FleetEdit = (props) =>{
    const [userToken, setUserToken]=useState(AppStore.token)
    const [id, setID] = useState(`${props.navigation.getParam('Id')}`)
    const [vtype, setVtype] = useState([])
    const [isOpen, setisOpen] = useState(false)
    const[ Fcounter, setFcounter] = useState({ 
        name: '',                   // name
        vRegNo: '',                 // Register Number
        vPlateNo: '',               //Plate Number
        vType: '',                  //Type
        vYear: '',                  // Year
        cost: '',                  //cost
        imgs: [],                   // image for base 64
    })
    const [deleteimages, setDeleteImages] = useState([])

  const [init, setinit] = useState(0)
  const isValid = useValidAPiCall(Fcounter,init)

    useEffect(()=>{
        async function callvtypemobx(){
            var response = await getData(`${API_URL}/api/v0.1/fleets/${id}`)
            if(response.ok){
                  
                setFcounter(response.data)
            }
            await VehicleStore.load()
            setVtype(VehicleStore.Vtypes)
        }
        callvtypemobx()
    },[])

    // initial 
    const imagePick = (response) => {
        var UpdateOne = Fcounter
        UpdateOne.imgs.push({Location: response.base64, Key: '' })
        setFcounter(JSON.parse(JSON.stringify(UpdateOne)))
    }
    // edit 
    const editImg = (response) =>{
        var newOne = Fcounter.imgs
        newOne[response.id] = {Location:response.res.base64, Key: newOne[response.id].Key}
        setFcounter({
            ...Fcounter,
            imgs: newOne
        })
    }
    // delete
    const imageDelAction = async (index) =>{
        var imgs = Fcounter.imgs
        var delarr = deleteimages
        if(imgs[index]){
            delarr.push(imgs[index].Key)
            imgs.splice(index,1)
            setDeleteImages(delarr)
            // setFcounter({
            //     ...Fcounter,
            //     imgs: imgs,
            // })
            
        }else{
            imgs.splice(index,1)
        }
        setFcounter({
            ...Fcounter,
            imgs: imgs
        })
    }

    const valueChange = (key, value) =>{
            setFcounter({
                ...Fcounter,
                [key]: value
            })
    }

    const Edit = async() =>{
        setinit(init+1)
        if(isValid){
            Fcounter.imgs.map((img,i)=>{
                // if(img.Key != '' && img.Location.includes('base64')){
                //     putData(`${API_URL}/api/v0.1/files?filename=${img.Key}`, { file: img.Location })
                //  }else{
                if(img.Key != '' && img.Location.includes('base64')){
                    putData(`${API_URL}/api/v0.1/files?filename=${img.Key}`, { file: img.Location })
                    .then(res=>{console.log(res)})
                }else if(img.Key != '' ){
                    putData(`${API_URL}/api/v0.1/files?filename=${img.Key}`, { file: img.Location })
                }else{
                    postData(`${API_URL}/api/v0.1/fleets/${id}/imgs`,{imgs: [img.Location]})
                }
               
            })
           
            var response= await putData(`${API_URL}/api/v0.1/fleets/${id}`, Fcounter)

            if(response.ok){
                if(deleteimages.length > 0 ){
                    var res = await deleteData(`${API_URL}/api/v0.1/fleets/${id}/imgs`,{keys: deleteimages})
                    if(!res.ok){
                        Toast.show({
                            text: response.err,
                            textStyle: { color: red_color, fontFamily: default_font },
                            duration: 1000
                        })
                    }
                }
                Toast.show({
                    text: succUpdate,
                    textStyle: { color: green_color,fontFamily: default_font },
                    duration: 1000
                })
                props.navigation.navigate('FleetList')
                
            }else{
                Toast.show({
                    text: response.err ,
                    textStyle: { color: red_color ,fontFamily: default_font },
                    duration: 1000,
                  })
                // console.log(response)
            }
        }else{
            Toast.show({
                text: validErrMesswithPhoto,
                textStyle: { color: red_color ,fontFamily: default_font },
                duration: 1000
              })
        }
    }

    const del = async() =>{
        var response = await deleteData(`${API_URL}/api/v0.1/fleets/${id}`)
        if(response.ok){
            Toast.show({
                text: succDelete,
                textStyle: {color: green_color, fontFamily: default_font},
                duration: 3000
            })
        }else{
            Toast.show({
                text: response.err ? response.err : genError,
                textStyle: {color : red_color, fontFamily: default_font},
                duration: 3000,
            })
        }
        props.navigation.navigate('FleetList')
    }

    return(
        <>
            <ScrollView style={{ flex:4 }}>

                <View>

                    <MultiImageCard
                        bearTokenEdit
                        images={Fcounter.imgs}
                        initPick={(response)=>imagePick(response)}
                        editPick = { (response) => editImg(response)}
                        ondelete = { res => imageDelAction(res)}
                    />
                    <View style={[styles.flexWrap,{ justifyContent: 'space-around', paddingHorizontal: 30}]}>
                        <View style={{ width: '100%' }}>
                            <OriginTextInput required label={fleet_name_label} edit={true} value={ Fcounter.name } onChangeText={(text)=>valueChange('name',text)}/>
                        </View>
                        <View style={{ width: '50%'}}> 
                            <SmallHighTextInput required label={register_label} width={'90%'} marginBottom={5} edit={true} value={ Fcounter.vRegNo } onChangeText={(text)=>valueChange('vRegNo',text)} />
                        </View> 
                    
                        <View style={{ width: '50%' }}> 
                            <SmallHighTextInput required  label={plate_numb_label} width={'90%'} marginBottom={5} edit={true} value={ Fcounter.vPlateNo } onChangeText={(text)=>valueChange('vPlateNo',text)}/>
                        </View> 
                    
                        <View style={{ width: '50%' }}> 
                            <STComponent
                                required
                                paddingTop = {0}
                                style={{height: 40, width: '90%'}}
                                value={Fcounter.vType}
                                isSelectSingle={true}
                                preSelectedItem={{ key: 'name', value: Fcounter.vType }}
                                popupTitle={select_type_label}
                                label={type_label}
                                title={Fcounter.vType? Fcounter.vType: select_type_label}
                                data={vtype}
                                edit={true}
                                searchPlaceHolderText={select_type_label}
                                
                                onChangeSelect={data => {
                                    valueChange('vType',data.name)
                                }}
                            />
                        </View> 
                    
                        <View style={{ width: '50%' }}> 
                            <OriginTextInput required label={year_label} height={40} width={'90%'} type={'number'} edit={true} value={Fcounter.vYear} onChangeText={(text)=>valueChange('vYear',text.toString())}/>
                        </View> 
                        <View style={{ width: '100%' , alignContent : 'flex-start'}}>
                            <View style={{width: '50%'}}>
                                <OriginTextInput required label={cost_label} height={40} width={'90%'} type={'number'} edit={true} value={`${ Fcounter.cost }`} onChangeText={(text)=>valueChange('cost',text)}/>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{width: '100%',flexDirection: 'row', paddingHorizontal :30}}>
                    <MultilineTextInput placeholder={note_label} edit={true} value={ Fcounter.note } numberOfLines={10} onChangeText={(text)=>valueChange('note',text)}/>
                </View>
                <View style={{flexDirection: 'row',justifyContent:'space-between', marginVertical: 20,paddingHorizontal:25}}>
                    <HomePageBtn width={'45%'} btnBg={red_color} onPress={()=>del()}>{delete_label}</HomePageBtn>
                    <HomePageBtn width={'45%'} onPress={()=>Edit()}>{update_label}</HomePageBtn>
                </View>                
            </ScrollView>
        </>
    )
}