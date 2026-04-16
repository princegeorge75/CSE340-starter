const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Route for vehicle detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInvId)
)

router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)

router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Route to build add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  utilities.handleErrors(invController.addInventory)
)

module.exports = router