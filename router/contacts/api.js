const express = require("express");
const router = express.Router();
const verifyToken = require('../helper/validate_token');


const {
    signupSchema,
    signup,
    signinSchema,
    signin,
    forgotPassword,
    contactSchema,
    addContact,
    getContact,
    getSpecificContact,
    deleteContact,
    updateContact
} = require("./contacts");


router.post("/v1/user/signup", signupSchema, signup);
router.post("/v1/user/signin", signinSchema, signin);
router.post("/v1/user/forgot-password", forgotPassword);
router.post("/v1/contact", verifyToken, contactSchema, addContact);
router.get("/v1/contact", verifyToken, getContact);
router.get("/v1/contact/:contact_id", verifyToken, getSpecificContact);
router.delete("/v1/contact/:contact_id", verifyToken, deleteContact);
router.patch("/v1/contact/:contact_id", verifyToken, updateContact);



module.exports = router;