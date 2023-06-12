import React, { useState, useEffect, useRef } from "React";
import { View, ScrollView, TextInput, Text, TouchableOpacity, Linking, RefreshControl } from "react-native";
import { API_URL, grey_color,  default_font, primary_color, white_color } from "../../../components/common";
import { Icon } from "native-base";
import { SearchForm, STComponent, OriginTextInput, DatePickerForm } from "../../../components/form";
import { DLCard, ADcard, CommonTags } from "../../../components/card";
import { getData } from "../../../components/fetch";
import courierStore from "../../../mobx/courierStore";
import { toJS } from "mobx";
import { NavigationEvents } from "react-navigation";
import Background from "../../../components/background";
import DatePicker from "react-native-datepicker";
import AsyncStorage from "@react-native-community/async-storage";
import AppStore from "../../../mobx/AppStore";
import { PlusBtn } from '../../../components/button';
import { standard_font_size } from "../../../components/font";
import { getDateForInput } from "../../../components/date";
import PaginateView from "../../../components/paginatView";
import { assigned_label, unassigned_label } from "../../../components/labels and messges";

const CourierList = (props) => {
    const [page, setPage] = useState(0)
    const [DeliList, setDeliList] = useState([])
    const [Assigned, setAssigned] = useState([])
    const [filter, setFilter] = useState({})
    const [fleetlists, setFleetLists] = useState([])
    const FromRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(AppStore.token)
    const [tsps, setTsps] = useState([]);
    const [choiceData, setData] = useState({
        fleet : '',
        date : ''
    })
    const [nextPage, setNextPage] = useState(0)

    useEffect(() => {
        callmobx()

        setData({
            ...choiceData,
            date: getDateForInput(new Date())
        })
        
    }, [token])

    useEffect(()=>{
        setNextPage('')
    },[page])

    useEffect(()=>{
        if(choiceData.fleet != undefined && choiceData.date != '' ){
            if(page == 0){
                unassignedDeli()
            }else{
                assignedDeli()
            }
        }
    },[choiceData, page])

    const unassignedDeli = () =>{
        getData(`${API_URL}/api/v0.1/deliveries?fleetId=${choiceData.fleet}&date=${choiceData.date}&status=unassigned`)
        .then(response=>{
            setDeliList(response.data.data)
            setNextPage(response.data.links.next)
        })
    }

    const assignedDeli = () =>{
        getData(`${API_URL}/api/v0.1/deliveries?fleetId=${choiceData.fleet}&date=${choiceData.date}&status=assigned`)
        .then(result=>{
            setAssigned(JSON.parse(JSON.stringify(result.data.data)))
            setNextPage(result.data.links.next)

        })
    }

    const callmobx = async () => {
        setLoading(true)
        // getData(`${API_URL}/api/v0.1/deliveries`)
        // .then(response => {
        //     if (response.ok) {
        //         setDeliList(response.data.data)
        //         setNextPage(response.data.links.next)
        //     }else{
        //         setDeliList([])
        //         setNextPage(0)
        //     }
        // })
        
        setData({
            fleet: '',
            date: getDateForInput(new Date())
        })
        
        unassignedDeli()
        assignedDeli()
        
        setLoading(false)
        var fleetRes = await getData(`${API_URL}/api/v0.1/fleets`)
        if (fleetRes.ok) {
            var fleetlist = []
            fleetRes.data.data.map((fl,i)=>{
                fleetlist.push({id: fl._id, name: fl.name})
            })
            setFleetLists(fleetlist)
        }
    }

    const scrollEnd = (data) =>{
        if(page == 0){
            var arr = DeliList
            data.data.map(x=>{
                var obj = DeliList.find(d=>d._id == x._id)
                if(obj){
                }else{
                    arr.push(x)
                }
            })
        setDeliList(arr)
        }else{
            var arr = Assigned
            data.data.map(x=>{
                var obj = Assigned.find(d=>d._id == x._id)
                if(obj){
                }else{
                    arr.push(x)
                }
            })
        setAssigned(arr)
        }
        setNextPage(data.links.next)
    }   

    const UnassignDeli = () => {
        return (
            <>
                {DeliList.length > 0?
                    DeliList.map((delilist, i) => (
                        <TouchableOpacity onPress={() => props.navigation.navigate('CourierEdit', { Id: delilist.id ? delilist.id: delilist._id})} key={i} style={{background: white_color,elevation: 5}}>
                            <DLCard img={
                                {
                                    uri: delilist.avatar ?`${API_URL}/api/v0.1/files?filename=${delilist.avatar.Key}&random=${Math.random().toString(36).substring(7)}` : undefined,
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    },cache: 'reload'
                                }
                            }
                                
                                name={delilist.name} phone={delilist.ph} onPress={() => Linking.openURL(`tel: +959${delilist.ph}`)}></DLCard>
                        </TouchableOpacity>
                    )): <></>
                }
            </>
        )
    }

    const AssignedDeli = () => {
        return (
            <>
                {Assigned.length > 0?
                    Assigned.map((assigned, i) => (
                        <View key={i}>
                            {
                                assigned ?
                                    <TouchableOpacity onPress={() => props.navigation.navigate('CourierAssignEdit', { assignId: assigned.driverAssign.find(x=>x.deliveryId == assigned._id)._id })}>
                                        <DLCard img={{ uri: assigned.delivery && assigned.delivery.avatar ? `${API_URL}/api/v0.1/files?filename=${assigned.delivery.avatar.Key}&random=${Math.random().toString(36).substring(7)}` :
                                            `${API_URL}/api/v0.1/files?filename=${assigned.avatar.Key}&random=${Math.random().toString(36).substring(7)}` ,
                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            },cache: 'reload'
                                        }} 
                                        name={assigned.delivery? assigned.delivery.name: assigned.name} phone={assigned.delivery? assigned.delivery.ph : assigned.ph} onPress={() => Linking.openURL(`tel: +959${assigned.delivery? assigned.delivery.ph: assigned.ph}`)}></DLCard>
                                    </TouchableOpacity>
                                    :
                                    <></>
                            }
                        </View>
                    )): <></>
                }
            </>
        )
    }

    

    return (
        <Background >
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 10 }}>
                <NavigationEvents onDidFocus={() => callmobx()} />
                <View style={{ flex: 0.3,flexDirection: 'row', paddingHorizontal: 5 }}>
                    <View style={{ flex: 1, paddingRight: 5  }}>
                        
                        <DatePickerForm
                            height={43}
                            value={choiceData.date}
                            onDateChange={(date)=>setData({
                                ...choiceData,
                                date: date
                            })}
                        />
                    </View>
                    
                    <View style={{ flex: 1}}>
                        <STComponent 
                            style={{height:43}}
                            value={choiceData.fleet}
                            paddingTop = {0}
                            isSelectSingle={true}
                            popupTitle={"Choose Fleet"}
                            title={"Choose Fleet"}
                            data={fleetlists}
                            searchPlaceholderText={"Choose Fleet"}
                            selectedTitleStyle={{fontSize: 5,textAlign: 'center'}}
                            onChangeSelect={data => {
                                setData({
                                    ...choiceData,
                                    fleet: data.id
                                })
                            }}
                        />  
                    </View>
                </View>
                <CommonTags TabArr={[
                        {name: unassigned_label,value: 0},
                        {name: assigned_label,value: 1},
                    ]}
                    active={page}
                    onPress={(data)=>setPage(data)}
                />
               
                <View style={{ flex: 3,flexDirection: 'row' }}>
                    <PaginateView
                        url={page == 0 ?`${API_URL}/api/v0.1/deliveries?fleetId=${choiceData.fleet}&date=${choiceData.date}&status=unassigned&page=` : 
                        `${API_URL}/api/v0.1/deliveries?fleetId=${choiceData.fleet}&date=${choiceData.date}&status=assigned&page=`}
                        next={nextPage}
                        scrollEnd={(data)=>scrollEnd(data)}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={()=>page==0? unassignedDeli(): assignedDeli()} />
                        }
                    >
                        {
                            DeliList == undefined? 
                            callmobx() 
                            :
                            page == 0 ?
                                UnassignDeli()
                                :
                                AssignedDeli()
                        }
                    </PaginateView>
                </View>
                <PlusBtn onPress={() => props.navigation.navigate('CourierRegister')}/>
            </View>
        </Background>
    )
}

export default CourierList;