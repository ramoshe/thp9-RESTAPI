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
// Route that returns all properties and values for currently authenticated user.
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;
    res.json({ user });
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        const user = await User.build(req.body);
        user.password = bcrypt.hashSync(user.password, 10);
        await user.save();
        res.status(201).location('/').end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
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
// Route that will return list of all courses
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll();
    res.json({ courses });
}));

// Route that will return the corresponding course
router.get('/courses/:id', asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.json({ course });
}));

// Route that wil create a new course
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    const course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
}));

// Route that will update the correspoding course
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        course.title = req.body.title;
        course.description = req.body.description;
        course.estimatedTime = req.body.estimatedTime;
        course.materialsNeeded = req.body.materialsNeeded;
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'No course to update.' });
    }
}));

// Route that will delete corresponding course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await Course.delete(course);
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'No course to delete' } )
    }
}));

module.exports = router;