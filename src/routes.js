const {getHandler, postHandler, putHandler, deleteHandler, getAllHandler} = require('./handler')



const routes = [
    {
        method  : 'POST',
        path    : '/books',
        handler : (request, h) => {
            const response = postHandler(request, h)
            return response
        }
    },
    {
        method  : 'GET',
        path    : '/books',
        handler : (request, h) => {
            const response = getAllHandler(request, h)

            return response
        }
    },
    {
        method  : 'GET',
        path    : '/books/{id}',
        handler : (request, h) => {
            const response = getHandler(request, h)

            return response
        }
    },
    {
        method  : 'PUT',
        path    : '/books/{id?}',
        handler : (request, h) => {
            const response = putHandler(request, h)
            return response
        }
    },
    {
        method  : 'DELETE',
        path    : '/books/{id?}',
        handler : (request, h) => {
            const response = deleteHandler(request, h)
            return response
        }
    },
    {
        method  : '*',
        path    : '/{any*}',
        handler : (request, h) => {
            const message = h.response('Not Found').code(404)
            return message
        }
    }
]

module.exports = routes