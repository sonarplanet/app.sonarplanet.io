interface Window {
  registration: ServiceWorkerRegistration;
  clients: any;
}

interface Event {
  notification: any;
  waitUntil: Function;
}

self.addEventListener('push', (event: MessageEvent) => {
  let url;
  if (event.data) {
    url = event.data.json().url;
  }

  const NOTIFICATION_OPTIONS = {
    body: "Une nouvelle transaction sur l'adresse que vous suivez. Cliquez pour plus d'informations.",
    icon: '../images/logo.png',
    data: {
      url: url,
    },
  };

  self.registration.showNotification('Notification Sonar Planet', NOTIFICATION_OPTIONS);
});

self.addEventListener('notificationclick', function(event) {
  const URL = event.notification.data.url;
  event.notification.close();
  event.waitUntil(self.clients.openWindow(URL));
});
