module.exports = (err, req, res, next) => {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Email already registered' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
};
