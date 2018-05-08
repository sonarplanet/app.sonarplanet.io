export const rootContext = '/api/v1'
const sonarplanetBackendUrl = '%%SONAR_BACK_URL%%' + rootContext
const accountsUrl = sonarplanetBackendUrl + '/accounts/'
const tempUBID = '123456789'
const subscriptionUrl = accountsUrl + tempUBID + '/networks/ETHEREUM_KOVAN/' + 'public-address-subscriptions'
const webpushNotificationUrl = accountsUrl + '/' + tempUBID + '/webpush-notifications'

export function registerServiceWorker(ethAddress: string) {
  return navigator.serviceWorker.register('./js/service-worker.js').then(serviceWorkerRegistration => {
    console.info("Service worker registered")
    return serviceWorkerRegistration
  },
    err => {
      console.error("Error during service worker registration. " + err)
      return err
    })
}

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


export function createPublicAddressSubscription(address: String) {
  return fetch(subscriptionUrl, {
    method: 'post',
    body: JSON.stringify({
      publicAddress: address
    })
  })
}


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


// Account
export function createAccountIfNeeded() {
  return fetch(accountsUrl + tempUBID, {
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

let createAccount = () => {
  return fetch(accountsUrl, {
    method: 'post',
    body: JSON.stringify({
      ubid: tempUBID
    })
  })
}
