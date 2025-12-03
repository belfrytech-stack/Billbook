import React, { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Image, FlatList, Dimensions, StyleSheet, ActivityIndicator, TextInput } from 'react-native';

const { height, width } = Dimensions.get('screen');
const onePerHeight = parseInt(height / 100);
const onePerWidth = parseInt(width / 100);
//invoices
import { getAllInvoices } from '../functions/getValue';
import { useFocusEffect } from '@react-navigation/native';
import { deleteInvoice } from '../functions/saveValue';
export default function Invoices({ navigation, route }) {
    useFocusEffect(
        useCallback(() => {
            getAllInvoices().then(allclients => {
                setInvoiceList(allclients);
                setLoading(false)
            }).catch(err => {
                console.log(err)
            })
        }, [])
    );


    const [loading, setLoading] = useState(true);
    const [invoiceList, setInvoiceList] = useState([])
    const [searching, setSearching] = useState(false);
    const [filteredInvoiceList, setFilteredInvoiceList] = useState([]);
    const search = (e) => {

    }
    const deleteItem = (item) => {
        deleteInvoice(item._id).then(res => {
            getAllInvoices().then(allclients => {
                setInvoiceList(allclients);
                setLoading(false)
            }).catch(err => {
                console.log(err)
            })
        })
    }
    //render Clients list
    const renderInvoiceList = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row', marginVertical: onePerHeight * 2, backgroundColor: '#89CEEF', borderRadius: onePerHeight, }}>
                <TouchableOpacity style={[styles.invoiceView]} onPress={() => { navigation.navigate('viewpdf', { pdf: item }) }}>
                    <View>
                        <Text style={[styles.text, { color: '#fff', }]}>{item.name}</Text>
                        <Text style={[styles.text, { color: '#fff' }]}>{String(new Date(parseInt(item.date))).substring(4, 15)}</Text>
                    </View>
                    <Image source={{ uri: `data:image/jpeg;base64,${item.pdfValue}` }} style={[styles.invoiceimage]} />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: onePerWidth * 15, paddingVertical: onePerHeight * 2, justifyContent: 'center' }} onPress={() => { deleteItem(item) }}>
                    <Image source={require('../assets/images/mybusiness/Delete.png')} style={{ height: onePerHeight * 2.5, width: onePerWidth * 5 }} />
                </TouchableOpacity>
            </View>
        )
    }
    if (loading) {
        return (
            <View style={[styles.container]}>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size='large' color='#241153' />
                </SafeAreaView>
            </View>
        )

    } else {
        return (
            <View style={[styles.container]}>
                <SafeAreaView style={[styles.container]}>
                    <View style={{ flex: 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 5 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <View>
                            {
                                !searching ?
                                    <Text style={[styles.headingTop, {}]}>All Invoices</Text> :
                                    <TextInput style={[styles.input]} placeholder='Search' onChangeText={(e) => { search(e) }} />
                            }
                        </View>
                        <View>
                            {
                                !searching ?
                                    <TouchableOpacity onPress={() => { setSearching(true) }}>
                                        <Image source={require('../assets/images/clients/search.png')} style={styles.icon} />
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => { setSearching(false), setFilteredInvoiceList([]) }}>
                                        <Text style={[styles.redText]}>Done</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ flex: 0.8, marginHorizontal: onePerWidth * 10, width: onePerWidth * 100, alignSelf: 'center', }}>
                        <TouchableOpacity style={[styles.button]} onPress={() => { navigation.navigate('createinvoice') }}>
                            <Text style={[styles.buttonText]}>Create Invoice</Text>
                        </TouchableOpacity>
                        <FlatList
                            data={invoiceList}
                            keyExtractor={(item, index) => String(item._id)}
                            renderItem={renderInvoiceList}
                        />
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#FFFFFF'
    },
    arrowIcon: {
        height: onePerHeight * 2.8, width: onePerHeight * 2
    },
    headingTop: {
        fontFamily: 'DMSans-Bold', fontSize: (onePerHeight * 3), color: '#241153', fontWeight: 'bold'
    },
    icon: {
        height: onePerHeight * 2.8, width: onePerHeight * 2.8
    },
    input: {
        backgroundColor: '#F3F3F3', borderRadius: onePerHeight * 0.8, paddingVertical: onePerHeight * 0.6, paddingHorizontal: onePerWidth * 5,
        fontSize: onePerHeight * 2, fontFamily: 'DMSans-Regular', letterSpacing: onePerWidth * 0.2, color: '#D1D1D1',
        width: onePerHeight * 30
    },
    redText: {
        fontFamily: 'DMSans-Regular', fontSize: onePerHeight * 2.5, color: '#F3B582', fontWeight: '900', letterSpacing: -0.4
    },
    button: {
        backgroundColor: '#2E186A', paddingVertical: onePerHeight, borderRadius: onePerHeight, justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 2.5, color: '#FFFFFF',
    },
    invoiceView: {
        marginHorizontal: onePerWidth * 2, width: onePerWidth * 80,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: onePerWidth * 4,
        paddingVertical: onePerHeight * 1, justifyContent: 'space-between'
    },
    invoiceimage: {
        width: onePerWidth * 15, height: onePerHeight * 6, borderRadius: onePerHeight * 2, marginRight: onePerWidth * 5
    },
    text: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 2, color: '#00000090'
    }
})