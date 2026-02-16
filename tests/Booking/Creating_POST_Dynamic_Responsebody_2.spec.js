import {test,expect} from '@playwright/test';
import fs from 'fs';      //buitin module to read files
//import { fi } from '@faker-js/faker';
import { stringformat } from '../../testdata/common.js'; //Importing the stringformat function from the first spec file
//const { stringformat } = require('../testdata/common');


//Utility function to format string with placeholders   
//Example usage: const formattedString = stringformat("Hello {0}, welcome to {1}!", "Alice", "Playwright");
/*
export const stringformat = (str,...args) => {
      return str.replace(/{(\d+)}/g, (match, index) => {
        return args[index] !== undefined ? args[index] : match;
    });
};
*/
//Reading the payload template from a json file
//const readfile = fs.readFileSync('./testdata/booking_payload.json', 'utf-8'); //reading the file from
const payloadTemplate = fs.readFileSync('./testdata/payloadTemplate.json', 'utf-8');

test('Create PostAPI using Dynamic payload and export response body to json file', async ({request}) => 
{     
    const formattedPayload = stringformat(payloadTemplate, "John",  "Doe",  500,  true,'2026-02-14','2026-03-14', "Breakfast");

    const payload = JSON.parse(formattedPayload); //converting string to json object 

    const response = await request.post('https://restful-booker.herokuapp.com/booking', 
        { header: { 'Content-Type': 'application/json' },
        data: payload
    });
    
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);
    //expect(response.status()).toBe(200);
    //Exporting the response body to a json file
    fs.writeFileSync('testdata/Dynamic_responseBody.json', JSON.stringify(responseBody, null, 2));
});

test('Get call with parameters', async ({request}) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking',
        {
        params:{"firstname":"ads"}
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);
});

test('Get call', async ({request}) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking/1960'
    // ,
    //     {
    //     params:{"firstname":"ads"}
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);
});