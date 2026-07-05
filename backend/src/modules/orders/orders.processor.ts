import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, Inventory } from '../../database/entities';
import { OrderStatus } from '../../common/enums';
import { WsGateway } from '../../websockets/ws.gateway';

@Processor('orders')
export class OrdersProcessor extends WorkerHost {
  private readonly logger = new Logger(OrdersProcessor.name);

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Inventory) private inventoryRepository: Repository<Inventory>,
    private wsGateway: WsGateway,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'check-acceptance-timeout') {
      const { orderId } = job.data;
      await this.handleAcceptanceTimeout(orderId);
    }
  }

  private async handleAcceptanceTimeout(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { items: true },
    });

    if (!order) return;

    // If order is still PENDING after 10 minutes, auto-cancel it
    if (order.status === OrderStatus.PENDING) {
      this.logger.warn(`Order ${orderId} auto-cancelled due to shopkeeper timeout`);
      
      order.status = OrderStatus.CANCELLED;
      await this.orderRepository.save(order);

      // Restore inventory stock
      for (const item of order.items) {
        const inventory = await this.inventoryRepository.findOne({
          where: { storeId: order.storeId, productId: item.productId },
        });
        if (inventory) {
          inventory.stock += item.quantity;
          await this.inventoryRepository.save(inventory);
        }
      }

      // Notify users via WebSocket
      this.wsGateway.emitOrderStatusUpdate(orderId, {
        status: OrderStatus.CANCELLED,
        reason: 'Store took too long to accept the order.',
      });
    }
  }
}
