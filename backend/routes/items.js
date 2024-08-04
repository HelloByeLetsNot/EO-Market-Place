const express = require('express');
const jwt = require('jsonwebtoken');
const Item = require('../models/item');
const User = require('../models/user');
const router = express.Router();

router.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.userId = decoded.id;
        next();
    });
});

router.post('/add', async (req, res) => {
    const { name, trade } = req.body;
    try {
        const item = new Item({ name, trade, owner: req.userId });
        await item.save();
        res.status(201).send('Item added');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const items = await Item.find().populate('owner', 'username');
        res.json(items);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;