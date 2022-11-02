const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');
const checkDeleteDeviceFromBasket = require('../middleware/checkDeleteDeviceFromBasket');

router.post('/', authMiddleware, basketController.addDevice);
router.get('/devices', authMiddleware, basketController.getAllDevices);
router.get('/', basketController.getAllBaskets);
router.delete('/:id', authMiddleware, checkDeleteDeviceFromBasket, basketController.deleteDevice);

module.exports = router;
