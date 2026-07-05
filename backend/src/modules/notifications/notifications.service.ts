import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendPushNotification(fcmToken: string, title: string, body: string, data?: Record<string, string>) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        token: fcmToken,
      };

      const response = await getMessaging().send(message);
      this.logger.log(`Successfully sent FCM message: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending FCM message: ${error.message}`);
      return false;
    }
  }

  async sendMulticastNotification(fcmTokens: string[], title: string, body: string, data?: Record<string, string>) {
    if (fcmTokens.length === 0) return false;
    
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        tokens: fcmTokens,
      };

      const response = await getMessaging().sendEachForMulticast(message);
      this.logger.log(`Successfully sent FCM multicast: ${response.successCount} successes, ${response.failureCount} failures`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending FCM multicast: ${error.message}`);
      return false;
    }
  }
}
