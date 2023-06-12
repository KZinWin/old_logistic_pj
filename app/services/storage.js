import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export async function setToken(value) {
    await AsyncStorage.setItem('access_token', value);
}

export async function getToken() {
    return await AsyncStorage.getItem('access_token');
}

// import { postData } from '../services/fetch';
// var value = await getToken()