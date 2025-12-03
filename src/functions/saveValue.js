import React from 'react';
import Realm from "realm";

export const MyBusinessSchema = {
    name: "MyBusiness",
    properties: {
        _id: "int",
        name: "string",
        address1: "string",
        addres2: 'string',
        phonenumber: 'string',
        emailaddress: 'string',
        additionalnote: 'string',
        image: 'string',
        date: 'string'
    },
    primaryKey: "_id",
};
export const ClientSchema = {
    name: "Clients",
    properties: {
        _id: "int",
        name: "string",
        address1: "string",
        addres2: 'string',
        phonenumber: 'string',
        emailaddress: 'string',
        additionalnote: 'string',
        image: 'string',
        date: 'string'
    },
    primaryKey: "_id",
};
export const InvoiceListSchema = {
    name: 'Invoices',
    properties: {
        _id: 'int',
        name: 'string',
        pdfValue: 'string',
        date: 'string'
    }
}
export const writeBusiness = async (business) => {
    const realm = await Realm.open({
        path: 'MyBusinessList',
        schema: [MyBusinessSchema],
    });
    realm.write(() => {
        const task = realm.create("MyBusiness", {
            _id: business.id,
            name: business.name,
            address1: business.address1,
            addres2: business.address2,
            phonenumber: business.number,
            emailaddress: business.email,
            additionalnote: business.additionalnote,
            image: business.image,
            date: String(Date.now())
        })
    })
    return
}
export const writeClient = async (client) => {
    const realm = await Realm.open({
        path: 'ClientsList',
        schema: [ClientSchema],
    });
    realm.write(() => {
        const task = realm.create("Clients", {
            _id: client.id,
            name: client.name,
            address1: client.address1,
            addres2: client.address2,
            phonenumber: client.number,
            emailaddress: client.email,
            additionalnote: client.additionalnote,
            image: client.image,
            date: String(Date.now())
        })
    })
    return
}
export const writeInvoice = async (invoice) => {
    const realm = await Realm.open({
        path: 'InvoiceList',
        schema: [InvoiceListSchema],
    });
    realm.write(() => {
        const task = realm.create("Invoices", {
            _id: invoice.id,
            name: invoice.name,
            pdfValue: invoice.pdfValue,
            date: String(Date.now())
        })
    })
    return
}
export const deleteInvoice = async (id) => {
    const realm = await Realm.open({
        path: 'InvoiceList',
        schema: [InvoiceListSchema],
    });
    realm.write(() => {
        realm.delete(
            realm.objects('Invoices').filter(invoiceObj => invoiceObj._id == id)
        )
    })
    return 
}
export const updatebusiness = async (id, business) => {
    const realm = await Realm.open({
        path: 'MyBusinessList',
        schema: [MyBusinessSchema],
    });
    realm.write(() => {
        const bu = realm.objects('MyBusiness')[id];
        bu.name = business.name;
        bu.address1 = business.address1;
        bu.address2 = business.address2;
        bu.phonenumber = business.number;
        bu.emailaddress = business.email;
        bu.additionalnote = business.additionalnote;
        bu.image = business.image;
        bu.date = String(Date.now())
    });
    return;
}
export const updateClient = async (id, business) => {
    const realm = await Realm.open({
        path: 'ClientsList',
        schema: [ClientSchema],
    });
    realm.write(() => {
        const bu = realm.objects('Clients')[id];
        bu.name = business.name;
        bu.address1 = business.address1;
        bu.address2 = business.address2;
        bu.phonenumber = business.number;
        bu.emailaddress = business.email;
        bu.additionalnote = business.additionalnote;
        bu.image = business.image;
        bu.date = String(Date.now())
    });
    return;
}
