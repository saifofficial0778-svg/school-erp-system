const classController=require('./class.controller')
const express=require('express')
const router=express.Router()

router.post('/',classController.createClass)
router.get('/',classController.getAllClasses)
router.get('/:id',classController.getClassById)
router.put('/:id',classController.updateClass)
router.patch('/:id/status',classController.updateStatus)
router.delete('/:id',classController.deleteClass)




module.exports = router;