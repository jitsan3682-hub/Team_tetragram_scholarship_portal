const express = require('express');
const router = express.Router();
const applicationController = require('../../controllers/applicationController');
const authenticate = require('../../middlewares/authenticate');

router.post('/', authenticate, applicationController.submitApplication);
router.get('/my', authenticate, applicationController.getMyApplications);
router.get('/', authenticate, applicationController.getAllApplications);
router.patch('/:id/status', authenticate, applicationController.updateApplicationStatus);
router.delete('/:id', authenticate, applicationController.withdrawApplication);

module.exports = router;
