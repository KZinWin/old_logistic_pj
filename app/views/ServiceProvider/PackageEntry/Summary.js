import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, TouchableOpacity, Button, AppState, RefreshControl } from "react-native";
import Background from "../../../components/background";
import { DashboardCard } from "../../../components/card";
import { API_URL, dashboard_red } from "../../../components/common";
import { getDateForInput } from "../../../components/date";
import { getData } from "../../../components/fetch";
import { DatePickerForm } from "../../../components/form";

const Summary = (props) => {
    const [from, setfrom] = useState()
    const [ to , setto ] = useState()
    const [report , setReport ] = useState({new: 0, failed: 0, delivered: 0, pickedUp: 0})
    const [mode, setMode] = useState(props.navigation.getParam("mode"))

    useEffect(()=>{
        setfrom(getDateForInput(new Date))
        setto(getDateForInput(new Date))
    },[])

    useEffect(() => {
        
        if(mode == 'business') {

            getData(`${API_URL}/api/v0.1/package-entries/report?from=${from}&to=${to}`)
            .then(response=>{
                var record = report
                if(response.data.length>0){
                    response.data.map(x=>{
                        if(x.status == 'NEW'){
                            record.new = x.count
                        }
                        if(x.status == 'FAILED'){
                            record.failed = x.count
                        }
                        if(x.status == 'DELIVERED'){
                            record.delivered = x.count
                        }
                        if(x.status == 'PIKCED UP'){
                            record.pickedUp = x.count
                        }
                    })
                }else{
                    record = {
                        new : 0,
                        failed: 0,
                        delivered: 0,
                        pickedUp: 0
                    }
                }
                setReport(JSON.parse(JSON.stringify(record)))
            })
        }else if(mode=='customer'){
            
            getData(`${API_URL}/api/v0.1/customer/package-entries/report?from=${from}&to=${to}`)
            .then(response=>{
                var record = report
                response.data.map(x=>{
                    if(x.status == 'NEW'){
                        record.new = x.count
                    }
                    if(x.status == 'FAILED'){
                        record.failed = x.count
                    }
                    if(x.status == 'DELIVERED'){
                        record.delivered = x.count
                    }
                    if(x.status == 'PIKCED UP'){
                        record.pickedUp = x.count
                    }
                })
                setReport(JSON.parse(JSON.stringify(record)))
            })
        }
        
    }, [from, to])
    return (
        <Background>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 5 }}>
                <View style={{ flex: 0.3,flexDirection: 'row',padding: 10 }}>
                    <DatePickerForm 
                        height={40}
                        label={'From'}
                        value={from}
                        onDateChange={(date) => {
                            setfrom(date)
                        }}
                    />
                    <DatePickerForm 
                        height={40}
                        label={'To'}
                        value={to}
                        onDateChange={(date) => {
                            setto(date)
                        }}
                    />
                </View>
                <View style={{flex: 3.5, flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'center'}}>
                    <DashboardCard
                        style={{backgroundColor: dashboard_red, width: '45%', margin : 5}}
                        name={'New'}
                        count={`${report.new}`}
                    />
                    <DashboardCard
                        style={{backgroundColor: dashboard_red, width: '45%', margin : 5}}
                        name={'Failed'}
                        count={`${report.failed}`}
                    />
                    <DashboardCard
                        style={{backgroundColor: dashboard_red, width: '45%', margin : 5}}
                        name={'Delivered'}
                        count={`${report.delivered}`}
                    />
                    <DashboardCard
                        style={{backgroundColor: dashboard_red, width: '45%', margin : 5}}
                        name={'Picked Up'}
                        count={`${report.pickedUp}`}
                    />
                </View>
                
            </View>
        </Background>

    )
}

export default Summary;