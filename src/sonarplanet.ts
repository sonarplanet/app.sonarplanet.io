const rootContext = '/api/v1'
const sonarplanetBackendUrl = '%%SONAR_BACK_URL%%' + rootContext
const register = '/register-to-notification'

const tempUBID = '123456789'

const accountsUrl = sonarplanetBackendUrl + '/accounts/'
const subscriptionUrl = accountsUrl + tempUBID + '/networks/ETHEREUM_KOVAN/' + 'public-address-subscriptions'
const webpushNotificationUrl = accountsUrl + '/' + tempUBID + '/webpush-notifications'


$(document).ready(() => {
  createAccountIfNeeded()
  var form = document.getElementById("trackAddressForm") as HTMLFormElement;
  form.addEventListener('submit', event => {
    trackAddressNow(event)
  })
})

let trackAddressNow = (event: Event) => {
  event.preventDefault()
  resetAlerts()
  var inputAddress = document.getElementById("trackAddress") as HTMLInputElement
  registerServiceWorker(inputAddress.value).then((serviceWorkerRegistration) => {
    subscribeDevice(serviceWorkerRegistration).then((subscription) => {
      createWebPushNotification(subscription).then(webPushNotification => {
        createPublicAddressSubscription(inputAddress.value).then(
          response => {
            if (response.status != 201) {
              showAlert("Error during public address subscription creation", "danger")
            } else {
              showAlert("Public address subscription success", "success")
            }
          },
          err => {
            showAlert("Error during public address subscription creation", "danger")
          }
        )
      })
    })
  })
}


let showAlert = (consoleMsg: string, level: string) => {
  console.error(consoleMsg)
  $('.alert.alert-'+level).css('display', 'block')
}

let registerServiceWorker = (ethAddress: string) => {
  return navigator.serviceWorker.register('./js/service-worker.js').then(serviceWorkerRegistration => {
    console.info("Service worker registered")
    return serviceWorkerRegistration
  },
    err => {
      console.error("Error during service worker registration. " + err)
      return err
    })
}

let createWebPushNotification = (subscription: PushSubscription) => {
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

let subscribeDevice = (registration: ServiceWorkerRegistration) => {
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

let resetAlerts = () => {
  $('.alert').each((index: Number, alert: HTMLElement) => {
    $(alert).css('display', 'none')
  })
}


// Account
let createAccountIfNeeded = () => {
  fetch(accountsUrl + tempUBID, {
    method: 'GET'
  }).then(
    (response) => {
      if (response.status === 404) {
        createAccount()
      }
    },
    (err) => {
      console.log('Error: Account')
    }
  )
}

let createAccount = () => {
  fetch(accountsUrl, {
    method: 'post',
    body: JSON.stringify({
      ubid: tempUBID
    })
  }).then(
    (response) => {
      if (response.status != 201) {
        console.info('Error during account creation')
        $('.alert.alert-danger').css('display', 'block')
        $('.track-btn').prop('disabled', true)
      }
    }, (err) => {
      console.error('Error during account creation')
    }
  )
}

//PublicAddressSubscription
let createPublicAddressSubscription = (address: String) => {
  return fetch(subscriptionUrl, {
    method: 'post',
    body: JSON.stringify({
      publicAddress: address
    })
  })
}
