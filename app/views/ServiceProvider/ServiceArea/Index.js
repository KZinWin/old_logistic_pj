import React, { useState, useEffect } from "react";
import { View, RefreshControl, TouchableOpacity, Text } from "react-native";
import { NavigationEvents, ScrollView } from "react-navigation";
import { SearchForm } from "../../../components/form";
import { SACard } from "../../../components/card";
import { primary_color, default_font, API_URL, white_color, light_grey_color } from "../../../components/common";
import { getData } from "../../../components/fetch";
import { Icon } from "native-base";
import Background from "../../../components/background";
import { PlusBtn } from '../../../components/button';
import PaginateView from "../../../components/paginatView";

const SAlist = (props) =>{
    const [ refreshing, setRefreshing ] = useState(false)
    const [ salist, setSAlist ] = useState([])
    const [dropdown, setdropId] = useState(0)
    const [ nextPage, setNextPage ] = useState(0)

    useEffect(()=>{
        callmobx()
    },[])

    async function callmobx(){
        setRefreshing(true)
        var response = await getData(`${API_URL}/api/v0.1/service-areas`)
        if(response.ok){
            setSAlist(response.data.data)
            setNextPage(response.data.links.next)
        }
        setRefreshing(false)
    }

    const scrollEnd = (data) =>{
        let arr = salist
        data.data.map(x=>{
            var obj = salist.find(d=>d._id == x._id)
            if(!obj){
                arr.push(x)
            }
        })
        setSAlist(arr)
        setNextPage(data.links.next)
    }   

    return(
        <Background>
        <View style={{flexDirection: 'column', justifyContent: 'center', padding: 10}}>
            <NavigationEvents onDidFocus={()=>callmobx()} />
            {/* <SearchForm/> */}
            <PaginateView
                url={`${API_URL}/api/v0.1/service-areas?page=`}
                next={nextPage}
                scrollEnd={(data)=>scrollEnd(data)}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={()=>callmobx()} />
                }
                // style={{ marginTop: 10}}
            >
               
                {
                    salist.map((list,i)=>(
                        <View key={i}>
                            <TouchableOpacity onPress={()=> dropdown == i+1 ? setdropId(0): setdropId(i+1)} onLongPress={()=>props.navigation.navigate('ServiceAreaEdit', { Id: list._id })} style={{elevation: 10}}>
                                <SACard
                                    from={list.pickUp?list.pickUp.tsp: list.tsp}
                                    fpost={list.pickUp?list.pickUp.post:list.post}
                                    to={list.deli?list.deli.tsp:'-'}
                                    tpost={list.deli?list.deli.post:'-'}
                                    tCol={list.price}
                                />
                            </TouchableOpacity>
                            {
                                dropdown == i+1? 
                                    <View style={{ justifyContent: 'center', padding: 20 , marginTop: 0, margin: 20, backgroundColor: white_color, borderRadius: 5, borderWidth: 1, borderColor: light_grey_color}}>
                                        {
                                            list.packageSizes.map((li, i)=>(
                                                <View style={{flexDirection: 'row'}} key={i}>
                                                    <Text style={{flex: 2, textAlign: 'left', fontFamily: default_font}}>{li.weight}kg({li.width}cm x{li.height}cm)</Text>
                                                    <Text style={{flex: 1, textAlign: 'center', fontFamily: default_font}}>{li.price + list.price}</Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                : <></>
                            }
                        </View>
                    ))
                }
            </PaginateView>
        </View>
        <PlusBtn onPress={() => props.navigation.navigate('ServiceAreaRegister')}/>
    </Background>
    )
}

export default SAlist;