import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { getData, postData } from "../../../components/fetch";
import { API_URL, default_font, red_color, green_color } from "../../../components/common";
import { STComponent, OriginTextInput, DatePickerForm } from "../../../components/form";
import { HomePageBtn } from "../../../components/button";
import { Toast } from "native-base";
import { getDateForInput } from '../../../components/date'
import { assign_label, choose_fleet_label, succAssign } from "../../../components/labels and messges";

const CourierAssign = (props) =>{
    const [fleetList, setFL] = useState([])
    const [ choiceData, setData ] = useState({
        deliveryId: props.navigation.getParam('id')
    })
    
    useEffect(()=>{

        getData(`${API_URL}/api/v0.1/fleets`)
        .then(response=>{
            flist = response.data.data.map((fl,i)=>{
                return {id: fl._id, name: fl.name}
            })
            setFL(flist)
        })
    },[])

    const assign =async() =>{
        postData(`${API_URL}/api/v0.1/driver-assigns`,choiceData)
        .then(response=>{
            // console.log(choiceData,response)
            if(response.ok){
                Toast.show({
                    text: succAssign,
                    textStyle: { color: green_color, fontFamily: default_font },
                    duration: 1000
                })
                props.navigation.navigate('CourierList')
            }else{
                Toast.show({
                    text: response.err,
                    textStyle: { color: red_color,fontFamily: default_font },
                    duration: 3000,
                })
            // console.log(response)

            }
        })
    }
    return(
        <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
                
            <View>
                <STComponent 
                    required
                    style={{height: 50}}
                    paddingTop = {0}
                    value={choiceData.fleetId}
                    isSelectSingle={true}
                    popupTitle={choose_fleet_label}
                    title={choose_fleet_label}
                    data={fleetList}
                    searchPlaceholderText={choose_fleet_label}
                    onSelect={data => {
                        setData({
                            ...choiceData,
                            fleetId: data[0]
                        })
                    }}
                />  
            </View>
            <View style={{flexDirection: 'row'}}>

                    <DatePickerForm 
                        required
                        height={50}
                        value={choiceData.date}
                        minDate={ getDateForInput(new Date())}
                        onDateChange={(date) => {
                            setData({
                                ...choiceData,
                                date: date
                            })
                        }}
                    />
            </View>
            <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 20}}>
                <HomePageBtn onPress={()=>assign()} width={'30%'}>{assign_label}</HomePageBtn>
            </View>

        </View>
    )
}

export default CourierAssign;