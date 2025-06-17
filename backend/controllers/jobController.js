const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      skills: req.body.skills || [],
      employer: req.user.userId,
    });
    await job.save();
    res.status(201).json({ message: 'Job created', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Job creation failed' });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.userId });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user.userId },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job updated', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
};

exports.stopApplications = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user.userId },
      { isActive: false },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Applications stopped', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to stop applications' });
  }
};

exports.getAllActiveJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch job' });
  }
};
