import { Injectable, Logger } from '@nestjs/common';
import { getMessaging } from 'firebase-admin/messaging';
import { getErrorMessage } from '../../common/errors';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendPushNotification(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        token: fcmToken,
      };

      await getMessaging().send(message);

      return true;
    } catch (error) {
      this.logger.error(`Error sending FCM message: ${getErrorMessage(error)}`);
      return false;
    }
  }
}
