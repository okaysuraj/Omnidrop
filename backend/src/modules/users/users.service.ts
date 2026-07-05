import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Address } from '../../database/entities';
import { UserRole } from '../../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  // --- User management (admin) ---
  async findAll(page = 1, pageSize = 20, role?: UserRole) {
    const where: any = {};
    if (role) where.role = role;

    const [items, total] = await this.userRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { addresses: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateRole(id: string, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    return this.userRepository.save(user);
  }

  async toggleActive(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = !user.isActive;
    return this.userRepository.save(user);
  }

  async getStats() {
    const total = await this.userRepository.count();
    const customers = await this.userRepository.count({ where: { role: UserRole.CUSTOMER } });
    const shopkeepers = await this.userRepository.count({ where: { role: UserRole.SHOPKEEPER } });
    const riders = await this.userRepository.count({ where: { role: UserRole.DELIVERY_PARTNER } });
    return { total, customers, shopkeepers, riders };
  }

  // --- Addresses ---
  async findAddresses(userId: string) {
    return this.addressRepository.find({ where: { userId }, order: { isDefault: 'DESC' } });
  }

  async createAddress(userId: string, data: Partial<Address>) {
    if (data.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }
    const address = this.addressRepository.create({ ...data, userId });
    return this.addressRepository.save(address);
  }

  async updateAddress(userId: string, addressId: string, data: Partial<Address>) {
    const address = await this.addressRepository.findOne({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundException('Address not found');

    if (data.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }

    Object.assign(address, data);
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, addressId: string) {
    const result = await this.addressRepository.delete({ id: addressId, userId });
    if (result.affected === 0) throw new NotFoundException('Address not found');
    return { deleted: true };
  }
}
