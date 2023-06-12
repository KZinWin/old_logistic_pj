import React ,{useState, useEffect} from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { STComponent, OriginTextInput, MultilineTextInput, DatePickerForm } from '../../../components/form'
import { HomePageBtn } from '../../../components/button'
import { default_font, grey_color, API_URL, red_color, green_color, light_grey_color, primary_color, white_color } from '../../../components/common'
import { getDateForInput } from '../../../components/date'
import { getData, postData, putData, deleteData } from '../../../components/fetch'
import { Toast } from 'native-base'
import { saved, failed, succDelete, date_label, 
    remark_labe, delete_label, category_label, 
    choose_category_label, amount_label, update_label } from '../../../components/labels and messges'
import { xxS, label_font_size, xxxS } from '../../../components/font'
import { ScrollView } from 'react-native-gesture-handler'
import Tags from 'react-native-tags'

const ExpenseEdit = (props) =>{
    const [exp_id, setexp_id] = useState(props.navigation.getParam('id'))
    const [choiceData, setData] = useState({
        amount: 0
    })
    const [expTypes, setExptypes] = useState([])

    const Register = async() => {
        var response = await putData(`${API_URL}/api/v0.1/expenses/${exp_id}`,choiceData)
        if(response.ok){
            Toast.show({
                text: saved,
                textStyle: { color: green_color, fontFamily: default_font },
                duration: 1000
            })
        }else{
            Toast.show({
                text: failed,
                textStyle: { color: red_color, fontFamily: default_font },
                duration: 1000
            })
        }
        props.navigation.navigate('ExpenseList')

    }

    const del = async() =>{
        var delresponse = await deleteData(`${API_URL}/api/v0.1/expenses/${exp_id}`)
        if(delresponse.ok){
            Toast.show({
                text: succDelete,
                textStyle: { color: green_color, fontFamily: default_font },
                duration: 1000
            })
        }
        props.navigation.navigate('ExpenseList')

    }
    
    async function getexpense () {

        var expresponse = await getData(`${API_URL}/api/v0.1/expenses/${exp_id}`)
        if(expresponse.ok){
            // console.log(expresponse)
            setData(expresponse.data)
        }
        var response = await getData(`${API_URL}/api/v0.1/expense-types/all`)
        var arr = response.data.map((x,i)=>({
            createdAt : x.createdAt,
            name: x.name ,
            updatedAt : x.updatedAt,
            id: x._id,
        }))
        setExptypes(arr)
    }

    useEffect(() => {
        getexpense()
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
                                preSelectedItem={{key: 'name' , value: choiceData.title}}
                                data={expTypes}
                                searchPlaceholderText={choose_category_label}
                                selectedTitleStyle={{fontSize: 5,textAlign: 'center'}}
                                onSelect={data => {
                                    if(data.length> 0){
                                        obj= expTypes.find(x=>x.id == data[0])
                                        changeValue('title', obj.name)
                                    }
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
                    value={choiceData.description} 
                    numberOfLines={10} 
                    onChangeText={(text) => changeValue('description',text)} />
                </View>
                
                <View style={{  marginVertical: 5,flexDirection: 'row' }}>
                    <Text style={{ fontSize: label_font_size, fontFamily: default_font,color: grey_color}}>Labels</Text>
                    <Text style={{ color: red_color, fontSize: xxxS, fontFamily: default_font }}> * use " spacebar " to add a label  </Text>
                </View>
                <View style={{ backgroundColor: light_grey_color, borderWidth: 1, width:'100%', borderRadius: 5, borderColor:light_grey_color, height: 'auto', paddingLeft: 20, marginBottom:15 }}>
                    <Tags
                        textInputProps={{
                        placeholder: "Type Labels"
                        }}
                        initialTags={choiceData.labels}
                        createTagOnString={[" "]}
                        onChangeTags={tags => {setData({...choiceData, labels: tags})}}
                        onTagPress={(index, tagLabel, event, deleted) =>{
                            // console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                            var labels = choiceData
                            labels.labels.splice(index,1),
                            setData(labels)
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

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginVertical: 20 }}>
                    <HomePageBtn width={'45%'} onPress={() => Register()}>{update_label}</HomePageBtn>
                    <HomePageBtn width={'45%'} btnBg={red_color} onPress={() => del()}>{delete_label}</HomePageBtn>
                </View>
            </View>
        </ScrollView>
    )
}

export default ExpenseEdit;