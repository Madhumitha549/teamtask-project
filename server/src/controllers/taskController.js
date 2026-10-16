const { z } = require('zod');
const { Task, Membership } = require('../models');

const taskSchema = z.object({ title: z.string().trim().min(1) });

async function getOrgId(userId) {
  const m = await Membership.findOne({ where: { UserId: userId } });
  return m ? m.OrganizationId : null;
}

exports.list = async (req, res, next) => {
  try {
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.status(403).json({ message: 'No team found' });
    const tasks = await Task.findAll({
      where: { OrganizationId: orgId },
      order: [['createdAt', 'DESC']],
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = taskSchema.parse(req.body);
    const orgId = await getOrgId(req.user.id);
    if (!orgId) return res.status(403).json({ message: 'No team found' });
    const task = await Task.create({
      title: data.title,
      OrganizationId: orgId,
      UserId: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.toggle = async (req, res, next) => {
  try {
    const orgId = await getOrgId(req.user.id);
    const task = await Task.findOne({
      where: { id: req.params.id, OrganizationId: orgId },
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = task.status === 'done' ? 'todo' : 'done';
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const orgId = await getOrgId(req.user.id);
    const task = await Task.findOne({
      where: { id: req.params.id, OrganizationId: orgId },
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};