import React ,{ useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { type_one_color, white_color, primary_color, secondary_color,default_font, reg_color, API_URL, grey_color } from "../../components/common";
import { HomePageBtn } from "../../components/button";
import { getData } from "../../components/fetch";
import { Icon } from "native-base";
import { xxL, S } from "../../components/font";
import { App_Name } from "../../components/labels and messges";

const ChooseUser = (props) => {
    const [register, setRegister] = useState('false');
    const [userTypes, setUsTypes] = useState([])
    const [user, setUser] = useState('');

    useEffect(()=>{
        async function getUserType(){
            var response = await getData(`${API_URL}/api/v0.1/business-types/all`)
            if(response.ok){
                setUsTypes(response.data)
            }
            else{
                console.log(response)
            }
        }
        getUserType()
    },[])

    const normalUser = (user) => {
        setUser(user)
        props.navigation.navigate('UserRegister',{userType: user})
    }
        return(
            <View style={{flex: 1, width : '100%', height: '100%',backgroundColor: primary_color}}>
                    <View style={{flex: 0.2, flexDirection: 'row',paddingLeft: 10,paddingTop: 10, justifyContent: 'flex-start', alignItems : 'flex-start'}}>
                        <TouchableOpacity onPress={()=>props.navigation.goBack(null)}>
                            <Icon name={'chevron-small-left'} type={'Entypo'} style={{fontFamily: default_font, fontSize: xxL, color: white_color}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 0.7, flexDirection: 'row', justifyContent: 'center', alignItems : 'center'}}>
                        <Text style={{textAlign: 'center'}}>Logo</Text>
                    </View>
                <View style={{flex: 1, flexDirection: 'row',backgroundColor: white_color, alignContent: 'center', justifyContent: 'center',borderTopLeftRadius:15,borderTopRightRadius: 20, paddingHorizontal: 20}}>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <Text style={{textAlign: 'center' , fontSize:  S,fontWeight: 'bold' }}>{App_Name}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <HomePageBtn 
                                btnBg={white_color}  color={grey_color} borderWidth={0.5} textAlign={ 'left' }
                                onPress={()=> normalUser('USER') }
                            >CUSTOMER</HomePageBtn>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <HomePageBtn 
                            btnBg={ white_color }  color={grey_color} borderWidth={0.5} textAlign={ 'left' }
                            onPress={()=> normalUser('DRIVER') }
                            >DRIVER</HomePageBtn>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <HomePageBtn 
                            btnBg={ white_color }  color={grey_color} borderWidth={0.5} textAlign={ 'left' }
                            onPress={()=> normalUser('BUSINESS') }
                            >SERVICE PROVIDER</HomePageBtn>
                        </View>
                        {/* <View style={{flexDirection: 'row', marginVertical: 15}}>
                            <HomePageBtn 
                            btnBg={ reg_color }
                            onPress={()=>props.navigation.navigate('UserRegister')}
                            >NEXT</HomePageBtn>
                        </View> */}
                    </View>
                </View>
            </View>
        )
}

export default ChooseUser;
