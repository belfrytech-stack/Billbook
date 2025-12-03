import React, { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Image, FlatList, Dimensions, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


const { height, width } = Dimensions.get('screen');
const onePerHeight = parseInt(height / 100);
const onePerWidth = parseInt(width / 100);
//get all clinets 
import { getAllClients } from '../functions/getValue';

export default function Clients({ navigation, route }) {
    useFocusEffect(
        useCallback(() => {
            getAllClients().then(allclients => {
                setClientsList(allclients);
                setLoading(false)
            }).catch(err => {
                console.log(err)
            })
        }, [])
    );

    const [loading, setLoading] = useState(true);
    const [clientsList, setClientsList] = useState([])
    const [searching, setSearching] = useState(false);
    const [filteredClientList, setFilteredClinetsList] = useState([]);
    const search = async (e) => {
        if (e != undefined) {
            setSearching(true);
            let temp = [];
            let x = await clientsList.map(item => {
                if (String(item.name).toLowerCase().includes(e.toLowerCase())) {
                    temp.push(item)
                }
            })
            setFilteredClinetsList(temp)
        }
    }
    //render Clients list
    const renderclientList = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.clientView]} onPress={()=>{navigation.navigate('editclient',{item:item})}} >
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
                                    <Text style={[styles.headingTop, {}]}>My Clinets</Text> :
                                    <TextInput style={[styles.input]} placeholder='Search' onChangeText={(e) => { search(e) }} />
                            }
                        </View>
                        <View>
                            {
                                !searching ?
                                    <TouchableOpacity onPress={() => { setSearching(true) }}>
                                        <Image source={require('../assets/images/clients/search.png')} style={styles.icon} />
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => { setSearching(false), setFilteredClinetsList([]) }}>
                                        <Text style={[styles.redText]}>Done</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ flex: 0.8, marginHorizontal: onePerWidth * 10, width: onePerWidth * 100, alignSelf: 'center', }}>
                        <TouchableOpacity style={[styles.button]} onPress={() => { navigation.navigate('addclient') }}>
                            <Text style={[styles.buttonText]}>Add Client</Text>
                        </TouchableOpacity>
                        <View>
                            {searching ?
                                <FlatList
                                    data={filteredClientList}
                                    keyExtractor={(item, index) => String(item._id)}
                                    renderItem={renderclientList}
                                />
                                :
                                <FlatList
                                    data={clientsList}
                                    keyExtractor={(item, index) => String(item._id)}
                                    renderItem={renderclientList}
                                />
                            }
                        </View>
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
        alignItems: 'center', marginBottom: onePerHeight * 2
    },
    buttonText: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 2.5, color: '#FFFFFF',
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