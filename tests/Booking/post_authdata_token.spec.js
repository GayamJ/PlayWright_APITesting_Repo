import {test,expect} from '@playwright/test';

const authdata = {
    username: 'admin',
    password: 'password123'
};

//syntax: post(url, {headers, data})
test('Booking API - Post AuthData Token', async ({request}) =>
{
    const authresponsedata = await request.post('https://restful-booker.herokuapp.com/auth',
   {
        headers: {'Content-Type': 'application/json'},
        data: authdata
    });

expect(authresponsedata.status()).toBe(200);
expect(authresponsedata.statusText()).toBe('OK');

const authresponsedatajson = await authresponsedata.json();
console.log('POST response body:', authresponsedatajson);

const authtoken = authresponsedatajson.token;
console.log('POST response token:', authtoken);

});

/* Test2*/

const newbookingdata = {
    "firstname" : "ads",
    "lastname" : "Brown",
    "totalprice" : 1000,
    "depositpaid" : true,
    "bookingdates" : { "checkin" : "2026-03-01", "checkout" : "2026-05-01"    },
    "additionalneeds" : "Breakfast"
};


test('POST NewBooking', async ({request}) => 
{
    const newbookingresponse = await request.post('https://restful-booker.herokuapp.com/booking',
    {
        headers: {'Content-Type': 'application/json'},
        data: newbookingdata
    });
expect(newbookingresponse.status()).toBe(200);
expect(newbookingresponse.statusText()).toBe('OK');

const newbookingresponsejson = await newbookingresponse.json();

const   newbookingid = newbookingresponsejson.bookingid;
console.log('POST NewBooking response bookingid:', newbookingid);

console.log('POST NewBooking response body:', newbookingresponsejson);
});

//Test3: Updatingthe above booking using PUT method

const updatedbookingdata = {
    "firstname" : "ads",
    "lastname" : "Testing",
    "totalprice" : 8000,
    "depositpaid" : true,
    "bookingdates" : { "checkin" : "2026-04-01", "checkout" : "2026-05-01"    },
    "additionalneeds" : "Breakfast, lunch and dinner"
};


test('PUT update booking', async ({request}) =>
{
    const updatebookingresponse = await request.put(`https://restful-booker.herokuapp.com/booking/${newbookingid}`,
    {
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Cookie': `token=${authtoken}`},
        data: updatedbookingdata
    });
expect(updatebookingresponse.status()).toBe(200);
expect(updatebookingresponse.statusText()).toBe('OK');

 const updatebookingresponsejson = await updatebookingresponse.json();
 console.log('PUT update booking response body:', updatebookingresponsejson);
});

