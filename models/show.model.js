const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Theatre',
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie',
    },
   timing: {
    type: Date,
    required: true
   },
    
    totalSeats: {
    type: Number,
    required: true
    },

    bookedSeats: {
    type: Number,
    default: 0
   },
    price: {
        type: Number,
        required: true
    },
    format: {
        type: String
    }
}, {timestamps: true});

const Show = mongoose.model('Show', showSchema);

module.exports = Show;