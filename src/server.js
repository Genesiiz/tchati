import http from 'http';
import polka from 'polka';
import io from 'socket.io';
import sirv from 'sirv';
// import serveStatic from 'serve-static'; // NOTE: Not sure to use this ?
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const server = http.createServer();
const files = sirv('static', { dev });
// const staticFiles = serveStatic('__sapper__/export');

// Init
polka({ server })
	.use(
		compression({ threshold: 0 }),
		// staticFiles,
		files,
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) throw err;
		console.log(`> Running on localhost:${PORT}`);
	});


// Chat room
let numUsers = 0;
io(server).on('connection', socket => {
	let added = false;

	// when the client emits 'new message', this listens and executes
	socket.on('new message', data => {
		// we tell the client to execute 'new message'
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		})
	});

	// when the client emits 'add user', this listens and executes
	socket.on('add user', username => {
		if (added) return;
		console.log(username);

		// we store the username in the socket session for this client
		socket.username = username;
		++numUsers;
		added = true;
		socket.emit('login', { numUsers });
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('user joined', { username, numUsers });
	});

	// when the client emits 'typing', we broadcast it to others
	socket.on('typing', _ => socket.broadcast.emit('typing', { username: socket.username }));

	// when the client emits 'stop typing', we broadcast it to others
	socket.on('stop typing', _ => socket.broadcast.emit('stop typing', { username: socket.username }));

	// when the user disconnects.. perform this
	socket.on('disconnect', _ => {
		if (added) {
			--numUsers;
			// echo globally that this client has left
			socket.broadcast.emit('user left', { numUsers, username: socket.username });
		}
	});
});
