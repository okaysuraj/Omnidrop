import { Injectable, ConflictException, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { User } from '../../database/entities';
import { UserRole } from '../../common/enums';
import { RegisterDto, UpdateProfileDto } from './dto/auth.dto';

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
    this.logger.log(`User registered: ${user.email} (${user.role})`);

    return this.sanitizeUser(user);
  }

  async login(firebaseToken: string) {
    const decodedToken = await this.verifyFirebaseToken(firebaseToken);

    const user = await this.userRepository.findOne({
      where: { firebaseUid: decodedToken.uid, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found. Please register first.');
    }

    // Update verification status if changed
    if (decodedToken.email_verified && !user.isVerified) {
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
    const allowedUpdates = ['fullName', 'phone', 'avatarUrl', 'currentLat', 'currentLng', 'fcmToken'] as const;
    const updateData: Partial<User> = {};
    for (const key of allowedUpdates) {
      if (data[key] !== undefined) (updateData as any)[key] = data[key];
    }

    Object.assign(user, updateData);
    await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }

  private async verifyFirebaseToken(token: string): Promise<DecodedIdToken> {
    try {
      return await getAuth().verifyIdToken(token);
    } catch (error) {
      this.logger.error(`Firebase token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  private sanitizeUser(user: User) {
    const { deletedAt, ...sanitized } = user;
    return sanitized;
  }
}
