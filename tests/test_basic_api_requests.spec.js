import  {test,expect} from '@playwright/test';

test('Get Request test', async ({request}) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.status()).toBe(200);
    console.log('GET response status:', response.status());
    console.log('GET response status text:', response.statusText());
    expect(response.statusText()).toBe('OK');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    console.log('GET response body:', body);

    const responseheader = response.headers();
    console.log('GET response headers:', responseheader);
//To capture header in array use headersArray() method to get all headers as an array of objects with name and value properties.
    const headerArray = response.headersArray();
    console.log('GET response header array:', headerArray);

});

/*
test('Post Request test', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            postId: 1,
            id: 10,
            name: 'id labore ex et quam laborum',
            email: 'Eliseo@gardner.biz',
            body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium'
        },
        headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
});
*/