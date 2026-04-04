const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryByInvId(inv_id)

  if (!data) {
    const err = new Error("Vehicle Not Found!")
    err.status = 404
    return next(err)
  }

  const nav = await utilities.getNav()
  const vehicleHTML = await utilities.buildVehicleDetail(data)

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleHTML,
  })
}

invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error triggered!")
}

module.exports = invCont