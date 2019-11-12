sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("ztest.Train_10_ChangeSet.controller.CreateOrder", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ztest.Train_10_ChangeSet.view.CreateOrder
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				//lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading"),
				salesOrder: {
					"GrossAmount": "100",
					"CurrencyCode": "USD"
				},
				items: []
			});
			
			//this.getRouter().getRoute("createOrder").attachPatternMatched(this._onObjectMatched, this);

			this.getView().setModel(oViewModel, "createOrderView");

			//this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		onAddItem: function(){
			var oViewModel = this.getView().getModel("createOrderView");
			var items = oViewModel.getProperty("/items");
			var itemData = {
				"Product": "HT-1040",
				"Quantity":"1",
				"Unit": "EA",
				"Price": "100",
				"Amount": "100"
			};
			items.push(itemData);
			oViewModel.setProperty("/items", items);
		},
		
		onSave: function(){
			//デフォルトモデルであるODataを取得
			var oModel = this.getView().getModel();
			//ビューモデルからODataに送る項目を取得（ヘッダ、明細を分ける）
			var oViewModel = this.getView().getModel("createOrderView");
			var payload_h = oViewModel.getProperty("/salesOrder");
			var payload_i = oViewModel.getProperty("/items");
			
			
			//DeferredGroupを設定
			//1回にまとめる場合は設定しなくても変わらない
			oModel.setDeferredGroups(["group1"]);
			
			var oParams = {};
			oParams.headers = {"content-ID": 1};
			
			//ヘッダの登録
			oModel.create("/SalesOrderSet", payload_h, oParams);
			
			//明細の登録
			//まとめるとエラーになってしまうので1行ずつ
			oParams.headers = "";
			//oParams.groupId = "group2";
			for (var i = 0; i < payload_i .length; i++) {
				var oEntry = payload_i[i];
				oModel.create("/$1/ToItems", oEntry, oParams);
			}
			
			//busyを設定
			this.g_setBusy(true);
			var that = this;
			
			//結果をサブミット
			oModel.submitChanges({
				success: function(data) {
					//busyを解除
					that._setBusy(false);
					MessageToast.show("Sales order has been created");
				},
				error : function(e) {
					that._setBusy(false);
					MessageBox.error(e.message);
				},
				groupId: "group1"
			});
			
		},
		
		_setBusy : function (bIsBusy) {
			var oModel = this.getView().getModel("createOrderView");
			oModel.setProperty("/busy", bIsBusy);
		},
		
		_onMetadataLoaded: function () {
		}
	});
});