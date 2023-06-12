import React, { useState, useEffect } from 'react'
import { ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { primary_color } from './common';
import { getData } from './fetch';

const PaginateView = (props) =>{
    const [endOfResult, setEndOfResult] = useState(true)
    const [next, setNext] = useState(0)
    const [data, setData] = useState([])

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 10;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    const scrollEnd= async() =>  {
        setEndOfResult(false)
        if(props.next != null){
            var result = await getData(`${props.url}${props.next}`)
            if (result.ok) {
                if(props.scrollEnd){
                    props.scrollEnd(result.data)
                }
            }else{
                setEndOfResult(true)
            }
        }
        setEndOfResult(true)
    }

    return(
        <ScrollView
            style={[{height: '95%'},props.style]}
            onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                    scrollEnd()
                }
            }}
            scrollEventThrottle={400}
            refreshControl={props.refreshControl}
            >
                <View style={{flex:1}}>
                    {props.children}
                </View>
                <View style={{flex:1}}>
                    {
                        endOfResult ?
                            <Text style={[styles.smallText,{textAlign: 'center'}]}>End of Result</Text> : 
                            <View style={{flex:1}}>
                                <Spinner color={primary_color} />
                            </View>
                    }
                </View>
        </ScrollView>
    )
}

export default PaginateView;
