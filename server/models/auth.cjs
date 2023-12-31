require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connectDB = require('../db/index.cjs');

const EX_IP = process.env.EX_IP || '127.0.0.1';
const FE_PORT = process.env.VITE_APP_PORT;
let usersCollection;
let contactsCollection;
let medicineCollection;

const connectToCollection = async () => {
  if (usersCollection) {
    return;
  }
  try {
    const db = await connectDB();
    usersCollection = db.collection('users');
    contactsCollection = db.collection('contacts');
    medicineCollection = db.collection('medicines');
  } catch (err) {
    console.error(err);
    throw err;
  }
};

connectToCollection();

module.exports = {
  getAllUserInfo: async (username) => {
    // Get user Info
    const userData = await usersCollection.findOne({ username: username });
    // AggregateMedicine
    const medsCursor = await medicineCollection.aggregate([
      {
        $match: {
          userId: userData._id,
        },
      },
      {
        $project: {
          userId: 0,
        },
      },
      {
        $group: {
          _id: '$userId',
          medicines: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const medsData = await medsCursor.toArray();
    // Get contacts info
    const contactsData = await contactsCollection.findOne({
      userId: userData._id,
    });

    const responseBody = {
      user: userData,
      medicines: medsData[0].medicines,
      contacts: contactsData.contacts,
    };

    return responseBody;
  },

  register: async (reqBody) => {
    const { user, medicines, contacts } = reqBody;
    const userDocument = {
      name: user.name,
      email: user.email,
      username: user.username,
      password: '',
      authenticated: true,
      authorization: 'user',
      qrCode: `https://image-charts.com/chart?chs=150x150&cht=qr&chl=http://${EX_IP}:${FE_PORT}/guest/${user.username}&choe=UTF-8`,
      allergies: user.allergies,
    };

    const medicineDocuments = medicines.map((medicine) => ({
      name: medicine.name,
      time: medicine.time,
      timeTaken: null,
      taken: false,
    }));

    try {
      // Check if user exists, if so return
      const userDB = await usersCollection.findOne({ email: user.email });
      // const userNameExist = await usersCollection.findOne({
      //   username: user.username,
      // });
      if (userDB) {
        return false;
      }
      /////////////////////////Continue if User does not Exist/////////////////////////////////
      // Create Hashed password
      userDocument.password = await bcrypt.hash(user.password, 10);

      //  Insert user
      const userResult = await usersCollection.insertOne({
        ...userDocument,
      });
      const userId = userResult.insertedId;
      // sign token
      const token = jwt.sign(
        {
          userId: userId,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET
      );

      //  Insert Medicine
      await Promise.all(
        medicineDocuments.map(
          async (med) => await medicineCollection.insertOne({ userId, ...med })
        )
      );

      // Insert Contacts
      const contactResult = await contactsCollection.insertOne({
        contacts,
        userId,
      });

      // AggregateMedicine
      const medsCursor = await medicineCollection.aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $group: {
            _id: '$userId',
            medicines: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);

      const medsData = await medsCursor.toArray();

      const responseBody = {
        user: { id: userId, ...userDocument },
        // schedule: { id: schedResult.insertedId, scheduleDocument },
        medicines: medsData[0].medicines,
        contacts: { id: contactResult.insertedId, contacts },
        token,
      };
      console.log(responseBody);
      return responseBody;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  login: async (email, password) => {
    const userData = await usersCollection.findOne({ email: email });
    if (!userData) {
      return { status: 404, msg: 'No account with that email exists' };
    }
    console.log(userData);
    const isValidPass = await bcrypt.compare(password, userData.password);

    if (!isValidPass) {
      return { code: 401, msg: 'Invalid Password' };
    }
    const token = await jwt.sign(
      {
        userId: userData._id,
        username: userData.username,
        email: userData.email,
      },
      process.env.JWT_SECRET
    );

    return {
      code: 201,
      data: {
        username: userData.username,
        token: token,
      },
    };
  },
};
