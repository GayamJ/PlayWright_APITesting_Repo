import {test,expect} from '@playwright/test';
import fs from 'fs';    //buitin module to read files
//import { fi } from '@faker-js/faker';
import { stringformat } from '../testdata/common.js'; //Importing the stringformat function from the first spec file
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

test('Create PostAPI using Dynamic payload and export response body to json file', async ({request}) => 
{
    //Reading the payload template from a json file
    const payloadTemplate = JSON.parse(fs.readFileSync('testdata/payloadTemplate.json', 'utf-8'));
    //Generating dynamic data for the payload
    const dynamicData = {
        firstname: "John",
        lastname: "Doe",
        totalprice: 500,
        depositpaid: true,
        checkinDate: "2024-07-01",
        checkoutDate: "2024-07-10"
    };

    //Formatting the payload template with dynamic data
    const formattedPayload = stringformat(payloadTemplate, 
        dynamicData.firstname,
        dynamicData.lastname,
        dynamicData.totalprice,
        dynamicData.depositpaid,
        dynamicData.checkinDate,
        dynamicData.checkoutDate
    );

    const payload = JSON.parse(formattedPayload); //converting string to json object

    const response = await request.post('https://restful-booker.herokuapp.com/booking', 
        { header: { 'Content-Type': 'application/json' },
        data: payload
    });

    //Exporting the response body to a json file
    fs.writeFileSync('testdata/Dynamic_responseBody.json', JSON.stringify(response.body(), null, 2));
});