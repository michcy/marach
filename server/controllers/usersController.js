const express = require('express');
const router = express.Router();
const usersService = require('../services/usersService.js');
const cookieJwtAuth = require("../middleware/cookieJwtAuth");
const autorizeRole = require("../middleware/autorizeRole");
module.exports = router;

router.get('/users', cookieJwtAuth, autorizeRole('admin'), async (request, response) => {
    await usersService.getUsers(request, response)
});

router.get('/users/byId/:id', cookieJwtAuth, async(request, response) => {
    await usersService.getUsersById(request, response)
})

router.get('/users/byUsername/:username', cookieJwtAuth, async (request, response) => {
    await usersService.getUsersByUsername(request, response)
})

router.get('/users/byEmail/:email', cookieJwtAuth, async (request, response) => {
    await usersService.getUsersByEmail(request, response)
})

router.post('/users', async (request, response) => {
    await usersService.createUser(request, response)
})

router.put('/users/:id', async (request, response) => {
    await usersService.updateUser(request, response)
})

router.delete('/users/:id', async (request, response) => {
    await usersService.deleteUser(request, response)
})