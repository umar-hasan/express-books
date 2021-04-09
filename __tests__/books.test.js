process.env.NODE_ENV = "test"

const db = require("../db");
const Book = require("../models/book");
const app = require("../app");
const request = require("supertest");

describe('tests creating and updating books', function () {
    beforeEach(async function () {
        await db.query("DELETE FROM books")
        await Book.create({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        })
    })

    test('POST /books', async function () {
        let res = await request(app).post("/books").send({
            "isbn": "0691161512",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2022
        })
        expect(res.status).toEqual(400)

        res = await request(app).post("/books").send({
            "isbn": "0691161512",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2021
        })
        expect(res.status).toEqual(201)
    })

    test('PUT /books', async function () {
        let res = await request(app).put("/books/0691161518").send({
            "year": 2022
        })
        expect(res.status).toEqual(400)

        res = await request(app).put("/books/0691161518").send({
            "year": 2021
        })
        expect(res.body).toEqual({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2021
            }
        })
    })



})

afterAll(async function () {
    await db.end();
});
