const { STATUS, USER_ROLE, BOOKING_STATUS } = require('../utils/constants');
const { errorResponseBody } = require('../utils/responsebody');
const mongoose= require('mongoose');


const theatreService = require('../services/theatre.service');
const userService = require('../services/user.service');

const validateBookingCreateRequest = async (req, res, next) => {
     if (!req.body.showId) {
        errorResponseBody.err = "No showId provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!ObjectId.isValid(req.body.showId)) {
        errorResponseBody.err = "Invalid showId";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.noOfSeats || req.body.noOfSeats <= 0) {
        errorResponseBody.err = "Invalid seat count";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    next();

    
   

}


const canChangeStatus = async (req, res, next) => {
    const user = await userService.getUserById(req.user);
    if(user.userRole == USER_ROLE.customer && req.body.status && req.body.status != BOOKING_STATUS.cancelled) {
        errorResponseBody.err = "You are not allowed to change the booking status";
        return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
    }
    next();
}

module.exports = {
    validateBookingCreateRequest,
    canChangeStatus,
}