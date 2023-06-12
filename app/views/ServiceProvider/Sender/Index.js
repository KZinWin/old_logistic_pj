import React, { useState, useEffect } from "React";
import { View, ScrollView, Text, RefreshControl, TouchableOpacity } from "react-native";
import { FLCard } from "../../../components/card";
import { SearchForm } from "../../../components/form";
import { white_color, API_URL, grey_color } from "../../../components/common";
import { getData } from "../../../components/fetch";
import { NavigationEvents } from "react-navigation";
import Background from "../../../components/background";
import AppStore from "../../../mobx/AppStore";
import { PlusBtn } from '../../../components/button';
import { styles } from "../../../components/styles";
import PaginateView from "../../../components/paginatView";

export default SenderList = (props) => {
    const [ userToken, setUserToken ] = useState(AppStore.token)
    const [senderList, setsenderList] = useState([])
    const [refreshing, setRefreshing ] = useState(false)
    const [ count , setCount ] = useState(0)
    const [nextPage,setNextPage] = useState(0)

    useEffect(()=>{
        onRefresh()
    },[])

    const onRefresh = async () =>{
        setRefreshing(true)
        setCount(count+1)
        var response = await getData(`${API_URL}/api/v0.1/senders`)
        if(response.ok){
            setsenderList(response.data.data)
            setNextPage(response.data.links.next)
        }else{
            console.log(response)
        }
        setRefreshing(false)
    }

    const scrollEnd = (data) =>{
        let arr = fList
        data.data.map(x=>{
            var obj = fList.find(fl=>fl._id == x._id)
            if(!obj){
                arr.push(x)
            }
        })
        setNextPage(data.links.next)
        setFList(JSON.parse(JSON.stringify(arr)))
    }

    return(
        <Background>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 5}}>
            <NavigationEvents onDidFocus={()=>onRefresh()} />
                {/* <SearchForm /> */}
                <View style={{flex: 5,flexDirection :'row', justifyContent: 'center'}}>
                    <PaginateView
                        url={`${API_URL}/api/v0.1/senders?page=`}
                        next={nextPage}
                        scrollEnd={(data)=>scrollEnd(data)}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={()=>onRefresh()} />
                        }
                    >
                        <View style={styles.flexWrap}>
                            {
                                senderList.map((sender,i)=>(
                                    <View style={{width: '50%', padding: 10}} key={i}>   
                                    {/* {console.log("se",sender)} */}
                                        <FLCard image={{ uri: `${API_URL}/api/v0.1/files?filename=${sender.img.Key}&random=${Math.random().toString(36).substring(7)}`,
                                        headers: {Authorization:  `Bearer ${userToken}`} }}  
                                            no={sender.name} plate={sender.tsp}
                                            onPress={()=>props.navigation.navigate('SenderEdit', { Id: sender._id })}>
                                            {/* <View style={{borderColor: light_grey_color, borderWidth: 0.5}}>
                                                <Text style={{textAlign: 'center', color: primary_color}}>{flist.vRegNo}</Text>
                                            </View> */}
                                        </FLCard>
                                    </View>
                                ))
                            }
                        </View>
                    </PaginateView>
                </View>
                <PlusBtn onPress={() => props.navigation.navigate('SenderRegister')}/>
        </View>
        </Background>

    )
}