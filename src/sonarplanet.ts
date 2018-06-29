import * as SonarPlanetAPI from './sonarplanetAPI';

$(document).ready(() => {

  SonarPlanetAPI.getNetworks().then(
    (response) => {
      response.forEach((element:any) => {
        $('#trackNetwork').append($('<option>', {
          value:element.networkId,
          text:element.label,
        }));
      });
    },
    (err) => {
      console.error('Error during network fetching');
      return err;
    },
  );

  SonarPlanetAPI.createAccountIfNeeded().then(
    (response) => {
      if ([201, 200].indexOf(response.status) === -1) {
        $('.alert.alert-danger').css('display', 'block');
        $('.track-btn').prop('disabled', true);
      }
      return response;
    },
    (err) => {
      console.error('Error during account creation');
      return err;
    },
  );
  const FORM = document.getElementById('trackAddressForm') as HTMLFormElement;
  FORM.addEventListener('submit', (event) => {
    trackAddressNow(event);
  });
});

let trackAddressNow = (event: Event) => {
  event.preventDefault();
  resetAlerts();
  const INPUT_ADDRESS = document.getElementById('trackAddress') as HTMLInputElement;
  const INPUT_NETWORK = document.getElementById('trackNetwork') as HTMLSelectElement;
  SonarPlanetAPI.registerServiceWorker().then((serviceWorkerRegistration) => {
    SonarPlanetAPI.subscribeDevice(serviceWorkerRegistration).then((subscription) => {
      SonarPlanetAPI.createWebPushNotification(subscription).then((webPushNotification) => {
        SonarPlanetAPI.createPublicAddressSubscription(INPUT_ADDRESS.value, INPUT_NETWORK.value).then(
          (response) => {
            if (response.status !== 201) {
              showAlert('Error during public address subscription creation', 'danger');
            } else {
              showAlert('Public address subscription success', 'success');
            }
          },
          (err) => {
            if (err) {
              showAlert('Error during public address subscription creation', 'danger');
            }
          },
        );
      });
    });
  });
};

let showAlert = (consoleMsg: string, level: string) => {
  console.log(consoleMsg);
  $('.alert.alert-' + level).css('display', 'block');
};

let resetAlerts = () => {
  $('.alert').each((index: Number, alert: HTMLElement) => {
    $(alert).css('display', 'none');
  });
};
