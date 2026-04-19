const Movie = require('../models/movie.model');

const createMovie = async (data) => {
    try {
        const movie = await Movie.create(data);
        return movie;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        } else {
            throw error;
        }
    }
}

const deleteMovie = async (id) => {
    try {
        const response = await Movie.findByIdAndDelete(id);
        if(!response) {
           throw {
                err: "No movie record found for the id provided",
                 code: STATUS.NOT_FOUND
            }
        }
        return response
    } catch (error) {
        
        throw error;
    }
}

const getMoviById = async (id) => {
    const movie = await Movie.findById(id);
    if(!movie) {
        throw {
            err: "No movie found for the corresponding id provided",
            code: STATUS.NOT_FOUND
        }
    };
    return movie;
}

const updateMovie = async (id, data) => {
    try {
        const movie = await Movie.findByIdAndUpdate(id, data, {new: true, runValidators: true});
        return movie;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        } else {
            throw error;
        }
    }
}


const fetchMovies = async (filter) => {
    let query = {};
    if(filter.name) {
        query.name = filter.name;
    }
    let movies = await Movie.find(query);
    if(!movies) {
       throw {
            err: 'Not able to find the queries movies',
           code: STATUS.NOT_FOUND
        }
    }
    return movies;
}

module.exports = {
    createMovie,
    deleteMovie,
    getMoviById,
    updateMovie,
    fetchMovies,
    
}