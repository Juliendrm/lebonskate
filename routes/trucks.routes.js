const router = require("express").Router();
const Trucks = require("../models/trucks.model");
const Order = require("../models/Order.model");
const isAuth = require("../middleware/middleware");
const User = require("../models/User.model");

router.post("/", isAuth, async (req, res, next) => {
  try {
    const { brand, color } = req.body;
    const newTrucks = await Trucks.create({
      brand: brand,
      color: color,
      seller: req.user.id,
    });
    //console.log(newTrucks);
    res.status(201).json(newTrucks);
  } catch {
    res.status(400);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const trucksFound = await Trucks.aggregate([
      {
        $match: { sold: false },
      },
      {
        $lookup: {
          from: "skateboards",
          localField: "_id",
          foreignField: "trucks",
          as: "result",
        },
      },
      {
        $match: {
          "result.0": {
            $exists: false,
          },
        },
      },
      {
        $unset: "result",
      },
    ]);

    res.status(201).json(trucksFound);
  } catch {
    res.status(400);
  }
});

// post trucks order
router.post("/:id", isAuth, async (req, res, next) => {
  const trucks = await Trucks.findById(req.params.id);
  console.log(trucks);
  const seller = await User.findById(trucks.seller);
  console.log(seller);
  try {
    const newOrder = await Order.create({
      buyer: req.user.id,
      seller: seller.id,
      trucks: trucks.id,
    });
    console.log(newOrder);
    const populatedOrder = await Order.findById(newOrder.id).populate(
      "buyer",
      "-password"
    );
    res.status(201).json(populatedOrder);
  } catch {
    res.status(400);
  }
});

router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const trucksPartOfSkateboard = await Skateboard.find({
      board: req.params.id,
    });

    console.log(trucksPartOfSkateboard);
    console.log(`test`);
    if (trucksPartOfSkateboard.length !== 0) {
      return res
        .status(406)
        .json({ message: `cannot delete componant of complete skateboard` });
    }

    console.log(req.params.id, req.user.id);
    const deleteTrucks = await Board.findOneAndRemove({
      _id: req.params.id,
      seller: req.user.id,
    });
    if (!deleteTrucks) {
      res.sendStatus(404);
    }
    res.status(204).json;
  } catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;
