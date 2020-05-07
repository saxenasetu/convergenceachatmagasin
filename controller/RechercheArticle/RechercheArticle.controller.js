sap.ui.define([
	"com/eramet/Convergence_Achat_Magasin/controller/BaseController",
	"com/eramet/Convergence_Achat_Magasin/util/constans",
	"com/eramet/Convergence_Achat_Magasin/util/formatter"
], function (BaseController, constans, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.Convergence_Achat_Magasin.controller.RechercheArticle.RechercheArticle", {

		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "RechercheArticle") {
				this.registerNavFrom(this);
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		}

	});

});