const { Order, OrderDevice, Device, Brand, Type } = require('../models/models');
const jwt = require('jsonwebtoken');

class OrderController {
  async create(req, res) {
    const auth = req.headers.authorization || '';
    const { mobile, basket } = req.body;

    try {
      let parseDevices = [];
      for (let key of basket) {
        parseDevices.push(key.id);
      }

      const isDeviceInDb = await Device.findAndCountAll({
        where: { id: parseDevices },
        attributes: ['id'],
      });

      if (isDeviceInDb.count === parseDevices.length) {
        // Если все девайсы будут найдены в ДБ
        const row = { mobile };
        if (auth) {
          const token = auth.split(' ')[1];
          const { id } = jwt.verify(token, process.env.SECRET_KEY);
          row.userId = id;
        }

        await Order.create(row).then((order) => {
          const { id } = order.get();
          parseDevices.forEach(async (deviceId, i) => {
            await OrderDevice.create({
              orderId: id,
              deviceId,
              count: basket[i].count,
            });
          });
        });
      } else {
        // Отправка сообщения о девайсах, которые не найдены в БД
        const notFoundIdDevices = [];
        const arrDevices = []; // Найденный id
        isDeviceInDb.rows.forEach((item) => arrDevices.push(item.id));
        parseDevices.forEach((deviceId) => {
          if (!arrDevices.includes(deviceId)) {
            notFoundIdDevices.push(deviceId);
          }
        });
        return ApiError.badRequest(res.json(`Устройства с таким id ${notFoundIdDevices.join(', ')} не существуют в ДБ`))
      }

      return res.json('Спасибо за ваш заказ! Мы скоро свяжемся с вами!')
    } catch (e) {
      return res.json(e);
    }
  }
}

module.exports = new OrderController();
