const { CreateLoginUser } = require('../models/index.cjs');

module.exports = {
  getAllUserInfo: async (req, res) => {
    const { email } = req.params;
    try {
      const responseBody = await CreateLoginUser.getAllUserInfo(email);
      res.send(responseBody);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  createUser: async (req, res) => {
    const { body } = req;
    try {
      const responseBody = await CreateLoginUser.createUser(body);
      // const responseBody = {
      //   user: { id: ids.userId, ...body.user },
      //   schedule: { id: ids.scheduleId, schedule: body.sched },
      // };
      res.status(201).send(responseBody);
    } catch (err) {
      res.status(400).send(err);
      throw err;
    }
  },
};