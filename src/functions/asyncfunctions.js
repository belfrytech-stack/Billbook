import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNIap from 'react-native-iap';

//store reciept
export const storeValue = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue);
        return
    } catch (e) {
        console.log(e,'store')
    }
}
//retrieve recipet
export const retrieveValue = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e,'retrieve')
    }
}

//check for pendign reciept 
export const getLatest = async () => {
    try {
        let connection = await RNIap.initConnection();
        while (connection != true) {
            connection = await RNIap.initConnection()
        }
        const purchaseHistory = await RNIap.getPurchaseHistory();
        RNIap.endConnection();
        if (purchaseHistory !== undefined && purchaseHistory !== null && purchaseHistory.length > 0) {
            const lastPurchaseDetails = await purchaseHistory.sort((a, b) => b.transactionDate - a.transactionDate)[0];
            let time = 0;
            let date = new Date();
            let nowTime = date.getTime();
            if (lastPurchaseDetails.productId === 'billbook.249.weekly') {
                time = parseInt(lastPurchaseDetails.transactionDate) + (7 * 24 * 60 * 60 * 1000)
            } else if (lastPurchaseDetails.productId === 'billbook.899.monthly') {
                time = parseInt(lastPurchaseDetails.transactionDate) + (30 * 24 * 60 * 60 * 1000)
            } else {
                time = parseInt(lastPurchaseDetails.transactionDate) + (363 * 24 * 60 * 60 * 1000)
            }
            if (nowTime < time) {
                return lastPurchaseDetails
            } else {
                return null
            }
        } else {
            return null
        }

    } catch (err) {
        console.log(err)
        RNIap.endConnection()
    }
}