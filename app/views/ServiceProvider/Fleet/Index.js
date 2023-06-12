import React, { useState, useEffect, useCallback } from "React";
import { View, ScrollView, Text,  RefreshControl } from "react-native";
import { FLCard } from "../../../components/card";
import { SearchForm } from "../../../components/form";
import { light_grey_color, primary_color, API_URL,white_color, randomStr  } from "../../../components/common";
import { getData } from "../../../components/fetch";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationEvents } from "react-navigation";
import { HomePageBtn } from "../../../components/button";
import Modal from "react-native-modal";
import Background from "../../../components/background";
import AppStore from "../../../mobx/AppStore";
import { PlusBtn } from '../../../components/button';
import { styles } from "../../../components/styles";
import PaginateView from "../../../components/paginatView";

export default fleetlist = (props) => {
    const [userToken, setUserToken]=useState(AppStore.token)
    const [fList, setFList] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [nextPage,setNextPage] = useState(0)
    const [id, setId] = useState()
    const [refreshing , setRefreshing] = useState(false)
    useEffect(()=>{
        onRefresh()
    },[])
    const onRefresh = () =>{
        setRefreshing(true)
        getData(`${API_URL}/api/v0.1/fleets`)
        .then(response =>{
            setFList(response.data.data)
            setNextPage(response.data.links.next)
        })
        .catch(error => {
            // console.log(error)
        })
        setRefreshing(false)
    }

    const scrollEnd = (data) =>{
        let arr = fList
        data.data.map(x=>{
            var obj = fList.find(fl=>fl._id == x._id)
            if(obj){
            }else{
                arr.push(x)
            }
        })
        setNextPage(data.links.next)
        setFList(JSON.parse(JSON.stringify(arr)))
    }

    return(
        <Background>
        <View style={{flex: 1, flexDirection: 'column',  justifyContent: 'center',alignContent: 'center', padding: 5}}>
            <NavigationEvents onDidFocus={()=>onRefresh()} />
                {/* <SearchForm/> */}
                <View style={{flex: 5,flexDirection :'row'}}>
                    <PaginateView
                        url={`${API_URL}/api/v0.1/fleets?page=`}
                        next={nextPage}
                        scrollEnd={(data)=>scrollEnd(data)}
                        refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={()=>onRefresh()} />
                        }
                    >
                        <View style={styles.flexWrap}>
                            {
                                fList.map((flist,i) => (
                                    <View key={i} style={{width: '50%', padding: 10}}>
                                        <FLCard 
                                            image={{ uri: `${flist.imgs[0].Location}&random=${Math.random().toString(36).substring(7)}`,
                                                    headers: {
                                                        Authorization: `Bearer ${userToken}`
                                                    } }} 
                                            no={flist.name} plate={flist.vPlateNo} type={flist.vType}  year={flist.vYear}
                                            onPress={()=>props.navigation.navigate('FleetEdit', { Id: flist._id })}>
                                            
                                        </FLCard>
                                    </View>
                                ))
                            }
                        </View>
                    </PaginateView>
                </View>
                <PlusBtn onPress={() => props.navigation.navigate('FleetRegister')}/>
        </View>
        </Background>
    )
}