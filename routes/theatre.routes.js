const theatreController=require('../controllers/theatre.controller.js');
const theatreMiddleware=require('../middlewares/theatre.middlewares.js');


const routes=(app)=>{
    app.post('mba/api/v1/theatres',
        theatreMiddleware.validateTheatreCreateRequest,
        theatreController.create);
}






module.exports = routes;