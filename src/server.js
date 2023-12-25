const Hapi = require('@hapi/hapi')
const routes = require('./routes')


const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: true
            
        }
    })

    server.route(routes)

    console.log(`server run in ${server.info.uri}`)
    await server.start()
}

init()