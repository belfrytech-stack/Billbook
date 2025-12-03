import React, { useCallback, useState, useRef } from 'react';
import {
    View, SafeAreaView, Text, TouchableOpacity, Image, ScrollView,
    Dimensions, StyleSheet, ActivityIndicator, TextInput, Modal, FlatList,
} from 'react-native';

const { height, width } = Dimensions.get('screen');
const onePerHeight = parseInt(height / 100);
const onePerWidth = parseInt(width / 100);

//image to pdf
import RNImageToPdf from 'react-native-image-to-pdf';
import Share from 'react-native-share';
import ViewShot, { captureRef } from 'react-native-view-shot';


export default function ViewPdf({ navigation, route }) {

    const [loading, setLoading] = useState(false);
    const viewShotRef = useRef(null)
    //methods
    //capture image
    const onCapture = async () => {
        await viewShotRef.current.capture().then(uri => {
            myAsyncPDFFunction(uri)
        })
    }
    const myAsyncPDFFunction = async (image) => {
        try {
            const options = {
                imagePaths: [image],
                name: (route.params.pdf.name),
                quality: .7, // optional compression paramter
            };
            const pdf = await RNImageToPdf.createPDFbyImages(options);
            share(pdf.filePath)
        } catch (e) {
            console.log(e);
        }
    };
    const share = (path) => {
        try {
            Share.open({
                title: "Share ",
                message: "share the pdf:",
                url: path,
                subject: "Share",
            }).then(res => {
                setImage(null);
                setPrepareforPicture(false)
            })
                .catch(errr => {
                    console.log(errr)
                })
        } catch (error) {
            console.log(error)
        }
    }
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fff', alignItems: 'center' }}>
                <ActivityIndicator size='large' color='red' />
            </View>
        )
    } else {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: onePerWidth * 4 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCapture} style={[styles.button, { paddingHorizontal: onePerWidth * 5 }]}>
                            <Image source={require('../assets/images/home/ShareInvoice.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                    </View>
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }} style={[styles.dropShadow, { flex: 0.9, backgroundColor: '#FFFFFF', marginHorizontal: onePerWidth * 2 }]}>

                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: `data:image/jpeg;base64,${route.params.pdf.pdfValue}` }} style={{
                                resizeMode: 'contain',
                                flex: 1,
                            }} />
                        </View>
                    </ViewShot>
                </SafeAreaView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    arrowIcon: {
        height: onePerHeight * 2.8, width: onePerHeight * 2
    },
    headingTop: {
        fontFamily: 'DMSans-Bold', fontSize: (onePerHeight * 3), color: '#241153', fontWeight: 'bold'
    },
    icon: {
        height: onePerHeight * 2.8, width: onePerHeight * 2.8
    },
})