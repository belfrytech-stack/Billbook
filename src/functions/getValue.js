import React from 'react';
import Realm from "realm";
import { MyBusinessSchema, ClientSchema,InvoiceListSchema } from './saveValue';
export const getAllBussiness = async () => {
    try {
        const realm = await Realm.open({
            path: "MyBusinessList",
            schema: [MyBusinessSchema],
        });
        const business = realm.objects("MyBusiness");
        return business
    } catch (err) {
        return []
    }
}

export const getAllClients = async () => {
    try {
        const realm = await Realm.open({
            path: 'ClientsList',
            schema: [ClientSchema],
        });
        const clients = realm.objects("Clients")
        return clients
    } catch (err) {
        return []
    }
}
export const getAllInvoices = async () => {
    try {
        const realm = await Realm.open({
            path: 'InvoiceList',
            schema: [InvoiceListSchema],
        });
        const clients = realm.objects("Invoices")
        return clients
    } catch (err) {
        return []
    }
}