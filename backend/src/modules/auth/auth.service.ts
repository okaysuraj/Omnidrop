import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums';
import { getErrorMessage } from '../../common/errors';
import { User } from '../../database/entities';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    // Verify Firebase token
    const decodedToken = await this.verifyFirebaseToken(dto.firebaseToken);

    // Check if user already exists
    const existing = await this.userRepository.findOne({
      where: { firebaseUid: decodedToken.uid },
    });

    if (existing) {
      throw new ConflictException('User already registered');
    }

    // Create internal user
    const user = this.userRepository.create({
      firebaseUid: decodedToken.uid,
      email: dto.email || decodedToken.email,
      fullName: dto.fullName,
      phone: dto.phone,
      role: dto.role || UserRole.CUSTOMER,
      isVerified: decodedToken.email_verified || false,
    });

    await this.userRepository.save(user);

    return this.sanitizeUser(user);
  }

  async login(firebaseToken: string) {
    const decodedToken = await this.verifyFirebaseToken(firebaseToken);

    if (!decodedToken.email_verified) {
      throw new UnauthorizedException('Please verify your email before logging in.');
    }

    const user = await this.userRepository.findOne({
      where: { firebaseUid: decodedToken.uid, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found. Please register first.');
    }

    // Update verification status if changed
    if (!user.isVerified) {
      user.isVerified = true;
      await this.userRepository.save(user);
    }

    return this.sanitizeUser(user);
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { addresses: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, data: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Only allow specific fields
    const allowedUpdates = [
      'fullName',
      'phone',
      'avatarUrl',
      'currentLat',
      'currentLng',
      'fcmToken',
    ] as const;
    for (const key of allowedUpdates) {
      if (data[key] !== undefined) Object.assign(user, { [key]: data[key] });
    }

    await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }

  private async verifyFirebaseToken(token: string): Promise<DecodedIdToken> {
    try {
      return await getAuth().verifyIdToken(token);
    } catch (error) {
      this.logger.error(`Firebase token verification failed: ${getErrorMessage(error)}`);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  private sanitizeUser(user: User) {
    const sanitized: Omit<User, 'deletedAt'> & { deletedAt?: Date } = { ...user };
    delete sanitized.deletedAt;
    return sanitized;
  }
}
