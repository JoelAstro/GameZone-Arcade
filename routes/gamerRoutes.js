const express = require('express');
const router = express.Router();

const {
    getAllGamers,
    getGamerById,
    addGamer
} = require('../controllers/gamerController');

router.get('/', getAllGamers);
router.get('/:id', getGamerById);
router.post('/', addGamer);

module.exports = router;