interface Window {
  registration: ServiceWorkerRegistration,
  clients: any
}

interface Event {
  notification: any,
  waitUntil: Function
}

self.addEventListener('push', (event: MessageEvent) => {
  var url;
  if (event.data) {
    url = event.data.json().url
  }

  var notificationOptions = {
    body: "Une nouvelle transaction sur l'adresse que vous suivez. Cliquez pour plus d'informations.",
    icon: './images/logo-sonarplanet-dark.png',
    data: {
      url: url
    }
  }

  self.registration.showNotification("Notification Sonar Planet", notificationOptions);

});

self.addEventListener('notificationclick', function (event) {
  var url = event.notification.data.url;
  event.notification.close();
  event.waitUntil(self.clients.openWindow(url));
});
