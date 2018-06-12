/* =====================================================================
 * Agreement Modal
 * ===================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var Cookie = Sushi.Cookie;
	var Events = Sushi.Events;
	var Modal = Sushi.Modal;


	// Set default options
	// ---------------------------

	Modal.DEFAULTS.horizontalCentering = true;
	Modal.DEFAULTS.verticalCentering = true;
	Modal.DEFAULTS.lockScrollWhileOpen = true;




	/* Agreement Modal (open until cookie is set)
	   ===================================================================== */

	var agreementModal = document.getElementById("agreementModal");

	if (agreementModal !== null) {
		var agreeCheckbox = document.getElementById("agreementModalAgreeCheckbox");
		var dontAgreeCheckbox = document.getElementById("agreementModalDontAgreeCheckbox");

		var modal = new Modal(document.createElement("i"), {
			overlay: $("#agreementModalOverlay"),
			container: $("#agreementModalContainer"),
			modal: $(agreementModal),
			populateContent: false,
			insertCloseButton: false,
			closeOnOverlayClick: false,
			closeOnEscape: false,
		});

		// Modal is already open, but we need to init the event listeners
		modal.open();

		Events(agreeCheckbox).on("change", function () {
			Cookie.create("userAgreement", true, 365);
			modal.close();
		});

		Events(dontAgreeCheckbox).on("change", function () {
			window.location.href = "https://google.com";
		});
	}




	/* Subscribe to Alerts Modal
	   ===================================================================== */

	var alertsModalOpenButton = document.getElementById("alertsModalOpenButton");
	var mobileMenuAlertsModalOpenButton = document.getElementById(
		"mobileMenuAlertsModalOpenButton"
	);
	var alertsModalContent = document.getElementById("alertsModalContent");

	if (alertsModalContent !== null) {
		if (alertsModalOpenButton !== null) {
			new Modal(alertsModalOpenButton, {
				content: alertsModalContent,
			});
		}

		if (mobileMenuAlertsModalOpenButton !== null) {
			new Modal(mobileMenuAlertsModalOpenButton, {
				content: alertsModalContent,
			});
		}
	}



})(Sushi || (Sushi = {}));
