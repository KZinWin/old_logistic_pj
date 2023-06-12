import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, RefreshControl, Text, TouchableOpacity } from "react-native";
import Background from "../../../components/background";
import { SearchForm, OriginTextInput, DatePickerForm } from "../../../components/form";
import { FLCard, PgList } from "../../../components/card";
import { grey_color, default_font, API_URL, primary_color, light_grey_color, red_color } from "../../../components/common";
import { getData, deleteData } from "../../../components/fetch";
import DatePicker from "react-native-datepicker";
import { HomePageBtn } from "../../../components/button";
import { Toast } from "native-base";
import { styles } from "../../../components/styles";
import { standard_font_size, xxS } from "../../../components/font";
import { fleet_name_label, fleet_numb_label } from "../../../components/labels and messges";

const Fpackage = (props) =>{
    const [fleetId, setfleetId] = useState(props.navigation.getParam('id'))
    const [fleetObj, setFObj] = useState({})
    const [pgEntries, setpgEntries] = useState([])
    const [date, setdate] = useState()
    const [loading, setLoading] = useState(false)
    const FromRef = useRef(null)
    useEffect(()=>{
        getData(`${API_URL}/api/v0.1/fleets/${fleetId}`)
        .then(response =>{
            setFObj(response.data)
        })
    },[])

    useEffect(()=>{
        packageCall()
    },[date])

    const packageCall = () =>{
        setLoading(true)
        getData(`${API_URL}/api/v0.1/package-assigns?date=${date}&fleetId=${fleetId}`)
        .then(response=>{
            if(response.ok){
                setpgEntries(response.data.data)
            }
        })
        setLoading(false)
    }


    return(
        <Background>
            <View style={{flex: 4, flexDirection: 'column', justifyContent: 'center', padding: 10}}>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontWeight: 'bold', color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                        Fleet Information 
                    </Text>
                    <View style={styles.flexWrap}>
                        <View style={{width: '40%'}}>
                            <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: xxS, paddingVertical: 10}}>
                                {fleet_name_label}
                            </Text>
                        </View>
                        <View style={{width: '60%'}}>
                            <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: xxS, paddingVertical: 10}}>
                                {fleetObj._id}
                            </Text>
                        </View>
                        <View style={{width: '40%'}}>
                            <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: xxS, paddingVertical: 10}}>
                                {fleet_numb_label}
                            </Text>
                        </View>
                        <View style={{width: '60%'}}>
                            <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: xxS, paddingVertical: 10}}>
                                {fleetObj.vRegNo}
                            </Text>
                        </View>
                        <View style={{width: '100%'}}>
                            {/* <TouchableOpacity onPress={() => {
                                FromRef.current.onPressDate()
                            }} >
                                <OriginTextInput editable={false} value={date} placeholder={"Select date"} width={'100%'}/>

                            </TouchableOpacity>
                            
                            <DatePicker
                                mode={'date'}
                                showIcon={false}
                                style={{ width: 50, height: 10 }}
                                hideText={true}
                                ref={FromRef}
                                timeZoneOffsetInMinutes={5}
                                onDateChange={(date) => {
                                    setdate(date)
                                }}
                            /> */}
                            <DatePickerForm
                                required
                                height={50}
                                value={date}
                                onDateChange={(date) => {
                                    setdate(date)
                                }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flex: 5,flexDirection :'row', paddingTop: 20, justifyContent: 'center'}}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={()=>packageCall()} />
                        }
                    >
                        <View style={styles.flexWrap}>
                            {
                                pgEntries? 
                                pgEntries.map((pk,i) =>(
                                    <View style={{ width: '50%', padding: 10 }} key={i} >
                                        <PgList onPress={()=>props.navigation.navigate('PackageDetail',{assignID: pk._id})}>
                                            <View style={{borderColor: light_grey_color, borderWidth: 0.5}}>
                                                <Text style={{textAlign: 'center', color: primary_color}}>{pk && pk.packageEntry ? pk.packageEntry.receiverInfo.tsp: ''}</Text>
                                            </View>
                                        </PgList>
                                    </View>
                                    ))
                                    :
                                    <></>
                                }
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Background>

    )
}

export default Fpackage;