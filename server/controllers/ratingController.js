const { Rating, Basket, BasketDevice, Device } = require('../models/models');
const jwt = require('jsonwebtoken');

class RatingController {
  async addRating(req, res) {
    try {
      const { rate, deviceId } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      const { id } = jwt.verify(token, process.env.SECRET_KEY);
      await Rating.create({ rate, deviceId, userId: id});
      
      let rating = await Rating.findAndCountAll({
        where: { deviceId },
      });

      let allRating = 0;
      let middleRating;

      rating.rows.forEach((item) => (allRating += item.rate));
      middleRating = Number(allRating) / Number(rating.count);

      await Device.update({ rating: Math.round(middleRating) }, { where: { id: deviceId } });

      return res.json('Рейтинг добавлен');
    } catch (e) {
      console.error(e);
    }
  }
  async getAll(req, res) {
    const ratings = await Rating.findAll();
    return res.json(ratings);
  }
}

module.exports = new RatingController();
