const mongoose=require('mongoose');

const { BOOKING_STATUS } = require('../utils/constants');

const bookingSchema =new mongoose.Schema({

showId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Show'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    noOfSeats: {
        type: Number,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: {
             values: [BOOKING_STATUS.processing, BOOKING_STATUS.cancelled, BOOKING_STATUS.successfull, BOOKING_STATUS.expired],
            message: "Invalid booking status"
        },
        default: BOOKING_STATUS.processing
    },
    
      idempotencyKey: {
       type: String,
       unique: true,
        sparse: true
      },

}, { timestamps: true });


const Booking= mongoose.model("Booking",bookingSchema);

module.exports = Booking;