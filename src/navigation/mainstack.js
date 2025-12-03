import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Navigator, Screen } = createNativeStackNavigator();

//screens
import Home from "../screens/home";
import AllBusiness from "../screens/allbusiness";
import MyBusiness from "../screens/mybussiness";
import AddClient from "../screens/addclient";
import Clients from "../screens/clients";
import Invoices from "../screens/allinvoice";
import CreateInvoice from "../screens/addinvoice";
import ViewPdf from "../screens/viewpdf";
import EditBusiness from "../screens/editbusiness";
import EditClient from "../screens/editclient";
import Payment from "../screens/payment";

export const MainStack = () => (
    <NavigationContainer>
        <Navigator>
            <Screen name="home" component={Home} options={{ headerShown: false }} />
            <Screen name="allbusiness" component={AllBusiness} options={{ headerShown: false }} />
            <Screen name="mybusiness" component={MyBusiness} options={{ headerShown: false }} />
            <Screen name="clients" component={Clients} options={{ headerShown: false }} />
            <Screen name="addclient" component={AddClient} options={{ headerShown: false }} />
            <Screen name="invoice" component={Invoices} options={{ headerShown: false }} />
            <Screen name="createinvoice" component={CreateInvoice} options={{ headerShown: false }} />
            <Screen name="payment" component={Payment} options={{ headerShown: false }} />
            <Screen name="viewpdf" component={ViewPdf} options={{ headerShown: false }} />
            <Screen name="editbusiness" component={EditBusiness} options={{ headerShown: false }} />
            <Screen name="editclient" component={EditClient} options={{ headerShown: false }} />
        </Navigator>
    </NavigationContainer>
)