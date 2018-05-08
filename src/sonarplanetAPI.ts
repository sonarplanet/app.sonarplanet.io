import * as ShortUniqueId from 'short-unique-id';

// Instantiate
const uid = new ShortUniqueId();

/**
 * Generate a unique random id and store it in sessionstorage
 */
let getBrowserId = () => {
  let uniqueBrowserId = sessionStorage.getItem("sonarplanet_unique_id")
  if (!uniqueBrowserId) {
    uniqueBrowserId = uid.randomUUID(42)
    sessionStorage.setItem("sonarplanet_unique_id", uniqueBrowserId)
  }
  return uniqueBrowserId
}

const rootContext = '/api/v1'
const sonarplanetBackendUrl = '%%SONAR_BACK_URL%%' + rootContext
const accountsUrl = sonarplanetBackendUrl + '/accounts/'
const subscriptionUrl = accountsUrl + getBrowserId() + '/networks/ETHEREUM_KOVAN/' + 'public-address-subscriptions'
const webpushNotificationUrl = accountsUrl + '/' + getBrowserId() + '/webpush-notifications'

/**
 * Register service worker
 */
export function registerServiceWorker() {
  return navigator.serviceWorker.register('./js/service-worker.js').then(serviceWorkerRegistration => {
    console.info("Service worker registered")
    return serviceWorkerRegistration
  },
    err => {
      console.error("Error during service worker registration. " + err)
      return err
    })
}

/**
 * Subscribe browser to push server
 * @param registration ServiceWorkerRegistration :
 */
export function subscribeDevice(registration: ServiceWorkerRegistration) {
  return registration.pushManager.subscribe({ userVisibleOnly: false }).then(
    subscription => {
      console.info("Device registered to push server")
      return subscription
    },
    err => {
      console.error("Error during device registration")
      return err
    }
  )
}

/**
 * Create Public Address Subscription to trigger notifications
 * @param address String : Public address to track
 */
export function createPublicAddressSubscription(address: String) {
  return fetch(subscriptionUrl, {
    method: 'post',
    body: JSON.stringify({
      publicAddress: address
    })
  })
}

/**
 * Create WebPushNotification to add webpush settings to browser account.
 * @param subscription PushSubscription : webpush server endpoint and user keys that enable backend to create webpush notifications sent by webpush server
 */
export function createWebPushNotification(subscription: PushSubscription) {
  return fetch(webpushNotificationUrl, {
    method: 'post',
    body: JSON.stringify({ subscription })
  }).then(webPushNotification => {
    console.info("Web push notification parameters created.")
    return webPushNotification
  },
    err => {
      console.error("Error occured during webpush notif parameters creation")
      return err
    }
  )
}

/**
 * Create a browser account if needed. Check if an account exists in backend and create it if not.
 */
export function createAccountIfNeeded() {
  return fetch(accountsUrl + getBrowserId(), {
    method: 'GET'
  }).then(
    (response) => {
      if (response.status === 404) {
        return createAccount()
      }
      return response
    },
    (err) => {
      console.log('Error: Account')
      return err
    }
  )
}

/**
 * Create a browser account
 */
let createAccount = () => {
  return fetch(accountsUrl, {
    method: 'post',
    body: JSON.stringify({
      ubid: getBrowserId()
    })
  })
}
