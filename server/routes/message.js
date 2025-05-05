const router = require("express").Router()
const messageCtrls = require("../controllers/message")
const joi = require("joi")
const validate = require("../middleware/validation")
const { stringReq, object } = require("../middleware/joiSchema")

router.post("/", validate(joi.object({ content: stringReq, type: stringReq, data: object })), messageCtrls.endpoint)

module.exports = router
