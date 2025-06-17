const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const jobController = require('../controllers/jobController');

router.post('/', authMiddleware, authorizeRoles('employer'), jobController.createJob);
router.get('/my-jobs', authMiddleware, authorizeRoles('employer'), jobController.getMyJobs);
router.put('/:id', authMiddleware, authorizeRoles('employer'), jobController.updateJob);
router.delete('/:id', authMiddleware, authorizeRoles('employer'), jobController.deleteJob);
router.patch('/:id/stop', authMiddleware, authorizeRoles('employer'), jobController.stopApplications);
router.get('/', jobController.getAllActiveJobs);
router.get('/:jobId', jobController.getJobById);

module.exports = router;
