// STEP1: POST call using dynamic payload with faker and date manipulation using luxon library.
// STEP2: Validate the response body with the request payload and also validate the bookingid is generated or not using playwright assertions.
//STEP3: Export this response payload to a json file and use that json file and write to a testdata file in ./testdata/booking_dynamic_response.json file.
import {test,expect} from '@playwright/test';
import { faker} from '@faker-js/faker';
import {DateTime} from 'luxon';
import fs from 'fs';    //buitin module to read files
//const {DateTime} = require('luxon');  //for date manipulation

//Utility function to format string with placeholders   
//Example usage: const formattedString = stringformat("Hello {0}, welcome to {1}!", "Alice", "Playwright");
export const stringformat = (str,...args) => {
    return str.replace(/{(\d+)}/g, (match, index) => {
        return args[index] !== undefined ? args[index] : match;
    });
};

test('Create PostAPI using Dynamic payload', async ({request}) => {
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const totalprice = faker.number.int({ min: 100, max: 1000 });
    const depositpaid = faker.datatype.boolean();
    //const checkinDate = DateTime.now().plus({ days: 1 }).toISODate();
    //const checkoutDate = DateTime.now().plus({ days: 2 }).toISODate();
    const checkinDate = DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd');
    const checkoutDate = DateTime.now().plus({ days: 2 }).toFormat('yyyy-MM-dd');

 const postAPIResponse =   await request.post('https://restful-booker.herokuapp.com/booking', 
    {
        header: { 'Content-Type': 'application/json' },
        data: {
            firstname: firstname,
            lastname: lastname,
            totalprice: totalprice,
            depositpaid: depositpaid,
            bookingdates: {
                checkin: checkinDate,
                checkout: checkoutDate
            }
        }
    });
   

    const responseStatus = await postAPIResponse.status();
    console.log(`Post API response status: ${responseStatus}`);
    const responseBody = await postAPIResponse.json();
    console.log('Post API response body: ', responseBody);  

    //Assertions for validating the response
    expect(responseStatus).toBe(200);
    expect(responseBody.bookingid).not.toBeNull();
    expect(responseBody.booking).toBeDefined();
    expect(responseBody.booking.firstname).toBe(firstname);
    expect(responseBody.booking.lastname).toBe(lastname);
    expect(responseBody.booking.totalprice).toBe(totalprice);
    expect(responseBody.booking.depositpaid).toBe(depositpaid);
    expect(responseBody.booking.bookingdates.checkin).toBe(checkinDate);
    expect(responseBody.booking.bookingdates.checkout).toBe(checkoutDate);

    //Exporting the response body to a json file
    const responseData = {
        bookingid: responseBody.bookingid,  
        firstname: responseBody.booking.firstname,
        lastname: responseBody.booking.lastname,
        totalprice: responseBody.booking.totalprice,
        depositpaid: responseBody.booking.depositpaid,
        checkin: responseBody.booking.bookingdates.checkin,
        checkout: responseBody.booking.bookingdates.checkout
    };

    //const fs = require('fs');
    const path = './testdata/booking_dynamic_response.json';
    fs.writeFileSync(path, JSON.stringify(responseData, null, 2), 'utf-8');
    console.log(`Response data exported to ${path} successfully.`);
    });
