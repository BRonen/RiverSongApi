const express = require('express');
const cors = require('cors');

const routes = require('./routes');

class App{
	constructor(){
		this.app = express();
		this.middlewares();
		this.routes();
	}

	middlewares(){
		this.app.use(cors());
	}

	routes(){
		this.app.use('/api', routes);
	}

	listen(port){
		this.app.listen(port, () => {
			console.log(`[server]: Listening at http://localhost:${port}/`);
		});
	}
}

module.exports = new App();