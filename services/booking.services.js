const Booking = require('../models/booking.model');
const { STATUS } = require('../utils/constants');
const Show = require('../models/show.model');

const createBooking = async (data) => {
    try {
        const { showId, noOfSeats, userId, idempotencyKey } = data;

        // 🔁 Step 1: Fast check (if already processed)
        if (idempotencyKey) {
            const existing = await Booking.findOne({ idempotencyKey, userId });
            if (existing) return existing;
        }

        const seats = noOfSeats;

        // 🔥 Step 2: Atomic seat update
        const show = await Show.findOneAndUpdate(
            {
                _id: showId,
                $expr: {
                    $lte: [
                        { $add: ["$bookedSeats", seats] },
                        "$totalSeats"
                    ]
                }
            },
            {
                $inc: { bookedSeats: seats }
            },
            { new: true }
        );

        if (!show) {
            throw {
                err: "Not enough seats available",
                code: 400
            };
        }

        const totalCost = seats * show.price;

        try {
            // 🧾 Step 3: Try creating booking
            const booking = await Booking.create({
                showId,
                userId,
                noOfSeats: seats,
                totalCost,
                idempotencyKey
            });

            return booking;

        } catch (err) {

            // 🔥 Step 4: Handle duplicate key (race condition)
            if (err.code === 11000 && idempotencyKey) {

                // rollback seat increment
                await Show.updateOne(
                    { _id: showId },
                    { $inc: { bookedSeats: -seats } }
                );

                // fetch existing booking
                const existing = await Booking.findOne({ idempotencyKey, userId });
                if (existing) return existing;
            }

            throw err;
        }

    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw { err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        throw error;
    }
};

const updateBooking = async (data, bookingId) => {
    try {
        const response = await Booking.findByIdAndUpdate(bookingId, data, {
            new: true, runValidators: true
        });
        if(!response) {
            throw {
                err: "No booking found for the given id",
                code: STATUS.NOT_FOUND
            }
        }
        return response;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw {err: err, code: STATUS.UNPROCESSABLE_ENTITY};
        }
        console.log(error);
        throw error;
    }
}

const getBookings = async (data) => {
    try {
        const response = await Booking.find(data);
        return response;
    } catch (error) {
        throw error;
    }
}

const getAllBookings = async () => {
    try {
        const response = await Booking.find();
        return response;
    } catch (error) {
        throw error;
    }
}

const getBookingById = async (id, userId) => {
    try {
        const response = await Booking.findById(id);
        if(!response) {
            throw {
                err: 'No booking records found for the id',
                code: STATUS.NOT_FOUND
            }
        }
        if(response.userId != userId) {
            throw {
                err: 'Not able to access the booking',
                code: STATUS.UNAUTHORISED
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
} 


module.exports = {
    createBooking,
    updateBooking,
    getBookings,
    getAllBookings,
    getBookingById,
}