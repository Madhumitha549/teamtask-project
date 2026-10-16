const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/taskController');

router.use(auth);
router.get('/', c.list);
router.post('/', c.create);
router.patch('/:id', c.toggle);
router.delete('/:id', c.remove);

module.exports = router;