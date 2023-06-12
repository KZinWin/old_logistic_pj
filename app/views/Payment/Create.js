import React, { useState ,useEffect } from "React";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { OriginTextInput, RNPicker, STComponent } from "../../components/form";
import { Picker, Icon, CheckBox, Toast } from "native-base";
import { light_grey_color, primary_color, white_color, default_font, grey_color, API_URL, red_color } from "../../components/common";
import { HomePageBtn } from "../../components/button";
import { postData } from "../../components/fetch";
import bankAccStore from "../../mobx/BankAccStore";
import bankStore from "../../mobx/banks";
import {styles} from "../../components/styles";
import { toJS } from 'mobx'
import { acc_num_label, register_label, select_bank_label } from "../../components/labels and messges";

const BankAccReg = (props) => {
    const [banklist, setbanklist] = useState([])
    const [ BAcc, setBAcc] = useState({
        bank:'',
        accNo: ''
    })
    const [enable, textBoxEnable] = useState(true)

    
    // const addmoreAcc = () =>{
    //     const values = [...BAccCounter];
    //     values.push({ value: null });
    //     setBAccCounter(values);
    // }

    useEffect(()=>{
        setbanklist(toJS(bankStore.banks))
    },[])

    const Register = () =>{
        if(BAcc.accNo == '' || BAcc.bank == ''){
            props.navigation.navigate("PaymentList")
        }else{
            postData(`${API_URL}/api/v0.1/bank-accounts`,BAcc)
            .then(response => {
                if(response.ok){
                    bankAccStore.load();
                    props.navigation.navigate('PaymentList')
    
                }
            })
            .catch(error => { console.log(error)})
        }
    }

    // bank customize number box without use parseInt
    const bankCustomizeNumberBox = async(text) => {
        var value = text.replace( /^\D+/g, '')
        setBAcc({ ...BAcc , accNo: value})
    }

    return (
        <View style={{flexDirection: 'column', justifyContent: 'center', padding: 20}}>
            <ScrollView>
                <View>
                    <Text style={styles.FleetLabel}>{select_bank_label}</Text>
                    <STComponent
                        isSelectSingle={true}
                        popupTitle={select_bank_label}
                        title={BAcc.bank? BAcc.bank: select_bank_label}
                        value={BAcc.bank}
                        preSelectedItem={{ key: 'name', value: BAcc.bank }}
                        data={banklist}
                        searchPlaceHolderText={select_bank_label}
                        onChangeSelect={data => {
                            setBAcc({
                                ...BAcc,
                                bank: data.name
                            })
                        }}
                    />
                    <OriginTextInput editable={enable} label={acc_num_label} keyboardType={'number-pad'} value={BAcc.accNo} onChangeText={(text)=>bankCustomizeNumberBox(text)} /> 
                </View>
                
                <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 20}}>
                    <HomePageBtn onPress={()=>Register()}>{register_label}</HomePageBtn>
                </View>
            </ScrollView>
        </View>
    )
}

export default BankAccReg;