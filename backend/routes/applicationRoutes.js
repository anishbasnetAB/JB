const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const upload = require('../utils/upload');
const { applyToJob, getApplicantsByJob } = require('../controllers/applicationController');
const applicationController = require('../controllers/applicationController');

// Jobseeker applies to a job
router.post(
  '/:jobId',
  authMiddleware,
  authorizeRoles('jobseeker'),
  upload.single('cv'),
  applyToJob
);

// Employer views applicants for a job
router.get(
  '/:jobId',
  authMiddleware,
  authorizeRoles('employer'),
  getApplicantsByJob
);

router.patch(
  '/status/:appId',
  authMiddleware,
  authorizeRoles('employer'),
  applicationController.updateStatus
);

router.patch(
  '/note/:appId',
  authMiddleware,
  authorizeRoles('employer'),
  applicationController.updateNote
);
module.exports = router;
