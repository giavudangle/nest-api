import {Request} from 'express'

import { Users } from '../user/entities/user.entity'

interface RequestWithUser extends Request{
    user:Users;
}

export default RequestWithUser