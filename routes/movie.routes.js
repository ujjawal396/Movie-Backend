// const router=require("router");
// const Myrouter=router();

//     Myrouter.route()



const movieController = require('../controllers/movie.controller.js');
const movieMiddlewares = require('../middlewares/movie.middlewares.js');

const authMiddlewares = require('../middlewares/auth.middlewares');

const routes = (app) => {
    // routes function takes express app object as parameter
    app.post('/mba/api/v1/movies',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
         movieMiddlewares.validateMovieCreateRequest,
         movieController.createMovie);


         app.delete(
        '/mba/api/v1/movies/:movieId',
         authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieController.deleteMovie
    );

    app.get(
        '/mba/api/v1/movies/:id',
        movieController.getMovie
    );

    app.put(
        '/mba/api/v1/movies/:id',
        movieController.updateMovie
    );

    app.patch(
        '/mba/api/v1/movies/:id',
        movieController.updateMovie
    );

    app.get(
        '/mba/api/v1/movies',
        movieController.getMovies
    );
}

module.exports = routes;