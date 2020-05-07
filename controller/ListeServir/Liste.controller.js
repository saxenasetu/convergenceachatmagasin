sap.ui.define([
	"com/eramet/Convergence_Achat_Magasin/controller/BaseController",
	"com/eramet/Convergence_Achat_Magasin/util/constans",
	"com/eramet/Convergence_Achat_Magasin/util/formatter",
	"sap/m/MessageBox"
], function (BaseController, constans, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("com.eramet.Convergence_Achat_Magasin.controller.ListeServir.Liste", {
		aOldValues: [10, 5, 8],      
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Liste") {
				this.registerNavFrom(this);
				var sTile = this.getView().getModel("i18n").getResourceBundle().getText("listeTitle");	
			
				//this.getView().byId("title").setText(sTile + " " + constans.aList.title.split("N° liste ")[1]);
				//this.getView().byId("breadcrumbs").setCurrentLocationText(sTile + " " + constans.aList.title.split("N° liste ")[1]);
				this.getView().byId("title").setText(sTile + " " + constans.aList.DeliveryDocument);
				this.getView().byId("breadcrumbs").setCurrentLocationText(sTile + " " + constans.aList.DeliveryDocument);
				this._resetModel();
				this._initStepInputs();
			}
		},	

		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		onPressNavBack: function () {
			this._resetModel();
			this.activeLine = "";
			this.getView().byId("enregister").setEnabled(false);
			//this.getView().byId("confirmer").setEnabled(false);
			this.getRouter().navTo("ListeServir");
		},
		
		_resetModel: function () {
		/*	var aElements = [
				{
					"title": "Code article 1",
			    	"designation": "Désignation 1",
			    	"demandee": "Demandée 1",
			    	"OriginalDeliveryQuantity": 10,
			    	"emplacement": "Emplacement 1",
			    	"servie": "Qté servie"
				},
				{
					"title": "Code article 2",
			    	"designation": "Désignation 2",
			    	"demandee": "Demandée 2",
			    	"OriginalDeliveryQuantity": 5,
			    	"emplacement": "Emplacement 2",
			    	"servie": "Qté servie"
				},
				{
					"title": "Code article 3",
			    	"designation": "Désignation 3",
			    	"demandee": "Demandée 3",
			    	"OriginalDeliveryQuantity": 8,
			    	"emplacement": "Emplacement 3",
			    	"servie": "Qté servie"
				}
			];
			this.listModel(aElements);*/
			
			var that = this;
			var sUrl = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_OUTBOUND_DELIVERY_SRV"].uri;
			
			var oModel = new sap.ui.model.odata.ODataModel(sUrl,true);
			
			this.getView().byId("listList").setBusy(true);
			
			oModel.read("/A_OutbDeliveryItem", {
				success: function (oData, oResponse) {
				
					var aDetailListEntries = [];
				//	;
					
					for(var i=0; i<=oData.results.length-1;i++ ){
						
						oData.results[i].quantity = 0;
						
						if(oData.results[i].DeliveryDocument === constans.aList.DeliveryDocument && 
						oData.results[i].PickingStatus != 'C' &&
						Number(oData.results[i].ActualDeliveredQtyInBaseUnit) != 0 ){
							
							oData.results[i].addEnabled = false;
							oData.results[i].removeEnabled = false;
						
							
							aDetailListEntries.push(oData.results[i]);
						}
						
					}
				
					//that.listModel(aDetailListEntries);
					
					that._CheckMaterialQuantity(aDetailListEntries);
					
					that.getView().byId("listList").setBusy(false);
					
				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
				}
			});
			
			this._setItemHeaderData();
		},
		
		_CheckMaterialQuantity: function(modelData){
			
			var that = this;
			var sUrl = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZI_INV_ARTICLEDETAIL_CDS"].uri;
			var oModel = new sap.ui.model.odata.ODataModel(sUrl,true);
			
			
			
			oModel.read("/ZI_INV_ARTICLEDETAIL", {
				success: function (oData, oResponse) {
					
					for(var i=0; i<=modelData.length-1;i++){
						
						for(var j=0;j<=oData.results.length-1;j++){
							if(modelData[i].Material == oData.results[j].matnr){
								modelData[i].MaterialDesc		= oData.results[j].maktg;
								modelData[i].MaterialCode		= oData.results[j].matnr;
								modelData[i].Emplacement		= oData.results[j].lgpbe;
								modelData[i].Magasin			= oData.results[j].lgort;
								break;
							}
							else{
								modelData[i].MaterialDesc = '';
							}
						}
						
					}
					
					that.listModel(modelData);
					
			
				
				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
				}
			});
			
			
			
		},
		
		bPartialPicking: false,
		
		_onCheckPartialPicking: function(){
			var oView = this.getView();
			var oPickingList = oView.getModel("listModel").getData();
	
			for(var i=0; i<=oPickingList.length-1;i++){
				
				if(Number(oPickingList[i].quantity) === Number(oPickingList[i].ActualDeliveryQuantity) && Number(oPickingList[i].ActualDeliveryQuantity) != 0){
					this.bPartialPicking = false;
				}
				else{
					this.bPartialPicking = true;
				}
				
			}
			
		},
		
		onPressEnregister: function(){
			
			var that = this;
			var sMessage = "";
			var sTitle = this.getView().getModel("i18n").getResourceBundle().getText("detailsDocMessageBoxTitle"),
				sButtonSave = this.getView().getModel("i18n").getResourceBundle().getText("detailsDocMessageBoxButton1"),
				sButtonCancel = this.getView().getModel("i18n").getResourceBundle().getText("detailsDocMessageBoxButton2");
			
			this._onCheckPartialPicking();
			
			console.log(this.bPartialPicking);

			if(!this.bPartialInventory){
				sMessage = this.getView().getModel("i18n").getResourceBundle().getText("listeMessageTextPartial");
			}
			else{
				sMessage = this.getView().getModel("i18n").getResourceBundle().getText("listeMessageText");
			}
			
		
			MessageBox.confirm(sMessage, {
				title: sTitle,
				actions: [sButtonSave, sButtonCancel],
				onClose: function (oAction) {
					
					if(oAction === "Oui"){
						BaseController.prototype.displayPopup(
						"L’inventaire a été sauvegardé",
						"Confirmer",
						"warning",
						function close(){
								that.onPickItems();
							}
						);
					}
					
				}
			});
			
			
		},
		
		onPickItems: function(){
			
			var that = this;
			var sUrlDetails = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_OUTBOUND_DELIVERY_SRV"].uri;
			var oModelDetails = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
			var oInventoryItemsModel = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
			
			var aListData = this.getView().getModel("listModel").getData();
			
			console.log("ListData",aListData);
			
			this.getView().byId("listList").setBusy(true);
			
			oModelDetails.read("A_OutbDeliveryHeader(DeliveryDocument='"+aListData[0].DeliveryDocument+"')", {
				success: function (oData, oResponse) {
				
					var batchModel =			oInventoryItemsModel;
					var batchChanges=			[];

					console.log(aListData);
						
					for(var i=0;i<aListData.length;i++){
						
						var oChangeSet = {
									"ActualDeliveryQuantity" : (Number(aListData[i].ActualDeliveryQuantity) - Number(aListData[i].quantity)).toString()//,
								//	"ActualDeliveredQtyInBaseUnit" : (aListData[i].ActualDeliveredQtyInBaseUnit).toString()
									
								};
						
						batchChanges.push(
							batchModel.createBatchOperation("PickOneItemWithBaseQuantity?DeliveryDocument='"+
							aListData[i].DeliveryDocument+"'&DeliveryDocumentItem='"+
							Number(aListData[i].DeliveryDocumentItem).toString()+"'&ActualDeliveredQtyInBaseUnit="+
							Number(aListData[i].quantity)+"&BaseUnit='"+aListData[i].BaseUnit+"'","POST", "", {sETag: oResponse.headers.etag})
						//batchModel.createBatchOperation("A_OutbDeliveryItem(DeliveryDocument='"+aListData[i].DeliveryDocument+"',DeliveryDocumentItem='"+aListData[i].DeliveryDocumentItem+"')","POST", oChangeSet, {sETag: oResponse.headers.etag})
						);
						
						/*batchChangesQuantity.push(
							batchModel.createBatchOperation("A_OutbDeliveryItem(DeliveryDocument='"+aListData[i].DeliveryDocument+"',DeliveryDocumentItem='"+aListData[i].DeliveryDocumentItem+"')","PATCH", oChangeSet, {sETag: oResponse.headers.etag})
						);*/
						
					}	
					
					batchModel.setUseBatch(true);
					batchModel.addBatchChangeOperations(batchChanges);
		    		batchModel.submitBatch(
		    			function(oData){
		    				console.log(oData.__batchResponses);
		    				
		    				if(oData.__batchResponses[0].response){
		    					var oError = JSON.parse(oData.__batchResponses[0].response.body);
		    					var sErrorText = oError.error.message.value;
		
			                    MessageBox.error(sErrorText,
			                        {
			                            styleClass: "sapUiSizeCompact"
			                        }
			                    ); 
		    				}
		    				else{
		
			    				/*console.log(that.activeLine);
		    					that.activeLine = "";
		    					that.getView().byId("enregister").setEnabled(false);
		    					that.getView().byId("listList").setBusy(false);
		    					that.onPressNavBack();*/
		    					
		    					that._onSubmitQuantityBatch();
	
		    				}
		    				
		    				that.getView().byId("listList").setBusy(false);
		    			},
		    			function(oData,oResponse){
		    				console.log(oResponse);
		    				
		    				that.activeLine = "";
		    				that.getView().byId("listList").setBusy(false);
		    			}
		    		);	

				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
		    		that.getView().byId("listList").setBusy(false);
				}
			});
			
		},
		
		_onSubmitQuantityBatch: function(){
			
			var that = this;
			var sUrlDetails = com.eramet.Convergence_Achat_Magasin.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_OUTBOUND_DELIVERY_SRV"].uri;
			var oModelDetails = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
			var oInventoryItemsModel = new sap.ui.model.odata.ODataModel(sUrlDetails,true);
			
			var aListData = this.getView().getModel("listModel").getData();
			
			console.log("ListData",aListData);
			
			this.getView().byId("listList").setBusy(true);
			
			oModelDetails.read("A_OutbDeliveryHeader(DeliveryDocument='"+aListData[0].DeliveryDocument+"')", {
				success: function (oData, oResponse) {
				
					var batchModel =			oInventoryItemsModel;
					var batchChanges=			[];

					console.log(aListData);
						
					for(var i=0;i<aListData.length;i++){
						
						var oChangeSet = {
									"ActualDeliveryQuantity" : (Number(aListData[i].ActualDeliveryQuantity) - Number(aListData[i].quantity)).toString()//,
							};

						batchChanges.push(
							batchModel.createBatchOperation("A_OutbDeliveryItem(DeliveryDocument='"+aListData[i].DeliveryDocument+"',DeliveryDocumentItem='"+aListData[i].DeliveryDocumentItem+"')","PATCH", oChangeSet, {sETag: oResponse.headers.etag})
						);
						
					}	
					
					batchModel.setUseBatch(true);
					batchModel.addBatchChangeOperations(batchChanges);
		    		batchModel.submitBatch(
		    			function(oData){
		    				console.log(oData.__batchResponses);
		    				
		    				if(oData.__batchResponses[0].response){
		    					var oError = JSON.parse(oData.__batchResponses[0].response.body);
		    					var sErrorText = oError.error.message.value;
		
			                    MessageBox.error(sErrorText,
			                        {
			                            styleClass: "sapUiSizeCompact"
			                        }
			                    ); 
		    				}
		    				else{
		
			    				console.log(that.activeLine);
		    					that.activeLine = "";
		    					that.getView().byId("enregister").setEnabled(false);
		    					that.getView().byId("listList").setBusy(false);
		    					that.onPressNavBack();
	
		    				}
		    				
		    				that.getView().byId("listList").setBusy(false);
		    			},
		    			function(oData,oResponse){
		    				console.log(oResponse);
		    				
		    				that.activeLine = "";
		    				that.getView().byId("listList").setBusy(false);
		    			}
		    		);	

				},
				error: function (oData, oResponse) {
					console.log("fail",oResponse);
		    		that.getView().byId("listList").setBusy(false);
				}
			});
			
			
		},
		
		_setItemHeaderData: function(){
			var aListHeader = constans.aList;
			
			this.getView().byId("demandeur").setValue(constans.aList.CreatedByUser);
			this.getView().byId("service").setValue(constans.aList.DeliveryDocumentType);
			this.getView().byId("date").setValue(new Date(constans.aList.PlannedGoodsIssueDate).toLocaleDateString("FR"));
			
			console.log(constans.aList);
			
		},
		
		_checkFullList: function () {

			var oList = this.getView().getModel("listModel").getData(),
				bFull = false,
				iCounter = 0;
			for(var i = 0; i < oList.length; i++) {
				if(parseInt(oList[i].quantity) > 0) {
					iCounter++;
				}
			}
			if(iCounter === oList.length){
			//Because of partial inventory we don't need to check the full list
			//if(iCounter >= 1)
				bFull = true;
			}
			console.log(bFull);
			
			if(bFull) {
				this.getView().byId("enregister").setEnabled(true);
				this.getView().byId("enregister").setType("Emphasized");
			} else {
				this.getView().byId("enregister").setEnabled(false);
				this.getView().byId("enregister").setType("Ghost");
			}
		},
		
		_initStepInputs: function () {
			/* eslint-disable */
			var oList = this.getView().byId("listList").getItems();
			for(var i = 0; i < oList.length; i++) {
				oList[i].getContent()[0].getItems()[4].getItems()[1].setValue("0");
				if(parseInt(oList[i].getContent()[0].getItems()[4].getItems()[1].getValue()) === 0) {
					oList[i].getContent()[0].getItems()[4].getItems()[0].setEnabled(false);
					oList[i].getContent()[0].getItems()[4].getItems()[1].removeStyleClass("customInputTextGreen");
				}
			} 
		},
		
		onPressDec: function (oEvent) {
			var core = sap.ui.getCore();
			core.byId(oEvent.getSource().sId).setEnabled(true);
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).removeStyleClass("customInputTextGreen");
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[2].sId).setEnabled(true);
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).setValue((parseInt(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].getValue()) - 1));
			var sId = oEvent.getSource().sId.split("listList-")[1]; 
			this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit =  parseInt(this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit) + 1; 
			this.getView().getModel("listModel").refresh(true);
			if(parseInt(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].getValue()) === 0) {
				core.byId(oEvent.getSource().sId).setEnabled(false);
			}
			
			this._checkFullList();
		},
		
		onPressInc: function (oEvent) {
			var core = sap.ui.getCore();
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).removeStyleClass("customInputTextGreen");
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[0].sId).setEnabled(true);
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).setValue((parseInt(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].getValue()) + 1));
			var sId = oEvent.getSource().sId.split("listList-")[1]; 
			this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit =  parseInt(this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit) - 1; 
			this.getView().getModel("listModel").refresh(true);
			if(parseInt(this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit) === 0) {
				core.byId(oEvent.getSource().sId).setEnabled(false);
				core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).addStyleClass("customInputTextGreen");
			}
			
			this._checkFullList();
		},
		
		onCheckValue: function (oEvent) {
			
		//	console.log(oEvent.getSource());
			
			var core = sap.ui.getCore(),
				sValue = parseInt(oEvent.getSource().getValue()),
				sId = oEvent.getSource().sId.split("listList-")[1],
				iOldValue = parseInt(this.aOldValues[sId]);
			if(sValue <= iOldValue) {
				core.byId(oEvent.getSource().sId).removeStyleClass("customInputTextGreen");
				core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).setValue(sValue);
				this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit = iOldValue - sValue;
				this.getView().getModel("listModel").refresh(true);
				if(iOldValue === 0) {
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[2].sId).setEnabled(false);
				}
				if(sValue === 0) {
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[0].sId).setEnabled(false);
				}
				if(this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit === 0) {
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[2].sId).setEnabled(false);
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[0].sId).setEnabled(true);
					core.byId(oEvent.getSource().sId).addStyleClass("customInputTextGreen");
				} 
				if(this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit > 0) {
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[2].sId).setEnabled(true);
				} 
			} else {
				core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).setValue("");
				this.getView().getModel("listModel").getData()[sId].ActualDeliveredQtyInBaseUnit = this.aOldValues[sId];
				this.getView().getModel("listModel").refresh(true);
			}
			
			this._checkFullList();
		},
		
		/*Enable counters in the list*/
		
		//activeLine is a flag to handle the active/inactive line state
		activeLine: "",
		
		/*This function handle the line item active/inactive state*/
		onEnableItem: function(oEvent){
			var sPath = oEvent.getSource().sId.split("-")[4];
			var oDocumentsModel = this.getView().getModel("listModel");

			/*Handle the active line item flag */
			this._onSetListItemInactive();
			
			//If there is a valid quantity we have to enable the minus button
			oDocumentsModel.getData()[sPath].quantity > 0 ? oDocumentsModel.getData()[sPath].removeEnabled = true : "";
			
			/*Make button clickable*/
			if(parseInt(oDocumentsModel.getData()[sPath].ActualDeliveryQuantity) != 0){
				oDocumentsModel.getData()[sPath].addEnabled = true;
			}
			
			oDocumentsModel.refresh(true);
			
			/*set the active line item flag*/
			this.activeLine = sPath;

		},
		
		_onSetListItemInactive: function(){
			var oDocumentsModel = this.getView().getModel("listModel");
			
			if(this.activeLine === ""){
			}
			else{
				oDocumentsModel.getData()[this.activeLine].addEnabled = false;
				oDocumentsModel.getData()[this.activeLine].removeEnabled = false
			}
			
			this.getView().getModel("listModel").refresh(true);
			
			console.log(this.getView().getModel("listModel").getData());
		}

	});

});