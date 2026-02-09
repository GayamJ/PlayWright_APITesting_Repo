import {test,expect} from '@playwright/test';

const BASE = process.env.API_BASE || 'https://jsonplaceholder.typicode.com';

// Test1: Very Get request from API for id = 10 before put request to verify the title is not changed

test('Get Request test', async ({request}) => {
    const response = await request.get(`${BASE}/posts/1`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.userId).toBe(1);
    expect(body.title).toBe('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
});


// Test2: Put request to change the title and body of post with id = 1
test('Put Request test', async ({request}) => { 
    const response = await request.put(`${BASE}/posts/1`, 
        {
        data: {
  "userId": 1,
  "id": 1,
  "title": "I want to change the title to test put request",
  "body": "Mock testing put request"
        },
        headers: { 'Content-Type': 'application/json' }
       });
    expect(response.status()).toBe(200);
    // The fake JSONPlaceholder API returns the JSON you send but does not persist changes.
    // Assert the PUT response body to verify the request succeeded.
    const putBody = await response.json();
    expect(putBody.title).toBe('I want to change the title to test put request');
    console.log('PUT response body:', putBody);
});

// Test3: I want to verify above put request in mock server by doing get request after put request
/* 
Note: JSONPlaceholder does not persist changes from PUT requests. 
This test will assert the original data instead of the changed title.
*/

test('Get Request after Put Request test', async ({request}) => { 
    // JSONPlaceholder does not persist PUT changes. Assert the original data instead.
    const response = await request.get(`${BASE}/posts/1`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.userId).toBe(1);
    expect(body.title).toBe('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
}) ;
