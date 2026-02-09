import {test,expect} from '@playwright/test';
import fs from 'fs';    //buitin module to read files

test('Postcall_From_Payloadffile', async ({ request }) => {

    //const payload = require('../Payloads/Booking_Postcall_Payload.json');
    const readfile = fs.readFileSync('./testdata/booking_payload.json', 'utf-8'); //reading the file from
    const payload = JSON.parse(readfile); //source converting string to json object

    const response = await request.post('https://restful-booker.herokuapp.com/booking', 
        { header: { 'Content-Type': 'application/json' },
        data: payload
    });

   const responsestatus = await response.status();
   console.log(`Post response status: ${responsestatus}`);
   const responsebody = await response.json();
   console.log("Post response body: ", responsebody);

   const bookingid = responsebody.bookingid;
   console.log(`Newly created booking ID: ${bookingid}`);

    //Assertions
    expect(responsestatus).toBe(200);
    expect(responsebody.bookingid).not.toBeNull(); 
    //expect(responsebody).toHaveProperty('bookingid');
    //expect(responsebody).toHaveProperty('bookingid').not.toBeNull();

    //Additional assertions to validate the response body against the payload
    expect(responsebody.booking).toBeDefined();
    expect(responsebody.booking.firstname).toBe(payload.firstname);
    expect(responsebody.booking.lastname).toBe(payload.lastname);
    expect(responsebody.booking.totalprice).toBe(payload.totalprice);
    expect(responsebody.booking.depositpaid).toBe(payload.depositpaid);
    expect(responsebody.booking.bookingdates.checkin).toBe(payload.bookingdates.checkin);
    expect(responsebody.booking.bookingdates.checkout).toBe(payload.bookingdates.checkout);
    expect(responsebody.booking.additionalneeds).toBe(payload.additionalneeds);
   console.log('All assertions passed successfully.');
});