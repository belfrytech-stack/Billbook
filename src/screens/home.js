import React, { useState, useCallback, useEffect } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Image, Dimensions, StyleSheet, Linking } from 'react-native';
const { height, width } = Dimensions.get('screen');
const onePerHeight = parseFloat(height / 100);
const onePerWidth = parseFloat(width / 100);
import { retrieveValue, getLatest } from '../functions/asyncfunctions';
import { useFocusEffect } from '@react-navigation/native';
import { getAllInvoices } from '../functions/getValue'
export default function Home({ navigation, route }) {

    const link = 'https://apps.apple.com/us/app/billbook-invoice-app-generator/id1608562944';
    const support = () => {
        if (subscribed) {
            Linking.openURL('mailto:admin@eldanapps.com?subject=Support&body=Description here')
        } else {
            navigation.navigate('payment')
        }
    }
    const [subscribed, setSubscribed] = useState(false);
    useFocusEffect(
        useCallback(() => {
            getAllInvoices().then(res => {
                if (res.length == 0) {
                    setSubscribed(true)
                } else {
                    retrieveValue('latestReciept').then(reciept => {
                        let nowDate = new Date();
                        let time = nowDate.getTime();
                        if (reciept !== null && reciept !== undefined) {
                            let remainingTime;
                            if (reciept.productId == 'billbook.249.weekly') {
                                remainingTime = parseInt(reciept.transactionDate) + (7 * 24 * 60 * 60 * 1000)
                            } else if (reciept.productId == 'billbook.899.monthly') {
                                remainingTime = parseInt(reciept.transactionDate) + (30 * 24 * 60 * 60 * 1000)
                            } else {
                                remainingTime = parseInt(reciept.transactionDate) + (363 * 24 * 60 * 60 * 1000)
                            }
                            if (remainingTime > time) {
                                setSubscribed(true)
                            } else {
                                getLatest().then(latest => {
                                    if (latest !== null && latest !== undefined) {
                                        let remainingTime;
                                        if (latest.productId == 'billbook.249.weekly') {
                                            remainingTime = parseInt(latest.transactionDate) + (7 * 24 * 60 * 60 * 1000)
                                        } else if (latest.productId == 'billbook.899.monthly') {
                                            remainingTime = parseInt(latest.transactionDate) + (30 * 24 * 60 * 60 * 1000)
                                        } else {
                                            remainingTime = parseInt(latest.transactionDate) + (363 * 24 * 60 * 60 * 1000)
                                        }
                                        if (remainingTime > time) {
                                            setSubscribed(true)
                                        } else {
                                            setSubscribed(false)
                                        }
                                    } else {
                                        setSubscribed(false)
                                    }
                                })
                            }
                        } else {
                            getLatest().then(latest => {
                                if (latest !== null && latest !== undefined) {
                                    let remainingTime;
                                    if (latest.productId == 'billbook.249.weekly') {
                                        remainingTime = parseInt(latest.transactionDate) + (7 * 24 * 60 * 60 * 1000)
                                    } else if (latest.productId == 'billbook.899.monthly') {
                                        remainingTime = parseInt(latest.transactionDate) + (30 * 24 * 60 * 60 * 1000)
                                    } else {
                                        remainingTime = parseInt(latest.transactionDate) + (363 * 24 * 60 * 60 * 1000)
                                    }
                                    if (remainingTime > time) {
                                        setSubscribed(true)
                                    } else {
                                        setSubscribed(false)
                                    }
                                } else {
                                    setSubscribed(false)
                                }
                            })
                        }
                    })
                }
            }).catch(err =>{
                console.log(err)
            })
        })
    )
    const [loading, setLoading] = useState(false)
    return (
        <View style={[styles.container]}>
            <SafeAreaView style={[styles.container]}>
                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.headingTop}>Features {'&'} More</Text>
                </View>
                <View style={{ flex: 0.5 }}>
                    <TouchableOpacity style={[styles.button]} onPress={() => { subscribed ? navigation.navigate('allbusiness') : navigation.navigate('payment') }}>
                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/images/home/MyBusiness.png')} style={[styles.image]} />
                        </View>
                        <Text style={[styles.buttonTexT]}>My Business</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button]} onPress={() => { subscribed ? navigation.navigate('clients') : navigation.navigate('payment') }}>
                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/images/home/client.png')} style={[{ height: (onePerHeight * 3), width: (onePerHeight * 2.8) }]} />
                        </View>
                        <Text style={[styles.buttonTexT]}>My Clients</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button]} onPress={() => { subscribed ? navigation.navigate('createinvoice') : navigation.navigate('payment') }}>
                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/images/home/CreateInvoice.png')} style={[styles.image]} />
                        </View>
                        <Text style={[styles.buttonTexT]}>Create Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button]} onPress={() => { subscribed ? navigation.navigate('invoice') : navigation.navigate('payment') }}>
                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/images/home/ShareInvoice.png')} style={[styles.image]} />
                        </View>
                        <Text style={[styles.buttonTexT]}>Share Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button]} onPress={() => {
                        Linking.canOpenURL(link).then(supported => {
                            supported && Linking.openURL(link);
                        }, (err) => console.log(err));
                    }}>
                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/images/home/RateUs.png')} style={[styles.image]} />
                        </View>
                        <Text style={[styles.buttonTexT]}>Rate Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button]} onPress={support}>
                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/images/home/Support.png')} style={{ height: (onePerHeight * 2.7), width: (onePerHeight * 3) }} />
                        </View>
                        <Text style={[styles.buttonTexT]}>Support </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.3 }}>
                    <View style={{ flex: 0.5 }}>
                        <Text style={[styles.headingTop, { fontSize: onePerHeight * 1.8, fontFamily: 'DMSans-Medium', alignSelf: 'center' }]}>Upgrade To Premium</Text>
                        <TouchableOpacity style={[styles.redButton]} onPress={() => { navigation.navigate('payment') }} >
                            <Text style={[styles.redButtonText]}>Subscriptions</Text>
                        </TouchableOpacity>
                        <Text style={[styles.headingTop, { fontSize: onePerHeight * 1.8, alignSelf: 'center', color: '#E77632' }]}>Change Subscription Page</Text>
                    </View>
                    <View style={{ flex: 0.5, marginHorizontal: onePerHeight * 5 }}>
                        <Text style={[styles.headingTop, { fontSize: onePerHeight * 1.8, fontWeight: 'bold', marginBottom: onePerHeight * 0.4 }]}>What's in it for you?</Text>
                        <Text style={[styles.headingTop, { fontSize: onePerHeight * 1.6, marginBottom: onePerHeight, color: '#000000' }]}>
                            Easy to create, no registration required for creating
                            the invoices. Create unlimited invoices, store them,
                            edit them based on your business need.</Text>
                        <Text style={[styles.headingTop, { fontSize: onePerHeight * 1.6, marginBottom: onePerHeight, color: '#000000' }]}>
                            Make your invoice more professional and authentic
                            by adding your business logo.
                        </Text>
                        <Text style={[styles.headingTop, { fontSize: onePerHeight * 1.6, color: '#000000' }]}>
                            We provide 24/7 support services, it's ads
                            free invoice.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#FFFFFF'
    },
    headingTop: {
        fontFamily: 'DMSans-Regular', fontSize: (onePerHeight * 2.8), color: '#241153'
    },
    button: {
        backgroundColor: '#241153', marginHorizontal: onePerHeight * 5, paddingVertical: onePerHeight,
        paddingHorizontal: onePerHeight * 3, borderRadius: onePerHeight, flexDirection: 'row',
        justifyContent: 'flex-start', alignItems: 'center', marginVertical: onePerHeight
    },
    image: {
        height: (onePerHeight * 2.5), width: (onePerHeight * 2.5),
    },
    buttonTexT: {
        fontFamily: 'DMSans-Bold', fontSize: onePerHeight * 2.3, color: '#FFFFFF', flex: 0.7
    },
    redButton: {
        backgroundColor: '#FD7624', marginHorizontal: onePerHeight * 5, paddingVertical: onePerHeight,
        paddingHorizontal: onePerHeight * 3, borderRadius: onePerHeight, justifyContent: 'center',
        alignItems: 'center', marginVertical: onePerHeight
    },
    redButtonText: {
        fontFamily: 'DMSans-Bold', fontSize: onePerHeight * 2.5, color: '#FFFFFF',
    }
})

/*
 useFocusEffect(
        useCallback(() => {
            getSubscriptions().then(res => {
                console.log(res)
            })

            return () => RNIap.endConnection();
        }, [])
    );
    try {
            let connection = await RNIap.initConnection();
            while (connection != true) {
                connection = await RNIap.initConnection()
            }
            const purchaseHistory = await RNIap.getPurchaseHistory();
            RNIap.endConnection()
            if (purchaseHistory !== undefined) {
                const lastPurchaseDetails = await purchaseHistory.sort((a, b) => b.transactionDate - a.transactionDate)[0];
                console.log(lastPurchaseDetails)
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

                } else {

                    navigation.navigate('payment')

                }
            } else {
                navigation.navigate('payment')
            }

        } catch (err) {
            console.log(err)
            RNIap.endConnection()
        }
*/