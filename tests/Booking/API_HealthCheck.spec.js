import {test,expect} from '@playwright/test';

test('API Health Check: GET /ping', async ({request}) => {
    test.setTimeout(60000); // Set timeout to 60 seconds for this test or 0 for no timeout
    while(true) {
    const beforetesttime =  Date.now();
    console.log('API Health Check test started at:', beforetesttime);
    const response = await request.get('https://restful-booker.herokuapp.com/ping');
    const aftertesttime = Date.now();
    console.log('API Health Check test ended at:', aftertesttime);
    const responsetime = aftertesttime - beforetesttime;
    if(responsetime > 1000) 
    {
        console.warn('API Health Check response time is greater than 1000 ms:', responsetime, 'ms');
    }
    else {
        console.log('API Health Check response time (ms):', responsetime);
    }
    expect(response.status()).toBe(201);
    console.log('API Health Check response status:', response.status());
    //console.log('API Health Check response status text:', response.statusText());
}

})