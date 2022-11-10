const Router = require('express');
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

router.post('/', authMiddleware, ratingController.addRating);
router.get('/', authMiddleware, ratingController.getAll);

module.exports = router;
