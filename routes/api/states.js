const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');

router.route('/')
  .get(statesController.getAllStates)
  .post(verifyStates, statesController.createState)
  .put(verifyStates, statesController.updateState)
  .delete(verifyStates, statesController.deleteState);

  router.get('/:stateCode/capital', statesController.getCapital);
router.get('/:stateCode/nickname', statesController.getNickname);
router.get('/:stateCode/population', statesController.getPopulation);
router.get('/:stateCode/admission', statesController.getAdmission);

router.route('/:stateCode/funfact')
  .get(verifyStates, statesController.getStateFunFact);
router.put('/:stateCode/funfact', verifyStates, statesController.updateStateFunFact);

// New route for /states/:stateCode
router.get('/:stateCode', verifyStates, statesController.getState);

module.exports = router;