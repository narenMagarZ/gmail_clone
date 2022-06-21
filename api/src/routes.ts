import express from 'express'
import Login from './handlers/login'
import Signup from './handlers/signup'

const router = express.Router()


router.get('/',function(_req,res){
    const defaultOkRes = {
        'status':200,
        'success':true,
        'msg':'ok'
    }
    res.json(defaultOkRes)
})

router.post('/signup',Signup)
router.post('/login',Login)
router.get('/emails')
export default router