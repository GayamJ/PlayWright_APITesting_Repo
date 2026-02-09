import { test, expect } from '@playwright/test';

const authdata = {
    username: 'admin',
    password: 'password123'
};

const newbookingdata = {
    "firstname" : "ads",
    "lastname" : "laxman",
    "totalprice" : 5000,
    "depositpaid" : true,
    "bookingdates" : { "checkin" : "2026-03-15", "checkout" : "2026-05-10"    },
    "additionalneeds" : "full meal"
};

const updatedbookingdata = {
    "firstname" : "ads",
    "lastname" : "Teacher",
    "totalprice" : 8000,
    "depositpaid" : true,
    "bookingdates" : { "checkin" : "2026-04-01", "checkout" : "2026-05-15"    },
    "additionalneeds" : "Breakfast, lunch, supper and dinner"
};

test('Auth, Create Booking, and Update Booking:Auth → Create → Update', async ({request}) => {
    // Test 1: Get auth token
    const authresponsedata = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: {'Content-Type': 'application/json'},
        data: authdata
    });
    expect(authresponsedata.status()).toBe(200);
    const authresponsedatajson = await authresponsedata.json();
    const authtoken = authresponsedatajson.token;

    console.log('Auth token:', authtoken);
    
    // Test 2: Create booking
    const newbookingresponse = await request.post('https://restful-booker.herokuapp.com/booking', {
        headers: {'Content-Type': 'application/json'},
        data: newbookingdata
    });
    expect(newbookingresponse.status()).toBe(200);
    const newbookingresponsejson = await newbookingresponse.json();
    const newbookingid = newbookingresponsejson.bookingid;
    console.log('New booking ID:', newbookingid);
    console.log('POST create booking response body:', newbookingresponsejson);

    // Test 3: Update booking with both variables now in scope
    const updatebookingresponse = await request.put(`https://restful-booker.herokuapp.com/booking/${newbookingid}`, {
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Cookie': `token=${authtoken}`},
        data: updatedbookingdata
    });
    expect(updatebookingresponse.status()).toBe(200);
    const updatebookingresponsejson = await updatebookingresponse.json();
    console.log('PUT update booking response body:', updatebookingresponsejson);
 
    // Assertions to verify the update
    expect(updatebookingresponsejson.firstname).toBe(updatedbookingdata.firstname);
    expect(updatebookingresponsejson.lastname).toBe(updatedbookingdata.lastname);
    expect(updatebookingresponsejson.totalprice).toBe(updatedbookingdata.totalprice);
    expect(updatebookingresponsejson.depositpaid).toBe(updatedbookingdata.depositpaid);
    expect(updatebookingresponsejson.bookingdates.checkin).toBe(updatedbookingdata.bookingdates.checkin);
    expect(updatebookingresponsejson.bookingdates.checkout).toBe(updatedbookingdata.bookingdates.checkout);
    expect(updatebookingresponsejson.additionalneeds).toBe(updatedbookingdata.additionalneeds);

//Test4: Update booking with PATCH method only firstname and lastname

const patchbookingresponse = await request.patch(`https://restful-booker.herokuapp.com/booking/${newbookingid}`, 
    {   
         headers:         {
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Cookie': `token=${authtoken}`
                          },
    data: {
        "firstname": "Updated",
        "lastname": "Student"
    }
});
expect(patchbookingresponse.status()).toBe(200);
const patchbookingresponsejson = await patchbookingresponse.json();
console.log('PATCH update booking response body:', patchbookingresponsejson);
});