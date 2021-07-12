'use strict';

const Book = require('../models/book');
const messages = require('../constants/messages');

module.exports = function (app) {
  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await Book.find({});
        const returnedBooks = books.map(book => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          };
        });

        return res.json(returnedBooks);
      } catch(err) {
        res.send(err.message);
      }
    })
    .post(async (req, res) => {
      const title = req.body.title;

      if (!title) {
        return res.send(messages.MISSING_TITLE);
      }

      try {
        const newBook = new Book({
          title,
          comments: []
        });

        await newBook.save();

        return res.json({
          _id: newBook._id,
          title: newBook.title
        });
      } catch(err) {
        return res.send(err.message);
      }
    })
    .delete(async (req, res) => {
      try {
        await Book.deleteMany({});

        return res.send(messages.COMPLETE_DELETE_SUCCESS);
      } catch(err) {
        res.send(err.message);
      }
    });

  app.route('/api/books/:id')
    .get(async (req, res) => {
      const bookid = req.params.id;

      try {
        const book = await Book.findById(bookid);

        if (!book) {
          return res.send(messages.NO_BOOK_EXISTS);
        }

        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch(err) {
        res.send(err.message);
      }
    })
    .post(async (req, res) => {
      const bookid = req.params.id;
      const comment = req.body.comment;

      if (!comment) {
        return res.send(messages.MISSING_COMMENT);
      }

      try {
        const book = await Book.findById(bookid);

        if (!book) {
          return res.send(messages.NO_BOOK_EXISTS);
        }

        book.comments.push(comment);
        await book.save();

        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch(err) {
        res.send(err.message);
      }
    })
    .delete(async (req, res) => {
      const bookid = req.params.id;

      try {
        const book = await Book.findById(bookid);

        if (!book) {
          return res.send(messages.NO_BOOK_EXISTS);
        }

        await Book.deleteOne({ _id: bookid });

        return res.send(messages.DELETE_SUCCESS);
      } catch(err) {
        res.send(err.message);
      }
    });
};
