const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Show = require('../models/show.model');
const { STATUS, BOOKING_STATUS, PAYMENT_STATUS, USER_ROLE } = require('../utils/constants');
const axios=require('axios');

const createPayment = async (data) => {
    try {
        const booking = await Booking.findById(data.bookingId);
        if(!booking){
             throw {
                err: 'No booking found',
                code: STATUS.NOT_FOUND
            };
        }

        

        if(booking.status == BOOKING_STATUS.successfull) {
            throw {
                err: 'Booking already done, cannot make a new payment against it',
                code: STATUS.FORBIDDEN
            }
        }

        
        let bookingTime = booking.createdAt;
        let currentTime = Date.now();

        // calculate how many minutes are remaining
        let minutes = Math.floor(((currentTime - bookingTime) / 1000) / 60);
        if(minutes > 5) {
            booking.status = BOOKING_STATUS.expired;
             await Show.updateOne(
                { _id: booking.showId },
                { $inc: { bookedSeats: -booking.noOfSeats } }
            );
            await booking.save();
            return booking;
        }


        const existingPayment = await Payment.findOne({ booking: booking._id });

        if (existingPayment && existingPayment.status === PAYMENT_STATUS.success) {
           return booking;
         }

        const payment = await Payment.create({
            booking: booking._id,
            amount: booking.totalCost,
        });
        
       let paymentSuccess = true;

        if (!paymentSuccess) {
            payment.status = PAYMENT_STATUS.failed;

            booking.status = BOOKING_STATUS.cancelled;

            // 🔥 release seats
            await Show.updateOne(
                { _id: booking.showId },
                { $inc: { bookedSeats: -booking.noOfSeats } }
            );

            await payment.save();
            await booking.save();

            return booking;
        }

        // ✅ SUCCESS FLOW
        payment.status = PAYMENT_STATUS.success;
        booking.status = BOOKING_STATUS.successfull;

        await payment.save();
        await booking.save();

        setImmediate(async () => {
       try {
        const user = await User.findById(booking.userId);

         if (!user) return;

    await axios.post(process.env.NOTI_SERVICE, {
      subject: "Booking Confirmed",
      content: `Your booking is confirmed for show ${booking.showId}`,
      recepientEmails: [user.email]
         });

       } catch (err) {
    console.error("Notification failed:", err.message);
        }
     });

        return booking;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getPaymentById = async (id) => {
    try {
        const response = await Payment.findById(id).populate('booking');
        if(!response) {
            throw {
                err: 'No payment record found',
                code: STATUS.NOT_FOUND
            }
        }
        return response;
    } catch (error) {
        console.log(error);
          throw error;
    }
}

const getAllPayments = async (userId) => {
    try {
        const user = await User.findById(userId);
        let filter = {};
        if(user.userRole != USER_ROLE.admin) {
            filter.userId = user.id;
        }
        const bookings = await Booking.find(filter, 'id');

        const payments = await Payment.find({booking: {$in: bookings}});
        return payments;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createPayment,
    getPaymentById,
    getAllPayments,
}