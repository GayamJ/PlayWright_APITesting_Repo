import {test,expect} from '@playwright/test';
//import { readFileSync } from 'fs'; 
const bookingdata = { 
  firstname: 'jhon',
  lastname: 'test',
  totalprice: 140,
  depositpaid: false,
  bookingdates: { checkin: '2026-02-07', checkout: '2026-03-20' }
}


test('Test1: Post Request test', async ({request}) => 
{
    const response = await request.post('https://restful-booker.herokuapp.com/booking', 
        {
        headers: { 'Content-Type': 'application/json' },
        data: bookingdata
        });
    console.log('POST response status:', response.status());
    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');

    const responsedata = await response.json();
    //expect(responsedata.token).toBeTruthy();
    console.log('POST response body:', responsedata);
    console.log('POST response token:', responsedata.bookingid);
//Validation of response body
    expect(responsedata.bookingid).not.toBeNull();

    expect(responsedata).toHaveProperty("firstname", bookingdata.firstname);
    expect(responsedata).toHaveProperty("lastname", bookingdata.lastname);
    expect(responsedata).toHaveProperty("totalprice", bookingdata.totalprice);
    expect(responsedata).toHaveProperty("depositpaid", bookingdata.depositpaid);
    expect(responsedata.bookingdates).toHaveProperty("checkin", bookingdata.bookingdates.checkin);
    expect(responsedata.bookingdates).toHaveProperty("checkout", bookingdata.bookingdates.checkout);

});

/*
POST response status: 200
POST response body: {
  bookingid: 357,
  booking: {
    firstname: 'Mary',
    lastname: 'Jones',
    totalprice: 140,
    depositpaid: false,
    bookingdates: { checkin: '2026-02-07', checkout: '2026-03-20' }
  }
}
POST response token: 357

*/