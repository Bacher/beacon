const Server = require('../json-protocol/Server');

const server = new Server({
    suppressSocketErrors: true
});

const connections = new Map();

server.on('connection', connection => {
    console.log('new connection');

    let id = null;

    connection.on('close', () => {
        console.log('disconnect:', id);
        if (id) {
            connections.delete(id);
        }
    });

    connection.on('message', data => {

        switch (data.name) {
            case 'register':
                id = data.id;
                console.log('register:', id);
                connections.set(id, connection);
                break;
            case 'message':
                console.log('call message');
                const receiver = connections.get(data.receiverId);

                if (receiver) {
                    receiver.send({
                        name: 'message',
                        data: data.data
                    });
                } else {
                    console.log('MESSAGE TO NOTHING');
                }
                break;
            default:
                console.log('Unknown package', data);
        }
    });
});

server.listen({
    host: '0.0.0.0',
    port: 8123
}, err => {
    if (err) {
        console.error('Listen', err);
    } else {
        console.log('== Server started ==');
    }
});

