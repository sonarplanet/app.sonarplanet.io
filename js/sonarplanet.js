var sonarplanetBackendUrl = 'http://localhost:8080/register-to-notification';
$(document).ready(function () {
    var form = document.getElementById("trackAddressForm");
    form.addEventListener('submit', function (event) {
        trackAddressNow(event);
    });
});
var trackAddressNow = function (event) {
    event.preventDefault();
    $('.alert').each(function (index, alert) {
        $(alert).css('display', 'none');
    });
    var inputAddress = document.getElementById("trackAddress");
    registerServiceWorker(inputAddress.value);
};
var registerServiceWorker = function (ethAddress) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./js/service-worker.js')
            .then(function (registration) {
            console.log('Registration succeeded.');
            subscribeDevice(registration, ethAddress);
        }, function (err) {
            console.log("error 0");
        })["catch"](function (error) {
            console.log('Registration failed with ' + error);
        });
    }
};
var subscribeDevice = function (registration, ethAddress) {
    if (registration && registration.pushManager) {
        registration.pushManager.subscribe({ userVisibleOnly: false }).then(function (subscription) {
            var subscriptionObject = {
                subscription: subscription,
                address: ethAddress
            };
            $.post(sonarplanetBackendUrl, JSON.stringify(subscriptionObject), function (data) { })
                .done(function () { $('.alert.alert-success').css('display', 'block'); })
                .fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('.alert.alert-danger').css('display', 'block');
            });
        }, function (err) {
            console.log("error 2");
        })["catch"](function (subscriptionErr) {
            console.log(subscriptionErr);
            $('.alert.alert-danger').css('display', 'block');
        });
    }
};
