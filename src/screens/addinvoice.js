import React, { useCallback, useState, useRef } from 'react';
import {
    View, SafeAreaView, Text, TouchableOpacity, Image, ScrollView,
    Dimensions, StyleSheet, ActivityIndicator, TextInput, Modal, FlatList,
} from 'react-native';

const { height, width } = Dimensions.get('screen');
const onePerHeight = parseInt(height / 100);
const onePerWidth = parseInt(width / 100);
//3rd party lib
import DatePicker from 'react-native-date-picker';
import CheckBox from '@react-native-community/checkbox';
import ImgToBase64 from 'react-native-image-base64';
import { useFocusEffect } from '@react-navigation/native';

//getvalues
import { getAllBussiness, getAllClients, getAllInvoices } from '../functions/getValue';
//signature
import SignatureScreen from "react-native-signature-canvas";
//convert view to image
import ViewShot, { captureRef } from 'react-native-view-shot';
//image to pdf
import RNImageToPdf from 'react-native-image-to-pdf';
import Share from 'react-native-share';
//write to database
import { writeInvoice } from '../functions/saveValue';

export default function CreateInvoice({ navigation, route }) {
    //get all cleints and business
    useFocusEffect(
        useCallback(() => {
            getAllClients().then(allclients => {
                setAllClients(allclients)
                getAllBussiness().then(busines => {
                    setAllBussines(busines);
                    setLoading(false)
                })
            }).catch(err => {
                console.log(err)
            })

        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            getAllInvoices().then(invoices => {
                if (invoices == undefined || invoices == null || invoices.length == 0) {
                    setInvoiceId(1)
                } else {
                    let id = (parseInt(invoices[invoices.length - 1]._id) + 1)
                    setInvoiceId(id)
                }
                setInoiceList(invoices);
                setLoading(false)
            }).catch(err => {
                console.log(err)
            })
        }, [])
    );


    const [loading, setLoading] = useState(false);
    const [business, setBusiness] = useState();
    const [client, setClient] = useState();
    const [invoiceDate, setInvoiceDate] = useState();
    const [invoiceDueDate, setInvoiceDueDate] = useState();
    const [amount, setAmount] = useState();
    const [mark, setMark] = useState();
    const [itemArray, setItemArray] = useState([]);
    const [taxDetails, setTaxDetails] = useState();
    const [taxCalculation, setTaxCalculation] = useState();
    const [taxValue, setTaxValue] = useState();
    const [subTotal, setSubtotal] = useState();
    const [taxtotal, setTaxTotal] = useState();
    const [signature, setSignature] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState();
    const [currency, setCurrency] = useState('$')

    //modals
    const [busModal, setBusModal] = useState(false);
    const [clientModal, setClientModal] = useState(false);
    const [invoiceDetailsModal, setInvoiceDetailsModal] = useState(false);
    const [itemDetailsModal, setItemDetailsModal] = useState(false);
    const [taxandtotoalModal, setTaxandtotalModal] = useState(false);
    const [additionalModal, setAdditionalModal] = useState(false);
    const [signautreModal, setSignatureModal] = useState(false)
    //allclients
    const [allClients, setAllClients] = useState([]);
    const [filteredClientList, setFilteredClinetsList] = useState([])
    const [allbusiness, setAllBussines] = useState([]);
    const [filteredBusiness, setFilteredBusiness] = useState([]);
    const [searching, setSearching] = useState(false)
    //reset
    const reSet = () => {
        setBusiness(), setClient(), setInvoiceDate(), setInvoiceDueDate(), setMark(), setItemArray([]), setTaxDetails(), setTaxCalculation(), setSubtotal(), setTaxTotal(), setSignature(), setAdditionalInfo(),
            setCurrency();
    }
    //invoice list
    const [invoiceList, setInoiceList] = useState([]);
    const [invoiceId, setInvoiceId] = useState(0)
    //modals
    //bus search
    const busSearch = (e) => {
        if (e != undefined && e.length > 0) {
            let temp = []
            let x = allbusiness.filter(async (item) => {
                if (item.name.toLowerCase().includes(e.toLowerCase())) {
                    temp.push(item)
                }
            })
            setFilteredBusiness(temp)
        } else {
            setFilteredBusiness([])
        }
    }
    //render bussines
    const rednerBusinessList = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.clientView]} onPress={() => {
                setBusiness(item);
                setBusModal(false);
                setSearching(false);
                setFilteredBusiness([]);
            }}>
                <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={[styles.clientimage]} />
                <View>
                    <Text style={[styles.clienttext]}>{item.name}</Text>
                    <Text style={[styles.clienttext]}>{item.phonenumber}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    //bussiness selection modal ui
    const businessModalUI = () => {
        return (
            <View style={[styles.container]}>
                <SafeAreaView style={[styles.container]}>
                    <View style={{ flex: 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 5 }}>
                        <TouchableOpacity onPress={() => { setSearching(false), setBusModal(false) }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <View>
                            {
                                !searching ?
                                    <Text style={[styles.headingTop, {}]}>My Business</Text> :
                                    <TextInput style={[styles.input]} placeholder='Search' onChangeText={(e) => { busSearch(e) }} />
                            }
                        </View>
                        <View>
                            {
                                !searching ?
                                    <TouchableOpacity onPress={() => { setSearching(true) }}>
                                        <Image source={require('../assets/images/clients/search.png')} style={styles.icon} />
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => { setSearching(false), setFilteredBusiness([]) }}>
                                        <Text style={[styles.redText]}>Done</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ flex: 0.9 }}>
                        <FlatList
                            data={filteredBusiness.length > 0 ? filteredBusiness : allbusiness}
                            keyExtractor={(item, index) => String(item._id)}
                            renderItem={rednerBusinessList}
                        />
                    </View>

                </SafeAreaView>

            </View>
        )
    }
    const clientSearch = (e) => {
        if (e != undefined && e.length > 0) {
            let temp = [];
            let x = allClients.filter(async (item) => {
                if (item.name.toLowerCase().includes(e.toLowerCase())) {
                    temp.push(item)
                }
            })
            setFilteredClinetsList(temp)
        } else {
            setFilteredClinetsList([])
        }
    }
    const renderclientList = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.clientView]} onPress={() => {
                setClient(item);
                setClientModal(false);
                setSearching(false);
                setFilteredClinetsList([]);
            }}>
                <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={[styles.clientimage]} />
                <View>
                    <Text style={[styles.clienttext]}>{item.name}</Text>
                    <Text style={[styles.clienttext]}>{item.phonenumber}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    //client selection ui
    const clientModalUI = () => {
        return (
            <View style={[styles.container]}>
                <SafeAreaView style={[styles.container]}>
                    <View style={{ flex: 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 5 }}>
                        <TouchableOpacity onPress={() => { setSearching(false), setClientModal(false) }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <View>
                            {
                                !searching ?
                                    <Text style={[styles.headingTop, {}]}>Clients</Text> :
                                    <TextInput style={[styles.input]} placeholder='Search' onChangeText={(e) => { clientSearch(e) }} />
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
                    <View style={{ flex: 0.9 }}>
                        <FlatList
                            data={filteredClientList.length > 0 ? filteredClientList : allClients}
                            keyExtractor={(item, index) => String(item._id)}
                            renderItem={renderclientList}
                        />
                    </View>

                </SafeAreaView>

            </View>
        )
    }
    //invoice details modal ui
    const [openID, setOpenID] = useState(false)
    const [openIDD, setOpenIDD] = useState(false)
    const invoiceModalUI = () => {
        return (
            <View style={[styles.container]}>
                <SafeAreaView style={[styles.container]}>
                    <DatePicker
                        modal
                        open={openID}
                        date={new Date()}
                        mode='date'
                        onConfirm={(date) => {
                            setOpenID(false)
                            setInvoiceDate(date)
                        }}
                        onCancel={() => {
                            setOpenID(false)
                        }}
                    />
                    <DatePicker
                        modal
                        open={openIDD}
                        date={new Date()}
                        mode='date'
                        onConfirm={(date) => {
                            setOpenIDD(false)
                            setInvoiceDueDate(date)
                        }}
                        onCancel={() => {
                            setOpenIDD(false)
                        }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 5, marginVertical: onePerHeight * 2 }}>
                        <TouchableOpacity onPress={() => { setInvoiceDetailsModal(false) }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <Text style={[styles.headingTop]}>Invoice Details</Text>
                        <Text></Text>
                    </View>
                    <View>
                        <TextInput placeholder={client == undefined ? "Please select a client" : 'Client: ' + client.name} placeholderTextColor="#00000070" style={[styles.inputInModal]} editable={false} />
                        <TextInput placeholder={'Invoice No : ' + String(invoiceId)} style={[styles.inputInModal]} placeholderTextColor="#00000070" editable={false} />
                        <TouchableOpacity onPress={() => { setOpenID(true) }} style={[styles.inputInModal]}>
                            <Text style={[{ fontFamily: 'DMSans-Regular', letterSpacing: onePerWidth * 0.2, color: '#ababab', fontSize: onePerHeight * 2.2, }]}>{invoiceDate == undefined ? 'Invoice Date' : String(invoiceDate).substring(4, 15)} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setOpenIDD(true) }} style={[styles.inputInModal]}>
                            <Text style={[{ fontFamily: 'DMSans-Regular', letterSpacing: onePerWidth * 0.2, color: '#ababab', fontSize: onePerHeight * 2.2, }]}>{invoiceDueDate == undefined ? 'Invoice Due Date' : String(invoiceDueDate).substring(4, 15)}</Text>
                        </TouchableOpacity>
                        <TextInput editable={false} placeholder='$' keyboardType='ascii-capable' onChangeText={setCurrency} style={[styles.inputInModal,]} placeholderTextColor="#00000070" />
                        <View style={{ paddingHorizontal: onePerWidth * 5, width: onePerWidth * 100, alignSelf: 'center', marginTop: onePerHeight * 2, flexDirection: 'row', alignItems: 'center', borderWidth: onePerWidth * 0.5, borderColor: '#FEB785', paddingVertical: onePerHeight, borderRadius: onePerHeight, marginVertical: onePerHeight * 2 }}>
                            <Text style={[styles.text, { color: '#C1C1C1' }]}>Mark</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: onePerWidth * 10 }}>
                                <CheckBox
                                    disabled={false}
                                    value={mark ? true : false}
                                    onValueChange={(newValue) => { setMark(true) }}
                                    boxType='square'
                                    tintColor='#382867'
                                    onCheckColor='#382867'
                                    onTintColor='#382867'
                                    style={{ height: onePerHeight * 2, marginRight: -onePerWidth }}
                                    lineWidth={onePerHeight * 0.24}
                                />
                                <Text style={[styles.text, { fontWeight: 'bold', color: '#382867' }]}>Paid</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: onePerWidth * 10 }}>
                                <CheckBox
                                    disabled={false}
                                    value={mark ? false : true}
                                    onValueChange={(newValue) => { setMark(false) }}
                                    boxType='square'
                                    tintColor='#FEB686'
                                    onCheckColor='#FEB686'
                                    onTintColor='#FEB686'
                                    style={{ height: onePerHeight * 2, marginRight: -onePerWidth * 2, color: '#FEB686' }}
                                    lineWidth={onePerHeight * 0.24}
                                />
                                <Text style={[styles.text, { fontWeight: 'bold', color: '#FEB686' }]}>Outstanding</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => { setInvoiceDetailsModal(false) }} style={[styles.button, { width: onePerWidth * 100, alignSelf: 'center', marginTop: onePerHeight * 1.2 }]}>
                            <Text style={[styles.buttonText]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
    //on item save
    const itemSave = () => {
            if (itemDescription !== undefined && itemDescription.length >0) {
                if (itemUnit != undefined && itemUnit.length > 0) {
                    if (itemQuantity != undefined && itemQuantity.length > 0) {
                        if (itemPrice != undefined && itemPrice.length > 0) {
                                let y = itemArray;
                                let object = new Object();
                                object['description'] = itemDescription;
                                object['unit'] = itemUnit;
                                object['quantity'] = itemQuantity;
                                object['price'] = itemPrice;
                                object['total'] = (itemQuantity * itemPrice).toFixed(2)
                                y[itemArray.length] = object;
                                setItemArray(y);
                                setItemDescription();
                                setItemUnit();
                                setItemQuantity();
                                setItemPrice();
                                setItemDetailsModal(false)
                        } else {
                            alert('Please enter valid price')
                        }
                    } else {
                        alert('Please enter valid quantit')
                    }
                } else {
                    alert('Please enter valid units')
                }
            } else {
                alert('Please enter valid description')
            }
        } 
    const [itemDescription,setItemDescription] = useState();
    const [itemUnit,setItemUnit] = useState();
    const [itemQuantity,setItemQuantity] = useState();
    const [itemPrice,setItemPrice] = useState();
    //item details ui
    const itemdetailsUI = () => {
        return (
            <View style={[styles.container]}>
                <SafeAreaView style={[styles.container]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 5, marginVertical: onePerHeight * 2 }}>
                        <TouchableOpacity onPress={() => { setItemDetailsModal(false)
                        setItemDescription();
                        setItemUnit();
                        setItemQuantity();
                        setItemPrice();
                        }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <Text style={[styles.headingTop]}>Item Details</Text>
                        <Text></Text>
                    </View>
                    <TextInput placeholder={(itemDescription == undefined || itemDescription.length == 0) ? 'Description' : itemDescription} onChangeText={setItemDescription}
                     style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TextInput placeholder={(itemUnit == undefined || itemUnit.length == 0) ? 'Unit' : itemUnit} onChangeText={setItemUnit} keyboardType='ascii-capable' style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TextInput placeholder={(itemQuantity == undefined || itemQuantity.length == 0) ? 'Quantity' : itemQuantity} onChangeText={setItemQuantity} keyboardType='decimal-pad' style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TextInput placeholder={(itemPrice == undefined || itemPrice.length == 0) ? 'Price' : itemPrice} onChangeText={setItemPrice} keyboardType='decimal-pad' style={[styles.inputInModal,]}
                        placeholderTextColor={"#00000070"} />
                    <Text style={[styles.inputInModal,{
                        color:(itemQuantity != undefined && itemQuantity.length > 0 && itemPrice != undefined && itemPrice.length > 0) ? '#000000' :'#00000070'
                    }]}>{(itemQuantity != undefined && itemQuantity.length > 0 && itemPrice != undefined && itemPrice.length > 0) ?
                        (itemQuantity * itemPrice).toFixed(2):'Total - USD $0.00'}</Text>
                    <TouchableOpacity onPress={itemSave} style={[styles.button, { width: onePerWidth * 100, alignSelf: 'center', marginTop: onePerHeight * 1.2 }]}>
                        <Text style={[styles.buttonText]}>Save</Text>
                    </TouchableOpacity>
                    {
                        itemArray.length > 0 ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: onePerWidth * 10, marginVertical: onePerHeight * 2, marginTop: onePerHeight * 4 }}>
                                <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 35 }]}>Description</Text>
                                <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 18 }]}>Unit</Text>
                                <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 18 }]}>Quantity</Text>
                                <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 18 }]}>Price</Text>
                                <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 18 }]}>Total</Text>
                            </View> :
                            null
                    }
                    <FlatList
                        data={itemArray}
                        style={{ paddingBottom: onePerHeight * 5 }}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: onePerWidth * 10, marginVertical: onePerHeight * 1, }}>
                                    <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 35 }]}>{item.description}</Text>
                                    <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 18 }]}>{item.unit}</Text>
                                    <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 18 }]}>{item.quantity}</Text>
                                    <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 18 }]}>{item.price}</Text>
                                    <Text style={[styles.text, { fontSize: onePerHeight * 2, width: onePerWidth * 18 }]}>{item.total}</Text>
                                    <TouchableOpacity onPress={() => {
                                        let temp = [];
                                        itemArray.map((item, ind) => {
                                            if (ind !== index) {
                                                temp.push(item)
                                            }
                                        })
                                        setItemArray(temp)
                                    }}>
                                        <Image source={require('../assets/images/mybusiness/Delete.png')} style={{ width: onePerWidth * 4, height: onePerHeight * 2 }} />
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </SafeAreaView>
            </View>
        )
    }
    //tax and total modal ui
    const taxandtotalUI = () => {
        return (
            <View style={[styles.container]} >
                <SafeAreaView style={[styles.container]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 5, marginVertical: onePerHeight * 2 }}>
                        <TouchableOpacity onPress={() => { setTaxandtotalModal(false) }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <Text style={[styles.headingTop]}>Tax {'&'} Total</Text>
                        <Text></Text>
                    </View>
                    <TextInput placeholder={taxDetails == undefined ? 'Tax Details' : taxDetails} keyboardType='ascii-capable' onChangeText={setTaxDetails} style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TextInput placeholder={taxCalculation == undefined ? 'Tax Calculation (Percentage/Amount)' : taxCalculation} keyboardType='decimal-pad' onChangeText={setTaxCalculation} style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TextInput placeholder={taxValue == undefined ? 'Tax Value' : taxValue} onChangeText={setTaxValue} keyboardType='decimal-pad' style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TextInput placeholder={subTotal == undefined ? 'Sub Total USD $0.00' : subTotal} keyboardType='decimal-pad' onChangeText={setSubtotal} style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TextInput placeholder={taxtotal == undefined ? 'Total - USD $0.00' : taxtotal} keyboardType='decimal-pad' onChangeText={(e) => { setTaxTotal(e) }} style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TouchableOpacity onPress={() => { setTaxandtotalModal(false) }} style={[styles.button, { width: onePerWidth * 100, alignSelf: 'center', marginTop: onePerHeight * 1.2 }]}>
                        <Text style={[styles.buttonText]}>Save</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        )
    }
    //additional info ui modal
    const additionalInfoUI = () => {
        return (
            <View style={[styles.container]}>
                <SafeAreaView style={[styles.container]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 5, marginVertical: onePerHeight * 2 }}>
                        <TouchableOpacity onPress={() => { setAdditionalModal(false) }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <Text style={[styles.headingTop]}>Additional info.</Text>
                        <Text></Text>
                    </View>
                    <TextInput placeholder='Additional Information' keyboardType='ascii-capable' onChangeText={setAdditionalInfo} style={[styles.inputInModal,]}
                        placeholderTextColor="#00000070" />
                    <TouchableOpacity onPress={() => { setAdditionalModal(false) }} style={[styles.button, { width: onePerWidth * 100, alignSelf: 'center', marginTop: onePerHeight * 1.2 }]}>
                        <Text style={[styles.buttonText]}>Save</Text>
                    </TouchableOpacity>
                </SafeAreaView>

            </View>
        )
    }
    //Invoice Modal
    const [invoicepreviewmodal, setInvoicePreviewModal] = useState(false);
    {/*const checkAllOkayPreivew = () => {
        if (business != undefined) {
            if (client != undefined) {
                if (invoiceDate != undefined) {
                    if (invoiceDueDate != undefined) {
                        if (amount != undefined) {
                            if (mark != undefined) {
                                if (description != undefined) {
                                    if (unit != undefined) {
                                        if (quantity != undefined) {
                                            if (price != undefined) {
                                                if (itemTota != undefined) {
                                                    if (taxDetails != undefined) {
                                                        if (taxCalculation != undefined) {
                                                            if (subTotal != undefined) {
                                                                if (taxtotal != undefined) {
                                                                    setInvoicePreviewModal(true)
                                                                } else {
                                                                    alert('Please enter total in tax & total')
                                                                }
                                                            } else {
                                                                alert('Please enter sub total in tax & total')
                                                            }
                                                        } else {
                                                            alert('Please enter tax value in tax & total')
                                                        }
                                                    } else {
                                                        alert('Please enter tax details in tax & total')
                                                    }
                                                } else {
                                                    alert('Please enter total in item details ')
                                                }
                                            } else {
                                                alert('Please enter price in item details')
                                            }
                                        } else {
                                            alert('Please enter quantity in item details')
                                        }
                                    } else {
                                        alert('Please enter units in item details')
                                    }
                                } else {
                                    alert('Please enter description in item details')
                                }
                            } else {
                                alert('Pleas choose paid or outstanding from invoice details')
                            }
                        } else {
                            alert('Please enter amount in currency from invoice details')
                        }
                    } else {
                        alert('Please select invoice due date from invoice details')
                    }
                } else {
                    alert('Please select an invoice date from invoice details')
                }
            } else {
                alert('Please select client from client detaisl')
            }
        } else {
            alert('Please select a business from my business details')
        }
    }*/}
    const checkAllOkayPreivew = () => {
        if (business != undefined) {
            setInvoicePreviewModal(true)
        } else {
            alert('Please select a business')
        }
    }
    const total = () => {
        let total = 0;
        itemArray.map(item => {
            total = total + parseFloat(item.total)
        });
        if (taxtotal != undefined && taxtotal.length > 0) {
            return (total + parseFloat(taxtotal))
        } else {
            return total;
        }

    }
    //preview ui
    //render list
    const renderPreviewItem = ({ item, index }) => {
        console.log(item)
        return (
            <View style={{
                flexDirection: 'row', alignItems: 'center', borderBottomWidth: onePerWidth * 0.5, marginHorizontal: onePerWidth * 3, paddingLeft: onePerWidth * 2,
                paddingTop: onePerHeight, paddingBottom: onePerHeight * 0.4, borderBottomColor: '#E0E0E0', borderRadius: onePerWidth * 2
            }}>
                <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.3, flex: 0.5 }]}>{item.description}</Text>
                <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.3, flex: 0.166 }]}>{item.quantity}</Text>
                <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.3, flex: 0.166 }]}>{currency}{item.price}</Text>
                <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.3, flex: 0.166 }]}>{currency}{item.total}</Text>
            </View>
        )
    }
    //capture image
    const onCapture = async () => {
        await viewShotRef.current.capture().then(uri => {
            setImage(uri);
            setPrepareforPicture(false);
            ImgToBase64.getBase64String(uri)
                .then(base64String => {
                    let invoice = new Object();
                    invoice['id'] = invoiceId;
                    invoice['name'] = String('invoice ' + invoiceId);
                    invoice['pdfValue'] = base64String;
                    writeInvoice(invoice)
                })
                .catch(err => { console.log(err) });
        })
    }
    //convert image
    const myAsyncPDFFunction = async () => {
        try {
            const options = {
                imagePaths: [image],
                name: ('invoice' + invoiceId),
                quality: .7, // optional compression paramter
            };
            const pdf = await RNImageToPdf.createPDFbyImages(options);
            setPdfPath(pdf.filePath);
            share(pdf.filePath)
        } catch (e) {
            console.log(e);
        }
    };

    const [pdfPath, setPdfPath] = useState();
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
    //viewShot Ref
    const viewShotRef = useRef(null)
    const InvoicePreviewUi = () => {
        return (
            <View style={[styles.container, { backgroundColor: '#F2F1F6' }]}>
                <SafeAreaView style={{ flex: 0.05, backgroundColor: '#FFFFFF', }}>
                    <View style={{ marginHorizontal: onePerWidth * 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <TouchableOpacity onPress={() => { setInvoicePreviewModal(false) }}>
                            <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                        </TouchableOpacity>
                        <Text style={[styles.businessTexT, { fontSize: onePerHeight * 3, fontWeight: 'bold' }]}>Preview</Text>
                        <TouchableOpacity onPress={() => { setPrepareforPicture(true) }}>
                            <Text style={[styles.buttonText, { color: '#34A1B3', fontWeight: 'bold' }]}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <View style={{ flex: 0.95, backgroundColor: '#F2F1F6' }}>
                    <View style={[{ flex: 0.1, backgroundColor: '#F3F2F8', }]}>

                    </View>
                    <SafeAreaView style={{ flex: 0.9, }}>
                        <View style={[styles.dropShadow, { flex: 1, backgroundColor: '#FFFFFF', marginHorizontal: onePerWidth * 2 }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <View style={{ flex: 0.6, alignItems: 'flex-start', }}>
                                    {
                                        business != undefined ?
                                            <View style={{ paddingHorizontal: onePerWidth * 4, marginTop: onePerHeight * 2 }}>
                                                {
                                                    business.image != undefined ?
                                                        <Image source={{ uri: `data:image/jpeg;base64,${business.image}` }} style={{ width: onePerWidth * 18, height: onePerHeight * 6, borderRadius: onePerWidth, alignSelf: 'flex-start', marginBottom: onePerHeight }} />
                                                        : null
                                                }
                                                <Text style={[styles.businessTexT, { fontWeight: 'bold', fontSize: onePerHeight * 2 }]}>{business.name != undefined ? business.name : ''}</Text>
                                                <Text style={[styles.businessTexT]}>{business.address1 != undefined ? business.address1 : ''}</Text>
                                                <Text style={[styles.businessTexT]}>{business.emailaddress != undefined ? business.emailaddress : ''}</Text>
                                                <Text style={[styles.businessTexT]}>{business.phonenumber != undefined ? business.phonenumber : ''}</Text>
                                            </View> :
                                            null
                                    }
                                </View>
                                <View style={{ flex: 0.5, alignItems: 'flex-end', paddingHorizontal: onePerWidth * 6, }}>
                                    <View style={{ alignItems: 'flex-start', marginTop: onePerHeight * 2 }}>
                                        <Text style={[styles.businessTexT, { fontWeight: 'bold', fontSize: onePerHeight * 4, }]}>Invoice</Text>
                                        <View style={[styles.topView]}>
                                            <Text style={[styles.businessTexT]}>Number#</Text>
                                            <Text style={[styles.businessTexT, { alignSelf: 'flex-start' }]}>{invoiceId}</Text>
                                        </View>
                                        <View style={[styles.topView]}>
                                            <Text style={[styles.businessTexT]}>Date</Text>
                                            <Text style={[styles.businessTexT, { alignSelf: 'flex-start' }]}>{invoiceDate != undefined ? String(invoiceDate).substring(4, 15) : null}</Text>
                                        </View>
                                        <View style={[styles.topView]}>
                                            <Text style={[styles.businessTexT]}>Due Date</Text>
                                            <Text style={[styles.businessTexT, { alignSelf: 'flex-start' }]}>{invoiceDueDate != undefined ? String(invoiceDueDate).substring(4, 15) : null}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        {
                                            client != undefined ?
                                                <View style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-start', marginTop: onePerHeight, width: onePerWidth * 45 }}>
                                                    <Text style={[styles.businessTexT, { fontWeight: 'bold', fontSize: onePerHeight * 2.2 }]}>Invoice To:</Text>
                                                    <Text style={[styles.businessTexT,]}>{client.name != undefined ? client.name : null}</Text>
                                                    <Text style={[styles.businessTexT]}>{client.address1 != undefined ? client.address1 : null}</Text>
                                                    <Text style={[styles.businessTexT]}>{client.emailaddress != undefined ? client.emailaddress : null}</Text>
                                                    <Text style={[styles.businessTexT]}>{client.phonenumber != undefined ? client.phonenumber : null}</Text>
                                                </View> :
                                                null
                                        }
                                    </View>
                                </View>
                            </View>


                            <View style={{ marginHorizontal: onePerWidth * 4, marginTop: onePerHeight / 2 }}>
                                <View style={{ height: onePerHeight * 32, flexDirection: 'column' }}>
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', borderWidth: onePerWidth * 0.5,
                                        marginHorizontal: onePerWidth * 3, paddingLeft: onePerWidth * 2, borderColor: '#E0E0E0',
                                        paddingVertical: onePerHeight * 0.5, marginTop: onePerHeight
                                    }}>
                                        <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.5 }]}>Description</Text>
                                        <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}>Qty.</Text>
                                        <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}>Price</Text>
                                        <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}>Total</Text>
                                    </View>

                                    <View>
                                        <View style={{}}>
                                            <FlatList
                                                data={itemArray}
                                                keyExtractor={(item, index) => String(index)}
                                                renderItem={renderPreviewItem}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: onePerWidth * 3, marginTop: onePerHeight * 6 }}>
                                    {
                                        taxtotal != undefined ?
                                            <View style={{
                                                flexDirection: 'row', alignItems: 'center', borderTopWidth: onePerWidth * 0.3,
                                                marginHorizontal: onePerWidth * 3, paddingLeft: onePerWidth * 2, borderColor: '#E0E0E0',
                                                paddingVertical: onePerHeight * 0.5, borderColor: '#9E9E9E',
                                                borderBottomWidth: onePerWidth * 0.3, paddingTop: onePerHeight
                                            }}>
                                                <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.5 }]}></Text>
                                                <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}></Text>
                                                <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}></Text>
                                                <Text style={[styles.businessTexT, { flex: 0.167 }]}>{currency}{taxtotal}</Text>
                                            </View> :
                                            null
                                    }
                                    <View style={{
                                        flexDirection: 'row', borderColor: '#9E9E9E', justifyContent: 'space-between',
                                        borderTopWidth: onePerWidth / 3, marginTop: onePerHeight * 2, paddingTop: onePerHeight, marginHorizontal: onePerWidth * 3,
                                    }}>
                                        <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.3, marginLeft: onePerWidth * 4 }]}>Thank you for your business!</Text>
                                        <View style={{
                                            borderTopWidth: onePerWidth / 5, borderColor: '#9E9E9E', width: onePerWidth * 40, alignItems: 'center',
                                            flexDirection: 'row', paddingTop: onePerWidth * 2, justifyContent: 'space-between', paddingHorizontal: onePerWidth,
                                            marginTop: onePerHeight * 1.2
                                        }}>
                                            <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8 }]}>Total:</Text>
                                            <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8 }]}>{currency}{total()}</Text>
                                            <Text></Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 3, paddingBottom: onePerHeight * 2 }}>
                                        <View>
                                            {additionalInfo != undefined ?
                                                <View>
                                                    <Text style={[styles.businessTexT, {}]}>Additional info</Text>
                                                    <Text style={[styles.businessTexT, {}]}>{additionalInfo}</Text>
                                                </View> :
                                                null
                                            }
                                        </View>
                                        <View>
                                            {signature && (
                                                <Image style={{
                                                    width: onePerWidth * 25,
                                                    height: onePerHeight * 8,
                                                    resizeMode: 'contain',
                                                }} source={{ uri: signature }} />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        )
    }
    const ref = useRef();
    const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;
    const signatureModalUi = () => {
        return (
            <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: 250,
                padding: 10,
            }}>
                <SignatureScreen
                    onOK={(e) => { setSignature(e), setSignatureModal(false) }}
                    onEmpty={() => { setSignature(null) }}
                    onClear={() => setSignature(null)}
                    autoClear={false}
                    imageType={'image/png+xml'}
                />
                <TouchableOpacity style={[styles.button, { paddingHorizontal: onePerWidth * 5 }]} onPress={() => { setSignatureModal(false) }}>
                    <Text style={[styles.buttonText]}>Cancel</Text>
                </TouchableOpacity>
                <View style={{ marginBottom: onePerHeight * 30 }}>
                    {signature && (
                        <Image style={{
                            width: onePerWidth * 30,
                            height: onePerHeight * 10,
                            resizeMode: 'contain',
                        }} source={{ uri: signature }} />
                    )}
                </View>
            </View>
        )
    }
    const [prepareForPicture, setPrepareforPicture] = useState(false)
    const [image, setImage] = useState(null)
    if (prepareForPicture) {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginHorizontal: onePerWidth * 4, marginTop: onePerHeight * 5 }}>
                    <TouchableOpacity style={[styles.button, { marginBottom: onePerHeight, paddingHorizontal: onePerWidth * 4 }]} onPress={() => { setImage(null), setPrepareforPicture(false) }}>
                        <Text style={[styles.businessTexT, { color: '#fff' }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { marginBottom: onePerHeight, paddingHorizontal: onePerWidth * 4 }]} onPress={onCapture}>
                        <Text style={[styles.businessTexT, { color: '#fff' }]}>Save</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 0.9 }}>
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }} style={[styles.dropShadow, { flex: 1, backgroundColor: '#FFFFFF', marginHorizontal: onePerWidth * 2 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View style={{ flex: 0.6, alignItems: 'flex-start', }}>
                                {
                                    business != undefined ?
                                        <View style={{ paddingHorizontal: onePerWidth * 4, marginTop: onePerHeight * 2 }}>
                                            {
                                                business.image != undefined ?
                                                    <Image source={{ uri: `data:image/jpeg;base64,${business.image}` }} style={{ width: onePerWidth * 18, height: onePerHeight * 6, borderRadius: onePerWidth, alignSelf: 'flex-start', marginBottom: onePerHeight }} />
                                                    : null
                                            }
                                            <Text style={[styles.businessTexT, { fontWeight: 'bold', fontSize: onePerHeight * 2 }]}>{business.name != undefined ? business.name : ''}</Text>
                                            <Text style={[styles.businessTexT]}>{business.address1 != undefined ? business.address1 : ''}</Text>
                                            <Text style={[styles.businessTexT]}>{business.emailaddress != undefined ? business.emailaddress : ''}</Text>
                                            <Text style={[styles.businessTexT]}>{business.phonenumber != undefined ? business.phonenumber : ''}</Text>
                                        </View> :
                                        null
                                }
                            </View>
                            <View style={{ flex: 0.5, alignItems: 'flex-end', paddingHorizontal: onePerWidth * 6, }}>
                                <View style={{ alignItems: 'flex-start', marginTop: onePerHeight * 2 }}>
                                    <Text style={[styles.businessTexT, { fontWeight: 'bold', fontSize: onePerHeight * 4, }]}>Invoice</Text>
                                    <View style={[styles.topView]}>
                                        <Text style={[styles.businessTexT]}>Number#</Text>
                                        <Text style={[styles.businessTexT, { alignSelf: 'flex-start' }]}>{invoiceId}</Text>
                                    </View>
                                    <View style={[styles.topView]}>
                                        <Text style={[styles.businessTexT]}>Date</Text>
                                        <Text style={[styles.businessTexT, { alignSelf: 'flex-start' }]}>{invoiceDate != undefined ? String(invoiceDate).substring(4, 15) : null}</Text>
                                    </View>
                                    <View style={[styles.topView]}>
                                        <Text style={[styles.businessTexT]}>Due Date</Text>
                                        <Text style={[styles.businessTexT, { alignSelf: 'flex-start' }]}>{invoiceDueDate != undefined ? String(invoiceDueDate).substring(4, 15) : null}</Text>
                                    </View>
                                </View>
                                <View>
                                    {
                                        client != undefined ?
                                            <View style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-start', marginTop: onePerHeight, width: onePerWidth * 45 }}>
                                                <Text style={[styles.businessTexT, { fontWeight: 'bold', fontSize: onePerHeight * 2.2 }]}>Invoice To:</Text>
                                                <Text style={[styles.businessTexT,]}>{client.name != undefined ? client.name : null}</Text>
                                                <Text style={[styles.businessTexT]}>{client.address1 != undefined ? client.address1 : null}</Text>
                                                <Text style={[styles.businessTexT]}>{client.emailaddress != undefined ? client.emailaddress : null}</Text>
                                                <Text style={[styles.businessTexT]}>{client.phonenumber != undefined ? client.phonenumber : null}</Text>
                                            </View> :
                                            null
                                    }
                                </View>
                            </View>
                        </View>


                        <View style={{ marginHorizontal: onePerWidth * 4, marginTop: onePerHeight / 2 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', borderWidth: onePerWidth * 0.5,
                                    marginHorizontal: onePerWidth * 3, paddingLeft: onePerWidth * 2, borderColor: '#E0E0E0',
                                    paddingVertical: onePerHeight * 0.5, marginTop: onePerHeight
                                }}>
                                    <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.5 }]}>Description</Text>
                                    <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}>Qty.</Text>
                                    <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}>Price</Text>
                                    <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}>Total</Text>
                                </View>

                                <View>
                                    <View style={{}}>
                                        <FlatList
                                            data={itemArray}
                                            keyExtractor={(item, index) => String(index)}
                                            renderItem={renderPreviewItem}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginHorizontal: onePerWidth * 3, marginTop: onePerHeight * 6 }}>
                                {
                                    taxtotal != undefined ?
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center', borderTopWidth: onePerWidth * 0.3,
                                            marginHorizontal: onePerWidth * 3, paddingLeft: onePerWidth * 2, borderColor: '#E0E0E0',
                                            paddingVertical: onePerHeight * 0.5, borderColor: '#9E9E9E',
                                            borderBottomWidth: onePerWidth * 0.3, paddingTop: onePerHeight
                                        }}>
                                            <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.5 }]}></Text>
                                            <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}></Text>
                                            <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8, flex: 0.167 }]}></Text>
                                            <Text style={[styles.businessTexT, { flex: 0.167 }]}>{currency}{taxtotal}</Text>
                                        </View> :
                                        null
                                }
                                <View style={{
                                    flexDirection: 'row', borderColor: '#9E9E9E', justifyContent: 'space-between',
                                    borderTopWidth: onePerWidth / 3, marginTop: onePerHeight * 2, paddingTop: onePerHeight, marginHorizontal: onePerWidth * 3,
                                }}>
                                    <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.3, marginLeft: onePerWidth * 4 }]}>Thank you for your business!</Text>
                                    <View style={{
                                        borderTopWidth: onePerWidth / 5, borderColor: '#9E9E9E', width: onePerWidth * 40, alignItems: 'center',
                                        flexDirection: 'row', paddingTop: onePerWidth * 2, justifyContent: 'space-between', paddingHorizontal: onePerWidth,
                                        marginTop: onePerHeight * 1.2
                                    }}>
                                        <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8 }]}>Total:</Text>
                                        <Text style={[styles.businessTexT, { fontSize: onePerHeight * 1.8 }]}>{currency}{total()}</Text>
                                        <Text></Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 3, paddingBottom: onePerHeight * 4 }}>
                                    <View>
                                        {additionalInfo != undefined ?
                                            <View>
                                                <Text style={[styles.businessTexT, {}]}>Additional info</Text>
                                                <Text style={[styles.businessTexT, {}]}>{additionalInfo}</Text>
                                            </View> :
                                            null
                                        }
                                    </View>
                                    <View>
                                        {signature && (
                                            <Image style={{
                                                width: onePerWidth * 25,
                                                height: onePerHeight * 8,
                                                resizeMode: 'contain',
                                            }} source={{ uri: signature }} />
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ViewShot>
                </ScrollView>

            </View>
        )
    } else {
        if (loading) {
            return (
                <View style={[styles.container]}>
                    <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator size='large' color='#241153' />
                    </SafeAreaView>
                </View>
            )
        } else {
            if (image != null) {
                return (
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ flex: 0.1, paddingHorizontal: onePerWidth * 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={[styles.button, { paddingHorizontal: onePerWidth * 2 }]} onPress={() => { setImage(null), setInvoicePreviewModal(false), navigation.goBack() }}>
                                <Text style={[styles.buttonText, { fontSize: onePerHeight * 2, fontWeight: 'bold' }]}>Done</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={myAsyncPDFFunction} style={[styles.button, { paddingHorizontal: onePerWidth * 5 }]}>
                                <Image source={require('../assets/images/home/ShareInvoice.png')} style={[styles.arrowIcon]} />
                            </TouchableOpacity>
                        </View>
                        <Image source={{ uri: image }} style={{
                            resizeMode: 'contain',
                            flex: 0.9,

                        }} />
                    </SafeAreaView>
                )
            } else {
                return (
                    <View style={[styles.container]}>
                        <Modal visible={busModal}>
                            {businessModalUI()}
                        </Modal>
                        <Modal visible={clientModal}>
                            {clientModalUI()}
                        </Modal>
                        <Modal visible={invoiceDetailsModal}>
                            {invoiceModalUI()}
                        </Modal>
                        <Modal visible={itemDetailsModal}>
                            {itemdetailsUI()}
                        </Modal>
                        <Modal visible={taxandtotoalModal}>
                            {taxandtotalUI()}
                        </Modal>
                        <Modal visible={additionalModal}>
                            {additionalInfoUI()}
                        </Modal>
                        <Modal visible={invoicepreviewmodal}>
                            {InvoicePreviewUi()}
                        </Modal>
                        <Modal visible={signautreModal}>
                            {signatureModalUi()}
                        </Modal>
                        <SafeAreaView style={[styles.container]}>
                            <View style={{ marginHorizontal: onePerWidth * 5, width: onePerWidth * 100, alignSelf: 'center', marginTop: onePerHeight * 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity>
                                    {/* <Image source={require('../assets/images/mybusiness/AllInvoices.png')} style={[styles.icon]} />*/}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={reSet}>
                                    <Image source={require('../assets/images/mybusiness/Delete.png')} style={[styles.icon]} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: onePerWidth * 5 }}>
                                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                                    <Image source={require('../assets/images/arrow.png')} style={[styles.arrowIcon]} />
                                </TouchableOpacity>
                                <Text style={[styles.headingTop]}>New Invoice</Text>
                                <Text></Text>
                            </View>
                            <View style={{ flex: 0.9 }}>
                                <View style={{ marginHorizontal: onePerWidth * 8, marginVertical: onePerHeight * 1.3 }}>
                                    <Text style={[styles.text]}>My Business Details</Text>
                                    {
                                        business == undefined ?
                                            <TouchableOpacity style={[styles.selectButton]} onPress={() => { setBusModal(true) }}>
                                                <Image source={require('../assets/images/createinvoice/plus.png')} style={[styles.plusicon]} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={[styles.selectButton]} onPress={() => { setBusModal(true) }}>
                                                <Text style={[styles.text]}>{business.name}</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                                <View style={{ marginHorizontal: onePerWidth * 8, marginVertical: onePerHeight * 1.3 }}>
                                    <Text style={[styles.text]}>Client Details</Text>
                                    {
                                        client == undefined ?
                                            <TouchableOpacity style={[styles.selectButton]} onPress={() => { setClientModal(true) }}>
                                                <Image source={require('../assets/images/createinvoice/plus.png')} style={[styles.plusicon]} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={[styles.selectButton]} onPress={() => { setClientModal(true) }}>
                                                <Text style={[styles.text]}>{client.name}</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                                <View style={{ marginHorizontal: onePerWidth * 8, marginVertical: onePerHeight * 1.3 }}>
                                    <Text style={[styles.text]}>Invoice Details</Text>
                                    <TouchableOpacity style={[styles.selectButton]} onPress={() => { setInvoiceDetailsModal(true) }}>
                                        {
                                            invoiceDate == undefined ?
                                                <Image source={require('../assets/images/createinvoice/plus.png')} style={[styles.plusicon]} /> :
                                                <Text>{String(invoiceDate).substring(4, 15)}</Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginHorizontal: onePerWidth * 8, marginVertical: onePerHeight * 1.3 }}>
                                    <Text style={[styles.text]}>Item Details</Text>
                                    <TouchableOpacity style={[styles.selectButton]} onPress={() => { setItemDetailsModal(true) }}>
                                        <Image source={require('../assets/images/createinvoice/plus.png')} style={[styles.plusicon]} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginHorizontal: onePerWidth * 8, marginVertical: onePerHeight * 1.3 }}>
                                    <Text style={[styles.text]}>Tax {'&'} and Total</Text>
                                    <TouchableOpacity style={[styles.selectButton]} onPress={() => { setTaxandtotalModal(true) }}>
                                        {
                                            taxtotal == undefined ?
                                                <Image source={require('../assets/images/createinvoice/plus.png')} style={[styles.plusicon]} /> :
                                                <Text>{taxtotal}</Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginHorizontal: onePerWidth * 8, marginVertical: onePerHeight * 1.3 }}>
                                    <Text style={[styles.text]}>Signature</Text>
                                    <TouchableOpacity style={[styles.selectButton]} onPress={() => { setSignatureModal(true) }}>
                                        {
                                            signature == undefined ?
                                                <Image source={require('../assets/images/createinvoice/plus.png')} style={[styles.plusicon]} /> :
                                                <Image style={{
                                                    width: onePerWidth * 10,
                                                    height: onePerHeight * 4,
                                                    resizeMode: 'cover',
                                                }} source={{ uri: signature }} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginHorizontal: onePerWidth * 8, marginVertical: onePerHeight * 1.3 }}>
                                    <Text style={[styles.text]}>Additional Info.</Text>
                                    <TouchableOpacity style={[styles.selectButton]} onPress={() => { setAdditionalModal(true) }}>
                                        {
                                            additionalInfo == undefined ?
                                                <Image source={require('../assets/images/createinvoice/plus.png')} style={[styles.plusicon]} /> :
                                                <Text>{additionalInfo}</Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={checkAllOkayPreivew} style={[styles.button, { marginHorizontal: onePerWidth * 8, marginTop: onePerHeight * 2 }]}>
                                    <Text style={[styles.buttonText]}>Save {'&'} Preview</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </View>
                )
            }
        }
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
    selectButton: {
        backgroundColor: '#F3F3F3', justifyContent: 'center', alignItems: 'center',
        paddingVertical: onePerHeight * 0.8, borderRadius: onePerWidth * 2, marginTop: onePerHeight
    },
    plusicon: {
        height: onePerHeight * 3, width: onePerHeight * 3
    },
    text: {
        fontFamily: 'DMSans-Regular', alignSelf: 'center', color: '#000000', fontSize: onePerHeight * 1.8
    },
    button: {
        backgroundColor: '#2E186A', paddingVertical: onePerHeight, borderRadius: onePerHeight, justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 2.5, color: '#FFFFFF', textAlign: 'left'
    },
    icon: {
        height: onePerHeight * 2.8, width: onePerHeight * 2.8
    },
    input: {
        backgroundColor: '#F3F3F3', borderRadius: onePerHeight * 0.8, paddingVertical: onePerHeight * 0.6,
        paddingHorizontal: onePerWidth * 5,
        fontSize: onePerHeight * 2, fontFamily: 'DMSans-Regular', letterSpacing: onePerWidth * 0.2, color: '#000000',
        width: onePerHeight * 30
    },
    redText: {
        fontFamily: 'DMSans-Regular', fontSize: onePerHeight * 2.5, color: '#F3B582', fontWeight: '900', letterSpacing: -0.4
    },
    clientView: {
        marginVertical: onePerHeight * 1, marginHorizontal: onePerWidth * 10, width: onePerWidth * 100, alignSelf: 'center',
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#89CEEF', paddingHorizontal: onePerWidth * 4,
        paddingVertical: onePerHeight * 2,
        borderRadius: onePerHeight
    },
    clientimage: {
        width: onePerWidth * 15, height: onePerHeight * 6, borderRadius: onePerHeight * 2, marginRight: onePerWidth * 5
    },
    clienttext: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 2, color: '#00000090',
    },
    inputInModal: {
        backgroundColor: '#F3F3F3', borderRadius: onePerHeight * 0.8, paddingVertical: onePerHeight * 1,
        paddingHorizontal: onePerWidth * 4, fontSize: onePerHeight * 1.8, fontFamily: 'DMSans-Regular',
        letterSpacing: onePerWidth * 0.2, color: '#000000', width: onePerWidth * 100, alignSelf: 'center',
        marginVertical: onePerHeight * 1.2,
    },
    businessTexT: {
        fontFamily: 'DMSans-Regular', fontSize: onePerHeight * 1.4, color: '#767477', textAlign: 'left', fontWeight: 'bold'
    },
    dropShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    tableText: {
        fontFamily: 'DMSans-Medium', fontSize: onePerHeight * 1.3, color: '#767477', textAlign: 'left', paddingHorizontal: onePerWidth * 0.2,
        paddingVertical: onePerHeight * 0.5
    },
    topView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: onePerWidth * 44
    }
})