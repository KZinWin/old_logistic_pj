import React, { useState, useEffect, useRef, createRef } from "react";
import { View, Text, TouchableOpacity,TextInput } from "react-native";
import { light_grey_color, default_font, API_URL, grey_color, secondary_color, green_color, white_color } from "../../../components/common";
import { postData, getData, deleteData } from "../../../components/fetch";
import {ExpenseCard} from '../../../components/card';
import { PlusBtn } from "../../../components/button";
import { NavigationEvents, ScrollView } from "react-navigation";
import { Toast, Icon } from "native-base";
import { amount_label, date_label, monthly_exp_label, succDelete, type_label, daily_exp_label } from "../../../components/labels and messges";
import { standard_font_size, label_font_size, xxS, xxxS } from "../../../components/font";
import { getDateForInput } from "../../../components/date";
import PaginateView from "../../../components/paginatView";
import { RNPicker, OriginTextInput, SearchForm, DatePickerForm } from "../../../components/form";
// import { Switch } from "react-native-gesture-handler";

const ExpenseList = (props) =>{
    const [expenses, setexpenses] = useState([])
    const [daily , setDaily] = useState(0)
    const [monthly , setMonthly] = useState(0)
    const [ nextPage, setNextPage ] = useState(0)
    const [date, setdate ]= useState(new Date())
    const [Month, setMonth] = useState()
    const [Year, setYear] = useState()
    const [show, setShow] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [ daterm, setdaterm ] = useState(false);
    const [filterState, setFilterState] = useState('')
    const dateRef = useRef(null);
    // const dateFormat = date == '' ? '': getDateForInput(date)

    const getexpense = async () =>{
        getData(`${API_URL}/api/v0.1/expenses?date=${getDateForInput(date)}&q=${searchValue}`)
        .then(response=>{
            // console.log(response,`${API_URL}/api/v0.1/expenses?date=${getDateForInput(date)}&q=${searchValue}`)
            setexpenses(response.data.data)
            setNextPage(response.data.links.next)
        })
        // if(daterm == false){
            var response = await getData(`${API_URL}/api/v0.1/expenses/total?date=${getDateForInput(date)}`)
                setDaily(response.data.total)
                
            getData(`${API_URL}/api/v0.1/expenses/monthly?month=${date.getMonth()+1<10?`0${date.getMonth()+1}`: date.getMonth()+1}&year=${date.getFullYear()}`)
            .then(response=>{
                setMonthly(response.data.total)
            })
        // }
    }
    useEffect(()=>{
        getexpense()
    },[])

    useEffect(() => {
        getexpense()
    }, [date,searchValue])

    // useEffect(()=>{
    //     if(daterm){
    //         setdate('')
    //     }
    // },[daterm])

    const del = async(exp_id) =>{
        var delresponse = await deleteData(`${API_URL}/api/v0.1/expenses/${exp_id}`)
        if(delresponse.ok){
            Toast.show({
                text: succDelete,
                textStyle: { color: green_color, fontFamily: default_font },
                duration: 2000
            })
        }
        getexpense()
    }

    const scrollEnd = (data) =>{
        let arr = expenses
        data.data.map(x=>{
            var obj = expenses.find(d=>d._id == x._id)
            if(obj){
            }else{
                arr.push(x)
            }
        })
        setexpenses(arr)
        setNextPage(data.links.next)
    }

    const filterchange = (param) =>{
        setFilterState(param)
    }

    // const switch_color= {
    //     'false' : light_grey_color,
    //     'true' : grey_color
    // }

    return(
        <View style={{flex:1 ,flexDirection: 'column', padding: 5,paddingHorizontal: 20}}>         
            <NavigationEvents onDidFocus={()=>getexpense()} /> 
            <View style={{flexDirection: 'row' }}> 
                <View style={{flex: 4}}>
                    {
                        filterState == 'search'?
                            <SearchForm value={searchValue} onChangeText={(val)=>setSearchValue(val)} style={{marginTop:0 }}/>
                        :
                            <DatePickerForm
                                androidMode={'spinner'}
                                width={'100%'}
                                height={45}
                                value={getDateForInput(date)}
                                onDateChange={(date) => {
                                    setdate(new Date(date))
                                }}
                            />
                    }
                </View>
                <View style={{flex:1, justifyContent: "space-between", flexDirection: 'row', alignItems: 'flex-start'}}>
                    <TouchableOpacity style={{padding: 10, borderRadius: 20 , backgroundColor: white_color, elevation: 10}} onPress={()=>filterchange('search')}>
                        <Icon name={'search'} type={'Feather'} style={{fontSize: standard_font_size}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding: 10, borderRadius: 20 , backgroundColor: white_color, elevation: 10}} onPress={()=>filterchange('date')}>
                        <Icon name={daterm? 'calendar-times-o':'calendar'} type={'FontAwesome'} style={{ fontSize: standard_font_size}}/>
                    </TouchableOpacity>
                </View>

                {/* <TouchableOpacity onPress={() => dateRef.current.onPressDate()} style={{paddingleft: 5}}>
                    <Text style={{ color: grey_color, textAlign: 'center', fontFamily: default_font, fontSize: xxS}}>{date == '' ? '':getDateForInput(date)}</Text>
                    <DatePicker
                        mode={'date'}
                        showIcon={false}
                        style={{ width: 50, height: 10 }}
                        hideText={true}
                        ref={dateRef}
                        androidMode={'spinner'}
                        onDateChange={(date) => {
                            setdate(new Date(date))
                        }}
                    />
                </TouchableOpacity> */}
                
                {/* <DatePickerForm
                    androidMode={'spinner'}
                    width={'50%'}
                    height={39}
                    value={getDateForInput(date)}
                    onDateChange={(date) => {
                        setdate(new Date(date))
                    }}
                /> */}
            </View>
                
            <View style={{flex:1, flexDirection : 'column', margin: 10, borderBottomWidth: 0.5}}>
                <View style={{flex:1,flexDirection: 'row', margin: 5}}> 
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: xxS}}>{date_label}</Text>
                        {/* <Switch 
                            value={daterm}
                            trackColor={switch_color}
                            thumbColor={white_color}
                            onValueChange={()=>setdaterm(!daterm)}
                        /> */}
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{color: grey_color, textAlign: 'right', fontFamily: default_font, fontSize: xxS}}>{getDateForInput(date)}</Text>
                    </View>
                    {/* <View style={{flex:1}}>
                    </View> */}
                </View>
                <View style={{flex:1,flexDirection: 'row', margin: 5}}> 
                    <View style={{flex:1}}>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: xxS}}>{monthly_exp_label}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{color: grey_color, textAlign: 'right', fontFamily: default_font, fontSize: xxS}}>{monthly} Ks</Text>
                    </View>
                    {/* <View style={{flex:1}}>
                    </View> */}
                </View>
                <View style={{flex:1, flexDirection: 'row', margin: 5}}> 
                    <View style={{flex:1}}>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: xxS}}>{daily_exp_label}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{color: grey_color, textAlign: 'right', fontFamily: default_font, fontSize: xxS}}>{daily} Ks</Text>
                    </View>
                    {/* <View style={{flex:1}}>
                    </View> */}
                </View>
            </View>
            
            <View style={{flex:3}}>
                <View style={{flexDirection: 'row'}}> 
                    <View style={{flex:1}}>
                        <Text style={{color: grey_color, textAlign: 'center', fontFamily: default_font, fontSize: standard_font_size}}>{type_label}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{color: grey_color, textAlign: 'center', fontFamily: default_font, fontSize: standard_font_size}}>{amount_label}</Text>
                    </View>
                    <View style={{flex:1}}>
                    </View>
                </View>
                <PaginateView
                    url={`${API_URL}/api/v0.1/expenses?page=`}
                    next={nextPage}
                    scrollEnd={(data)=>scrollEnd(data)}
                    style={{flex:3.5}}
                >
                    {
                        expenses.map((exp,i)=>(
                            <TouchableOpacity key={i} onPress={()=>props.navigation.navigate('ExpenseEdit',{id: exp._id})} style={{elevation: 10}}>
                                <ExpenseCard 
                                    fCol={exp.title}
                                    sCol={exp.amount}
                                    onPress={()=>del(exp._id)}
                                />
                            </TouchableOpacity>
                        ))
                    }
                   
                </PaginateView>
            </View>
           
            <PlusBtn onPress={() => props.navigation.navigate('ExpenseCreate')}/>

        </View>
    )
}

export default ExpenseList;