const express = require('express');
const auth = require('../middleware/auth');
const Document = require('../models/Document');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const newDocument = new Document({
            owner: req.user.id,
            content: '// Start coding...\n'
        });
        const document = await newDocument.save();
        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const documents = await Document.find({ owner: req.user.id });
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/:id/versions', auth, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        const newVersion = {
            content: req.body.content
        };

        document.history.push(newVersion);
        await document.save();

        res.json(document.history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        if (document.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await document.deleteOne();

        res.json({ msg: 'Document removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id/versions/:versionId', auth, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        if (document.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        
        const versionIndex = document.history.findIndex(
            (version) => version._id.toString() === req.params.versionId
        );

        if (versionIndex === -1) {
            return res.status(404).json({ msg: 'Version not found' });
        }

        
        document.history.splice(versionIndex, 1);

        await document.save();

        res.json(document.history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;