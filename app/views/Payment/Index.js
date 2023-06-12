import React, { useState, useEffect } from "React";
import { View, Text, Image, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import { default_font, primary_color, API_URL, grey_color, green_color } from "../../components/common";
import { SearchForm } from "../../components/form";
import { PLCard } from "../../components/card";
import bankAccStore from "../../mobx/BankAccStore";
import { getData, deleteData } from "../../components/fetch";
import { toJS } from 'mobx';
import { NavigationEvents } from "react-navigation";
import bankStore from "../../mobx/banks";
import Background from "../../components/background";
import { Toast } from "native-base";
import { PlusBtn } from '../../components/button';
import { succDelete } from "../../components/labels and messges";
import PaginateView from "../../components/paginatView";

const PaymentList = (props) => {
    const [ bankList, setbankList ] = useState([])
    const [ refreshing, setRefresh ] = useState(false)
    const [nextPage, setnextPage] = useState(0)

    useEffect(()=>{
        bankAcc()
    },[])

    const bankAcc = async()=>{
        setRefresh(true)
        var response = await getData(`${API_URL}/api/v0.1/bank-accounts`)
        if(response.ok){
            setbankList(JSON.parse(JSON.stringify(response.data.data)))
            setnextPage(response.data.links.next)
        }
        setRefresh(false)
    }

    const del = async (id) =>{
        var response = await deleteData(`${API_URL}/api/v0.1/bank-accounts/${id}`)
        if(response.ok){
            Toast.show({
                text: succDelete,
                textStyle: { color: green_color,fontFamily: default_font },
                duration: 3000
            })
            bankAcc()
        }else{
            console.log(response)
        }

    }
        
    const scrollEnd= async() =>  {
        var list = bankList
        data.data.map((x, i) => {
            var obj = bankList.find(d=>d._id == x._id)
            if(!obj){
                list.push(x)
            }
        })
        setbankList(list)
        setnextPage(data.links.next)

    }

    return(
        <Background>
        <View style={{flexDirection: 'column', justifyContent: 'center', padding: 10}}>
            <NavigationEvents onDidFocus={()=>bankAcc()} />
            {/* <SearchForm/> */}
            <PaginateView
                url={`${API_URL}/api/v0.1/bank-accounts?page=`}
                next={nextPage}
                scrollEnd={(data)=>scrollEnd(data)}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={()=>bankAcc()} />
                }
            >
                {
                    bankList.map((list,i) => (
                        <TouchableOpacity onPress={()=>props.navigation.navigate('BankAccEdit', { Id: list._id })} key={i}>
                            <PLCard 
                            no={list.accNo} bank={list.bank}
                            onPress={()=>del(list._id)}
                            />
                        </TouchableOpacity>
                    ))
                }
            </PaginateView>
        </View>
        <PlusBtn onPress={() => props.navigation.navigate('BankRegister')}/>
        </Background>
    )
}

export default PaymentList;
