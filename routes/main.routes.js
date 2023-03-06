'use strict';

const router = require('express').Router();
const prefix = 'logs';

const controller = require('../controllers/main.controller');
const auth = require('../middlewares/auth');

router.get(`/${prefix}/`, auth, controller.all);
router.post(`/${prefix}/`, auth, controller.create);
router.get(`/${prefix}/:id`, auth, controller.info);
router.put(`/${prefix}/:id`, auth, controller.update);
router.delete(`/${prefix}/:id`, auth, controller.delete);

/* Aplications */
router.get(`/${prefix}/apps/initAplicacionsCollection/`, controller.initAplicacionsCollection);

/* Authorization */
router.post(`/${prefix}/apps/initAuthorizationCollection/:application_id`, controller.initAuthorizationCollection);

module.exports = router;