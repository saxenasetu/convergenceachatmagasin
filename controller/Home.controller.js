sap.ui.define([
	"com/eramet/Convergence_Achat_Magasin/controller/BaseController",
	"com/eramet/Convergence_Achat_Magasin/util/constans",
	"com/eramet/Convergence_Achat_Magasin/util/formatter",
	"com/eramet/Convergence_Achat_Magasin/model/models",
], function (BaseController, constans, formatter, models) {
	"use strict";

	return BaseController.extend("com.eramet.Convergence_Achat_Magasin.controller.Home", {
		/* eslint-disable */
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		onAfterRendering: function(){
			
			//24.02.2020 GT
			this._getServices();
			this._getPickingList();
			this._getUnpickedItems();
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Home") {
				this.registerNavFrom(this);
			}
			
		
		},
		
		onPressNavToInventaire: function () {
			this.navTo("Inventaire");
		},
		
		onPressNavToListeServir: function () {
			this.navTo("ListeServir");
		},
		
		onPressNavToScanBl: function () {
			this.navTo("ScanBl");
		},
		
		onPressNavToRechercheArticle: function () {
			this.navTo("RechercheArticle");
		},
		
		onOpenUserSelection: function () {
			var userSelection = sap.ui.xmlfragment("com.eramet.Convergence_Achat_Magasin.view.fragment.userSelection", this);
			this.getView().addDependent(userSelection);
			userSelection.open();  
		},
		
		onSelectCustomer: function (oEvent) {
			this._setTiles(oEvent.getSource().sId);
			this._onCloseCustomerialog();
		},
		
		_onCloseCustomerialog: function () {
			var core = sap.ui.getCore();
			core.byId("userSelectionDialog").close();
			core.byId("userSelectionDialog").destroy();
		},
		
		_getServices  : function(){
			var that = this;
			var sUrl = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["MM_IM_PHYS_INV_DOC_SRV"].uri;

			var oModel = new sap.ui.model.odata.ODataModel(sUrl,true);
			oModel.read("/C_PhysInvtryDocHdrObjPage", {
				success: function (oData, oResponse) {
					console.log("success",oData.results);
				
					constans.aListDoc = oData.results;     
				
					that.listDocModel(oData);
					that.getView().byId("inventory").getTileContent()[0].getAggregation("content").setValue(oData.results.length);
				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
				}
			});
			
				    
		},
		
		_getPickingList: function(){
			
			
			var that = this;
			var sUrl = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_OUTBOUND_DELIVERY_SRV"].uri;

			var oModel = new sap.ui.model.odata.ODataModel(sUrl,true);
			oModel.read("/A_OutbDeliveryHeader", {
				success: function (oData, oResponse) {
					console.log("success",oData);
					var aNotPicked = [];
					
					for(var i=0;i<oData.results.length;i++){
						if(oData.results[i].OverallPickingStatus != "C"){
							aNotPicked.push(oData.results[i])
						}
					}
					
					//constans.aListServir = oData.results; 
					constans.aListServir = aNotPicked
					
					that.listServirModel(aNotPicked);
					
					that.getView().byId("picking").getTileContent()[0].getAggregation("content").getAggregation("items")[0].setValue(aNotPicked.length)
			
				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
				}
			});
		},
		
		_getUnpickedItems: function(){
			
			var that = this;
			var sUrl = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_OUTBOUND_DELIVERY_SRV"].uri;

			var nNotPicked = 0;

			var oModel = new sap.ui.model.odata.ODataModel(sUrl,true);
			oModel.read("/A_OutbDeliveryItem", {
				success: function (oData, oResponse) {
					
					for(var i=0; i<=oData.results.length-1;i++){
						if(oData.results[i].PickingStatus != "C"){
							
							nNotPicked++;
						}
					}
					that.getView().byId("picking").getTileContent()[0].getAggregation("content").getAggregation("items")[1].setValue(nNotPicked)
				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
				}
			});
			
			
		},
		
		_setTiles: function (sValue) {
			this.getView().byId("user").setIcon("");
			this.getView().byId("user").removeStyleClass("green");
			this.getView().byId("user").removeStyleClass("purple");
			this.getView().byId("user").removeStyleClass("blue");

			if(sValue === "magasinier") {
				this.getView().byId("user").addStyleClass("green");
				this.getView().byId("user").setText("M");
	//			util.sCustomer = "R";
			} else if (sValue === "depanneur") {
				this.getView().byId("user").addStyleClass("purple");
				this.getView().byId("user").setText("D");
	//			util.sCustomer = "D";
			} else {
				this.getView().byId("user").addStyleClass("blue");
				this.getView().byId("user").setText("T");
	//			util.sCustomer = "T";
			}
		}
		/* eslint-enable */
	});
});