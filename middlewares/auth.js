let DataBase = require('../db/db');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let db = await DataBase.getDB();
    let collection = await db.collection("Authorizations");
    await collection.find({token: token}).toArray().then(function(r){
        if (r.length > 0) {
          next();
        } else {
          res.status(401).json({error: 'Invalid token'});
        }
    }).catch(function(e) {
      res.status(401).json({error: e});
    });
    
  } catch {
    res.status(401).json({error: 'Invalid request!'});
  }
};