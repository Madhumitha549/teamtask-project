const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { sequelize, User, Organization, Membership } = require('../models');

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const sign = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await User.findOne({ where: { email: data.email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(data.password, 10);

    // All-or-nothing: user + organization + membership
    const user = await sequelize.transaction(async (t) => {
      const u = await User.create({ ...data, password: hash }, { transaction: t });
      const org = await Organization.create(
        { name: `${data.name}'s Team` },
        { transaction: t }
      );
      await Membership.create(
        { UserId: u.id, OrganizationId: org.id, role: 'admin' },
        { transaction: t }
      );
      return u;
    });

    res.status(201).json({
      token: sign(user),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      token: sign(user),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
