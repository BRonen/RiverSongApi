const fs = require('fs');
const upload = require('./upload');

const routes = require('express').Router();

routes.get('/test', (req, res) => (
	res.json({'status': 'Listening'})
));

routes.use('/', (req, res, next) => {
	console.log('[server]: new client in progress...');
	next();
});

routes.get('/', (req, res) => {
	fs.readFile(__dirname+'/../musics/index.json', function(err, data) {
    if(err) return console.log('reading', err);
    const musics = JSON.parse(data);

		return res.json(musics);
	});
});

routes.get('/musics/:id', (req, res) => {
	if(req.params.id.length != 13){
		return res.json({err: 'invalid id'});
	}

	fs.readFile(__dirname+'/../musics/index.json', function(err, data) {
    if(err) console.log('reading err: ', err);
    const musics = JSON.parse(data);

		let path;

		musics.forEach( file => {
			if(file.id === req.params.id){
				path = file.path;
			}
		} );

		if(path){
			return res.download(path);
		}

		return res.json({err: 'file not found'});
	});
});

routes.post('/', upload.any('music'), (req, res) => {
	if(!req.body.name){
		return res.json({'server': 'Name of music uploaded invalid'});
	}
	if(!req.body.singer){
		return res.json({'server': 'Singer of music uploaded invalid'});
	}
	if(req.files.length !== 1){
		return res.json({'server': 'Number of musics uploaded invalid'});
	}

	const music = {
		name: req.body.name,
		singer: req.body.singer,
		id: req.files[0].filename.slice(0, 13),
		path: req.files[0].path
	};

	fs.readFile(__dirname+'/../musics/index.json', function(err, data) {
    if(err) return console.log('reading err: ', err);

    const musics = JSON.parse(data);

		musics.push(music);

		fs.writeFile(__dirname+'/../musics/index.json', JSON.stringify(musics), (err) => {
		  if(err) return console.log('writing err: ', err);
		  console.log('Successfully Written to File.');
		});

		return res.json({'server': music});
	});
});

module.exports = routes;