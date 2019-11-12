/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ztest/Train_10_ChangeSet/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});