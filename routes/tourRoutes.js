const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

// Param Middleware that will run for the route where id will be sent by the client
router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.route('/:id').get(tourController.getTour);

module.exports = router;
