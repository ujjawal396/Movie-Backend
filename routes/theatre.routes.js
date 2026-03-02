const theatreController=require('../controllers/theatre.controller.js');
const theatreMiddleware=require('../middlewares/theatre.middlewares.js');


const routes=(app)=>{
    app.post('mba/api/v1/theatres',
        theatreMiddleware.validateTheatreCreateRequest,
        theatreController.create);

        app.delete(
        '/mba/api/v1/theatres/:id',
        theatreController.destroy
    );

    app.get(
        '/mba/api/v1/theatres/:id',
        theatreController.getTheatre
    );




        
}






module.exports = routes;