const express = require('express');
const { issueBook, returnBook, getMyTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/issue', issueBook);
router.post('/return', returnBook);
router.get('/my', getMyTransactions);

module.exports = router;
