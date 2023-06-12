import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { getData, postData } from "../../../components/fetch";
import { API_URL, default_font, red_color, green_color } from "../../../components/common";
import { STComponent, OriginTextInput, DatePickerForm } from "../../../components/form";
import { HomePageBtn } from "../../../components/button";
import { Toast } from "native-base";
import { getDateForInput } from '../../../components/date'
import { succAssign, genError, choose_fleet_label, assign_label } from "../../../components/labels and messges";

const PackageAssign = (props) =>{
    const [fleetList, setFL] = useState([])
    const [ choiceData, setData] = useState({
        packageIds: props.navigation.getParam('ids')
    })
    
    const FromRef = useRef(null)
    useEffect(()=>{
        // console.log(choiceData,'gg')
        callfleet()
    },[])

    const callfleet = () =>{
        
        getData(`${API_URL}/api/v0.1/fleets`)
        .then(response=>{
            if(response.ok){
                flist = response.data.data.map((fl,i)=>{
                    return {id: fl._id, name: fl.name}
                })
                setFL(flist)
            }
            // console.log(flist)
        })
    }

    const assign =async() =>{
        url = `${API_URL}/api/v0.1/package-assigns/many`
        var response = await postData(url,choiceData)
        if(response.ok){
            Toast.show({
                text: succAssign,
                textStyle: { color: green_color, fontFamily: default_font },
                duration: 1000
            })
            props.navigation.navigate('packageList')
        }else{        
            Toast.show({
                text: response.err,
                textStyle: { color: red_color,fontFamily: default_font },
                duration: 3000
            })
        }
    }
    return(
        <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
                
            <View>
                <STComponent 
                    required
                    value={choiceData.fleetId}
                    isSelectSingle={true}
                    popupTitle={choose_fleet_label}
                    title={choose_fleet_label}
                    data={fleetList}
                    searchPlaceholderText={choose_fleet_label}
                    onChangeSelect={data => {
                        setData({
                            ...choiceData,
                            fleetId: data.id
                        })
                    }}
                />  
            </View>
            <View style={{flexDirection: 'row'}}>
                   
                    {/* <TouchableOpacity onPress={() => {
                        FromRef.current.onPressDate()
                    }} >
                        <OriginTextInput required editable={false} value={choiceData.date} placeholder={"Select date"} width={'100%'}/>

                    </TouchableOpacity>
                    
                    <DatePicker
                        mode={'date'}
                        showIcon={false}
                        style={{ width: 50, height: 10 }}
                        hideText={true}
                        minDate={getDateForInput(new Date())}
                        ref={FromRef}
                        timeZoneOffsetInMinutes={5}
                        onDateChange={(date) => {
                            setData({
                                ...choiceData,
                                date: date
                            })
                        }}
                    /> */}
                    <DatePickerForm
                        required
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
                <HomePageBtn onPress={()=>assign()} width={'30%'}>{assign_label}</HomePageBtn>
            </View>
        </View>
    )
}

export default PackageAssign;