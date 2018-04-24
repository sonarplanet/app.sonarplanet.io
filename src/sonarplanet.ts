const sonarplanetBackendUrl = 'http://localhost:8080/register-to-notification'

$(document).ready(() => {
  var form = document.getElementById("trackAddressForm") as HTMLFormElement;
  form.addEventListener('submit', event => {
    trackAddressNow(event);
  })
});

let trackAddressNow = (event: Event) => {
  event.preventDefault();
  $('.alert').each((index: Number, alert: HTMLElement) => {
    $(alert).css('display', 'none')
  })
  var inputAddress = document.getElementById("trackAddress") as HTMLInputElement;
  registerServiceWorker(inputAddress.value);
}

let registerServiceWorker = (ethAddress: string) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./js/service-worker.js')
      .then((registration) => {
        console.log('Registration succeeded.')
        subscribeDevice(registration, ethAddress)
      }, err => {
        console.log("error 0")
      }).catch((error) => {
        console.log('Registration failed with ' + error)
      })
  }
}

let subscribeDevice = (registration: ServiceWorkerRegistration, ethAddress: string) => {
  if (registration && registration.pushManager) {
    registration.pushManager.subscribe({ userVisibleOnly: false }).then(
      subscription => {
        let subscriptionObject = {
          subscription: subscription,
          address: ethAddress
        }
        $.post(sonarplanetBackendUrl, JSON.stringify(subscriptionObject), (data: JSON) => { })
          .done(() => { $('.alert.alert-success').css('display', 'block') })
          .fail((jqXHR, textStatus, errorThrown) => {
            console.log(errorThrown)
            $('.alert.alert-danger').css('display', 'block')
          })
      },
      err => {
        console.log("error 2")
      }
    )
      .catch((subscriptionErr) => {
        console.log(subscriptionErr)
        $('.alert.alert-danger').css('display', 'block')
      })
  }
}
