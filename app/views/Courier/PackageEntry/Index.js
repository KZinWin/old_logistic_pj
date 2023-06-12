import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, TouchableOpacity, Button, AppState, RefreshControl } from "react-native";
import { PgList, CommonTags } from "../../../components/card";
import { SearchForm, OriginTextInput, STComponent, RNPicker, DatePickerForm } from "../../../components/form";
import { grey_color, API_URL, light_grey_color, primary_color, white_color, default_font, secondary_color } from "../../../components/common";
import { getData, deleteData } from "../../../components/fetch";
import { NavigationEvents } from "react-navigation";
import { Icon,Picker } from "native-base";
import Background from "../../../components/background";
import Spinner from "react-native-loading-spinner-overlay";
import {styles} from "../../../components/styles";
import CityStore from "../../../mobx/cityStore";
import { toJS } from "mobx";
import AsyncStorage, { useAsyncStorage } from "@react-native-community/async-storage";
import AppStore from "../../../mobx/AppStore";
import { standard_font_size } from "../../../components/font";
import { getDateForInput } from "../../../components/date";
import PaginateView from "../../../components/paginatView";
import { fleet_information_label, fleet_name_label, fleet_numb_label, Tsp_label } from "../../../components/labels and messges";

export default PackageListForCourier = (props) => {
    const [packagelist, setPackageList] = useState([])
    const [delilist, setDeliList] = useState([])
    const [newList, setNewList] = useState([])
    const [visible, setVisible] = useState(false)
    const [IDlist, setID] = useState([])
    const wrapperRef = useRef(null)
    const [current, setCurrent] = useState(false)
    const [tsps, setTsps] = useState([]);
    const [fleet, setFleet] = useState({})
    const [cities, setCities] = useState([]);
    const [choiceData, setChoiceData] = useState({
        city: '',
        tsp: '',
        date : getDateForInput(new Date()),
        // packageIds: props.navigation.getParam('ids')
    })
    const [page, setPage] = useState(0)
    const [userToken, setUsertoken] = useState(AppStore.token)
    const [loading, setLoading] = useState(false)
    const [nextPage, setnextPage] = useState(0)

    useEffect(() => {
        callmobx()
    }, [])

    const callmobx = async () => {
        
        await CityStore.load()
        setCities(toJS(CityStore.cities))
        setPage(0)
        newPackages()
    }

    const newPackages = () =>{
        setLoading(true)
        getData(`${API_URL}/api/v0.1/courier/package-assigns?receiverCity=${choiceData.city}&receiverTsp=${choiceData.tsp}&pickUpDate=${choiceData.date}&status=new`)
        .then(response=>{
            setNewList(response.data.data)
            setLoading(false)
        })
    }

    const FromRef = useRef(null)
    useEffect(()=>{
        if(choiceData.date != ''){
            getData(`${API_URL}/api/v0.1/courier/driver-assigns?date=${choiceData.date}`)
            .then(async (response) => {
                // console.log(response,`${API_URL}/api/v0.1/courier/driver-assigns?date=${choiceData.date}`)
                if(response.ok){
                    setFleet(response.data.fleet)
                }
            })

            getData(`${API_URL}/api/v0.1/courier/package-assigns?receiverCity=${choiceData.city}&receiverTsp=${choiceData.tsp}&pickUpDate=${choiceData.date}&status=${page == 0?'new':page == 1?'picked-up':'delivered' } `)
            .then(response=>{
                // console.log(response,`${API_URL}/api/v0.1/courier/package-assigns?receiverCity=${choiceData.city}&receiverTsp=${choiceData.tsp}&pickUpDate=${choiceData.date}&status=${page == 0?'new':page == 1?'picked-up':'delivered'}`)
                if(response.ok){
                    page == 0 ?
                    setNewList(response.data.data)
                    :
                    page==1?
                        setPackageList(response.data.data)
                        :
                        setDeliList(response.data.data)
                }
            })
        }
    },[choiceData,page])

    const CallmetaLink = (data) =>{
        let arr = newList
        data.data.map(x=>{
            var obj = newList.find(ass=>ass._id == x._id)
            if(!obj){
                arr.push(x)
            }
            
        })
        setnextPage(data.links.next)
        page == 0 ?
        setNewList(arr)
        :
        page==1?
            setPackageList(arr)
            :
            setDeliList(arr)
    }

    // useEffect(()=>{
    //     if(choiceData.date != ''){
    //         getData(`${API_URL}/api/v0.1/courier/package-assigns?receiverCity="${choiceData.city}"&receiverTsp=${choiceData.tsp}&pickUpDate=${choiceData.date}&status=${page == 0?'new':page == 1?'picked-up':'delivered' } `)
    //         .then(response=>{
    //             if(response.ok){
    //                 page == 0 ?
    //                 setNewList(response.data.data)
    //                 :
    //                 page==1?
    //                     setPackageList(response.data.data)
    //                     :
    //                     setDeliList(response.data.data)
    //             }
    //         })
    //     }
    // },[page])

    const cityChange = async (value) =>{
        setChoiceData({
            ...choiceData,
            city: value,
            tsp: ''
        })
    }

    const changeTwsp = async (index) => {
        var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`)
        var townships = []
        response.data.map((township,i) =>{
            townships.push({id: township._id, name: township.name, cityId: township.cityId})
        })
        setTsps(townships)
    }

    const toDetail = (id) =>{
        props.navigation.navigate('PackageEntryDetailForCourier',{id: id})
    }

    const NewList = () =>{
        return(
            <>
            {/* {console.log(newList,'new')} */}
                {
                    newList.length> 0?
                    <View style={{ flex: 5, flexDirection: 'row', paddingTop: 10, justifyContent: 'center' }}>
                        <PaginateView
                            url={`${API_URL}/api/v0.1/courier/package-assigns?receiverCity=${choiceData.city}&receiverTsp=${choiceData.tsp}&pickUpDate=${choiceData.date}&status='new'&page=` }
                            next={nextPage}
                            scrollEnd={(data)=>CallmetaLink(data)}
                            refreshControl={
                                <RefreshControl refreshing={loading} onRefresh={() => packageEntries()} />
                            }
                            
                        >
                            <View style={styles.flexWrap}>
                                {
                                    newList.map((nlist, i) => (
                                        <View key={i} style={{ width: '50%', padding: 10 }}>
                                            <PgList onPress={() => toDetail(nlist._id)} 
                                            image={{ uri: `${nlist.packageEntry.imgs[0].Location}`,
                                             headers: { Authorization: `Bearer ${userToken}` } 
                                        }}
                                            tsp={nlist.packageEntry && nlist.packageEntry.receiverInfo? nlist.packageEntry.receiverInfo.tsp: ''}>
                                            </PgList>
                                        </View>
                                    ))
                                }

                            </View>

                        </PaginateView>
                    </View>
                    :
                    <View style={{ flex: 5, flexDirection: 'row', paddingTop: 10, justifyContent: 'center' }}>
                        <Text style={[styles.FleetLabel,{color: light_grey_color}]}> No Packages To Show </Text>
                    </View>
                }
            </>
        )
    }

    const PickedUpList = () =>{
        return(
            <>
                {/* {console.log(packagelist,'gg')} */}
                {
                    packagelist.length>0?
                    <View style={{ flex: 5, flexDirection: 'row', paddingTop: 10, justifyContent: 'center' }}>
                        <PaginateView
                            url={`${API_URL}/api/v0.1/courier/package-assigns?receiverCity=${choiceData.city}&receiverTsp=${choiceData.tsp}&pickUpDate=${choiceData.date}&status='picked-up'&page=` }
                            next={nextPage}
                            scrollEnd={(data)=>CallmetaLink(data)}
                            refreshControl={
                                <RefreshControl refreshing={loading} onRefresh={() => packageEntries()} />
                            }
                            
                        >
                            <View style={styles.flexWrap}>
                                {
                                    packagelist.map((pklist, i) => (
                                        <View key={i} style={{ width: '50%', padding: 10 }}>
                                            <PgList onPress={() => toDetail(pklist._id)} 
                                            image={{ uri: `${pklist.packageEntry.imgs[0].Location}`, headers: { Authorization: `Bearer ${userToken}` } }}
                                            tsp={pklist.packageEntry && pklist.packageEntry.receiverInfo? pklist.packageEntry.receiverInfo.tsp: ''}>
                                            </PgList>
                                        </View>
                                    ))
                                }

                            </View>

                        </PaginateView>
                    </View>
                    :
                    <View style={{ flex: 5, flexDirection: 'row', paddingTop: 10, justifyContent: 'center' }}>
                        <Text style={[styles.FleetLabel,{color: light_grey_color}]}> No Packages To Show </Text>
                    </View>
                }
            </>
        )
    }

    const DeliveredList = () =>{
        return(
            <>
            {/* {console.log(delilist,'deli')} */}
            {
                delilist.length>0?
                <View style={{ flex: 5, flexDirection: 'row', paddingTop: 10, justifyContent: 'center' }}>
                    <PaginateView
                            url={`${API_URL}/api/v0.1/courier/package-assigns?receiverCity=${choiceData.city}&receiverTsp=${choiceData.tsp}&pickUpDate=${choiceData.date}&status='delivered'&page=` }
                            next={nextPage}
                            scrollEnd={(data)=>CallmetaLink(data)}
                            refreshControl={
                                <RefreshControl refreshing={loading} onRefresh={() => packageEntries()} />
                            }
                            
                        >
                        <View style={styles.flexWrap}>
                            {
                                delilist.map((delilist, i) => (
                                    <View key={i} style={{ width: '50%', padding: 10 }}>

                                        <PgList onPress={() => toDetail(delilist._id)} 
                                         image={{ uri: `${delilist.packageEntry.imgs[0].Location}`, headers: { Authorization: `Bearer ${userToken}` } }}
                                         tsp={delilist.packageEntry && delilist.packageEntry.receiverInfo? delilist.packageEntry.receiverInfo.tsp: ''}>
                                        </PgList>
                                    </View>
                                ))
                            }

                        </View>

                    </PaginateView>
                </View>
                :
                <View style={{ flex: 5, flexDirection: 'row', paddingTop: 10, justifyContent: 'center' }}>
                    <Text style={[styles.FleetLabel,{color: light_grey_color}]}> No Packages To Show </Text>
                </View>
            }
                
            </>
        )
    }

    return (
        <>
            <NavigationEvents onDidFocus={() => callmobx()} />
            <View style={{ flex: 0.3,flexDirection: 'row',padding: 10 }}>
                <DatePickerForm 
                    height={40}
                    value={choiceData.date}
                    onDateChange={(date) => {
                        setChoiceData({
                            ...choiceData,
                            date: date
                        })
                    }}
                />
                <View style={{ flex: 1,paddingRight: 5}}>
                    <STComponent
                        isSelectSingle={true}
                        popupTitle={"State"}
                        title={choiceData.city? choiceData.city:'State'}
                        paddingTop = {0}
                        style={{height: 40}}
                        height={40}
                        value={choiceData.city}
                        preSelectedItem={{ key: 'name', value: choiceData.city }}
                        data={cities}
                        searchPlaceHolderText={"State"}
                        onChangeSelect={data => {   
                            cityChange(`${data.name}`);
                            changeTwsp(data.id);
                            if(data.name == '') {
                                setTsps([])
                            }
                        }}
                    />
                    
                </View>
                <View style={{ flex: 1, paddingRight: 5}}>
                    <STComponent                         
                        paddingTop = {0}
                        style={{height: 40}}
                        isSelectSingle={true}
                        popupTitle={Tsp_label}
                        preSelectedItem={{ key: 'name', value: choiceData.tsp }}
                        title={choiceData.tsp? choiceData.tsp: Tsp_label}
                        data={tsps}
                        searchPlaceHolderText={Tsp_label}
                        onChangeSelect={data => {
                            setChoiceData({
                                ...choiceData,
                                tsp : data.name
                            })
                        }}
                    />
                </View>
            </View>
            <View style={{ flex: 5, flexDirection: 'column', justifyContent: 'center', padding: 2, paddingTop: 2 }}>
                       
                <View style={{ flex: 0.5,flexDriection: 'row',marginBottom: 20,paddingVertical: 10}}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20}}>
                        <Text style={{ borderBottomWidth: 1, borderBottomColor: grey_color,color: grey_color,fontSize: standard_font_size,fontFamily: default_font }}>{fleet_information_label}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10}}>
                        <View style={{ flex: 1}}>
                            <Text style={{  color: grey_color, fontFamily: default_font }}>{fleet_name_label}</Text>
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={{  color: grey_color, fontFamily: default_font }}>{fleet.name ? fleet.name.length > 35 ? `${fleet.name.substring(0,35)}...` :fleet.name : ''}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10}}>
                        <View style={{ flex: 1}}>
                            <Text style={{  color: grey_color, fontFamily: default_font }}>{fleet_numb_label} </Text>
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={{  color: grey_color, fontFamily: default_font }}>{fleet ? fleet.vRegNo: ''}</Text>
                        </View>
                    </View>
                </View>
                <CommonTags TabArr={[
                        {name: 'New',value: 0},
                        {name: 'Picked Up',value: 1},
                        {name: 'Delivered',value: 2}
                    ]}
                    active={page}
                    onPress={(data)=>setPage(data)}
                >
                    <View style={{ flex: 5,justifyContent: 'center' }}>
                            {
                                page == 0 ?
                                    NewList()
                                    :
                                    page == 1?
                                        PickedUpList()
                                        :
                                        DeliveredList()
                            }
                    </View>
                </CommonTags>

            </View>
        </>

    )
}
