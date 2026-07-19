import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product, Category } from '../../database/entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // --- Categories ---
  async findAllCategories() {
    return this.categoryRepository.find({ order: { sortOrder: 'ASC' } });
  }

  async createCategory(data: { name: string; slug: string; imageUrl?: string; sortOrder?: number }) {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: string, data: Partial<Category>) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Category not found');
    return { deleted: true };
  }

  // --- Products ---
  async findAll(params: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    search?: string;
    sort?: string;
  }) {
    const { page = 1, pageSize = 20, categoryId, search, sort = 'name' } = params;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (categoryId) {
      query.andWhere('product.category_id = :categoryId', { categoryId });
    }

    if (search) {
      // Typo-tolerant full-text search fallback to ILIKE
      query.andWhere(
        `(to_tsvector('english', product.name || ' ' || coalesce(product.description, '')) @@ plainto_tsquery('english', :search)) OR (product.name ILIKE :searchLike OR product.description ILIKE :searchLike)`,
        { search, searchLike: `%${search}%` },
      );
    }

    if (sort === 'price_asc') {
      query.orderBy('product.selling_price', 'ASC');
    } else if (sort === 'price_desc') {
      query.orderBy('product.selling_price', 'DESC');
    } else if (sort === 'newest') {
      query.orderBy('product.created_at', 'DESC');
    } else {
      query.orderBy('product.name', 'ASC');
    }

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: Partial<Product>) {
    // Auto-generate slug from name
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async delete(id: string) {
    const result = await this.productRepository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
    return { deleted: true };
  }

  async search(query: string) {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where(
        `(to_tsvector('english', product.name || ' ' || coalesce(product.description, '')) @@ plainto_tsquery('english', :query)) OR (product.name ILIKE :queryLike OR product.description ILIKE :queryLike)`,
        { query, queryLike: `%${query}%` },
      )
      .take(20)
      .getMany();
  }
}
