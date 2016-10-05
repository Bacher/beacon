const Client = require('../../json-protocol/Client');

const client = new Client({
    host: 'localhost',
    port: 8123,
    autoReconnect: true
});

client.connect();

setTimeout(() => {
    client.send({
        name: 'register',
        id:   Number(process.argv[2])
    });

    setTimeout(() => {
        client.send({
            name:       'message',
            receiverId: Number(process.argv[3]),
            data:       { hello: 'world' }
        });
    }, 500);

}, 500);

client.on('message', data => {
    console.log('REC DATA', data);
});
