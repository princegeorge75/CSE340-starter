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

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

// Show form
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

// Process form
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav: await utilities.getNav(),
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

// Show form
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

// Process form
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const data = req.body

  const result = await invModel.addInventory(data)

  if (result) {
    req.flash("notice", "Vehicle added successfully.")
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav: await utilities.getNav(),
    })
  } else {
    req.flash("notice", "Failed to add vehicle.")
    let classificationList = await utilities.buildClassificationList(data.classification_id)

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...data
    })
  }
}

module.exports = invCont