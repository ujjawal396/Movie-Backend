const { mongoose } = require('mongoose');
const Theatre = require('../models/theatre.model');
const Movie = require('../models/movie.model');

const createTheatre = async (data) => {
    try {
        const response = await Theatre.create(data);
        return response;
    } catch (err) {
         if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            return {err: err, code: 422};
        }
        console.log(err);
        throw err;
    }
}

const deleteTheatre = async (id) => {
    try {
        const response = await Theatre.findByIdAndDelete(id);
        if(!response) {
            return {
                err: "No record of a theatre found for the given id",
                code: 404
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getTheatre = async (id) => {
    try {
        const response = await Theatre.findById(id);
        if(!response) {
            // no record found for the given id
            return {
                err: "No theatre found for the given id",
                code: 404
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllTheatres = async (data) => {
    try {
        
        let query = {};
        let pagination = {};
        if(data && data.city) {
            // this checks whether city is present in query params or not
            query.city = data.city;
        } 
        if(data && data.pincode) {
            // this checks whether pincode is present in query params or not
            query.pincode = data.pincode;
        }
        if(data && data.name) {
            // this checks whether name is present in query params or not 
            query.name = data.name;
        }

        if(data && data.movieId) {
            query.movies = {$all: data.movieId};
        }
        
        if(data && data.limit) {
            pagination.limit = data.limit;
        }
        if(data && data.skip) {
            // for first page we send skip as 0
            let perPage = (data.limit) ? data.limit : 3;
            pagination.skip = data.skip*perPage;
        }
        const response = await Theatre.find(query, {}, pagination);
        
        return response;
    } catch (error) {
        console.log(error);
    } 
}

const updateTheatre = async (id, data) => {
    try {
        const response = await Theatre.findByIdAndUpdate(id, data, {
            new: true, runValidators: true
        });
        if(!response) {
            // no record found for the given id
            return {
                err: "No theatre found for the given id",
                code: 404
            }
        }
        return response;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            return {err: err, code: 422}
        }
        throw error;
    }
}


const updateMoviesInTheatres = async (theatreId, movieIds, insert) => {
   try {
        if (insert) {
            // we need to add movies
            await Theatre.updateOne(
                {_id: theatreId},
                {$addToSet: {movies: {$each: movieIds}}}
            );
        } else {
            // we need to remove movies
            await Theatre.updateOne(
                {_id: theatreId},
                {$pull: {movies: {$in: movieIds}}}
            );
        }
        const theatre = await Theatre.findById(theatreId);
        return theatre.populate('movies');
    } catch (error) {
        if(error.name == 'TypeError') {
            return {
                code: 404,
                err: 'No theatre found for the given id'
            }
        }
        console.log("Error is", error);
        throw error;
    }
}

const getMoviesInATheatre = async (id) => {
    try {
        const theatre = await Theatre.findById(id, {name: 1, movies: 1, address: 1}).populate('movies');
        if(!theatre) {
            return {
                err: 'No theatre with the given id found',
                code: 404
            }
        }
        return theatre;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getAllTheatres,
    updateTheatre,
    updateMoviesInTheatres,
    getMoviesInATheatre ,
}