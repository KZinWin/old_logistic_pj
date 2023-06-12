import React, { useState, useEffect } from "React";
import { View, TouchableOpacity, Image, Picker, Text, ScrollView } from "react-native";
import { Icon, CheckBox,Toast } from "native-base";
import { grey_color, light_grey_color, default_font, primary_color,red_color, API_URL, green_color } from "../../../components/common";
import { SmallHighTextInput, OriginTextInput, MultilineTextInput, ValidateForm, RNPicker, STComponent } from "../../../components/form";
import { HomePageBtn } from "../../../components/button";
import ImagePicker from 'react-native-image-picker';
import { postData, getData } from "../../../components/fetch";
import VehicleStore from "../../../mobx/VehicleStore";
import {styles} from "../../../components/styles";
import useValidAPiCall from "../../../components/validCallApi";
import { cost_label, fleet_name_label, note_label, plate_numb_label, register_label, registration_num_label, select_type_label, succRegister, type_label, validErrMesswithPhoto, year_label } from "../../../components/labels and messges";
import { MultiImageCard } from "../../../components/card";

export default FleetRegister = (props) =>{
    const [vtype, setVtype] = useState([])
    const[Fcounter, setFcounter] = useState({ 
        name: '',                   // name
        vRegNo: '',                 // Register Number
        vPlateNo: '',               //Plate Number
        vType: '',                  //Type
        vYear: '',                  // Year
        cost: '',                  //cost
        imgs: [],                   // image for base 64
        uri: []                     // image for show uri
    })
    const [init, setinit] = useState(0)
    const isValid = useValidAPiCall(Fcounter,init)
    const [imgindex, setindex] = useState(0)
    const [isOpen, setisOpen] = useState(false)
   
    useEffect(()=>{
        async function callvtypemobx(){
            await VehicleStore.load()
            setVtype(VehicleStore.Vtypes)
        }
        callvtypemobx()
    },[])

    const initial = (response) => {
        var UpdateOne = Fcounter
        UpdateOne.uri.push( response.uri )
        UpdateOne.imgs.push( response.base64 )
        setFcounter(JSON.parse(JSON.stringify(UpdateOne)))
    }

    const editImg = (response) =>{
        var newOne = Fcounter
        newOne.uri[response.id] = response.res.uri
        newOne.imgs[response.id] =response.res.base64
        setFcounter(JSON.parse(JSON.stringify(newOne)))
    }
    
    const deleteAction = async (index) =>{
        
        var obj = Fcounter.uri
        var img = Fcounter.imgs
        obj.splice(index,1)
        img.splice(index,1)
        setFcounter({
            ...Fcounter,
            imgs: img,
            uri: obj
        })
        
    }

    const valueChange = (key, value) =>{
        setFcounter({
            ...Fcounter,
            [key]: value
        })
    }

    // const check = async () =>{
    //     if (!Fcounter.CamCounter){
    //         var camera = []
    //         camera.push({ num: 0 });
    //         setFcounter({
    //             ...Fcounter,
    //             CamCounter: camera
    //         });
    //     }
    // }


    const register = async() =>{
        setinit(init+1)
        if(isValid){
            var response= await postData(`${API_URL}/api/v0.1/fleets`, Fcounter)
            if(response.ok){
                Toast.show({
                    text: succRegister,
                    textStyle: { color: green_color, fontFamily: default_font },
                    duration: 1000
                })
                props.navigation.navigate('FleetList')
            } else {
                Toast.show({
                    text: response.err,
                    textStyle: { color: red_color, fontFamily: default_font },
                    duration: 3000,
                })
            }
        }else{
            Toast.show({
                text: validErrMesswithPhoto,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 3000
            })
        }

    }
    return(
        <ScrollView style={{ flex:1 }}>
            <View>
                <MultiImageCard
                    images={Fcounter.uri}
                    maxImage={5}
                    initPick={(response)=>initial(response)}
                    editPick = { (response) => {editImg(response)}}
                    ondelete = { res => deleteAction(res)}
                />
                <View style={[styles.flexWrap,{ justifyContent: 'space-around', paddingHorizontal: 30}]}>
                    <View style={{ width: '100%' }}>
                        <OriginTextInput required label={fleet_name_label} value={Fcounter.name} onChangeText={(text)=>valueChange('name',text)}/>
                    </View>
                    <View style={{ width: '50%'}}> 
                        {/* <Text style={styles.FleetLabel}>Registration Number</Text> */}
                        <SmallHighTextInput required label={registration_num_label} width={'90%'}  value={Fcounter.vRegNo} marginBottom={5} onChangeText={(text)=>valueChange('vRegNo',text)} />
                    </View> 
                
                    <View style={{ width: '50%' }}> 
                        {/* <Text style={styles.FleetLabel}>Plate Number</Text> */}
                        <SmallHighTextInput label={plate_numb_label} required width={'90%'}  value={Fcounter.vPlateNo} marginBottom={5} onChangeText={(text)=>valueChange('vPlateNo',text)}/>
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
                        {/* <Text style={styles.FleetLabel}>Year</Text> */}
                        <OriginTextInput required label={year_label} height={40} width={'90%'} value={Fcounter.vYear} type={'number'} onChangeText={(text)=>valueChange('vYear',text.toString())}/>
                    </View> 
                    <View style={{ width: '100%' , alignContent : 'flex-start'}}>
                        <View style={{width: '50%'}}>
                            {/* <Text style={styles.FleetLabel}>Cost</Text> */}
                            <OriginTextInput required width={'90%'} height={40} label={cost_label} value={`${Fcounter.cost}`} type={'number'} onChangeText={(text)=>valueChange('cost',text)}/>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{width: '100%',flexDirection: 'row', paddingHorizontal :30}}>
                <MultilineTextInput placeholder={note_label} numberOfLines={10} onChangeText={(text)=>valueChange('note',text)}/>
            </View>
            <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 20,paddingHorizontal:25}}>
                <HomePageBtn onPress={()=>register()}>{register_label}</HomePageBtn>
            </View>                
        </ScrollView>
    )
}