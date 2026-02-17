// const router=require("router");
// const Myrouter=router();

//     Myrouter.route()



const MovieController = require('../controllers/movie.controller.js');
const MovieMiddlewares =require('../middlewares/movie.middlewares.js')

const routes = (app) => {
    // routes function takes express app object as parameter
    app.post('/mba/api/v1/movies', MovieMiddlewares.validateMovieCreateRequest,
         MovieController.createMovie);
}

module.exports = routes;