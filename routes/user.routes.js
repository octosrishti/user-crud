const express = require('express')

const router = express.Router()
const {create_user, get_all_user, get_single_user, update_user, delete_user, login_user} = require('../controllers/user')

router.post('/register', create_user)
router.post('/login', login_user)
router.get('/all_user',get_all_user)
router.get('/:id/get_single', get_single_user)
router.put('/:id/update', update_user)
router.delete('/:id/delete', delete_user)

module.exports = router