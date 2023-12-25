let bookshelf = require('./bookshelf.js')
const {nanoid} = require('nanoid')
// const {generateUniqueId} = require('./id')
// const {getFormattedTimestamp} = require('./timestamp')

const postHandler = (request, h) => {
    const {name, year = '-', author = '-', summary ='-', publisher = '-', pageCount, readPage, reading = false} = request.payload || {}

            if (!name ){
                const response = h.response(`{
                    "status": "fail",
                    "message": "Gagal menambahkan buku. Mohon isi nama buku"
                }`)
                .type('application/json')
                .code(400)
                return response
            }

            if(readPage > pageCount){
                const response = h.response(`{
                    "status": "fail",
                    "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
                }`)
                .type('application/json')
                .code(400)
                return response
            }
            
            let finished = false

            if(pageCount === readPage){
                finished = true
            }

            const id = nanoid(16);
            const insertedAt = new Date().toISOString();
            const updatedAt = new Date().toISOString();

            const newBookshelf = {
                id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
            }

            if(bookshelf == []) {
                bookshelf = [newBookshelf]
            }
            else {
                bookshelf = [...bookshelf, newBookshelf]
            }

            // console.log(bookshelf)cl
            const response =
            h.response(
                {
                    "status" : "success",
                    "message" : "Buku berhasil ditambahkan",
                    "data": {
                        "bookId": id
                    }
                }
                )
                .type('application/json')
                .code(201)
                    
            return response
}

const getAllHandler = (request, h) => {

    let {reading, finished, name } = request.query
    let newBookshelf = [];
    
    if (reading || finished || name){
        let newBooks = [...bookshelf]
        // let newBooks = []
        const lowerCaseName = name ? name.toLowerCase() : null

        if(reading == 1){
            newBooks = newBooks.filter((n) => n.reading === true)
        }
        else if(reading == 0){
            newBooks = newBooks.filter((n) => n.reading === false)
        }

        if(finished == 1){
            newBooks = newBooks.filter((n) => n.finished === true)
        }
        else if (finished == 0){
            newBooks = newBooks.filter((n) => n.finished === false)
        }
        
        if(lowerCaseName){
            newBooks = newBooks.filter((n) => n.name.toLowerCase().includes(lowerCaseName))
        }
        
        newBookshelf = newBooks.map(book => ({
            id: book.id, name: book.name, publisher: book.publisher
        }))
        
        // console.log(`books in name : ${newBookshelf}`)
        const message = {
            "status": "success",
            "data": {
                "books": newBookshelf
            }
        }

    
        const response = h.response(message).type('application/json').code(200);
    
        return response
        
    }

    newBookshelf = bookshelf.map(book => ({
        id: book.id, name: book.name, publisher: book.publisher
    }))


    const message = {
        "status": "success",
        "data": {
            "books": newBookshelf
        }
    }

    const response = h.response(message).type('application/json').code(200);

    return response
}

const getHandler = (request, h) => {
    let indexNotes = []
    const { id } = request.params

    // newBookshelf = bookshelf.map(book =>({
    //     id: book.id, name: book.name, publisher: book.publisher
    // }))
    const book = bookshelf.filter((n) => n.id === id)[0];

    if(book !== undefined){
        const getNotes = {
            status: "success",
            data: {
                book: book
            }
        }
    
        const response = h.response(getNotes)
                        .type('application/json')
                        .code(200)
    
        return response
    }

    const message =     
    {
        "status": "fail",
        "message": "Buku tidak ditemukan"
    }
    const response = h.response(message)
                .type('application/json')
                .code(404)

    return response
}

const putHandler = (request, h) => {
    const { id } = request.params
    const { name, year = '-', author = '-', summary ='-', publisher = '-', pageCount, readPage, reading = false } = request.payload;

    let indexNotes = bookshelf
    let x = 0

    if (!name ){
        const response = h.response(`{
            "status": "fail",
            "message": "Gagal memperbarui buku. Mohon isi nama buku"
        }`)
        .type('application/json')
        .code(400)
        return response
    }

    if(readPage > pageCount){
        const response = h.response(`{
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        }`)
        .type('application/json')
        .code(400)
        return response
    }


    const updatedAt = new Date().toISOString();
    // const timestamp = getFormattedTimestamp();

    for(let i in indexNotes){
        if(id === indexNotes[i].id){
            let editBook = indexNotes[i]
            editBook.name = name
            editBook.year  = year
            editBook.author  = author
            editBook.summary = summary;
            editBook.publisher = publisher
            editBook.pageCount = pageCount
            editBook.readPage = readPage
            editBook.reading = reading
            editBook.updatedAt = updatedAt
            indexNotes[i] = editBook
            x++
        }
    }

    if (x == 0){
        const message =
        {
            "status": "fail",
            "message": "Gagal memperbarui buku. Id tidak ditemukan"
        }
        const response = h.response(message)
                            .type('application/json')
                            .code(404)
        return response
    }

    // bookshelf = indexNotes

    const message =     
    {
        "status": "success",
        "message": "Buku berhasil diperbarui"
    }

    const response = h.response(message)
                        .type('application/json')
                        .code(200)
    
    return response
}

const deleteHandler = (request, h) => {
    const {id} = request.params
    let x = 0;
    if(!id){
        return h.response('must contain id').type('application/json').code(404)
    }

    for(let i in bookshelf){
        if(id === bookshelf[i].id){
            bookshelf.splice(i, 1)
            x++
        }
    }

    if(x == 0){
        const message =
        {
            "status": "fail",
            "message": "Buku gagal dihapus. Id tidak ditemukan"
        }
        
        const response = h.response(message).type('application/json').code(404)

        return response
    }

    const message =
    {
        "status": "success",
        "message": "Buku berhasil dihapus"
    }

    const response = h.response(message).code(200)

    return response
}


module.exports = {getHandler, getAllHandler, postHandler, putHandler, deleteHandler}