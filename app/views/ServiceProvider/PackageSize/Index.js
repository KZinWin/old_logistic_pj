import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity,TextInput, ScrollView, RefreshControl } from "react-native";
import { SearchForm, OriginTextInput, SmallHighTextInput, SearchandAddForm } from "../../../components/form";
import { light_grey_color, default_font, API_URL, grey_color, white_color, red_color, primary_color } from "../../../components/common";
import { HomePageBtn, PlusBtn } from "../../../components/button";
import { postData, getData, deleteData } from "../../../components/fetch";
import { Icon, Toast } from "native-base";
import { genError, height_label, insurance_label, laborFee_label, price_label, weight_label, width_label } from "../../../components/labels and messges";
import { xS, standard_font_size, xxS } from "../../../components/font";
import { NavigationEvents } from "react-navigation";
import { styles } from "../../../components/styles";
import { duration } from "moment";

const PackageSize = (props) =>{
    const [addone, setAddOne] = useState([])
    const [packagelist, setPackageList] = useState([
        {
            _id: "",
            weight: 0,
            width: 0,
            height: 0,
            price: '',
            laborFee: '',
            insurance:'',
            userId: ""
        }
    ])
    const [Package, setPackage] = useState({
        weight: '',
        height: '',
        width: '',
        price: '',
        laborFee: '',
        insurance: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        // getData(`${API_URL}/api/v0.1/package-sizes`)
        // .then(response =>{
        //     setPackageList(JSON.parse(JSON.stringify(response.data.data)))
        // })
        // .catch(error => { console.log(error) })
        listCallback()
    },[])

    const addOne = () =>{
        setAddOne([1])
        this.scrollView.scrollToEnd({ animated: true });
    }

    const onValueChange = (key,value)=>{
        
        setPackage({
            ...Package,
            [key]: value
        })
    }

    const listCallback = async() =>{
        setLoading(true)
        var result = await getData(`${API_URL}/api/v0.1/package-sizes`)
        if(result.ok){
            setPackageList(JSON.parse(JSON.stringify(result.data)))
        }
        setLoading(false)
    }

    const save = async() =>{
        setAddOne([])
        if(Package.weight != '' && Package.height != '' && Package.width != ''){
            if(Package.laborFee == ""){
                Package.laborFee = 0
            }
            if( Package.insurance == ""){
                Package.insurance = 0
            }
            if(Package.price == ""){
                Package.price = 0
            }
            var response = await postData(`${API_URL}/api/v0.1/package-sizes`, Package)
            if(response.ok){
                setPackage({
                    weight: '',
                    height: '',
                    width: '',
                    price: '',
                    laborFee: '',
                    insurance : ''})
                listCallback()
            }
            else{
                Toast.show({
                    text: response.err,
                    textStyle: {color: red_color, fontFamily: default_font},
                    duration: 2500
                })
            }
        }
    }
    
    return(
        <>
        
            <ScrollView
                horizontal={true}
                style={{width: '100%', marginBottom: 20}}
            >
            <NavigationEvents onDidFocus={()=>listCallback()} />
            
            <View style={{margin: 15 , padding: 8, borderColor: light_grey_color, borderWidth: 1}}>
                <View style={{ width: '100%',flexDirection: 'row',borderBottomWidth:0.5, borderBottomColor: light_grey_color, marginBottom: 5}}>
                    <View style={{flex:1,flexDirection: 'row'}}>
                        <View style={styles.tableRowStyle}>
                            <Text style={styles.packageSizeLable}>{weight_label}</Text>
                        </View>
                        <View style={styles.tableRowStyle}>
                            <Text style={styles.packageSizeLable}>{width_label}</Text>
                        </View>
                        <View style={styles.tableRowStyle}>
                            <Text style={styles.packageSizeLable}>{height_label}</Text>
                        </View>
                        <View style={{flexDirection: 'column', height: 40,justifyContent: 'center' , marginHorizontal: 10, alignItems: 'center', width: 70}}>
                            <Text style={styles.packageSizeLable}>{price_label}</Text>
                        </View>
                        <View style={styles.tableRowStyle}>
                            <Text style={styles.packageSizeLable}>{laborFee_label}</Text>
                        </View>
                        <View style={styles.tableRowStyle}>
                            <Text style={styles.packageSizeLable}>{insurance_label}</Text>
                        </View>
                        <View style={styles.tableRowStyle}>
                            <Text style={styles.packageSizeLable}>Action</Text>
                        </View>
                    </View>
                </View>
                <ScrollView style={{marginBottom: 20}}  ref={(view) => {this.scrollView = view}} onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
                    {packagelist.map((pack,i)=>(
                        <View style={{ width: '100%',flexDirection: 'row', justifyContent: 'center'}} key={i}>
                            <View style={{flex:1,flexDirection: 'row', alignContent: 'center', backgroundColor: i % 2 == 0 ? light_grey_color: white_color }}>
                                <View style={styles.tableRowStyle}>
                                    <Text style={styles.packageSizeLable}>{pack.weight}</Text>
                                </View>
                                <View style={styles.tableRowStyle}>
                                    <Text style={styles.packageSizeLable}>{pack.width}</Text>
                                </View>
                                <View style={styles.tableRowStyle}>
                                    <Text style={styles.packageSizeLable}>{pack.height}</Text>
                                </View>
                                <View style={styles.tableRowStyle}>
                                    <Text style={styles.packageSizeLable}>{pack.price}</Text>
                                </View>
                                <View style={styles.tableRowStyle}>
                                    <Text style={styles.packageSizeLable}>{pack.laborFee}</Text>
                                </View>
                                <View style={styles.tableRowStyle}>
                                    <Text style={styles.packageSizeLable}>{pack.insurance}</Text>
                                </View>
                                <TouchableOpacity style={styles.tableRowStyle} onPress={()=>props.navigation.navigate('PackageSizeEdit',{id : pack._id})}>
                                    <Icon name={'edit'} type={'Feather'} style={{color: grey_color, fontSize: standard_font_size}} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    </ScrollView>
                {/* {
                    addone.map((no,i)=>( */}
                        <View style={{ flexDirection: 'row',justifyContent: 'space-between', marginBottom : 20}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{ width: 70,flexDirection: 'column',alignItems: 'center', height: 40, marginHorizontal: 10}}>
                                    <SmallHighTextInput 
                                    // autoFocus={addone.length>0? true: false} 
                                    width={'90%'} value={`${Package.weight}`} type={'number'} onChangeText={(text)=>onValueChange('weight',text)}/>
                                </View>
                                <View style={{ width: 70,flexDirection: 'column',alignItems: 'center', height: 40, marginHorizontal: 10}}>
                                    <SmallHighTextInput width={'90%'} value={`${Package.width}`} type={'number'} onChangeText={(text)=>onValueChange('width',text)}/>
                                </View>
                                <View style={{ width: 70,flexDirection: 'column',alignItems: 'center', height: 40, marginHorizontal: 10}}>
                                    <SmallHighTextInput width={'90%'} value={`${Package.height}`} type={'number'} onChangeText={(text)=>onValueChange('height',text)}/>
                                </View>
                                <View style={{ width: 70,flexDirection: 'column',alignItems: 'center', height: 40, marginHorizontal: 10}}>
                                    <SmallHighTextInput width={'90%'} value={`${Package.price}`} type={'number'} onChangeText={(text)=>onValueChange('price',text)}/>
                                </View>
                                <View style={{ width: 70,flexDirection: 'column',alignItems: 'center', height: 40, marginHorizontal: 10}}>
                                    <SmallHighTextInput width={'90%'} value={`${Package.laborFee}`} type={'number'} onChangeText={(text)=>onValueChange('laborFee', text)}/>
                                </View>
                                <View style={{ width: 70,flexDirection: 'column',alignItems: 'center', height: 40, marginHorizontal: 10}}>
                                    <SmallHighTextInput width={'90%'} value={`${Package.insurance}`} type={'number'} onChangeText={(text)=>onValueChange('insurance', text)}/>
                                </View>
                                <TouchableOpacity style={{ 
                                        width: 70,
                                        flexDirection: 'column', 
                                        height: 40, 
                                        marginHorizontal: 10, 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        borderRadius: 5,
                                        backgroundColor: primary_color
                                    }} onPress={()=>save()}>
                                    <Icon name={'save'} type={'Entypo'} style={{color: white_color, fontSize: xS}} />
                                </TouchableOpacity>
                            </View>
                            {/* <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 20}}>
                                <HomePageBtn onPress={()=>save()}> SAVE </HomePageBtn>
                            </View> */}
                        </View>
                    {/* )) */}
                {/* } */}
            </View>
        </ScrollView>
        {/* <PlusBtn onPress={()=>addone == 1? alert("Not allow to set multiple package size !"):addOne()} style={{bottom: 30}}/> */}

        </>
    )
}

export default PackageSize;