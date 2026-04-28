const Movie = require('../models/movie.model');
const movieService = require('../services/movie.service.js');
const { successResponseBody, errorResponseBody} = require('../utils/responsebody.js');
const { STATUS } = require('../utils/constants');






const createMovie = async (req, res) => {
    try {
        
        const response = await movieService.createMovie(req.body);
        if(response.err) {
            errorResponseBody.err = response.err;
            errorResponseBody.message = "Validation failed on few parameters of the request body"
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the movie";

        return res.status(201).json(successResponseBody);
    } 
    catch (err) {
        console.log(err);
        
          return res.status(500).json(errorResponseBody);
    }
};




const deleteMovie = async (req, res) => {
    try {
        
        const response = await movieService.deleteMovie(req.params.id);
        


        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the movie";

        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const getMovie = async (req, res) => {
    try {
        const response = await movieService.getMoviById(req.params.id);
        

        successResponseBody.data = response;
        return res.status(STATUS.OK).json(successResponseBody);

    }catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);

    }

}

const updateMovie = async (req, res) => {
    try {
        const response = await movieService.updateMovie(req.params.id, req.body);
        
        successResponseBody.data = response;
        successResponseBody.message="successfully updated the movie"
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const getMovies = async (req, res) => {
    try {
        const response = await movieService.fetchMovies(req.query);
       
        successResponseBody.data = response;
       return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
         if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
         return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

module.exports = {
    createMovie,
    deleteMovie,
    getMovie,
    updateMovie,
    getMovies,
}