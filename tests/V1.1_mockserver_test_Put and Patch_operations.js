import {test,expect} from '@playwright/test';
import { readFileSync } from 'fs';

process.env.PORT = process.env.PORT || '0';
let server;
let BASE;

test.describe.serial('Mock server PUT/PATCH operations', () => {
    test.beforeAll(async () => {
        const mod = await import('../mock-server');
        server = mod.default || mod;
        const addr = server.address();
        BASE = process.env.API_BASE || `http://localhost:${addr && addr.port}`;
    });

// Test1: Very Get request from API for id = 10 before put request to verify the title is not changed

test('Test1: Get Request test', async ({request}) => {
    const response = await request.get(`${BASE}/posts/1`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.userId).toBe(1);
    //expect(body.title).toBe('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
});

// Test2: Put request to change the title and body of post with id = 1
test('Test2: Put Request test', async ({request}) => { 
    // Read payload from file so tests can use external JSON fixtures
    const raw = readFileSync('tests/putPayload.json', 'utf8');
    const payload = JSON.parse(raw);

    const response = await request.put(`${BASE}/posts/1`, {
        data: payload,
        headers: { 'Content-Type': 'application/json' }
    });

    expect(response.status()).toBe(200);
    // Assert the returned body contains the supplied title
    const putBody = await response.json();
    expect(putBody.title).toBe(payload.title);
    console.log('PUT response body:', putBody);
});

// Test3: I want to verify above put request in mock server by doing get request after put request
/* 
Note: JSONPlaceholder does not persist changes from PUT requests. 
This test will assert the original data instead of the changed title.
*/

test('Test3: Get Request after Put Request test', async ({request}) => { 
    // JSONPlaceholder does not persist PUT changes. Assert the original data instead.
    const response = await request.get(`${BASE}/posts/1`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.userId).toBe(1);
    expect(body.title).toBe('Verstion2: I want to change the title');
    expect(body.Updatedate).toBe('2026-02-07T19:50:00.000Z');
}) ;

    test.afterAll(async () => {
        await server.closeAsync();
    });
});
