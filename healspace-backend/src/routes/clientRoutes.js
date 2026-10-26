const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getClients, getClientById, updateClient } = require('../controllers/clientController');

router.use(protect);

router.get('/', getClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);

module.exports = router;