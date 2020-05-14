sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"ClearSubmit/model/models",
	"ClearSubmit/model/ContextModel",
	"sap/m/Token",
	"sap/m/library",
	"sap/m/MessageToast"
], function (UIComponent, JSONModel, models, ContextModel, Token, MobileLibrary, MessageToast) {
	"use strict";

	return UIComponent.extend("ClearSubmit.Component", {

		metadata: {
			manifest: "json"
		},

		appModel: {
			isBusy: false
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			var that = this;

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// set application model
			this.setModel(new JSONModel(this.appModel), "appModel");
			this.setModel(models.createLocalModel());
			this.setModel(new JSONModel({
				"maximumFilenameLength": 55,
				"maximumFileSize": 10,
				"mode": MobileLibrary.ListMode.SingleSelectMaster,
				"uploadEnabled": true,
				"uploadButtonVisible": true,
				"enableEdit": false,
				"enableDelete": true,
				"visibleEdit": false,
				"visibleDelete": true,
				"listSeparatorItems": [
					MobileLibrary.ListSeparators.All,
					MobileLibrary.ListSeparators.None
				],
				"showSeparators": MobileLibrary.ListSeparators.All,
				"listModeItems": [{
					"key": MobileLibrary.ListMode.SingleSelectMaster,
					"text": "Single"
				}, {
					"key": MobileLibrary.ListMode.MultiSelect,
					"text": "Multi"
				}],
				"busy": false,
				"submitEnabled": true,
				"headerBusy": false
			}), "settings");

			// get task instance ID	and read the process context
			try {
				var taskId = this._getTaskId();

				var p = ContextModel.readContext(that, taskId);
				p.then(function (oContext) {
					// loading of context data was successfull

					// TODO Here you can add some initialization if necessary

					// adding that "data" model. data.ctx contains the context
					var oStartupParameters = that.getComponentData().startupParameters;
					// 获取Parameters
					var oQueryParameters = oStartupParameters.oParameters.oQueryParameters;
					var oTaskData = oStartupParameters.taskModel.getData();
					var oDataModel = new JSONModel({
						context: oContext,
						task: {
							description: "",
							title: oTaskData.TaskTitle,
							priority: oTaskData.Priority,
							priorityText: oTaskData.PriorityText,
							status: oTaskData.Status,
							statusText: oTaskData.StatusText,
							createdOn: oTaskData.CreatedOn,
							createdBy: oTaskData.CreatedBy
						}
					});
					// Setting task description
					oStartupParameters.inboxAPI.getDescription("NA", taskId)
						.done(function (dataDescr) {
							oDataModel.setProperty("/task/description", dataDescr.Description);
						})
						.fail(function (errorText) {
							that._handleError.call(that, Error(errorText));
						});

					// set the model for binding
					that.setModel(oDataModel, "data");

					// // add buttons to approve and reject
					// that._addAction("Approve", "GENERIC_COMPLETE_TITLE", "Accept", function (button) {
					// 	that._callbackAction(oDataModel, "confirm");
					// });

					// that._addAction("Reject", "GENERIC_REJECT_TITLE", "Reject", function (button) {
					// 	that._callbackAction(oDataModel, "Reject");
					// });
					that._addAction("Approve", "GENERIC_SUBMIT_TITLE", "Accept", function (button) {
						that._callbackAction(oDataModel, "SUBMIT");
					});

					// 绑定附件
					if (oContext.DocumentInfoRecord) {
						var DocumentInfoRecordDocType = oContext.DocumentInfoRecord.DocumentInfoRecordDocType;
						var DocumentInfoRecordDocNumber = oContext.DocumentInfoRecord.DocumentInfoRecordDocNumber;
						var DocumentInfoRecordDocVersion = oContext.DocumentInfoRecord.DocumentInfoRecordDocVersion;
						var DocumentInfoRecordDocPart = oContext.DocumentInfoRecord.DocumentInfoRecordDocPart;
					}

					var path = "Attach>/A_DocumentInfoRecordAttch(DocumentInfoRecordDocType='" + DocumentInfoRecordDocType +
						"',DocumentInfoRecordDocNumber='" + DocumentInfoRecordDocNumber + "',DocumentInfoRecordDocVersion='" +
						DocumentInfoRecordDocVersion + "',DocumentInfoRecordDocPart='" + DocumentInfoRecordDocPart + "')";
					// this.getView().bindElement(path);
					that.getRootControl().byId("UploadCollectionAttach").bindElement(path);

					//绑定供应商
					var Customers = oContext.Header.Customers;
					var CustomerInput = that.getRootControl().byId("Customer");
					if (Customers !== undefined) {
						for (var i = 0; i < Customers.length; i++) {
							CustomerInput.addToken(new Token({
								key: Customers[i].key,
								text: Customers[i].text
							}));
						}
					}
					// remove busy indicator
					that.setBusy(false);
				}, function (err) {
					that._handleError.call(that, err);
				});
			} catch (err) {
				that._handleError.call(that, err);
			}
		},

		_callbackAction: function (oDataModel, action) {

			var that = this;
			var _checkAction = false;
			// if (action === "confirm") {
			_checkAction = that._checkConfirmData(oDataModel.getData());
			// } else {
			// 	_checkAction = that._checkRejectData(oDataModel.getData());
			// }
			if (_checkAction) {
				var taskId = that.oComponentData.inboxHandle.attachmentHandle.detailModel.getData().InstanceID;
				// var p = ContextModel.triggerComplete(taskId, action, oDataModel.getData().context);
				// p.then(function () {
				// 	that._refreshTask.call(that);
				// }, function (err) {
				// 	that._handleError.call(that, err);
				// });
				that.completeWorkflowTasks(oDataModel, action);
			}

		},
		completeWorkflowTasks: function (oDataModel, action) {
			var that = this;
			var oData = oDataModel.getData();
			that._JSONModel.setProperty("/appProperties/busy", true);
			// 上传附件
			// var oUploadCollection = that.byId("UploadCollectionAttach");
			var oUploadCollection = that.getRootControl().byId("UploadCollectionAttach");
			oUploadCollection.upload();

			// 填写审批历史记录
			var currentLog = {
				"STARTCOMPANY": oData.context.Header.STARTCOMPANY,
				"FLOWID": oData.context.workflowDefinitionId,
				"INSTANCEID": oData.context.workflowInstanceId,
				"NODEID": oData.queryParameters.node[0],
				"SUBNODEID": oData.queryParameters.subnode[0],
				"TASKINSTANCEID": that._getTaskId(),
				// "SNUMBER": "0001",
				"DOCUMENT": oData.context.Header.FLOW,
				"ACCOUNT": oData.context.APPLICANT,
				"JOB": "",
				"APPROVALDATE": new Date(),
				"CHANGEDATE": new Date(),
				"SUGGESTION": action,
				"RESULT": ""
			};
			oData.context.currentAction = action;
			// oData.context.approvalLogs.push(currentLog);

			// 返写日志记录至Cloud Foundry HANA
			that.postToCFHana(oData, currentLog).then(function (oSuccess) {
				var taskId = that.oComponentData.inboxHandle.attachmentHandle.detailModel.getData().InstanceID;
				var p = ContextModel.triggerComplete(taskId, action, oDataModel.getData().context);
				p.then(function () {
					that._refreshTask.call(that);
					that._JSONModel.setProperty("/appProperties/busy", false);
				}, function (err) {
					that._JSONModel.setProperty("/appProperties/busy", false);
					that._handleError.call(that, err);
				});
			}, function (oError) {
				that._JSONModel.setProperty("/appProperties/busy", false);
				MessageToast.show("回写HANA日志失败，请稍后再试");
			});
		},

		postToCFHana: function (oData, oLog) {
			var that = this;
			var promise = new Promise(function (resolve, reject) {
				that.createNodeHistory(that, oLog).then(function (oData) {
					// that.batchCreateMaterialHistoryItem(oData);
					// that.getModel().setProperty("/MaterialHead/ApplicteNum", oData.APPNUM);
					resolve(oData);
				}, function (oError) {
					reject(oError);
				});
			});
			return promise;
		},
		createNodeHistory: function (oController, oLog) {
			var promise = new Promise(function (resolve, reject) {
				var mParameter = {
					success: function (oData) {
						resolve(oData);
					},
					error: function (oError) {
						reject(oError);
					}
				};
				oController.getModel("WORKFLOWLOG").create("/WORKFLOWLOG", oLog, mParameter);
			});
			return promise;
		},
		/**
		 * 
		 */
		_handleError: function (err) {
			// to ensure busy indicator is off
			this.setBusy(false);

			// show a message box with the error
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.error(err.toLocaleString(), {
				title: this.getModel("i18n").getResourceBundle().getText("GENERIC_ERROR_TITLE")
			});
		},

		/**
		 *
		 */
		_checkConfirmData: function (oData) {
			// TODO check data and return either true or false
			return true;
		},

		/**
		 *
		 */
		_checkRejectData: function (oData) {
			// TODO check data and return either true or false
			return true;
		},

		/**
		 *
		 */
		setBusy: function (isBusy) {
			var oModel = this.getModel("appModel");
			oModel.setProperty("/isBusy", isBusy);
			oModel.refresh();
		},

		/**
		 *
		 */
		_getTaskId: function () {
			var oCompontentData = this.getComponentData();
			if (oCompontentData.startupParameters) {
				var startupParameters = oCompontentData.startupParameters;
				var taskData = startupParameters.taskModel.getData();
				var taskId = taskData.InstanceID;

				return taskId;
			}

			throw Error("no startupParameter available");
		},

		/**
		 *
		 */
		_addAction: function (sName, sButtonText, sButtonType, fnPressed) {
			var oCompontentData = this.getComponentData();
			if (oCompontentData.startupParameters) {
				var startupParameters = this.getComponentData().startupParameters;
				startupParameters.inboxAPI.addAction({
					action: sName,
					label: this.getModel("i18n").getResourceBundle().getText(sButtonText),
					type: sButtonType
				}, fnPressed, this);
			}
		},

		/**
		 *
		 */
		_refreshTask: function () {
			this.getComponentData().startupParameters.inboxAPI.updateTask("NA", this._getTaskId());
		}
	});
});