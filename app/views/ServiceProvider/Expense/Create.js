import React ,{useState, useEffect} from 'react'
import { View, TouchableOpacity, Text, Dimensions } from 'react-native'
import { STComponent, OriginTextInput, MultilineTextInput, DatePickerForm } from '../../../components/form'
import { HomePageBtn } from '../../../components/button'
import { default_font, grey_color, API_URL, red_color, green_color, primary_color, white_color, light_grey_color } from '../../../components/common'
import { getDateForInput } from '../../../components/date'
import { getData, postData } from '../../../components/fetch'
import { Toast, Icon } from 'native-base'
import { saved, failed, validErrormessage, date_label, 
    category_label, choose_category_label, amount_label, 
    remark_labe, register_label } from '../../../components/labels and messges'
import { xxS, label_font_size, xxxS } from '../../../components/font'
import useValidAPiCall from '../../../components/validCallApi'
import Tags from "react-native-tags";
import { ScrollView } from 'react-native-gesture-handler'

const ExpenseCreate = (props) =>{
    const [choiceData, setData] = useState({
        date: getDateForInput(new Date()),
        title :'',
        amount: ''
    })
    const [labels, setLabels] = useState([])
    const [text, setText] = useState('')
    const [expTypes, setExptypes] = useState([])
    const [ init, setinit] = useState(0)
    const isValid = useValidAPiCall(choiceData, init)

    const Register = async() => {
        choiceData['labels'] = labels
        setinit(init+1)
        if(isValid){
            var response = await postData(`${API_URL}/api/v0.1/expenses`,choiceData)
            if(response.ok){
                Toast.show({
                    text: saved,
                    textStyle: { color: green_color, fontFamily: default_font },
                    duration: 1000
                })
            }else{
                Toast.show({
                    text: response.err,
                    textStyle: { color: red_color, fontFamily: default_font },
                    duration: 1000
                })
            }
            props.navigation.navigate('ExpenseList')
        }else{
            Toast.show({
                text: validErrormessage,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 1000
            })
        }

    }

    useEffect(() => {
   
    async function getexpensetypes () {
        var response = await getData(`${API_URL}/api/v0.1/expense-types/all`)
        var arr = response.data.map((x,i)=>({
            createdAt : x.createdAt,
            name: x.name ,
            updatedAt : x.updatedAt,
            id: x._id,
        }))
        setExptypes(arr)
    }
    getexpensetypes()
    }, [])

    const changeValue=(key,value)=>{
            setData({
                ...choiceData,
                [key]: value
            })
    }
    return(
        <ScrollView>
        <View style={{flex:1 ,flexDirection: 'column', padding: 10,paddingHorizontal: 20}}>
            
            <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>

                <View style={{ flex:1,flexDirection: 'column' }}>
                    <Text style={{ fontSize: xxS, marginVertical: 5, fontFamily: default_font,color: grey_color}}>{date_label}</Text>
                    <DatePickerForm
                        required
                        height={50}
                        // minDate={getDateForInput(new Date())}
                        value={choiceData.date}
                        onDateChange={(date) => {
                            changeValue('date', date)
                        }}
                    />
                </View>
                <View style={{ flex:1,flexDirection: 'column'}}>

                        <STComponent 
                            required
                            height={50}
                            value={choiceData.title}
                            isSelectSingle={true}
                            popupTitle={choose_category_label}
                            label={category_label}
                            title={choiceData.title? choiceData.title:choose_category_label}
                            data={expTypes}
                            searchPlaceholderText={choose_category_label}
                            selectedTitleStyle={{fontSize: 5,textAlign: 'center'}}
                            onChangeSelect={data => {
                                changeValue('title',data.name)
                               
                            }}
                        />  
                </View>

            </View>
                <View>
                    <OriginTextInput 
                    required
                    label={amount_label} 
                    placeholder={amount_label} 
                    value={`${choiceData.amount}`} 
                    type={'number'} 
                    onChangeText={(text) =>
                        changeValue('amount',text)
                    } />
                </View>

                <View style={{flexDirection: 'row'}}>
                    <MultilineTextInput 
                    placeholder={remark_labe} 
                    value={choiceData.rescription} 
                    numberOfLines={10} 
                    onChangeText={(text) => changeValue('description',text)} />
                </View>
                
                <View style={{  marginVertical: 5,flexDirection: 'row' }}>
                    <Text style={{ fontSize: label_font_size, fontFamily: default_font,color: grey_color}}>Labels</Text>
                    <Text style={{ color: red_color, fontSize: xxxS, fontFamily: default_font }}> * use "spacebar" to add a label  </Text>
                </View>
                <View style={{ backgroundColor: light_grey_color, borderWidth: 1, width:'100%', borderRadius: 5, borderColor:light_grey_color, height: 'auto', paddingLeft: 20, marginBottom:15 }}>
                    <Tags
                        textInputProps={{
                        placeholder: "Type Labels"
                        }}
                        initialTags={labels}
                        onChangeTags={tags => setLabels(tags)}
                        createTagOnString={[" "]}
                        onTagPress={(index, tagLabel, event, deleted) =>{
                            // console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                            labels.splice(index),
                            setLabels(labels)
                        }}
                        containerStyle={{ justifyContent: "center" }}
                        inputStyle={{ backgroundColor: light_grey_color }}
                        renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                        <TouchableOpacity key={`${tag}-${index}`} onPress={onPress} style={{ margin: 5,padding: 5, borderRadius: 5,backgroundColor: primary_color}}>
                            <Text style={{color: white_color ,fontFamily: default_font}}>{tag}</Text>
                        </TouchableOpacity>
                        )}
                    />
                </View>

                <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <HomePageBtn width={'100%'} onPress={() => Register()}>{register_label}</HomePageBtn>
                </View>
        </View>
        </ScrollView>
    )
}

export default ExpenseCreate;