import React, { useState, useCallback, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, Platform,Linking } from 'react-native';
const { height, width } = Dimensions.get('screen');
const onePerHeight = parseFloat(height / 100);
const onePerWidth = parseFloat(width / 100);
import * as RNIap from 'react-native-iap';
import { useFocusEffect } from '@react-navigation/native';

import { storeValue, retrieveValue } from '../functions/asyncfunctions';

export default function Payment({ navigation, route }) {
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(2);
    const [isSubscribed, setSubscribed] = useState(false);

    const productid = ['billbook.249.weekly', 'billbook.899.monthly', 'billbook.2799.yearly']

    useFocusEffect(
        useCallback(() => {
            RNIap.initConnection().then(async (res) => {
                await RNIap.getProducts(productid).then(async (products) => {
                    retrieveValue('latestReciept').then(reciept => {
                        if (reciept !== null && reciept !== undefined) {
                            if (reciept.productId === 'billbook.249.weekly') {
                                setSelected(0)
                            } else if (reciept.productId === 'billbook.899.monthly') {
                                setSelected(1)
                            } else {
                                setSelected(2)
                            }
                            setLoading(false)
                        } else {
                            setLoading(false)
                        }
                    }).catch(err => {
                        setLoading(false)
                    })
                }).catch(Err => {
                    setLoading(false)
                    console.log(Err)
                })
                setLoading(false)
            })
            return () => RNIap.endConnection();
        }, [])
    );

    //subscribe
    const subscribe = async () => {
        if (selected == undefined) {
            alert('Please select an offer')
        } else {
            console.log(selected)
            let offer;
            if (selected == 0) {
                offer = 'Weekly subscription'
            } else if (selected == 1) {
                offer = 'Monthly subscription'
            } else {
                offer = 'Yearly subscription'
            }
            await RNIap.requestSubscription(productid[selected]).then(res => {
                setLoading(true);
                storeValue('latestReciept', res).then(async(stored) => {
                    setLoading(false)
                    let notifyAdmin = await fetch('https://billbooknotificationadmin.herokuapp.com/', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ offer })
                    }).then(res => {
                        alert('Subscribed')
                    })
                }).catch(err => {
                    setLoading(false)
                    console.log(err)
                })
            }).catch(err => {
                setLoading(false)
                alert('Error Please try again')
                console.log(err)
            })
        }
    }
    //restore purchase
    const restorePurchase = async () => {
        const purchaseHistory = await RNIap.getPurchaseHistory()
        if (purchaseHistory !== undefined && purchaseHistory !== null && purchaseHistory.length > 0) {
            setLoading(true);
            const lastPurchaseDetails = await purchaseHistory.sort((a, b) => b.transactionDate - a.transactionDate)[0];
            storeValue('latestReciept', lastPurchaseDetails).then(res => {
                setLoading(false)
                alert('Purchase restored')
            })
        } else {
            setLoading(false)
            alert('No subscription found')
        }
    }
    if (loading) {
        return (
            <View style={[styles.container]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' color='blue' />
                </View>
            </View>
        )
    } else {
        return (
            <View style={[styles.container]}>
                <SafeAreaView style={[styles.container, { marginHorizontal: onePerWidth * 4 }]}>
                    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                        <Text></Text>
                        <Text style={[styles.heading]}>Upgrade To Premium</Text>
                        <TouchableOpacity style={{}} onPress={() => { navigation.goBack() }}>
                            <Image source={require('../assets/images/paymnet/Cancel.png')} style={{ height: onePerHeight * 2.5, width: onePerWidth * 6, }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: onePerHeight * 3 }}>
                        <Image source={require('../assets/images/paymnet/payment.png')} style={{ width: onePerWidth * 50, height: onePerHeight * 14, alignSelf: 'center' }} />
                        <Text style={[styles.greyText, { textAlign: 'center', marginTop: onePerHeight }]}>Choose a plan that works best for you!</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: onePerHeight * 5 }}>
                        <View style={[styles.subscriptionBox]}>
                            {
                                selected != undefined && selected == 1 ?
                                    <View style={[styles.planbox]}>
                                        <View style={[styles.topBar, { backgroundColor: '#FE7524' }]}>
                                            <Text style={[styles.topBarText]}>Save 20%</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.planContainer, { backgroundColor: '#FE7524' }]} onPress={() => { setSelected() }}>
                                            <Text style={[styles.amountText, { color: '#fff' }]}>$8.99</Text>
                                            <Text style={[styles.timeText, { color: '#fff' }]}>Month</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={[styles.planbox]}>
                                        <View style={[styles.topBar]}>
                                            <Text style={[styles.topBarText]}>Save 20%</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.planContainer]} onPress={() => { setSelected(1) }}>
                                            <Text style={[styles.amountText]}>$8.99</Text>
                                            <Text style={[styles.timeText]}>Month</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                        <View style={[styles.subscriptionBox]}>
                            {
                                selected != undefined && selected == 2 ?
                                    <View style={[styles.planbox]}>
                                        <View style={[styles.topBar, { backgroundColor: '#FE7524' }]}>
                                            <Text style={[styles.topBarText]}>Save 79%</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.planContainer, { backgroundColor: '#FE7524' }]} onPress={() => { setSelected() }}>
                                            <Text style={[styles.amountText, { color: '#fff' }]}>$27.99</Text>
                                            <Text style={[styles.timeText, { color: '#fff' }]}>Yearly</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={[styles.planbox]}>
                                        <View style={[styles.topBar]}>
                                            <Text style={[styles.topBarText]}>Save 79%</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.planContainer]} onPress={() => { setSelected(2) }}>
                                            <Text style={[styles.amountText]}>$27.99</Text>
                                            <Text style={[styles.timeText]}>Yearly</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                        <View style={[styles.subscriptionBox]}>
                            {
                                selected != undefined && selected == 0 ?
                                    <View style={[styles.planbox]}>
                                        <View style={[styles.topBar, { backgroundColor: '#FE7524' }]}>
                                            <Text style={[styles.topBarText]}>Lowest Price</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.planContainer, { backgroundColor: '#FE7524' }]} onPress={() => { setSelected() }}>
                                            <Text style={[styles.amountText, { color: '#fff' }]}>$2.49</Text>
                                            <Text style={[styles.timeText, { color: '#fff' }]}>Weekly</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={[styles.planbox]}>
                                        <View style={[styles.topBar]}>
                                            <Text style={[styles.topBarText]}>Lowest Price</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.planContainer]} onPress={() => { setSelected(0) }}>
                                            <Text style={[styles.amountText]}>$2.49</Text>
                                            <Text style={[styles.timeText]}>Weekly</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                    </View>
                    <View style={[{ marginTop: onePerHeight * 3 }]}>
                        <TouchableOpacity style={[styles.button]} onPress={subscribe}>
                            <Text style={[styles.buttonText]}>{isSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'flex-start', marginTop: onePerHeight * 3, marginLeft: onePerWidth * 3 }}>
                        <View style={[styles.feature]}>
                            <Image source={require('../assets/images/paymnet/infinity.png')} style={[styles.featureImage]} />
                            <Text style={[styles.greyText]}>Send Unlimited Invoices</Text>
                        </View>
                        <View style={[styles.feature]}>
                            <Image source={require('../assets/images/paymnet/signature.png')} style={[styles.featureImage]} />
                            <Text style={[styles.greyText]}>Add Signature To Invoice</Text>
                        </View>
                        <View style={[styles.feature]}>
                            <Image source={require('../assets/images/paymnet/logo.png')} style={[styles.featureImage]} />
                            <Text style={[styles.greyText]}>Add Business Logo</Text>
                        </View>
                        <View style={[styles.feature]}>
                            <Image source={require('../assets/images/paymnet/template.png')} style={[styles.featureImage]} />
                            <Text style={[styles.greyText]}>Unlimited Invoice Templates</Text>
                        </View>
                        <View style={[styles.feature]}>
                            <Image source={require('../assets/images/paymnet/support.png')} style={[styles.featureImage]} />
                            <Text style={[styles.greyText]}>24/7 Customer Support</Text>
                        </View>
                        <View style={[styles.feature]}>
                            <Image source={require('../assets/images/paymnet/dollar.png')} style={[styles.featureImage]} />
                            <Text style={[styles.greyText]}>Your Payment is 100% Tax-deductible</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', marginTop: onePerHeight * 2, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={()=>{Linking.openURL('https://sites.google.com/view/billbook-invoice-app-pp')}}>
                            <Text style={[styles.redText]}>Privacy Policy</Text>
                        </TouchableOpacity>
                        <Text style={[styles.redText, { marginHorizontal: onePerWidth * 2 }]}>|</Text>
                        <TouchableOpacity onPress={()=>{Linking.openURL('https://sites.google.com/view/billbook-invoice-app-tc')}}>
                            <Text style={[styles.redText]}>Terms of use</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', marginTop: onePerHeight * 0.1, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={restorePurchase}>
                            <Text style={[styles.redText, { fontSize: onePerHeight * 2 }]}>Restore Purchase</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff'
    },
    heading: {
        fontSize: onePerHeight * 2.5, color: '#443179', fontWeight: '800', fontFamily: 'DMSans-bold',
    },
    greyText: {
        fontSize: onePerHeight * 1.8, fontWeight: '600', color: '#5F6B68', fontFamily: 'DMSans-Medium',
    },
    planbox: {
        alignItems: 'center', width: onePerWidth * 30
    },
    topBar: {
        backgroundColor: '#2E186A', paddingHorizontal: onePerWidth, paddingVertical: onePerHeight * 0.8, borderTopEndRadius: onePerHeight, borderTopStartRadius: onePerHeight,
        width: onePerWidth * 28, justifyContent: 'center', alignItems: 'center', marginBottom: onePerHeight * 0.7
    },
    topBarText: {
        fontSize: onePerHeight * 1.6, fontWeight: '400', color: '#fff', fontFamily: 'DMSans-Regular',
    },
    planContainer: {
        borderWidth: 1, width: onePerWidth * 28, justifyContent: 'center', alignItems: 'center', borderColor: '#FE7624', backgroundColor: '#fff', paddingVertical: onePerHeight * 3.5, borderRadius: onePerHeight
    },
    amountText: {
        fontSize: onePerHeight * 2.8, fontWeight: '800', color: '#101010', fontFamily: 'DMSans-Medium', textAlign: 'center', letterSpacing: onePerWidth / 6, marginBottom: onePerHeight * 0.2
    },
    timeText: {
        fontSize: onePerHeight * 1.4, fontWeight: '700', color: '#101010', fontFamily: 'DMSans-Medium', textAlign: 'center'
    },
    button: {
        backgroundColor: '#2E186A', width: onePerWidth * 88.5, alignSelf: 'center', paddingVertical: onePerHeight * 1.2, borderRadius: onePerHeight, justifyContent: 'center', alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'DMSans-Medium', color: '#fff', fontSize: onePerHeight * 2.5, fontWeight: 'bold'
    },
    feature: {
        flexDirection: 'row', alignItems: 'center', marginBottom: onePerHeight * 0.3
    },
    featureImage: {
        width: onePerWidth * 8, height: onePerHeight * 4, marginRight: onePerWidth * 2
    },
    redText: {
        fontFamily: 'DMSans-Medium', color: '#FE7524', fontSize: onePerHeight * 1.8, fontWeight: '600'
    }


})