import React, { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Image, FlatList, Dimensions, StyleSheet, ActivityIndicator, TextInput } from 'react-native';

const { height, width } = Dimensions.get('screen');
const onePerHeight = parseInt(height / 100);
const onePerWidth = parseInt(width / 100);
//invoices
import { getAllBussiness } from '../functions/getValue';
import { useFocusEffect } from '@react-navigation/native';

export default function AllBusiness({ navigation, route }) {
    useFocusEffect(
        useCallback(() => {
            getAllBussiness().then(allbusiness => {
                setBusinessList(allbusiness);
                setLoading(false)
            }).catch(err => {
                console.log(err)
            })
        }, [])
    );


    const [loading, setLoading] = useState(true);
    const [businesList, setBusinessList] = useState([])
    const [searching, setSearching] = useState(false);
    const [filteredbusinessList, setFilteredbusinessList] = useState([]);
    const search = (e) => {
        if (e != undefined) {
            let temp = []
            businesList.map(item => {
                if (item.name.toLowerCase().includes(e.toLowerCase())) {
                    temp.push(item)
                }
            })
            setFilteredbusinessList(temp)
        }
    }
    //render business list
    const renderbusinessList = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.clientView]} onPress={()=>{navigation.navigate('editbusiness',{item:item})}}>
                <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={[styles.clientimage]} />
                <View>
                    <Text style={[styles.text]}>{item.name}</Text>
                    <Text style={[styles.text]}>{item.phonenumber}</Text>
                </View>
            </TouchableOpacity>
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
                                    <Text style={[styles.headingTop, {}]}>My Business</Text> :
                                    <TextInput style={[styles.input]} placeholder='Search' onChangeText={(e) => { search(e) }} />
                            }
                        </View>
                        <View>
                            {
                                !searching ?
                                    <TouchableOpacity onPress={() => { setSearching(true) }}>
                                        <Image source={require('../assets/images/clients/search.png')} style={styles.icon} />
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => { setSearching(false), setFilteredbusinessList([]) }}>
                                        <Text style={[styles.redText]}>Done</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ flex: 0.8, marginHorizontal: onePerWidth * 10, width: onePerWidth * 100, alignSelf: 'center', }}>
                        <TouchableOpacity style={[styles.button]} onPress={() => { navigation.navigate('mybusiness') }}>
                            <Text style={[styles.buttonText]}>Add Business</Text>
                        </TouchableOpacity>
                        {
                            searching ?
                                <FlatList
                                    data={filteredbusinessList}
                                    keyExtractor={(item, index) => String(item._id)}
                                    renderItem={renderbusinessList}
                                /> :
                                <FlatList
                                    data={businesList}
                                    keyExtractor={(item, index) => String(item._id)}
                                    renderItem={renderbusinessList}
                                />
                        }
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
        marginVertical: onePerHeight * 2, marginHorizontal: onePerWidth * 10, width: onePerWidth * 100, alignSelf: 'center',
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#89CEEF', paddingHorizontal: onePerWidth * 4,
        paddingVertical: onePerHeight * 1, borderRadius: onePerHeight, justifyContent: 'space-between'
    },
    invoiceimage: {
        width: onePerWidth * 15, height: onePerHeight * 6, borderRadius: onePerHeight * 2, marginRight: onePerWidth * 5
    },
    text: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 2, color: '#00000090'
    },
    clientView: {
        marginVertical: onePerHeight * 1, marginHorizontal: onePerWidth * 10, width: onePerWidth * 100, alignSelf: 'center',
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#89CEEF', paddingHorizontal: onePerWidth * 4, paddingVertical: onePerHeight * 2,
        borderRadius: onePerHeight
    },
    clientimage: {
        width: onePerWidth * 15, height: onePerHeight * 6, borderRadius: onePerHeight * 2, marginRight: onePerWidth * 5
    },
    text: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 2, color: '#00000090'
    }
})