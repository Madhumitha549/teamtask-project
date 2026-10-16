const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const id = { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true };

const User = sequelize.define('User', {
  id,
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

const Organization = sequelize.define('Organization', {
  id,
  name: { type: DataTypes.STRING, allowNull: false },
});

const Membership = sequelize.define('Membership', {
  id,
  role: { type: DataTypes.ENUM('admin', 'member'), defaultValue: 'member' },
});

const Task = sequelize.define('Task', {
  id,
  title: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('todo', 'done'), defaultValue: 'todo' },
});

User.belongsToMany(Organization, { through: Membership });
Organization.belongsToMany(User, { through: Membership });
User.hasMany(Membership);
Membership.belongsTo(User);
Organization.hasMany(Membership);
Membership.belongsTo(Organization);
Organization.hasMany(Task);
Task.belongsTo(Organization);
User.hasMany(Task);
Task.belongsTo(User);

module.exports = { sequelize, User, Organization, Membership, Task };