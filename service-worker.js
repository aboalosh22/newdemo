'use strict';

/* eslint-env browser, serviceworker */

importScripts('./scripts/libs/idb-keyval.js');
importScripts('./scripts/analytics-sw.js');

self.analytics.trackingId = 'UA-77119321-2';

self.addEventListener('push', function(event) {
  console.log('Received push');
  let notificationTitle = 'شبكة نجمان نت اللاسلكية';
  const notificationOptions = {
    body: 'عزيزي المشترك: رصيدك المتبقي أقل من 100 ميجا',
    icon: './images/logo-192x192.png',
    badge: './images/badge-72x72.png',
    tag: 'تنبيه',
    data: {
      url: 'http://n.net/status.html',
    },
  };

  if (event.data) {
    const dataText = event.data.text();
    notificationTitle = 'شبكة نجمان نت اللاسلكية';
    notificationOptions.body = `عزيزي المشترك: '${dataText}'`;
  }

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(
        notificationTitle, notificationOptions),
      self.analytics.trackEvent('push-received'),
    ])
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let clickResponsePromise = Promise.resolve();
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data.url);
  }

  event.waitUntil(
    Promise.all([
      clickResponsePromise,
      self.analytics.trackEvent('notification-click'),
    ])
  );
});

self.addEventListener('notificationclose', function(event) {
  event.waitUntil(
    Promise.all([
      self.analytics.trackEvent('notification-close'),
    ])
  );
});
