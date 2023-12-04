const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Rev = require("../models/Rev");

exports.AddRev = async (req, res, next) => {
  const errors = validationResult(req);
  const createdRev = new Rev({
  Text:""
  });
  try {
    await createdRev.save();
    console.log("REV saved successfully");
  } catch (e) {
    return next(new HttpError(" Creating REV failed ! ", 500));
  }
  res.status(201).json({
    message: "REV has been added succsessfully !",
    user: createdRev.toObject({ getters: true }),
  });
};

exports.getTextById = async (req, res, next) => {
    const revId = req.params.id;
    let rev;
    try {
        rev = await Rev.findById(revId);
    } catch (err) {
        return next(new HttpError("Fetching text failed, please try again later.", 500));
    }
  
    if (!rev) {
        return next(new HttpError("Could not find text for the provided ID.", 404));
    }
  
    res.json({ text: rev.Text });
};
