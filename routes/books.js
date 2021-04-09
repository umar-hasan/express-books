const express = require("express");
const jsonschema = require("jsonschema");
const newBookSchema = require("../schemas/newBookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json");
const Book = require("../models/book");
const ExpressError = require("../expressError")

const router = new express.Router();


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, newBookSchema)
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack)
      throw new ExpressError(listOfErrors, 400)
    }
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, updateBookSchema)
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack)
      throw new ExpressError(listOfErrors, 400)
    }
    let b = await Book.findOne(req.params.isbn)
    for (const key of Object.keys(req.body)) {
      if (req.body[key]) {
        b[key] = req.body[key]
      }
    }
    const book = await Book.update(req.params.isbn, b);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
