const Bank = require("../models/Bank");
const Category = require("../models/Category");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const Booking = require("../models/Booking");
const Member = require("../models/Member");
const fs = require("fs-extra");
const path = require("path");
const Image = require("../models/Image");
const Item = require("../models/Item");
const Users = require("../models/Users");
const bycrypt = require("bcryptjs");

module.exports = {
  viewSignIn: (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          title: "Sign In",
          alert,
        });
      } else {
        res.redirect('/admin/dashboard');
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/signin");
    }
  },

  actionSignIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      const isPasswordMatch = await bycrypt.compare(password, user.password);

      if (user && isPasswordMatch) {
        req.session.user = {
          id: user.id,
          username: user.username,
        };
        res.redirect('/admin/dashboard');
      } else {
        req.flash("alertMessage", `Incorrect combination of username and password.`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
    } catch (error) {
      req.flash("alertMessage", `Incorrect combination of username and password.`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/signin");
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect('/admin/signin');
  },

  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("admin/dashboard/view", {
        title: "Dashboard",
        user: req.session.user,
        member,
        booking,
        item,
      });
    } catch (error) {
      res.redirect("/admin/dashboard");
    }
  },

  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view", {
        category,
        title: "Category",
        alert,
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/dashboard", {
        title: "Category",
      });
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "Add successful.");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Update successful.");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash("alertMessage", "Delete successful.");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/bank/view", {
        title: "Bank",
        bank,
        alert,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.render("admin/bank/view", {
        title: "Bank",
      });
    }
  },

  addBank: async (req, res) => {
    try {
      const { bankName, accountNumber, accountName } = req.body;
      await Bank.create({
        bankName,
        accountName,
        accountNumber,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Add successful.");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, bankName, accountName, accountNumber } = req.body;
      const bank = await Bank.findOne({ _id: id });

      if (req.file == undefined) {
        bank.bankName = bankName;
        bank.accountName = accountName;
        bank.accountNumber = accountNumber;
        await bank.save();
        req.flash("alertMessage", "Update successful.");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.bankName = bankName;
        bank.accountName = accountName;
        bank.accountNumber = accountNumber;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", "Update successful.");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Delete successful.");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  viewItem: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const category = await Category.find();
      const item = await Item.find()
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      res.render("admin/item/view", {
        title: "Item",
        alert,
        category,
        item,
        action: "view",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  addItem: async (req, res) => {
    try {
      if (req.files.length > 0) {
        const { title, price, city, country, categoryId, description } =
          req.body;
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          title,
          price,
          city,
          country,
          description,
          categoryId: category._id,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let idxImg = 0; idxImg < req.files.length; idxImg++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[idxImg].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMessage", "Add successful.");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "categoryId",
        select: "id name",
      });
      const category = await Category.find();
      const alertMessage = req.flash("alerMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view", {
        title: "Edit Item",
        category,
        item,
        action: "edit",
        alert,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  updateItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, price, city, country, categoryId, description } =
        req.body;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });

      if (categoryId !== item.categoryId) {
        const category = await Category.findOne({ _id: item.categoryId });
        let arrayCat = category.itemId;
        let arrayCatIndex = arrayCat.indexOf(item._id);
        if (arrayCatIndex !== -1) {
          category.itemId.splice(arrayCatIndex, 1);
          await category.save();
        }
        const newCategory = await Category.findOne({ _id: categoryId });
        newCategory.itemId.push({ _id: item._id });
        await newCategory.save();
      }

      if (req.files.length > 0) {
        for (let idxImg = 0; idxImg < item.imageId.length; idxImg++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[idxImg]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[idxImg].filename}`;
          await imageUpdate.save();
        }
      }

      item.title = title;
      item.price = price;
      item.city = city;
      item.country = country;
      item.description = description;
      item.categoryId = categoryId;
      await item.save();
      req.flash("alertMessage", "Update successful.");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate('imageId').populate('categoryId');
      const category = await Category.findOne({ _id: item.categoryId });

      let arrayCat = category.itemId;
      let arrayCatIndex = arrayCat.indexOf(item._id);
      if (arrayCatIndex !== -1) {
        category.itemId.splice(arrayCatIndex, 1);
        await category.save();
      }

      for (let idxImg = 0; idxImg < item.imageId.length; idxImg++) {
        Image.findOne({ _id: item.imageId[idxImg]._id }).then((image) => {
          fs.unlink(path.join(`public/${image.imageUrl}`));
          image.remove();
        }).catch((error) => {
          req.flash("alertMessage", `${error.message}`);
          req.flash("alertStatus", "danger");
          res.redirect("/admin/item");
        });
      }

      await item.remove();
      req.flash("alertMessage", "Delete successful.");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  viewDetailItem: async (req, res) => {
    try {
      const { itemId } = req.params;
      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item/detailItem/viewDetailItem', {
        title: 'Show Detail Item',
        alert,
        itemId,
        feature,
        activity,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  addItemFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", 'Image not found');
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }

      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push(feature._id);
      await item.save();
      req.flash('alertMessage', 'Add successful');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  updateItemFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file) {
        fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.imageUrl = `images/${req.file.filename}`;
      }
      feature.name = name;
      feature.qty = qty;
      await feature.save();
      req.flash('alertMessage', 'Update successful');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteItemFeature: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId });

      let arrayCatItem = item.featureId;
      let arrayCatItemIndex = arrayCatItem.indexOf(feature._id);
      if (arrayCatItemIndex !== -1) {
        item.featureId.splice(arrayCatItemIndex, 1);
        await item.save();
      }

      fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash('alertMessage', 'Delete successful');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${item._id}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  addItemActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", 'Image not found');
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }

      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.push(activity._id);
      await item.save();

      req.flash('alertMessage', 'Add successful');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  updateItemActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file) {
        fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.imageUrl = `images/${req.file.filename}`;
      }
      activity.name = name;
      activity.type = type;
      await activity.save();
      req.flash('alertMessage', 'Update successful');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteItemActivity: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId });

      let arrayActItem = item.activityId;
      let arrayActItemIndex = arrayActItem.indexOf(activity._id);
      if (arrayActItemIndex !== -1) {
        item.activityId.splice(arrayActItemIndex, 1);
        await item.save();
      }

      fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash('alertMessage', 'Delete successful');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${item._id}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view", {
        title: "Show Image Item",
        action: "show image",
        alert,
        item,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate('memberId')
        .populate('bankId');
      res.render("admin/booking/view", {
        title: "Booking",
        user: req.session.user,
        booking
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/booking");
    }
  },

  showDetailBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id })
        .populate('memberId')
        .populate('bankId');
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/booking/viewDetailBooking', {
        title: 'Detail Booking',
        booking,
        user: req.session.user,
        alert,
      });
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },

  actionConfirmation: async (req, res) => {
    const { id, stat } = req.body;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = stat;
      let alertMessage, alertStatus;
      if (stat === 'Accepted') {
        alertMessage = 'Booking accepted.';
        alertStatus = 'success';
      } else if (stat === 'Rejected') {
        alertMessage = 'Booking rejected.';
        alertStatus = 'danger';
      }
      await booking.save();
      req.flash('alertMessage', alertMessage);
      req.flash('alertStatus', alertStatus);
      res.redirect(`/admin/booking/${booking.id}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/booking/${id}`);
    }
  }
};
