import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { getData, postData, putData } from "../../../components/fetch";
import { API_URL, default_font, red_color, green_color } from "../../../components/common";
import { STComponent, OriginTextInput, DatePickerForm } from "../../../components/form";
import { HomePageBtn } from "../../../components/button";
import { Toast } from "native-base";
import { getDateForInput } from '../../../components/date'
import { succUpdate, conflictMess, failed, choose_fleet_label, update_label, succAssign } from "../../../components/labels and messges";
import { xxS } from "../../../components/font";

const AssignPackageEdit = (props) =>{
    const [ID, setID] = useState(props.navigation.getParam('id'))
    const [id, setAssignId ] = useState(props.navigation.getParam('assignID'))
    const [fleetList, setFL] = useState([])
    const [ choiceData, setData] = useState({
        packageId : '',
    })
    
    const FromRef = useRef(null)
    useEffect(()=>{
        callApi()
    },[])


    const callApi = () =>{
        if(id){
            getData(`${API_URL}/api/v0.1/package-assigns/${id}`)
            .then(result=>{
                if(result.ok){
                    setData({
                        ...choiceData,
                        packageId: ID,
                        fleetId : result.data.fleetId,
                        fname: result.data.fleet?result.data.fleet.name: '',
                        date: result.data.date,
                        updatedAt: result.data.updatedAt
                    })
                }
            })
        }else{
            setData({packageId: ID})
        }

        getData(`${API_URL}/api/v0.1/fleets`)
        .then(response=>{
            flist = response.data.data.map((fl,i)=>{
                return {id: fl._id, name: fl.name}
            })
            setFL(flist)
        })

    }

    const update =async() =>{
        if(id){
            var response = await putData(`${API_URL}/api/v0.1/package-assigns/${id}`,choiceData)
            if(response.ok){
                Toast.show({
                    text: succUpdate,
                    textStyle: { color: green_color,fontFamily: default_font },
                    duration: 1000, 
                })
                props.navigation.navigate('packageList')
            }else{ 
                Toast.show({
                    text: response.err,
                    textStyle: { color: red_color,fontFamily: default_font },
                    duration: 1000,
                    onClose:()=>response.status == 409 ? callApi(): Toast.hide()
                })
            }
        }else{
            var response = await postData(`${API_URL}/api/v0.1/package-assigns/reassign`,choiceData)
            if(response.ok){
                Toast.show({
                    text: succAssign,
                    textStyle: { color: green_color,fontFamily: default_font },
                    duration: 1000, 
                })
                props.navigation.navigate('packageList')
            }else{ 
                Toast.show({
                    text: response.err,
                    textStyle: { color: red_color,fontFamily: default_font },
                    duration: 1000,
                    onClose:()=>response.status == 409 ? callApi(): Toast.hide()
                })
            }
        }
    }

    return(
        <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
            <View>
                <STComponent 
                    required
                    value={choiceData.fleetId}
                    isSelectSingle={true}
                    preSelectedItem={{ key: 'id', value: choiceData.fleetId }}
                    popupTitle={choose_fleet_label}
                    title={choiceData.fname? choiceData.fname:choose_fleet_label}
                    data={fleetList}
                    searchPlaceholderText={choose_fleet_label}
                    onChangeSelect={data => {
                       setData({
                           ...choiceData,
                           fleetId: data.id,
                           fname: data.name
                       })
                    }}
                    />  
            </View>
                    {/* {console.log(choiceData.fleetId, choiceData.fname)} */}
            <View style={{flexDirection: 'row'}}>
                 
                    <DatePickerForm
                        height={50}
                        minDate={getDateForInput(new Date())}
                        value={choiceData.date} 
                        onDateChange={(date) => {
                            setData({
                                ...choiceData,
                                date: date
                            })
                        }}
                    />
                </View>
            <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 20}}>
                <HomePageBtn onPress={()=>update()} width={'30%'}>{update_label}</HomePageBtn>
            </View>
        </View>
    )
}

export default AssignPackageEdit;