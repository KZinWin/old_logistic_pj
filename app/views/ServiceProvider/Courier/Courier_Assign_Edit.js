import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { getData, postData, putData, deleteData } from "../../../components/fetch";
import { API_URL, default_font, red_color, green_color } from "../../../components/common";
import { STComponent, OriginTextInput, DatePickerForm } from "../../../components/form";
import { HomePageBtn } from "../../../components/button";
import DatePicker from "react-native-datepicker";
import { Toast } from "native-base";
import Loading from "../../../components/loading";
import { succUnassign, succUpdate, genError, choose_fleet_label, reassign_label, unassign_label } from "../../../components/labels and messges";
import { getDateForInput } from "../../../components/date";

const CourierAssignEdit = (props) =>{
    const [loading, setLoading] = useState(false)
    const [id ,setID] = useState(props.navigation.getParam('assignId'))
    const [fleetList, setFL] = useState([])
    const [choiceData, setData] = useState({})
    const [reassignData, setReAssignData] = useState({})
    
    const FromRef = useRef(null)
    useEffect(()=>{
        callData()
    },[])

    const callData= async()=>{
        
        var response = await getData(`${API_URL}/api/v0.1/fleets`)
        if(response.ok){
            flist = response.data.data.map((fl,i)=>{
                return {id: fl._id, name: fl.name}
            })
            setFL(flist)
        }
       
    }

    useEffect(()=>{
        // get assigned deliver and fleet get
        getData(`${API_URL}/api/v0.1/driver-assigns/${id}`)
        .then(result=>{
            // console.log(result,`${API_URL}/api/v0.1/driver-assigns/${id}`)
            setData(result.data)
            setReAssignData({
                deliveryId: result.data.delivery._id,
                fleetId: result.data.fleetId,
                date: result.data.date
            })
        })
    },[fleetList])

    const assign =async() =>{
        setLoading(true)
        // console.log(reassignData)
        putData(`${API_URL}/api/v0.1/driver-assigns/${id}`,reassignData)
        .then(response=>{

            if(response.ok){
                Toast.show({
                    text: succUpdate,
                    textStyle: {color: green_color, fontFamily: default_font},
                    duration: 1000
                })
            }else{
                Toast.show({
                    text: response.err? response.err: genError,
                    textStyle: {color: red_color, fontFamily: default_font},
                    button: 'Okay',
                    duration: 3000
                })
                
            }
            props.navigation.navigate('CourierList')
        })
        setLoading(false)
    }

    const del = async() =>{
        var response = await deleteData(`${API_URL}/api/v0.1/driver-assigns/${id}`)
        if(response.ok){
            Toast.show({
                text: succUnassign,
                textStyle: {color: green_color, fontFamily: default_font},
                duration: 1000
            })
        }else{
            Toast.show({
                text: response.err? response.err: genError,
                textStyle: {color: red_color, fontFamily: default_font},
                buttonText: 'Okay',
                duration: 3000
            })
        }
        props.navigation.navigate('CourierList')
    }

    return(
        loading ? 
        <Loading visible={loading} />
        :
        <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
            <View>
                <STComponent 
                    required
                    value={choiceData.fleetId}
                    isSelectSingle={true}
                    popupTitle={choose_fleet_label}
                    title={choiceData.fleet ? choiceData.fleet.name: choose_fleet_label}
                    data={fleetList}
                    preSelectedItem={{key:'id',value: choiceData.fleetId}}
                    searchPlaceholderText={choose_fleet_label}
                    onSelect={data => {
                       setReAssignData({
                           ...reassignData,
                           fleetId: data[0]
                       })
                    }}
                />  
            </View>
            <View style={{flexDirection: 'row'}}>
                <DatePickerForm 
                    required
                    height={50}
                    minDate={ getDateForInput(new Date())}
                    value={reassignData.date}
                    onDateChange={(date) => {
                        setReAssignData({
                            ...reassignData,
                            date: date
                        })
                    }}
                />
            </View>
            <View style={{flexDirection: 'row',justifyContent:'space-between', marginVertical: 20}}>
                <HomePageBtn onPress={()=>assign()} width={'45%'}>{reassign_label}</HomePageBtn>
                <HomePageBtn btnBg={red_color} onPress={()=>del()} width={'45%'}>{unassign_label}</HomePageBtn>
            </View>
        </View>
    )
}

export default CourierAssignEdit;