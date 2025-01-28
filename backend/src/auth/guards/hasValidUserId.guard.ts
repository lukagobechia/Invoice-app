// import {
//   BadGatewayException,
//   CanActivate,
//   ExecutionContext,
//   Injectable,
// } from '@nestjs/common';
// import { isValidObjectId } from 'mongoose';
// import { Observable } from 'rxjs';

// @Injectable()
// export class HasValidUserId implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const headers = request.headers;

//     if (!headers['user-id']) {
//       throw new BadGatewayException('User Id is not provided');
//     }
//     if (!isValidObjectId(headers['user-id'])) {
//       throw new BadGatewayException('User Id is not valid');
//     }
//     request.userId = headers['user-id'];

//     return true;
//   }
// }
