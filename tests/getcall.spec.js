import {test,expect} from '@playwright/test';
//import { readFileSync } from 'fs';
test('Test1: Get Request test', async ({request}) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking/10');
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');

    const responsebody = await response.json();
    console.log('GET response body:', responsebody);
});