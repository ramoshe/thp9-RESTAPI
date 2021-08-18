'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { User, Course } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

/**
 * * User Routes
 */
// Route that will READ (show) currently authenticated user.
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {
    const user = await User.findOne({
        where: { id: req.currentUser.id },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    res.json({ user });
}));

// Route that will CREATE a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        const user = await User.build(req.body);
        user.password = bcrypt.hashSync(user.password, 10);
        await user.save();
        res.status(201).location('/').end();
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));

/**
 * * Course Routes
 */
// Route that will READ (show) list of all courses
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json({ courses });
}));

// Route that will READ (show) the corresponding course
router.get('/courses/:id', asyncHandler(async(req, res) => {
    const course = await Course.findOne({
        where: {id: req.params.id},
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json({ course });
}));

// Route that wil CREATE a new course
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));

// Route that will UPDATE the correspoding course
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        const user = req.currentUser;
        if (user.id === course.userId) {
            if (course) {
                course.title = req.body.title;
                course.description = req.body.description;
                course.estimatedTime = req.body.estimatedTime;
                course.materialsNeeded = req.body.materialsNeeded;
                await course.save();
                await Course.update({ course }, { where: { id: req.params.id } });
                res.status(204).end();
            } else {
                res.status(404).json({ message: 'No course to update.' });
            }
        } else {
            res.status(403).json({ message: 'Only course owner can edit.' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));

// Route that will DELETE corresponding course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id);
    const user = req.currentUser;
    if (user.id === course.userId) {
        if (course) {
            await Course.destroy({ where: { id: req.params.id } });
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'No course to delete' } )
        }
    } else {
        res.status(403).json({ message: 'Only course owner can delete.' });
    }
}));

module.exports = router;