import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, TouchableOpacity, Button, AppState, RefreshControl } from "react-native";
import { PgList, CommonTags } from "../../../components/card";
import { SearchForm } from "../../../components/form";
import { grey_color, API_URL, light_grey_color, primary_color, white_color, green_color, default_font, red_color } from "../../../components/common";
import { getData, deleteData, postData } from "../../../components/fetch";
import { NavigationEvents } from "react-navigation";
import { Icon, Toast } from "native-base";
import Loading from "../../../components/loading";
import Background from "../../../components/background";
import Spinner from "react-native-loading-spinner-overlay";
import { FloatDeleteBtn, HomePageBtn, PlusBtn } from '../../../components/button';
import AppStore from "../../../mobx/AppStore";
import UserStore from "../../../mobx/userStore";
import { styles } from "../../../components/styles";
import { standard_font_size, xxS, xxxS } from "../../../components/font";
import PaginateView from "../../../components/paginatView";
import { assigned_label, delivered_label, succDelete, unassigned_label, unassign_label, undeliver_label } from "../../../components/labels and messges";

const PackageList = (props) => {
    const [packagelist, setPackageList] = useState([])
    const [assignpk, setAssignPk] = useState([])
    const [deliveredPackages, setDeliveredPackages] = useState([])
    const [undeliveredPackages, setunDeliveredPackages] = useState([])
    const [visible, setVisible] = useState(false)
    const [unassignedPgnate, setUnassignPgnate] = useState(1)
    const [IDlist, setID] = useState([])
    const wrapperRef = useRef(null)
    const [page, setPage] = useState(0)
    const [nextPage, setnextPage] = useState(0)
    const [assignNext, setassignNext] = useState(0)
    const [deliNext, setdeliNext] = useState(0)
    const [undeliNext, setundeliNext] = useState(0)
    const [loading, setLoading] = useState(false)
    const [userToken, setUserToken] = useState(AppStore.token)
    const [deleteArray, setdeleteArray] = useState([])
    const [multidel, setmultidel] = useState(false)

    // useEffect(() => {
        
        
    // }, [page])

    useEffect(()=>{
        reload()
    },[])

    const reload = async() => {
        if(props.navigation.getParam('page')){
            setPage(props.navigation.getParam('page'))
            packageAssign()
        }else{
            setPage(0)
            packageEntries()
        }
    }

    // not assigned package list call 
    const packageEntries = async () => {
        setLoading(true)
        var response = await getData(`${API_URL}/api/v0.1/package-entries?status=unassigned`)
        if (response.ok) {
            setLoading(false)
            setPackageList(response.data.data)
            setnextPage(response.data.links.next)
        } else {
            setLoading(false)
            setPackageList([])
        }

    }

    // assigned package list call
    const packageAssign = async () => {
        setLoading(true)
        getData(`${API_URL}/api/v0.1/package-entries?status=assigned`)
            .then(response => {
                // console.log(response,'g')
                if (response.ok) {
                    setAssignPk(JSON.parse(JSON.stringify(response.data.data)))
                    setassignNext(response.data.links.next)
                    setLoading(false)
                } else {
                    setAssignPk([])
                    // console.log(response)
                    setLoading(false)
                }
            })
    }

    //delivered package list call
    const deliveredPack = async () => {
        setLoading(true)
        getData(`${API_URL}/api/v0.1/package-entries?status=delivered`)
            .then(response => {
                if (response.ok) {
                    setDeliveredPackages(JSON.parse(JSON.stringify(response.data.data)))
                    setdeliNext(response.data.links.next)
                    setLoading(false)
                } else {
                    setDeliveredPackages([])
                    // console.log(response)
                    setLoading(false)
                }
            })
    }

    // look Edit for not assigned package
    const toDetail = (id) => {
        props.navigation.navigate('PackageDetail', { id: id })
        // props.navigation.navigate('PackageEntryEdit', { id: id })
    }

    const unassignScrollEnd = (data) =>{
        let arr = packagelist
        data.data.map(x=>{
            var obj = packagelist.find(ass=>ass._id == x._id)
            if(!obj){
                arr.push(x)
            }
            
        })
        setnextPage(data.links.next)
        setPackageList(JSON.parse(JSON.stringify(arr)))
    }

    const assignedScrollEnd = (data) =>{
        let arr = assignpk
        data.data.map(x=>{
            var obj = assignpk.find(ass=>ass._id == x._id)
            if(!obj){
                arr.push(x)
            }
        })
        setassignNext(data.links.next)
        setAssignPk(JSON.parse(JSON.stringify(arr)))
    }

    const deliverdScrollEnd = (data) =>{
        let arr = deliveredPackages
        data.data.map(x=>{
            var obj = deliveredPackages.find(ass=>ass._id == x._id)
            if(!obj){
                arr.push(x)
            }
        })
        setdeliNext(data.links.next)
        setDeliveredPackages(JSON.parse(JSON.stringify(arr)))
    }

    // start multi delete process
    const MultiDelete = async(index) =>{
        if (deleteArray.find(x=>x == index)){
            var index = deleteArray.findIndex(item => item == index)
            deleteArray.splice(index,1)
        }else{
            deleteArray.push(index)
        }
        setdeleteArray(JSON.parse(JSON.stringify(deleteArray)))
    }

    useEffect(() => {
        deleteArray.length > 0?
        setmultidel(true)
        :setmultidel(false)
    }, [deleteArray])

    // multi delete api
    const multiDeleteApi = () =>{
        deleteData(`${API_URL}/api/v0.1/package-assigns/many`,deleteArray)
        .then(response=>{
            if(response.ok){
                setdeleteArray([])
                packageAssign()
                Toast.show({
                    text: succDelete,
                    textStyle: {color: green_color, fontFamily: default_font},
                    duration: 3000
                  })
            }else{
                Toast.show({
                    text: response.err,
                    textStyle: {color: red_color, fontFamily: default_font},
                    duration: 3000
                  })
            }
        })
    }
    
    // not assigned packages list render
    const notassignpk = () => {
        return (
                <PaginateView
                    url={`${API_URL}/api/v0.1/package-entries?status=unassigned&&page=`}
                    next={nextPage}
                    scrollEnd={(data)=>unassignScrollEnd(data)}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => packageEntries()} />
                    }
                    
                >
                <View style={styles.flexWrap}>

                    {
                        packagelist.map((pklist, i) => (

                            <View key={i} style={{ width: '50%', padding: 10 }}>
                                <PgList 
                                    onPress={() => toDetail(pklist._id)
                                        // : ()=>props.navigation.navigate('PackageAssign',{ids: [pklist._id]})
                                    }
                                    image={{ uri: pklist.imgs[0].Location, headers: { Authorization: `Bearer ${userToken}` } }}
                                    tsp={pklist.receiverInfo && pklist.receiverInfo.tsp ? pklist.receiverInfo.tsp : null} />
                            </View>
                        ))
                    }
                    </View>
                </PaginateView>

        )
    }

    // assigned packages list render
    const Assignpk = () => {
        return (
            <PaginateView
                url={`${API_URL}/api/v0.1/package-entries?status=assigned&&page=`}
                next={assignNext}
                scrollEnd={(data)=>assignedScrollEnd(data)}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => packageAssign()} />
                }
            >
                <View style={styles.flexWrap}>
                    {
                        assignpk.map((assig, i) => (
                            <View key={i} style={{ width: '50%', padding: 10 }}>
                                {
                                    <PgList onPress={() => multidel?MultiDelete(assig.packageAssign[0]._id) :props.navigation.navigate('PackageDetail', { assignID: assig.packageAssign[0]._id })}
                                        // longPress={()=>MultiDelete(assig.packageAssign[0]._id)}
                                        image={{
                                            uri: `${assig.imgs[0].Location}`,
                                            // &random=${Math.random().toString(36).substring(7)}
                                            headers: {
                                                Authorization: `Bearer ${userToken}`
                                            }
                                        }}
                                        tsp={assig && assig.receiverInfo ? assig.receiverInfo.tsp : null} 
                                        bgColor ={deleteArray.find(x=>x == assig.packageAssign[0]._id)? grey_color: white_color}
                                        />
                                }
                            </View>
                        ))
                    }
                </View>

            </PaginateView>
        )
    }

    // delivered pacakges render
        const deliveredPks = () => {
            return (
                <PaginateView
                    url={`${API_URL}/api/v0.1/package-entries?status=delivered&&page=`}
                    next={deliNext}
                    scrollEnd={(data)=>deliverdScrollEnd(data)}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => deliveredPack()} />
                    }
                >
                    <View style={styles.flexWrap}>
                        {
                            deliveredPackages.map((deli, i) => (
                                <View key={i} style={{  width: '50%', padding: 10 }}>
                                    <PgList onPress={() => props.navigation.navigate('PackageDetail', { assignID: deli.packageAssign[0]._id })}
                                        image={{
                                            uri: `${deli.imgs[0].Location}`,
                                            headers: {
                                                Authorization: `Bearer ${userToken}`
                                            }
                                        }}
                                        tsp={deli && deli.receiverInfo ? deli.receiverInfo.tsp : null} />
                                </View>
                            ))
                        }
                    </View>

                </PaginateView>
            )
        }

    // undelivered pacakges render
        // api call
        const undeliveredPack = async () => {
            setLoading(true)
            getData(`${API_URL}/api/v0.1/package-entries?status=failed`)
                .then(response => {
                    if (response.ok) {
                        setunDeliveredPackages(JSON.parse(JSON.stringify(response.data.data)))
                        setundeliNext(response.data.links.next)
                        setLoading(false)
                    } else {
                        setunDeliveredPackages([])
                        // console.log(response)
                        setLoading(false)
                    }
                })
        }
        // undelivered render
        const undeliverPks = () => {
            return (
                <PaginateView
                    url={`${API_URL}/api/v0.1/package-entries?status=failed&&page=`}
                    next={deliNext}
                    scrollEnd={(data)=>undeliverdScrollEnd(data)}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => undeliveredPack()} />
                    }
                >
                    <View style={styles.flexWrap}>
                        {
                            undeliveredPackages.map((deli, i) => (
                                <View key={i} style={{  width: '50%', padding: 10 }}>
                                    <PgList onPress={() => props.navigation.navigate('PackageDetail', { id: deli._id })}
                                        image={{
                                            uri: `${deli.imgs[0].Location}`,
                                            headers: {
                                                Authorization: `Bearer ${userToken}`
                                            }
                                        }}
                                        tsp={deli && deli.receiverInfo ? deli.receiverInfo.tsp : null} />
                                </View>
                            ))
                        }
                    </View>

                </PaginateView>
            )
        }
        // scroll end 
        const undeliverdScrollEnd = (data) =>{
            let arr = undeliveredPackages
            data.data.map(x=>{
                var obj = undeliveredPackages.find(ass=>ass._id == x._id)
                if(!obj){
                    arr.push(x)
                }
            })
            setundeliNext(data.links.next)
            setunDeliveredPackages(JSON.parse(JSON.stringify(arr)))
        }
    // end process of undelivered packages

    const pageChange = async (pg) =>{
        if (pg == 0) {
            packageEntries()
        } else if(pg == 1) {
            packageAssign()
        } else if(pg == 2){
            deliveredPack()
        } else {
            undeliveredPack()
        }
        setPage(pg)
    }
    return (
        <Background>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 5 }}>
                <NavigationEvents onDidFocus={() => reload()} />
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <HomePageBtn width={'40%'} onPress={()=>props.navigation.navigate('Summary',{mode: 'business'})}>
                        Summary
                    </HomePageBtn>
                </View>
                {/* <SearchForm /> */}
                <CommonTags TabArr={[
                        {name: unassigned_label,value: 0},
                        {name: assigned_label,value: 1},
                        {name: delivered_label,value: 2},
                        {name: undeliver_label,value: 3}
                    ]}
                    active={page}
                    onPress={(data)=>pageChange(data)}
                >
                    <View style={{ flex: 5,justifyContent: 'center' }}>
                        
                            {
                                page == 0 ?
                                    notassignpk()
                                    :
                                    page == 1?
                                        Assignpk()
                                    :
                                        page == 2?
                                            deliveredPks()
                                        : 
                                            undeliverPks()
                            }
                    </View>
                </CommonTags>
                {
                    multidel ? 
                    <FloatDeleteBtn onPress={()=>multiDeleteApi()}/>
                    :
                    <PlusBtn onPress={() => props.navigation.navigate('PackageEntry')}/>
                }
            </View>
        </Background>

    )
}

export default PackageList;