const express = require('express');
const router = express.Router();
const upload = require ('../services/upload.js')

const {createNews, showNews, showNew, updateNews, deleteNews} = require('../controller/news.control');

router.post('/create', upload.single('image'), createNews );
router.get('/', showNews);
router.get('/:id', showNew);
router.put('/:id', updateNews);
router.delete('/:id', deleteNews);

module.exports = router