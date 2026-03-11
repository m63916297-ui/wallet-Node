const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middleware/auth');

router.get('/public', settingController.getPublicSettings);

router.get('/', auth, settingController.getAllSettings);
router.get('/init', auth, settingController.initSettings);
router.get('/:key', auth, settingController.getSetting);
router.post('/', auth, settingController.createSetting);
router.put('/:key', auth, settingController.updateSetting);
router.delete('/:key', auth, settingController.deleteSetting);

module.exports = router;
