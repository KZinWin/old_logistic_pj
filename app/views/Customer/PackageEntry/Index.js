import React , { useState, useEffect, useRef} from "react";
import { View, ScrollView, Text, TouchableOpacity, Switch, AppState, RefreshControl } from "react-native";
import { PgList, CommonTags } from "../../../components/card";
import { SearchForm,OriginTextInput } from "../../../components/form";
import { grey_color, API_URL, light_grey_color, primary_color, white_color, default_font } from "../../../components/common";
import { getData, deleteData } from "../../../components/fetch";
import { NavigationEvents } from "react-navigation";
import { Icon } from "native-base";
import Loading from "../../../components/loading";
import Background from "../../../components/background";
import Spinner from "react-native-loading-spinner-overlay";
import DatePicker from "react-native-datepicker";
import { HomePageBtn, PlusBtn } from '../../../components/button';
import AppStore from "../../../mobx/AppStore";
import { styles } from "../../../components/styles";
import { standard_font_size } from "../../../components/font";
import PaginateView from "../../../components/paginatView";

const PackageListForCustomer = (props) => {
    const [userToken, setUsertoken] = useState(AppStore.token)
    const [packagelist, setPackageList] = useState([])
    const [deliveredPg, setDeliveredPg] = useState([])
    const [loading, setLoading] = useState(false)
    const [fleetlist, setFL] = useState([])
    const [page, setPage] = useState(0)
    const [processingnextPage, setprocessingnextPage] = useState(0)
    const [deliverednextPage, setdeliverednextPage] = useState(0)
        
    useEffect(() => {
        let listener = true
        if(listener){
            packageEntries()
            deliveredpgs()
            // get fleet list
            getData(`${API_URL}/api/v0.1/fleets`)
            .then(response => {
                flist = response.data.data.map((fl, i) => {
                    return { id: fl._id, name: fl.name }
                })
                setFL(flist)
            })
        }
        return()=>{
            listener = false
        }
    }, [])
    
// package list calls
        // not assigned package list call 
        const packageEntries = async() =>{
            setLoading(true)
            var response = await getData(`${API_URL}/api/v0.1/customer/package-entries?status=processing`)
            if(response.ok){
                // console.log(response)
                setPackageList(response.data.data)
                setprocessingnextPage(response.data.links.next)
                setLoading(false)
            }else{
                setPackageList([])
                setLoading(false)
            }
        }
        // delivered packages list call
        const deliveredpgs = async () =>{
            setLoading(true)
            var response = await getData(`${API_URL}/api/v0.1/customer/package-entries?status=delivered`)
            if(response.ok){
                setdeliverednextPage(response.data.links.next)
                setDeliveredPg(response.data.data)
                setLoading(false)
            }else{
                setPackageList([])
                setLoading(false)
            }
        }

// pagniate scroll returns
    const processingScroll = (data) =>{
        let arr = packagelist
        data.data.map(x=>{
            var obj = packagelist.find(ass=>ass._id == x._id)
            if(obj){
            }else{
                arr.push(x)
            }
        })
        // console.log(data,'dd')
        setprocessingnextPage(data.links.next)
        setPackageList(JSON.parse(JSON.stringify(arr)))
    }

    const deliveredScroll = (data) =>{
        let arr = deliveredPg
        data.data.map(x=>{
            var obj = deliveredPg.find(ass=>ass._id == x._id)
            if(obj != 'undefined'){
                arr.push(x)
            }
            
        })
        setdeliverednextPage(data.links.next)
        setDeliveredPg(JSON.parse(JSON.stringify(arr)))
    }

        // look detail for not assigned package
        const toDetail = (index) =>{
            props.navigation.navigate('PackageEntryDetailForCustomer',index)
        }

        // render for processing packages
        const ProcessingPackage = () =>{
            return(
                <PaginateView
                    url={`${API_URL}/api/v0.1/customer/package-entries?status=processing&&page=`}
                    next={processingnextPage}
                    scrollEnd={(data)=>processingScroll(data)}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => packageEntries()} />
                    }
                >
                    <View style={styles.flexWrap}>
                        {
                            packagelist.map((pklist,i) => (
                                <View key={i} style={{ width: '50%', padding: 10 }}> 
                                                                    
                                    <PgList onPress={()=>toDetail({id:pklist._id})} tsp={pklist && pklist.receiverInfo? pklist.receiverInfo.tsp : null}
                                        image={{ uri:pklist.imgs[0].Location, headers: { Authorization: `Bearer ${userToken}` } }}
                                    >
                                    </PgList>
                                </View>
                            ))
                        }
                        
                    </View>
                </PaginateView>
            )
        }

        // render for delivered packages
        const DeliveredPackage = () =>{
            return(
                <PaginateView
                    url={`${API_URL}/api/v0.1/customer/package-entries?status=delivered&&page=`}
                    next={deliverednextPage}
                    scrollEnd={(data)=>deliveredScroll(data)}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => deliveredpgs()} />
                    }
                >
                <View style={styles.flexWrap}>
                    {
                        deliveredPg.map((pklist,i) => (
                            <View key={i} style={{ width: '50%', padding: 10 }}> 
                                <PgList onPress={()=>toDetail({id:pklist._id, page: 'delivered'})} tsp={pklist && pklist.receiverInfo? pklist.receiverInfo.tsp : null}
                                    image={{ uri: `${API_URL}/api/v0.1/files?filename=${pklist.imgs[0].Key}&random=${Math.random().toString(36).substring(7)}`, headers: { Authorization: `Bearer ${userToken}` } }}
                                >
                                </PgList>
                            </View>
                        ))
                    }
                    
                </View>
            </PaginateView> 
            )
        }

        const loadRender = ()=>{
            return(
                <>
                {
                    page == 0?
                    ProcessingPackage()
                    :
                    DeliveredPackage()
                }
                </>
            )
        }
    
    const pageChange = async (pg) =>{
        if (pg == 0) {
            packageEntries()
        } else if(pg == 1) {
            deliveredpgs()
        }
        setPage(pg)
    }

    return(
        <Background>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                <NavigationEvents onDidFocus={()=>packageEntries()} />
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <HomePageBtn width={'40%'} onPress={()=>props.navigation.navigate('Summary',{mode: 'customer'})}>
                        Summary
                    </HomePageBtn>
                </View>
                <View style={{ flex: 1,padding: 10 }}>
                    
                        <CommonTags TabArr={[
                                {name: 'Processing',value: 0},
                                {name: 'Delivered',value: 1}
                            ]}
                            active={page}
                            onPress={(data)=>pageChange(data)}
                        >
                            <View style={{flex:5, width: '100%', justifyContent: 'center'}}>
                                
                                    {
                                        loadRender()
                                    }
                            </View>
                        </CommonTags>
                    
                    <PlusBtn onPress={() => props.navigation.navigate('PackageEntryForCustomer')}/>
                </View>
            </View>
        </Background>

    )
}

export default PackageListForCustomer;