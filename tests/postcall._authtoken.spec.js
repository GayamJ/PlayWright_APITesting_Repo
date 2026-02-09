import {test,expect} from '@playwright/test';
//import { readFileSync } from 'fs'; 
const authdata = {
    username: 'admin',
    password: 'password123'
};

test('Test1: Post Request test', async ({request}) => 
{
    const response = await request.post('https://restful-booker.herokuapp.com/auth', 
        {
        headers: { 'Content-Type': 'application/json' },
        data: authdata
        });
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');

    const responsedata = await response.json();
    //expect(responsedata.token).toBeTruthy();
    console.log('POST response body:', responsedata);
    console.log('POST response token:', responsedata.token);
//validation rules for token
expect(responsedata.token).not.toBeNull();
    expect(responsedata.token).toBeTruthy();
    expect(typeof responsedata.token).toBe('string');
    expect(responsedata.token.length).toBeGreaterThan(0);

});
