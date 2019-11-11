var http = require('http');
var url = require('url');
var WebSocketServer = require('websocket').server;
var server = http.createServer((request, response) => {
    /**
     * Receives POST parameter for notification
     */
    const getPostParam = (request, callback) => {
		const querystring = require('querystring')
        if (request.method === "POST") {
            var body = '';

            request.on('data', (data) => {
	            body += data;
	            if (body.length > 1e6) {
	                request.connection.destroy();
                }
	        });

	        request.on('end', () => {
				const POST = querystring.parse(body);
	            callback(POST);
	        });
        }
    }

    if (request.method === 'POST') {
        getPostParam(request, (POST) => {
			try {
                const {id, receiverId, message} = JSON.parse(POST.data)
				notifyUser(id, receiverId, message);
				response.writeHead(200);
			} catch (e) {
				response.writeHead(500);
			}
			response.end();
        })
        return;
    }
});
server.listen(8080, '127.0.0.1');

global.clients = {}; // store the connections

var websocketServer = new WebSocketServer({
    httpServer: server
});

const websocketRequest = request => {
    // start the connection
    try {
        const { query: { id }} = url.parse(request.resource, true);
        var connection = request.accept(null, request.origin); 
        console.log(`New Connection ${id}`)
        // save the connection for future reference
        clients[Number(id)] = connection;
    } catch (e) {
        console.log('Unable to start a connection');
        console.error(e);
    }
}

websocketServer.on("request", websocketRequest);

const notifyUser = (notificationId, userId, message) => {
	if (clients[Number(userId)]) {
		clients[Number(userId)].sendUTF(JSON.stringify({
            notificationId,
            message
        }))
	}
}