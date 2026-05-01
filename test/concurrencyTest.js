const axios = require("axios");

const URL = "http://localhost:8000/mba/api/v1/bookings";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjBjOTlkYzVjNDA0OTVhYjdlN2ZkNCIsImVtYWlsIjoic29udXNoYWg4OEBnbWFpbC5jb20iLCJpYXQiOjE3Nzc2NDEyNDIsImV4cCI6MTc3NzY0NDg0Mn0.-UOm6FrXowZO7ML-oOiufgHTa_Z1-emY0Res1N-VJDU";

const payload = {
  showId: "69f4aabd5452ca3b0678a130",
  noOfSeats: 3
};

const requests = Array(5).fill().map(() =>
  axios.post(URL, payload, {
    headers: {
      "x-access-token": TOKEN
    }
  }).then(res => console.log("SUCCESS", res.data))
    .catch(err => console.log("FAIL", err.response?.data))
);

Promise.allSettled(requests);