const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');
const funFactsController = require('../../controllers/funFactsController');

router.route('/')
  .get(statesController.getAllStates)
  //.post(verifyStates, statesController.createState)
  //.put(verifyStates, statesController.updateState)
  //.delete(verifyStates, statesController.deleteState);

router.get('/:stateCode/capital', statesController.getCapital);
router.get('/:stateCode/nickname', statesController.getNickname);
router.get('/:stateCode/population', statesController.getPopulation);
router.get('/:stateCode/admission', statesController.getAdmission);

router.get('/:stateCode/funfact', verifyStates, funFactsController.getRandomFunFact);
router.post('/:stateCode/funfact', verifyStates, funFactsController.createFunFacts);
router.patch('/:stateCode/funfact', verifyStates, funFactsController.updateFunFacts);
router.delete('/:stateCode/funfact',verifyStates, funFactsController.deleteFunFact);

router.get('/:stateCode', verifyStates, statesController.getState);

module.exports = router;