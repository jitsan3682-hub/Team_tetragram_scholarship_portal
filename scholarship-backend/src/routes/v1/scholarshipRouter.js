const express = require('express');
const router = express.Router();
const scholarshipController = require('../../controllers/scholarshipController');
const authenticate = require('../../middlewares/authenticate');

router.get('/', scholarshipController.getAllScholarships);
router.get('/:id', scholarshipController.getScholarshipById);
router.post('/', authenticate, scholarshipController.createScholarship);
router.delete('/:id', authenticate, scholarshipController.deleteScholarship);

module.exports = router;
