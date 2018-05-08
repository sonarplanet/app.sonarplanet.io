import * as SonarPlanetAPI from "./sonarplanetAPI"


$(document).ready(() => {
  SonarPlanetAPI.createAccountIfNeeded().then(
    (response) => {
      if ([201,200].indexOf(response.status) === -1) {
        $('.alert.alert-danger').css('display', 'block')
        $('.track-btn').prop('disabled', true)
      }
      return response
    }, (err) => {
      console.error('Error during account creation')
      return err
    }
  )
  var form = document.getElementById("trackAddressForm") as HTMLFormElement;
  form.addEventListener('submit', event => {
    trackAddressNow(event)
  })
})

let trackAddressNow = (event: Event) => {
  event.preventDefault()
  resetAlerts()
  var inputAddress = document.getElementById("trackAddress") as HTMLInputElement
  SonarPlanetAPI.registerServiceWorker().then((serviceWorkerRegistration) => {
    SonarPlanetAPI.subscribeDevice(serviceWorkerRegistration).then((subscription) => {
      SonarPlanetAPI.createWebPushNotification(subscription).then(webPushNotification => {
        SonarPlanetAPI.createPublicAddressSubscription(inputAddress.value).then(
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
  console.log(consoleMsg)
  $('.alert.alert-'+level).css('display', 'block')
}

let resetAlerts = () => {
  $('.alert').each((index: Number, alert: HTMLElement) => {
    $(alert).css('display', 'none')
  })
}
