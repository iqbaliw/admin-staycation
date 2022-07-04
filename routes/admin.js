const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middlewares/multer');
const { isLogin } = require('../middlewares/auth');

router.get('/signin', adminController.viewSignIn);
router.post('/signin', adminController.actionSignIn);
router.get('/logout', adminController.actionLogout);
router.use(isLogin);
router.get('/dashboard', adminController.viewDashboard);

// endpoint category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

// endpoint bank
router.get('/bank', adminController.viewBank);
router.post('/bank', upload, adminController.addBank);
router.put('/bank', upload, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);

// endpoint item
router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/:id', adminController.showEditItem);
router.put('/item/:id', uploadMultiple, adminController.updateItem);
router.delete('/item/:id/delete', adminController.deleteItem);

//endpoint detail item
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature', upload, adminController.addItemFeature);
router.put('/item/update/feature', upload, adminController.updateItemFeature);
router.delete('/item/:itemId/feature/:id/delete', adminController.deleteItemFeature);
router.post('/item/add/activity', upload, adminController.addItemActivity);
router.put('/item/update/activity', upload, adminController.updateItemActivity);
router.delete('/item/:itemId/activity/:id/delete', adminController.deleteItemActivity);

// endpoint booking
router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);
router.put('/booking/update', adminController.actionConfirmation);

module.exports = router;