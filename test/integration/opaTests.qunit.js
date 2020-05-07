/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/eramet/Convergence_Achat_Magasin/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});