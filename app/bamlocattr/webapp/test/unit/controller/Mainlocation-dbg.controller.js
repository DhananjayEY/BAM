/*global QUnit*/

sap.ui.define([
	"com/ey/bamlocattr/controller/Mainlocation.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Mainlocation Controller");

	QUnit.test("I should test the Mainlocation controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});