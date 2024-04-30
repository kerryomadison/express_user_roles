const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');

router.route('/')
  .get(statesController.getAllStates)
  .post(verifyStates, statesController.createState)
  .put(verifyStates, statesController.updateState)
  .delete(verifyStates, statesController.deleteState);

router.route('/:stateCode')
  .get(statesController.getState);

module.exports = router;