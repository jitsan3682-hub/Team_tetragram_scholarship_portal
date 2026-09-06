const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const scholarshipRouter = require('./scholarshipRouter');
const applicationRouter = require('./applicationRouter');
const { isDriveConfigured } = require('../../utils/driveService');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/scholarships', scholarshipRouter);
router.use('/applications', applicationRouter);

router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    googleDriveConfigured: isDriveConfigured(),
    version: '1.0.0',
  });
});

module.exports = router;
