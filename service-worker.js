self.addEventListener('push', function (event) {
  console.log('event : ' + JSON.stringify(event));
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
  };
  title = "Notification Sonar Planet";
  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  var url = event.notification.data.url;
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
