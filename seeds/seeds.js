const User = require("../models/User.model");
const Trucks = require("../models/trucks.model")
const Board = require("../models/board.model")
const Wheels = require("../models/wheels.model")
const Skateboard = require("../models/skateboard.model")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const salt = 10
let password = "password"
const generatedSalt = bcrypt.genSaltSync(salt);
const saltedPassword = bcrypt.hashSync(password, generatedSalt);

const users = [
  {
    username: "Julien",
    password: saltedPassword,
    email: "julien@email.com",
    areaCode: 33,
    phoneNumber: 7123456789
  },
  {
    username: "Hamza",
    password: saltedPassword,
    email: "hamza@email.com",
    areaCode: 33,
    phoneNumber: 7987654321
  },
];


  mongoose
    .connect(`mongodb://127.0.0.1:27017/Le-Bon-Skate`)
    .then(async () => {
      await User.deleteMany();

      const users = await User.create(users);

      console.log(users);
      await mongoose.disconnect();
    })
    .catch ((error) => {
        console.log(`unable to connect`. error.message)
    })
