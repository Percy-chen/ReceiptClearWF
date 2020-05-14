sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"ClearApproval/model/models",
	"ClearApproval/model/ContextModel",
	"sap/m/MessageToast",
	"ClearApproval/js/xml-js",
	"sap/m/Dialog",
	"sap/m/MessageView",
	"sap/m/MessageItem",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/Bar",
	"sap/m/Token"
], function (UIComponent, JSONModel, models, ContextModel, MessageToast, xml, Dialog, MessageView, MessageItem, Button, Text, Bar, Token) {
	"use strict";

	return UIComponent.extend("ClearApproval.Component", {

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
			this._JSONModel = this.getModel();
			this.getModel("userAttributes").attachRequestCompleted(function (oEvent) {
				var userAttributes = this.getData();
				// this.setModel(userAttributes.displayname, "Approver");
				that.getModel().setProperty("/Approver", userAttributes.name);
				that.getUSER(userAttributes.name);
				// that.getModel().setProperty("/ECRData/REQUESTER", userAttributes.displayname);
			});

			// get task instance ID	and read the process context
			try {
				var taskId = this._getTaskId();

				var p = ContextModel.readContext(that, taskId);
				p.then(function (oContext) {
					// loading of context data was successfull

					// TODO Here you can add some initialization if necessary

					// var Approver = that.getModel().oData.Approver;
					oContext.Header.PostingDate = new Date();
					oContext.Header.DocumentDate = new Date();
					oContext.RESULT = "";

					// oContext.Header.Accountant = Approver;

					// adding that "data" model. data.ctx contains the context
					var oStartupParameters = that.getComponentData().startupParameters;
					// 获取Parameters
					var oQueryParameters = oStartupParameters.oParameters.oQueryParameters;
					if (oQueryParameters.node[0] === "0010") {
						that.GetADoc(that, oContext.Header.FLOW);
					}
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
						},
						queryParameters: oQueryParameters
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

					var PrintFlag = oDataModel.getData().context.Print;
					if (PrintFlag === "X") {
						that._addAction("Print", "GENERIC_PRINT_TITLE", "Accept", function () {
							that._callbackAction(oDataModel, "Print");
						});
						that._addAction("OK", "GENERIC_OK_TITLE", "OK", function () {
							that._callbackAction(oDataModel, "OK");
						});
					} else {
						that._addAction("Approve", "GENERIC_COMPLETE_TITLE", "Accept", function () {
							that._callbackAction(oDataModel, "confirm");
						});
						that._addAction("Reject", "GENERIC_REJECT_TITLE", "Reject", function () {
							that._callbackAction(oDataModel, "Reject");
						});
					}

					// // add buttons to approve and reject
					// that._addAction("Approve", "GENERIC_COMPLETE_TITLE", "Accept", function (button) {
					// 	that._callbackAction(oDataModel, "confirm");
					// });

					// that._addAction("Reject", "GENERIC_REJECT_TITLE", "Reject", function (button) {
					// 	that._callbackAction(oDataModel, "Reject");
					// });
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

					//绑定客户
					// var Customers = oContext.Header.Customers;
					// var CustomerInput = that.getRootControl().byId("CustomerInput");
					// if (Customers !== undefined) {
					// 	for (var i = 0; i < Customers.length; i++) {
					// 		CustomerInput.addToken(new Token({
					// 			key: Customers[i].key,
					// 			text: Customers[i].text
					// 		}));
					// 	}
					// }

					var Customers = oContext.CustomerData;
					var CustomerInput = that.getRootControl().byId("CustomerInput");
					if (Customers !== undefined) {
						for (var i = 0; i < Customers.length; i++) {
							CustomerInput.addToken(new Token({
								key: Customers[i].CUSTOMER,
								text: Customers[i].SEARCHTERM1
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
		getUSER: function (User) {
			this._ODataModel = this.getModel("GetEMPLOYEES");
			var sPath = "/EMPLOYEES" + "('" + User + "')";
			var mParameters = {
				success: function (oData) {
					this.getModel("data").setProperty("/context/Reference1InDocumentHeader", oData.FULLNAME);
					this.getModel("data").setProperty("/context/Header/Accountant", oData.FULLNAME);
				}.bind(this)
			};
			this._ODataModel.read(sPath, mParameters);
		},
		_callbackAction: function (oDataModel, action) {
			var that = this;
			// var oData = oDataModel.getData();
			var queryParameters = oDataModel.getData().queryParameters;
			var context = oDataModel.getData().context;
			var _checkAction = false;
			if (action === "confirm") {
				context.approved = true;
				_checkAction = that._checkConfirmData(oDataModel.getData());
			} else if (action === "Reject") {
				context.approved = false;
				var RESULT = context.Header.RESULT;
				if (RESULT === undefined || RESULT === "") {
					MessageToast.show("请先输入审批意见");
					return;
				}
				that._callbackActionReject(oDataModel, action, queryParameters);
				return; //直接退出
			} else if (action === "Print") {
				that.onPrint(context, that);
			} else if (action === "OK") {
				that.onPass(context, action);
				// that._refreshTask.call(that);
			}

			if (_checkAction) {
				// var taskId = that.oComponentData.inboxHandle.attachmentHandle.detailModel.getData().InstanceID;
				// var p = ContextModel.triggerComplete(taskId, action, oDataModel.getData().context);
				// p.then(function () {
				// 	that._refreshTask.call(that);
				// }, function (err) {
				// 	that._handleError.call(that, err);
				// });

				//过账

				that._JSONModel.setProperty("/appProperties/busy", true);
				that.getModel("appModel").setProperty("isBusy", true);
				// var workflownode = oDataModel.getData().context.User.d.results[0].NODEID;
				// var PostFlag = "";
				// PostFlag = oDataModel.getData().context.Header.PostFlag;
				// if (PostFlag === "X") {
				// 	var taskId = that.oComponentData.inboxHandle.attachmentHandle.detailModel.getData().InstanceID;
				// 	var p = ContextModel.triggerComplete(taskId, action, oDataModel.getData().context);
				// 	p.then(function () {
				// 		that._refreshTask.call(that);
				// 	}, function (err) {
				// 		that._handleError.call(that, err);
				// 	});
				if (queryParameters.node[0] === "0010") {
					var PostFlag = "";
					PostFlag = oDataModel.getData().context.Header.PostFlag;
					if (PostFlag === "X") {
						var message = that.getModel("i18n").getResourceBundle().getText("Mess1");
						MessageToast.show(message);
						return;
					}
					var context = oDataModel.getData().context;
					that.postJournalEntry(context).then(function (response) {
						//过账成功
						if (that.handleJournalEntryResponse(response)) {
							that.getModel("appModel").setProperty("isBusy", false);
							that._JSONModel.setProperty("/appProperties/busy", false);
							that.changeClearReHistory(oDataModel);
							that.completeWorkflowTasks(oDataModel, action);
						} else {
							//过账失败
							that.getModel("appModel").setProperty("isBusy", false);
							that._JSONModel.setProperty("/appProperties/busy", false);
						}
					}, function () {
						//接口调用失败
						that.getModel("appModel").setProperty("isBusy", false);
						that._JSONModel.setProperty("/appProperties/busy", false);
						MessageToast.show("SOAP接口错误");
					});
				} else {
					that.getModel("appModel").setProperty("isBusy", false);
					that._JSONModel.setProperty("/appProperties/busy", false);
					that.completeWorkflowTasks(oDataModel, action);
				}
			}
		},
		completeWorkflowTasks: function (oDataModel, action) {
			var that = this;
			var context = oDataModel.getData().context;
			var queryParameters = oDataModel.getData().queryParameters;
			// var UserData = context.User.d.results;
			var Approver = that.getModel().oData.Approver;
			// for (var i = 0; i < UserData.length; i++) {
			// 	if (UserData[i].APPROVALACCOUNT === Approver) {
			// 		var NODEAPPROVER = UserData[i];
			// 	}
			// }
			if (context.approved === true) {
				var SUGGESTION = "同意";
			} else {
				var SUGGESTION = "拒绝";
			}
			var LOGData = {
				"STARTCOMPANY": context.Header.STARTCOMPANY, //发起公司
				"FLOWID": context.workflowDefinitionId,
				"INSTANCEID": context.workflowInstanceId,
				"NODEID": queryParameters.node[0],
				"SUBNODEID": queryParameters.subnode[0],
				"TASKINSTANCEID": that._getTaskId(),
				// SNUMBER: NODEAPPROVER.SNUMBER, //序号
				"DOCUMENT": context.FLOW, //单号
				"ACCOUNT": Approver, //审核人员
				// JOB: context.MAINENGINEER,//职位
				"APPROVALDATE": new Date(), //审核日期
				"CHANGEDATE": new Date(), //修改日期
				"SUGGESTION": SUGGESTION, //审核结果
				"RESULT": context.RESULT //审核意见
			};

			// 填写审批历史记录

			// 返写日志记录至Cloud Foundry HANA
			that.postToCFHana(context, LOGData).then(function (oSuccess) {
				that._JSONModel.setProperty("/appProperties/busy", true);
				var taskId = that.oComponentData.inboxHandle.attachmentHandle.detailModel.getData().InstanceID;
				var p = ContextModel.triggerComplete(taskId, action, oDataModel.getData().context);
				p.then(function () {
					that._refreshTask.call(that);
					that._JSONModel.setProperty("/appProperties/busy", false);
				}, function (err) {
					that._handleError.call(that, err);
					that._JSONModel.setProperty("/appProperties/busy", false);
				});
			}, function (oError) {
				that._JSONModel.setProperty("/appProperties/busy", false);
				MessageToast.show("回写HANA日志失败，请稍后再试");
			});
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
		},
		_callbackActionReject: function (oDataModel, action, queryParameters) {
			var that = this;
			that._JSONModel.setProperty("/appProperties/busy", true);
			var _checkAction = true;
			var context = oDataModel.getData().context;
			// var queryParameters = oDataModel.getData().queryParameters;
			// var UserData = context.User.d.results;
			var Approver = that.getModel().oData.Approver;
			// for (var i = 0; i < UserData.length; i++) {
			// 	if (UserData[i].APPROVALACCOUNT === Approver) {
			// 		var NODEAPPROVER = UserData[i];
			// 	}
			// }
			if (context.approved === true) {
				var SUGGESTION = "同意";
			} else {
				var SUGGESTION = "拒绝";
			}
			if (_checkAction) {
				// 填写审批历史记录
				var SaveLog = {
					"STARTCOMPANY": context.Header.STARTCOMPANY, //发起公司
					"FLOWID": context.workflowDefinitionId,
					"INSTANCEID": context.workflowInstanceId,
					"NODEID": queryParameters.node[0],
					"SUBNODEID": queryParameters.subnode[0],
					"TASKINSTANCEID": that._getTaskId(),
					// SNUMBER: NODEAPPROVER.SNUMBER, //序号
					"DOCUMENT": context.Header.FLOW, //单号
					"ACCOUNT": Approver, //审核人员
					// JOB: context.MAINENGINEER,//职位
					"APPROVALDATE": new Date(), //审核日期
					"CHANGEDATE": new Date(), //修改日期
					"SUGGESTION": SUGGESTION, //审核结果
					"RESULT": context.Header.RESULT //审核意见
				};
				context.currentAction = action;
				// context.approvalLogs.push(SaveLog);

				// 返写日志记录至Cloud Foundry HANA
				that.postToCFHana(context, SaveLog).then(function (oSuccess) {
					that._JSONModel.setProperty("/appProperties/busy", true);
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

			}
		},
		postToCFHana: function (oData, oLog) {
			var that = this;
			var promise = new Promise(function (resolve, reject) {
				that.createNodeHistory(that, oLog).then(function (oData) {
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
		handleJournalEntryResponse: function (response) {
			//弹出消息框
			this.createMessageDialog();

			// 处理返回消息
			var responseJs = xml2js(response, {
				compact: true
			})["soap-env:Envelope"]["soap-env:Body"]["n0:JournalEntryBulkCreateConfirmation"];

			//处理消息内容
			var aMessageItems = responseJs.JournalEntryCreateConfirmation.Log.Item;
			var aMessages = [];
			if (aMessageItems.Note !== undefined) {
				//成功 只传回一行
				aMessages.push({
					type: this.getMessageTypeFromSoap(aMessageItems.SeverityCode._text),
					title: aMessageItems.TypeID._text,
					description: aMessageItems.Note._text,
					subtitle: aMessageItems.Note._text
				});
				var AccountingDocument = responseJs.JournalEntryCreateConfirmation.JournalEntryCreateConfirmation.AccountingDocument._text;
				var CompanyCode = responseJs.JournalEntryCreateConfirmation.JournalEntryCreateConfirmation.CompanyCode._text;
				var FiscalYear = responseJs.JournalEntryCreateConfirmation.JournalEntryCreateConfirmation.FiscalYear._text;
				this.getModel("data").setProperty("/context/postedJournalEntry", {
					AccountingDocument: AccountingDocument,
					CompanyCode: CompanyCode,
					FiscalYear: FiscalYear
				});
			} else {
				// 失败传回多行
				for (var i = 0; i < aMessageItems.length; i++) {
					aMessages.push({
						type: this.getMessageTypeFromSoap(aMessageItems[i].SeverityCode._text),
						title: aMessageItems[i].TypeID._text,
						description: aMessageItems[i].Note._text,
						subtitle: aMessageItems[i].Note._text
					});
				}
			}

			this.oMessageView.setModel(new JSONModel({
				Messages: aMessages
			}), "postResults");
			//打开消息框
			this.oDialog.open();
			this.oMessageView.navigateBack();

			//根据返回的AccountingDocument字段,判断过账是否成功
			if (responseJs.JournalEntryCreateConfirmation.JournalEntryCreateConfirmation.AccountingDocument._text === undefined) {
				return false;
			} else {
				return true;
			}

		},
		createMessageDialog: function () {
			var that = this;

			if (!this.oMessageView) {
				var oMessageTemplate = new MessageItem({
					type: '{postResults>type}',
					title: '{postResults>title}',
					description: '{postResults>description}',
					subtitle: '{postResults>subtitle}'
				});
				this.oMessageView = new MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "postResults>/Messages",
						template: oMessageTemplate
					}
				});
			}
			if (!this.oDialog) {
				var oBackButton = new Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});
				this.oDialog = new Dialog({
					resizable: true,
					content: this.oMessageView,
					state: 'Error',
					beginButton: new Button({
						press: function () {
							this.getParent().close();
						},
						text: "Close"
					}),
					customHeader: new Bar({
						contentMiddle: [
							new Text({
								text: "消息"
							})
						],
						contentLeft: [oBackButton]
					}),
					contentHeight: "300px",
					contentWidth: "500px",
					verticalScrolling: false
				});
			}
			// this.getRootControl().byId("messagePopoverBtn").addDependent(this.oMP);
		},
		changeClearReHistory: function (oDataModel) {
			var that = this;
			var oData = oDataModel.getData();
			this.getClearRe(oDataModel).then(function (ClearReHis) {
				ClearReHis.ACCOUNTINGDOCUMENT = oData.context.postedJournalEntry.AccountingDocument;
				ClearReHis.COMPANYCODE = oData.context.postedJournalEntry.CompanyCode;
				ClearReHis.FISCALYEAR = oData.context.postedJournalEntry.FiscalYear;
				// var sPath = "/CLEHeader('" + oAppHeader.APPNUM + "')";
				oData.context.patchHead = ClearReHis;
				// that.getModel("CLEARRE").update(sPath, ClearReHis);
			});
		},
		getClearRe: function (oDataModel) {
			var that = this;
			var promise = new Promise(function (resolve, reject) {
				//获取清账历史数据
				var sPath = "/CLEHeader('" + oDataModel.getData().context.FLOW + "')";
				var mParameter = {
					success: function (oData) {
						resolve(oData);
					},
					error: function (oError) {
						reject(oError);
					}
				};
				that.getModel("CLEARRE").read(sPath, mParameter);
			});
			return promise;
		},
		postJournalEntry: function (oContext) {
			var GLItem = [];
			var aItems = [];
			var ReferenceDocumentItem = 1;

			var promise = new Promise(function (resolve, reject) {
				function formatDate(date) {
					var d = new Date(date),
						month = '' + (d.getMonth() + 1),
						day = '' + d.getDate(),
						year = d.getFullYear();

					if (month.length < 2) {
						month = '0' + month;
					}
					if (day.length < 2) {
						day = '0' + day;
					}
					return [year, month, day].join('-');
				}
				var lv_CostCenter1 = "";
				var lv_Country = "";
				var lv_CityName = "";
				if (oContext.Header.STARTCOMPANY === "6310") {
					lv_CostCenter1 = "63101603";
				} else if (oContext.Header.STARTCOMPANY === "1310") {
					lv_CostCenter1 = "13101602";
				}
				if (oContext.Header.STARTCOMPANY === "1310") {
					lv_Country = "CN";
					lv_CityName = "深圳";
				} else if (oContext.Header.STARTCOMPANY === "6310") {
					lv_Country = "TW";
					lv_CityName = "台北";
				} else if (oContext.Header.STARTCOMPANY === "1710") {
					lv_Country = "US";
					lv_CityName = "California";

				}
				for (var i = 0; i < oContext.GLAccountData.length; i++) {
					var lv_CostCenter = "";
					if (parseInt(oContext.GLAccountData[i].GLACCOUNT) >= 60000000 & parseInt(oContext.GLAccountData[i].GLACCOUNT) <= 69999999) {
						if (oContext.Header.STARTCOMPANY === "6310") {
							lv_CostCenter = "63101603";
						} else if (oContext.Header.STARTCOMPANY === "1310") {
							lv_CostCenter = "13101601";
						}else if  (oContext.Header.STARTCOMPANY === "1710") {
							lv_CostCenter = "17101603";
						}
					}
					GLItem.push({
						ReferenceDocumentItem: {
							_text: ReferenceDocumentItem
						},
						GLAccount: {
							_text: oContext.GLAccountData[i].GLACCOUNT.padStart(10, "0")
						},
						AmountInTransactionCurrency: {
							_attributes: {
								currencyCode: oContext.Header.CLEARCURRENCY
							},
							_text: oContext.GLAccountData[i].TRANSCURR
						},
						AmountInCompanyCodeCurrency: {
							_attributes: {
								currencyCode: oContext.Header.COMPCURRENCY
							},
							_text: oContext.GLAccountData[i].LOCALCURR
						},
						DebitCreditCode: {
							_text: oContext.GLAccountData[i].DEBITCREDIT
						},
						DocumentItemText: {
							_text: oContext.FLOW + " " + oContext.GLAccountData[i].NOTE
						},
						AssignmentReference: {
							_text: oContext.FLOW
						},
						AccountAssignment: {
							AccountAssignmentType: {
								_text: "EO"
							},
							// ProfitCenter: {
							// 	_text: "YB99"
							// },
							// Segment: {
							// 	_text: "1000_A"
							// },
							CostCenter: {
								_text: lv_CostCenter1
							}
						}
					});
					ReferenceDocumentItem += 1;
				}
				var n = GLItem.length;
				var EXCHANGEGL = oContext.Header.EXCHANGEGL;
				var GLAccount = "";
				if (EXCHANGEGL > 0) {
					GLAccount = "0071820001";
				} else {
					GLAccount = "0071810001";
				}

				GLItem.push({
					ReferenceDocumentItem: {
						_text: n + 1
					},
					GLAccount: {
						_text: GLAccount.padStart(10, "0")
					},
					ValueDate: {
						_text: formatDate(oContext.Header.PostingDate)
					},
					AmountInTransactionCurrency: {
						_attributes: {
							currencyCode: oContext.Header.CLEARCURRENCY
						},
						_text: 0
					},
					AmountInCompanyCodeCurrency: {
						_attributes: {
							currencyCode: oContext.Header.COMPCURRENCY
						},
						_text: EXCHANGEGL
					},
					DebitCreditCode: {
						_text: "H"
					},
					DocumentItemText: {
						_text: oContext.FLOW
					},
					AssignmentReference: {
						_text: oContext.FLOW
					},
					AccountAssignment: {
						CostCenter: {
							_text: lv_CostCenter1
						}
					}
				});
				for (var j = 0; j < oContext.ClearItem.length; j++) {
					var item = {
						ReferenceDocumentItem: {
							_text: ReferenceDocumentItem
						},
						Debtor: {
							_text: oContext.ClearItem[j].CUSTOMER
						},
						AmountInTransactionCurrency: {
							_attributes: {
								currencyCode: oContext.Header.CLEARCURRENCY
							},
							_text: oContext.ClearItem[j].CLEARCURR
						},
						AmountInCompanyCodeCurrency: {
							_attributes: {
								currencyCode: oContext.Header.COMPCURRENCY
							},
							_text: oContext.ClearItem[j].COMPCLEARCURR
						},
						DebitCreditCode: {
							_text: oContext.ClearItem[j].DEBITCREDITCODE
						},
						DocumentItemText: {
							_text: oContext.FLOW + " " + oContext.ClearItem[j].SEARCHTERM1 + " " + oContext.ClearItem[j].ASSIGNMENTRE
						},
						AssignmentReference: {
							_text: oContext.ClearItem[j].ASSIGNMENTRE
						},
						BusinessPlace: {
							_text: oContext.Header.STARTCOMPANY
						},
						DownPaymentTerms: {
							SpecialGLCode: {
								_text: oContext.ClearItem[j].SG
							}
						},
						CashDiscountTerms: {
							DueCalculationBaseDate: {
								_text: formatDate(oContext.Header.PostingDate)
							},
							CashDiscount1Days: {
								_text: "0"
							},
							CashDiscount1Percent: {
								_text: "0"
							},
							CashDiscount2Days: {
								_text: "0"
							},
							CashDiscount2Percent: {
								_text: "0"
							},
							NetPaymentDays: {
								_text: "0"
							}
						}
						// OneTimeCustomerDetails: {
						// 	Name: {
						// 		_text: oContext.ClearItem[j].DOCUMENTITEMTEXT.substring(0, 35)
						// 	},
						// 	Country: {
						// 		_text: lv_Country
						// 	},
						// 	CityName: {
						// 		_text: lv_CityName
						// 	}
						// }
					};
					// if (oContext.Items[j].SpecialGLCode === "") {
					// 	delete item["DownPaymentTerms"];
					// }
					aItems.push(item);
				}

				//填写
				var postJson = {
					MessageHeader: {
						CreationDateTime: {
							_text: new Date().toISOString()
						}
					},
					JournalEntryCreateRequest: {
						MessageHeader: {
							CreationDateTime: {
								_text: new Date().toISOString()
							}
						},
						JournalEntry: {
							OriginalReferenceDocumentType: {
								_text: "BKPFF"
							},
							OriginalReferenceDocument: {
								_text: "00001"
							},

							OriginalReferenceDocumentLogicalSystem: {
								_text: "SCP"
							},
							BusinessTransactionType: {
								_text: "RFBU"
							},
							AccountingDocumentType: {
								_text: "DZ"
							},
							DocumentReferenceID: {
								// _text: oContext.APPNUM  //delete by jiangqin
								_text: oContext.FLOW //add by jiangqin
							},
							DocumentHeaderText: {
								_text: "SCP收款清账"
							},
							CreatedByUser: {
								_text: "CC0000000001"
							},
							CompanyCode: {
								_text: oContext.Header.STARTCOMPANY
							},
							DocumentDate: {
								_text: formatDate(oContext.Header.DocumentDate)
							},
							PostingDate: {
								_text: formatDate(oContext.Header.PostingDate)
							},
							ExchangeRate: {
								_text: "1"
							},
							Reference1InDocumentHeader: {
								_text: oContext.Header.Accountant
							},
							Item: GLItem,
							DebtorItem: aItems
						}
					}
				};
				var options = {
					compact: true,
					ignoreComment: true,
					spaces: 4
				};
				var result = json2xml(postJson, options);
				// 拼接抬头
				result =
					"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sfin=\"http://sap.com/xi/SAPSCORE/SFIN\"><soapenv:Header/><soapenv:Body><sfin:JournalEntryBulkCreateRequest>" +
					result + "</sfin:JournalEntryBulkCreateRequest></soapenv:Body></soapenv:Envelope>";

				var BearAuth = 'Basic ' + btoa("SCP_INBOUND" + ":" + "P@ssw0rd123456789012");

				$.ajax({
					url: "/html5apps/receiptclearwf/destinations/WT_S4HC_SOAP/sap/bc/srt/scs_ext/sap/journalentrycreaterequestconfi?sap-client=100",
					method: "POST",
					contentType: "text/xml;charset=\"utf-8\"",
					data: result,
					// username: "SCP_INBOUND",
					// password: "P@ssword123456789012",
					// headers: {
					// 	"Authorization": BearAuth
					// },
					success: function (result, xhr, data) {
						resolve(data.responseText);
					},
					error: function (xhr, textStatus, errorText) {
						reject(xhr);
					}
				});
			});
			return promise;
		},
		getMessageTypeFromSoap: function (SeverityCode) {
			switch (SeverityCode) {
			case "1":
				return "Success";
			case "3":
				return "Error";
			case "2":
				return "Warning";
			}
		},
		onPrint: function (context, that) {
			that._JSONModel.setProperty("/appProperties/busy", true);
			var url = "/html5apps/receiptclearwf/destinations/Print/ws/data/print/receipt-clear";
			var language = sap.ui.getCore().getConfiguration().getLanguage();
			switch (language) {
			case "zh-Hant":
			case "zh-TW":
				language = "zh_CN_F";
				break;
			case "zh-Hans":
			case "zh-CN":
				language = "zh_CN";
				break;
			case "EN":
			case "en":
				language = "en_GB";
				break;
			default:
				break;
			}
			var Customers = context.Header.Customers;
			var customer = "";
			if (Customers !== undefined) {
				customer = Customers[0].key;
			}
			var GLAccountData = context.GLAccountData;
			var Header = context.Header;
			var ClearItem = context.ClearItem;
			var CustomerName = ClearItem[0].CUSTOMER + '(' + ClearItem[0].CUSTOMERNAME + ')';
			var items = [];
			var items1 = [];
			for (var i = 0; i < ClearItem.length; i++) {
				items[i] = {
					"flow": Header.FLOW,
					"flowItem": ClearItem[i].FLOWITEM,
					"customer": ClearItem[i].CUSTOMER,
					"searchterm1": ClearItem[i].SEARCHTERM1,
					"accountingDocument": ClearItem[i].FLOW,
					"glAccount": ClearItem[i].GLACCOUNT,
					"glAccountName": ClearItem[i].GLACCOUNTNAME,
					"sg": ClearItem[i].SG,
					"orderNo": ClearItem[i].ASSIGNMENTRE,
					"text": ClearItem[i].DOCUMENTITEMTEXT,
					"postingDate": ClearItem[i].POSTINGDATE,
					"netdueDate": ClearItem[i].NETDUEDATE,
					"transCurr": ClearItem[i].TRANSCURR,
					// "transCurrYe": ClearItem[i].TRANSCURR - ClearItem[i].CLEARCURR,
					"transCurrency": ClearItem[i].TRANSCURRENCY,
					"rate": ClearItem[i].RATE,
					"companyCodeCurr": ClearItem[i].COMPCLEARCURR,
					"clearCurr": ClearItem[i].CLEARCURR,
					"clearCurrency": ClearItem[i].CLEARCURRENCY,
					"debitCreditCode": ClearItem[i].DEBITCREDITCODE,
					"transCurrYe": ClearItem[i].COMPANYCODECURR
				};
			}
			var num = (items.length + 1) * 10;
			for (var i = 0; i < GLAccountData.length; i++) {
				items1[i] = {
					"flow": Header.FLOW,
					"flowItem": num,
					// "customer": GLAccountData[i].GLACCOUNT,
					// "searchterm1": ClearItem[i].SEARCHTERM1,
					// "accountingDocument": ClearItem[i].FLOW,
					"glAccount": GLAccountData[i].GLACCOUNT,
					"glAccountName": GLAccountData[i].GLACCOUNTNAME,
					// "assignmentre": GLAccountData[i].ASSIGNMENTRE,
					// "documentItemText": GLAccountData[i].DOCUMENTITEMTEXT,
					// "postingDate": GLAccountData[i].POSTINGDATE,
					// "netdueDate": Header.NETDUEDATE,
					// "transCurr": GLAccountData[i].TRANSCURR,
					"transCurrency": GLAccountData[i].CLEARCURRENCY,
					"clearCurr": GLAccountData[i].TRANSCURR,
					"rate": GLAccountData[i].RATE,
					"companyCodeCurr": GLAccountData[i].LOCALCURR,
					"clearCurrency": GLAccountData[i].CLEARCURRENCY,
					"debitCreditCode": GLAccountData[i].DEBITCREDIT,
					"text": GLAccountData[i].NOTE
				};
				num = num + 10;
				items.push(items1[i]);
			}
			var Num = items.length * 10 + 10;
			//匯兌損益科目				
			var EXCHANGEGL = Header.EXCHANGEGL;
			var GLAccount = "";
			var GLACCOUNTNAME = "";
			var debitCreditCode = "";
			if (EXCHANGEGL > 0) {
				GLAccount = "71820001";
				GLACCOUNTNAME = that.getModel("i18n").getResourceBundle().getText("EXCHANGEGL2");
				debitCreditCode = "S";
			} else {
				GLAccount = "71810001";
				GLACCOUNTNAME = that.getModel("i18n").getResourceBundle().getText("EXCHANGEGL1");
				debitCreditCode = "H";
			}
			var glItem = {
				"flow": Header.FLOW,
				"flowItem": Num,
				// "customer": ClearItem[i].CUSTOMER,
				// "searchterm1": ClearItem[i].SEARCHTERM1,
				// "accountingDocument": ClearItem[i].FLOW,
				"glAccount": GLAccount,
				"glAccountName": GLACCOUNTNAME,
				// "assignmentre": GLAccountData[i].ASSIGNMENTRE,
				// "documentItemText": GLAccountData[i].DOCUMENTITEMTEXT,
				// "postingDate": GLAccountData[i].POSTINGDATE,
				// "netdueDate": Header.NETDUEDATE,
				// "transCurr": GLAccountData[i].TRANSCURR,
				"transCurrency": Header.CLEARCURRENCY,
				"clearCurr": 0,
				"rate": "",
				"companyCodeCurr": EXCHANGEGL,
				"clearCurrency": Header.COMPCURRENCY,
				"debitCreditCode": debitCreditCode,
				"text": ""
			};
			items.push(glItem);
			var param = {
				"flow": Header.FLOW,
				"applicationDate": Header.APPLICATIONDATE,
				"applicant": Header.APPLICANT,
				"bukrs": Header.STARTCOMPANY,
				"companyName": Header.COMPANYNAME,
				"netDueDate": Header.NETDUEDATE,
				"customer": CustomerName,
				"transCurrency": Header.TRANSCURRENCY,
				"clearCurrency": Header.CLEARCURRENCY,
				// "note": Header.FLOW,
				"accountingDocument": "",
				"companyCode": "",
				"fiscalYear": "",
				"note": Header.NOTE,
				"manager": Header.Accountant,
				"items": items
			};
			var xhr = new XMLHttpRequest();
			xhr.responseType = "blob";
			xhr.open("POST", url, true);
			xhr.setRequestHeader("content-Type", "application/json");
			xhr.setRequestHeader("accept-language", language);
			// var that = this;
			xhr.onload = function (e) {
				that._JSONModel.setProperty("/appProperties/busy", false);
				var sUrl = window.URL.createObjectURL(this.response);
				var link = document.createElement("a");
				link.style.display = "none";
				link.href = sUrl;
				link.target = "_blank";
				// link.setAttribute('download', '11111.pdf');
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			};
			xhr.send(JSON.stringify(param));
			// var taskId = this.oComponentData.inboxHandle.attachmentHandle.detailModel.getData().InstanceID;
			// var p = ContextModel.triggerComplete(taskId, action, context);
			// var that = this;
			// p.then(function () {
			// 	that._refreshTask.call(that);
			// }, function (err) {
			// 	that._handleError.call(that, err);
			// });
		},
		onPass: function (context, action) {
			var taskId = this.oComponentData.inboxHandle.attachmentHandle.detailModel.getData().InstanceID;
			var p = ContextModel.triggerComplete(taskId, action, context);
			var that = this;
			that._JSONModel.setProperty("/appProperties/busy", true);
			p.then(function () {
				that._JSONModel.setProperty("/appProperties/busy", false);
				that._refreshTask.call(that);
			}, function (err) {
				that._JSONModel.setProperty("/appProperties/busy", false);
				that._handleError.call(that, err);
			});

		},
		GetADoc: function (that, Flow) {
			var aFilters = [];
			var oFilter1 = new sap.ui.model.Filter("DocumentReferenceID", sap.ui.model.FilterOperator.EQ, Flow);
			aFilters.push(oFilter1);
			that._ODataModel = that.getModel("ACCTGDOC");
			var mParameters = {
				filters: aFilters,
				success: function (oData) {
					if (oData.results.length > 0) {
						that.getModel("data").setProperty("/context/Header/PostFlag", "X");
					}
				}.bind(that)
			};
			that._ODataModel.read("/A_OperationalAcctgDocItemCube", mParameters);
		}
	});
});