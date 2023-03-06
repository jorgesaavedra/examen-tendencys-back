'use strinct';
let DataBase = require('../db/db');
const ObjectID = require('mongodb').ObjectId;
const Joi = require('joi');
const schema = Joi.object({
	type: Joi.string().valid('error','info', 'warning').required(),
	priority: Joi.string().valid('lowest','low', 'medium', 'high', 'highest').required(),
	path: Joi.string().required(),
	message: Joi.string().required(),
	request: Joi.string().required(),
	response: Joi.string().required()
});
class MainController {

	async all(req, res, next) {
		let db = await DataBase.getDB();
		let collection = await db.collection("Logs");
		await collection.find({}).toArray().then(function(r){
			res.json(r);
		});
	}

	async create(req, res, next) {
		const application_id = req.body.application_id;
		const type = req.body.type;
		const priority = req.body.priority;
		const path = req.body.path;
		const message = req.body.message;
		const request = req.body.request;
		const response = req.body.response;
		
		const validate = { type: type, priority: priority, path: path, message: message, request: request, response: response };

		if(ObjectID.isValid(application_id) == false) return res.json({error: `${application_id} no es un identificador de aplicacion valido.`});
		
		const { value, error } = schema.validate(validate); 
		if (error != null) return res.status(400).json({message: error.details[0].message, data: req.body });

		let db = await DataBase.getDB();
		let collection = await db.collection("Logs");
		const log = { application_id: application_id, type: type, priority: priority, path: path, message: message, request: request, response: response, created_at: new Date(), updated_at: new Date() };
		await collection.insertOne(log).then(function(r){
			res.json(r);
		});
	}

	async info(req, res, next) {
		const id = req.params.id;
		if(ObjectID.isValid(id) == false) return res.json({error: `${id} no es un identificador valido.`});
		let db = await DataBase.getDB();
		let collection = await db.collection("Logs");

		await collection.find({_id: new ObjectID(id)}).toArray().then(function(r){
			if (r.length > 0) {
				res.json(r);
			} else {
				res.json({error: `No se encontraron los datos del log con el id ${id}`});
			}
		}).catch(function(e) {
			res.json({error: e});
		});
	}

	async update(req, res, next) {
		const id = req.params.id;
		const application_id = req.body.application_id;
		const type = req.body.type;
		const priority = req.body.priority;
		const path = req.body.path;
		const message = req.body.message;
		const request = req.body.request;
		const response = req.body.response;

		const validate = { type: type, priority: priority, path: path, message: message, request: request, response: response };

		if(ObjectID.isValid(id) == false) return res.json({error: `${id} no es un identificador valido.`});
		if(ObjectID.isValid(application_id) == false) return res.json({error: `${application_id} no es un identificador de aplicacion valido.`});

		const { value, error } = schema.validate(validate); 
		if (error != null) return res.status(400).json({message: error.details[0].message, data: req.body });

		let db = await DataBase.getDB();
		let collection = await db.collection("Logs");
		const updateLog = { $set: { application_id: application_id, type: type, priority: priority, path: path, message: message, request: request, response: response, updated_at: new Date() }};
		await collection.find({_id: new ObjectID(id)}).toArray().then(function(r){
			if (r.length > 0) {
				collection.updateOne({_id: new ObjectID(id)}, updateLog ).then(function(r){res.json(r)});
			} else {
				res.json({error: `No se encontraron los datos del log con el id ${id}`});
			}
		}).catch(function(e) {
			res.json({error: e});
		});
	}

	async delete(req, res, next) {
		const id = req.params.id;
		if(ObjectID.isValid(id) == false) return res.json({error: `${id} no es un identificador valido.`});

		let db = await DataBase.getDB();
		let collection = await db.collection("Logs");

		await collection.find({_id: new ObjectID(id)}).toArray().then(function(r){
			if (r.length > 0) {
				collection.deleteOne({_id: new ObjectID(id)}).then(function(r){res.json(r)});
			} else {
				res.json({error: `No se encontraron los datos del log con el id ${id}`});
			}
		}).catch(function(e) {
			res.json({error: e});
		});
	}

	
	async listDatabases(client){
		databasesList = await client.db().admin().listDatabases();
		databasesList.databases.forEach(db => console.log(` - ${db.name}`));
	};

	async initAplicacionsCollection(req, res, next){
		let db = await DataBase.getDB();
		let collection = await db.collection("Aplications");
		const apps = [
			{ nombre: "Aplicacion 1", created_at: new Date(), updated_at: new Date() },
			{ nombre: "Aplicacion 2", created_at: new Date(), updated_at: new Date() },
			{ nombre: "Aplicacion 3", created_at: new Date(), updated_at: new Date() },
			{ nombre: "Aplicacion 4", created_at: new Date(), updated_at: new Date() }
		];
		const options = { ordered: true };
		await collection.deleteMany();
		await collection.insertMany(apps, options);
		await collection.find({}).toArray().then(function(r){
			res.json(r);
		});
	};

	async initAuthorizationCollection(req, res, next){
		let db = await DataBase.getDB();
		let collection = await db.collection("Authorizations");
		const token = {application_id: req.params.application_id, token: "1ohaBulRHFaBUzDr/3QTdA==", created_at: new Date(), updated_at: new Date()};
		await collection.deleteMany();
		await collection.insertOne(token);
		await collection.find({}).toArray().then(function(r){
			res.json(r);
		});
	};
}

module.exports = new MainController();
