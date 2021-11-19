import { Request } from 'express';

import { Users } from '../../user/entities/user.entity';

interface IRequestWithUser extends Request {
  user: Users;
}

export default IRequestWithUser;
