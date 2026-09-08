const express = require("express")
const router = express.Router()
const tasksService = require("../services/tasksService.js")
const cookieJwtAuth = require("../middleware/cookieJwtAuth");
const autorizeRole = require("../middleware/autorizeRole.js");

module.exports = router

router.get("/tasks", cookieJwtAuth, autorizeRole('admin'), async (request, response) => {
    await tasksService.getAllTasks(request, response)
})

router.get("/tasks/:id", cookieJwtAuth, async (request, response) => {
    await tasksService.getTaskById(request, response)
})

router.get("/tasks/byUser/:id", cookieJwtAuth, async (request, response) => {
    await tasksService.getTasksByUserId(request, response)
})

router.post("/tasks", cookieJwtAuth, async (request, response) => {
    await tasksService.createTask(request, response)
})

router.post("/tasks/:id/done", async (request, response) => {
    await tasksService.getTaskDone(request, response)
})

router.put("/tasks/:id", cookieJwtAuth, async (request, response) => {
    await tasksService.updateTask(request, response)
})

router.delete("/tasks/:id", cookieJwtAuth, async (request, response) => {
    await tasksService.deleteTask(request, response)
})
