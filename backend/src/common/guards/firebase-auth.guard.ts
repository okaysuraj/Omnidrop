import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { getAuth } from 'firebase-admin/auth';
import { Repository } from 'typeorm';
import { User } from '../../database/entities';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { getErrorMessage } from '../errors';
import type { AuthenticatedRequest } from '../http-request';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // Verify Firebase ID token
      const decodedToken = await getAuth().verifyIdToken(token);

      // Look up internal user by firebase_uid
      const user = await this.userRepository.findOne({
        where: { firebaseUid: decodedToken.uid, isActive: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Attach user to request
      request.user = user;
      request.firebaseUser = decodedToken;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error(`Firebase auth error: ${getErrorMessage(error)}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
