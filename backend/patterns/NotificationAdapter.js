class ConsoleNotificationService {
  send(message) {
    console.log(`Console Notification: ${message}`);
  }
}

class NotificationAdapter {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  sendNotification(message) {
    this.notificationService.send(message);
  }
}

module.exports = {
  ConsoleNotificationService,
  NotificationAdapter,
};