import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, Image, Dimensions, SafeAreaView, StyleSheet, ActivityIndicator, TextInput,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';

const { height, width } = Dimensions.get('screen');
const onePerHeight = parseFloat(height / 100);
const onePerWidth = parseFloat(width / 100);

//3rd party library

import { launchImageLibrary } from 'react-native-image-picker';

//Real me 
import Realm from "realm";
//write a new business
import { writeBusiness } from '../functions/saveValue';
//get a new business
import { getAllBussiness } from '../functions/getValue';

export default function MyBusiness({ navigation, route }) {
    useEffect(() => {
        getAllBussiness().then(res => {
            setAllBussines(res);
            setLoading(false)
        }).catch(err => {
            console.log(err)
        })

    }, [])
    const [image, setImage] = useState();
    const [name, setName] = useState();
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();
    const [number, setNumber] = useState();
    const [email, setEmail] = useState();
    const [additionalNotes, setAdditionalNotes] = useState();
    const [loading, setLoading] = useState(true);
    const [allbusiness, setAllBussines] = useState([])
    //pick an image
    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({ mediaType: 'photo', includeBase64: true });
            setImage(result.assets[0])
        } catch (e) {

        }
    }
    //reset all 
    const reSet = () => {
        setImage(); setName(); setAddress1(); setAddress2(); setNumber(); setEmail(); setAdditionalNotes()
    }
    //save the details of bussines
    const saveBussiness = () => {
        setLoading(true)
        if (name != undefined) {
            if (address1 != undefined) {
                const business = new Object();
                business['id'] = allbusiness.length;
                business['image'] = image == undefined ? '' : String(image.base64);
                business['name'] = String(name);
                business['address1'] = String(address1);
                business['address2'] = address2 == undefined ? '' : String(address2);
                business['number'] = number == undefined ? '' : String(number);
                business['email'] = email == undefined ? '' : String(email);
                business['additionalnote'] = additionalNotes == undefined ? '' : String(additionalNotes);
                writeBusiness(business).then(res => {
                    setLoading(false);
                    alert('Business added succesfulyy');
                    navigation.goBack()
                }).catch(err => {
                    setLoading(false);
                    console.log(err)
                })
            } else {
                alert('Please enter address 1')
            }
        } else {
            alert('Please enter valid bussiness name')
        }
    }


    if (loading) {
        return (
            <View style={[styles.container]}>

                <ActivityIndicator size='large' color='#241153' />

            </View>
        )
    } else {
        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : nul} style={styles.container} >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ marginHorizontal: onePerWidth * 10, width: onePerWidth * 80, alignSelf: 'center', marginTop: onePerHeight * 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity>
                            {/* <Image source={require('../assets/images/mybusiness/AllInvoices.png')} style={[styles.icon]} />*/}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={reSet}>
                            <Image source={require('../assets/images/mybusiness/Delete.png')} style={[styles.icon]} />
                        </TouchableOpacity>
                    </View>
                    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                        <View style={[styles.inner]}>
                            <View style={{ width: onePerWidth * 95, alignSelf: 'center', marginBottom: onePerHeight * 1.4, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                                    <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                                </TouchableOpacity>
                                <Text style={[styles.headingTop, { marginTop: onePerHeight * 0.4 }]}>My Business</Text>
                                <TouchableOpacity>
                                    {/* <Image source={require('../assets/images/mybusiness/edit.png')} style={styles.icon} />*/}
                                </TouchableOpacity>

                            </View>
                            <View style={{}}>
                                {
                                    image == undefined ?
                                        <TouchableOpacity onPress={pickImage} style={[styles.image, { backgroundColor: '#F3F3F3', justifyContent: 'center' }]}>
                                            <Image source={require('../assets/images/mybusiness/image.png')} style={[{ alignSelf: 'center', width: onePerHeight * 4, height: onePerHeight * 3.2 }]} />
                                        </TouchableOpacity> :
                                        <TouchableOpacity onPress={pickImage}>
                                            <Image style={styles.image} source={{ uri: image.uri }} />
                                        </TouchableOpacity>
                                }
                                <Text style={[styles.smallText, { alignSelf: 'center' }]}>My Business Logo (Optional)</Text>
                            </View>
                            <View style={{ marginHorizontal: onePerWidth * 10, width: onePerWidth * 80, alignSelf: 'center', marginTop: onePerHeight * 2 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
                                    {/* <Text style={[styles.redText]}>Set as default</Text>*/}
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginHorizontal: onePerWidth * 10, width: onePerWidth * 80, alignSelf: 'center', marginTop: onePerHeight * 2 }}>
                                <TextInput style={[styles.input]} keyboardType='name-phone-pad' placeholderTextColor="#00000070" placeholder='My Business Name' onChangeText={setName} />
                                <TextInput style={[styles.input]} keyboardType='ascii-capable' placeholderTextColor="#00000070" placeholder='Address line 1' onChangeText={setAddress1} />
                                <TextInput style={[styles.input]} keyboardType='ascii-capable' placeholderTextColor="#00000070" placeholder='Address line 2' onChangeText={setAddress2} />
                                <TextInput style={[styles.input]} keyboardType='phone-pad' placeholderTextColor="#00000070" placeholder='Phone Number' onChangeText={setNumber} />
                                <TextInput style={[styles.input]} keyboardType='email-address' placeholderTextColor="#00000070" placeholder='Email Address' onChangeText={setEmail} />
                                <TextInput style={[styles.input]} keyboardType='ascii-capable' placeholderTextColor="#00000070" placeholder='Additional Notes' onChangeText={setAdditionalNotes} />
                                <TouchableOpacity onPress={saveBussiness} style={[styles.button]}>
                                    <Text style={[styles.buttonText]}>Save</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </KeyboardAvoidingView>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#FFFFFF',
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "flex-end",
    },
    arrowIcon: {
        height: onePerHeight * 2.8, width: onePerHeight * 2
    },
    headingTop: {
        fontFamily: 'DMSans-Bold', fontSize: (onePerHeight * 2.8), color: '#241153', fontWeight: 'bold'
    },
    icon: {
        height: onePerHeight * 2.4, width: onePerHeight * 2.3
    },
    image: {
        height: onePerHeight * 16, width: onePerWidth * 80, alignSelf: 'center', borderRadius: onePerHeight
    },
    smallText: {
        fontFamily: 'DMSans-Italic', fontSize: onePerHeight * 1.3, marginTop: onePerHeight,
    },
    redText: {
        fontFamily: 'DMSans-Regular', fontSize: onePerHeight * 1.5, marginTop: onePerHeight, color: '#F3B582', fontWeight: '900', letterSpacing: -0.4
    },
    input: {
        backgroundColor: '#F3F3F3', borderRadius: onePerHeight * 0.8, paddingVertical: onePerHeight * 1.2, paddingHorizontal: onePerWidth * 5,
        fontSize: onePerHeight * 1.7, fontFamily: 'DMSans-Regular', letterSpacing: onePerWidth * 0.2, marginTop: onePerHeight * 2, color: '#000000'
    },
    button: {
        backgroundColor: '#2E186A', paddingVertical: onePerHeight, borderRadius: onePerHeight, justifyContent: 'center',
        alignItems: 'center', marginVertical: onePerHeight * 2
    },
    buttonText: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 2.2, color: '#FFFFFF',
    }
})