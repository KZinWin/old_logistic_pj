import React, { useState, useEffect, useRef, createRef } from "React";
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert } from "react-native";
import { white_color, primary_color, grey_color, default_font, light_grey_color, dashboard_green, dashboard_red, red_color, API_URL } from "../../components/common";
import { Icon } from "native-base";
import Background from "../../components/background";
import { S, xS, standard_font_size, xxS } from "../../components/font";
import { DashboardList, DashboardCard, DatetimepickerText } from "../../components/card";
import { getData } from "../../components/fetch";
import { getDateForInput } from "../../components/date";
import { NavigationEvents } from "react-navigation";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { TextInput } from "react-native-gesture-handler";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { assigned_label, unassigned_label } from "../../components/labels and messges";
import {HomePageBtn} from "../../components/button"
import {ShowNotification} from "../../components/localNotificationService"

const Dashboard = (props) => {
    const [assignCount, setassignCount] = useState(0)
    const [unassignCount, setunassignCount] = useState(0)
    const [deliverCount, setdeliverCount] = useState(0)
    const [courierCount, setcourierCount] = useState(0)
    const [fleetCount, setfleetCount] = useState(0)
    const [dailyTotal, setdailyTotal] = useState(0)
    const [monthlyTotal, setmonthlyTotal] = useState(0)
    const [region, setRegion] = useState()
    const [choicedDate, setchoiceDate] = useState(getDateForInput(new Date()))
    const choiceDateRef = useRef({})
    const mapRef =useRef(null)
    const callApi = () =>{
        var date = moment(choicedDate)
        var month = date.format('MM');
        var year = date.format('Y')
        // var month = date.getMonth() +1

        getData(`${API_URL}/api/v0.1/package-entries/count?date=${choicedDate}`)
        .then(response=>{
            setdeliverCount(response.data.delivered? response.data.delivered: 0)
            setassignCount(response.data.assigned? response.data.assigned: 0)
            setunassignCount(response.data.unassigned? response.data.unassigned: 0)
        })

        getData(`${API_URL}/api/v0.1/deliveries`)
        .then(response=>{
            // console.log(response, 'deliveres')
            setcourierCount(response.data.meta.total)
        })

        getData( `${API_URL}/api/v0.1/fleets` )
        .then(response=>{
            // console.log(response, 'fleet')
            setfleetCount(response.data.meta.total)
        })

        getData(`${API_URL}/api/v0.1/expenses/total?date=${choicedDate}`)
        .then(response=>{
            var total = response.data.total == undefined? 0 : response.data.total
            setdailyTotal(total)
        })

        getData(`${API_URL}/api/v0.1/expenses/monthly?month=${month}&year=${year}`)
        .then(response=>{
            setmonthlyTotal(response.data.total)
        })
    }

    const onMapReady = () =>{
        setRegion({
            latitude: 16.855146,
            longitude:  96.175649,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        })
    }

    useEffect(()=>{
        if(choicedDate != undefined){
            callApi()
        }
    },[choicedDate])

    useEffect(()=>{
        callApi()
    },[])

    const changeDate = (choicedate) =>{
        setchoiceDate(choicedate)
    }
    return (
        <Background >
            <NavigationEvents onDidFocus={()=>callApi()}/>
                <View style={{flexDirection: 'row',justifyContent: 'flex-end',paddingTop: 10, paddingHorizontal: 20}}>

                    <Text style={{fontFamily: default_font, color: grey_color}}>Select Date : </Text>
                    <TouchableOpacity onPress={()=>{choiceDateRef.current.onPressDate()}}>
                        <Text style={{ color: grey_color, fontFamily: default_font }}>{choicedDate}</Text>

                        <DatePicker
                            mode={'date'}
                            showIcon={false}
                            date={getDateForInput(new Date())}
                            style={{ width: 50, height: 10 }}
                            hideText={true}
                            ref={choiceDateRef}
                            androidMode={'spinner'}
                            onDateChange={async(date) => await changeDate(date)}
                        />

                    </TouchableOpacity>
                </View>
            <ScrollView>
                <View style={{flex: 1, flexDirection: 'column', padding: 20}}>
                    <DashboardList 
                        iconName={'package'} 
                        iconType={'Feather'} 
                        listName={'Package'}
                    >
                        <DashboardCard
                            name={assigned_label}
                            count={`${deliverCount}/${assignCount}`}
                            unit={'Pack(s)'}
                            onPress={()=>props.navigation.navigate('packageList',{page : 1})}
                        />
                        <DashboardCard
                            style={{backgroundColor: dashboard_red}}
                            name={unassigned_label}
                            count={`${unassignCount}`}
                            unit={'Pack(s)'}
                            onPress={()=>props.navigation.navigate('packageList',{page : 0})}
                        />
                    </DashboardList>
                    <DashboardList 
                        iconName={'dollar-sign'} 
                        iconType={'Feather'} 
                        listName={'Expense'}
                    >
                        <DashboardCard
                            style={{backgroundColor: dashboard_red}}
                            name={'Monthly'}
                            count={`${monthlyTotal}`}
                            unit={'Ks'}
                            onPress={()=>props.navigation.navigate('ExpenseList')}
                        />
                        <DashboardCard
                            style={{backgroundColor: dashboard_red}}
                            name={'Daily'}
                            count={`${dailyTotal}`}
                            unit={'Ks'}
                            onPress={()=>props.navigation.navigate('ExpenseList')}
                        />
                    </DashboardList>
                    <DashboardList 
                        iconName={'md-bicycle'} 
                        iconType={'Ionicons'} 
                        listName={'Courier'}
                    >
                        <DashboardCard
                            style={{backgroundColor: dashboard_green}}
                            name={'Count'}
                            count={`${courierCount}`}
                            unit={''}
                            onPress={()=>props.navigation.navigate('CourierList')}
                        />
                        
                    </DashboardList>
                    <DashboardList 
                        iconName={'car'} 
                        iconType={'FontAwesome5'} 
                        listName={'Fleet'}
                    >
                        <DashboardCard
                            style={{backgroundColor: dashboard_green}}
                            name={'Count'}
                            count={`${fleetCount}`}
                            unit={''}
                            onPress={()=>props.navigation.navigate('FleetList')}
                        />
                        
                    </DashboardList>
                    <DashboardList
                        iconName={'map'} 
                        iconType={'Entypo'} 
                        listName={'Mini Map'}
                    >
                        <MapView 
                            provider={PROVIDER_GOOGLE}
                            style={{width: '100%', height: 200}}
                            region={region}
                            onMapReady={()=>onMapReady()}
                            zoomEnabled = {true}
                        >
                            <Marker
                            coordinate={{
                                latitude: 16.855146,
                                longitude:  96.175649,
                            }}
                            />
                        </MapView>
                    </DashboardList>
                </View>
            </ScrollView>
        </Background>
    )
}

export default Dashboard;