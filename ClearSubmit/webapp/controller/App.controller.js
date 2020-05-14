sap.ui.define(["./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/UploadCollectionParameter",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"./messages",
		"sap/m/library",
		"sap/ui/comp/filterbar/FilterBar",
		"sap/ui/comp/filterbar/FilterGroupItem",
		"sap/m/Table",
		'sap/m/Token',
		"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
		"sap/m/Input",
		"sap/m/MultiInput",
		"sap/m/Text"
	],
	function (BaseController, JSONModel, Filter, FilterOperator, UploadCollectionParameter, MessageToast, MessageBox, messages,
		MobileLibrary, FilterBar, FilterGroupItem, mTable, Token, ValueHelpDialog, Input, MultiInput, Text) {
		"use strict";
		return BaseController.extend("ClearSubmit.controller.App", {

			onInit: function () {
				this._JSONModel = this.getModel();
				this.getView().setModel(new JSONModel({
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
					"submitEnabled": true
				}), "settings");
			},

			formatDate: function (value) {
			if (value) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return oDateFormat.format(new Date(value));
			} else {
				return value;
			}
		},
			// onSearchBankAccount: function (oEvent) {
			// 	var that = this;
			// 	//设置语言
			// 	var sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
			// 	switch (sLanguage) {
			// 	case "zh-Hant":
			// 		sLanguage = "ZF";
			// 		break;
			// 	case "zh-Hans":
			// 	case "zh-CN":
			// 		sLanguage = "ZH";
			// 		break;
			// 	case "EN":
			// 		sLanguage = "EN";
			// 		break;
			// 	default:
			// 		break;
			// 	}
			// 	var CompanyCode = this.getModel("data").getProperty("/context/STARTCOMPANY");
			// 	if (!this._oMTableBKA) {
			// 		var oSRColumnModel = new JSONModel();
			// 		oSRColumnModel.setData({
			// 			cols: [{
			// 				label: "科目",
			// 				template: "GLAccount"
			// 			}, {
			// 				label: "科目描述",
			// 				template: "GLAccountName"
			// 			}, {
			// 				label: "科目货币",
			// 				template: "GLAccountCurrency"
			// 			}]
			// 		});
			// 		this._oMTableBKA = new mTable();
			// 		this._oMTableBKA.setModel(oSRColumnModel, "columns");
			// 		this._oMTableBKA.setModel(this.getModel("BANKGLACCOUNTVH"), "BANKGLACCOUNTVH");
			// 		this._oMTableBKA.getModel("BANKGLACCOUNTVH").attachBatchRequestCompleted(function (oEvent) {
			// 			that._oValueHelpDialogBKA.setContentHeight("100%");
			// 		});
			// 	}
			// 	if (!this._oFilterBarBKA) {
			// 		this._oFilterBarBKA = new FilterBar({
			// 			advancedMode: true,
			// 			filterBarExpanded: true, //Device.system.phone,
			// 			filterGroupItems: [new FilterGroupItem({
			// 					groupTitle: "More Fields",
			// 					groupName: "gn1",
			// 					name: "GLAccount",
			// 					label: "會計科目",
			// 					control: new Input({
			// 						id: "GLAccount"
			// 					}),
			// 					visibleInFilterBar: true
			// 				}),
			// 				new FilterGroupItem({
			// 					groupTitle: "More Fields",
			// 					groupName: "gn1",
			// 					name: "GLAccountName",
			// 					label: "科目描述",
			// 					control: new Input({
			// 						id: "GLAccountName"
			// 					}),
			// 					visibleInFilterBar: true
			// 				})
			// 			],
			// 			search: function (oEvent) {
			// 				var aSearchItems = oEvent.getParameters().selectionSet;
			// 				var aFilters = [];
			// 				for (var i = 0; i < aSearchItems.length; i++) {
			// 					if (aSearchItems[i].getValue() != "") {
			// 						var filter = new Filter({
			// 							path: aSearchItems[i].getId(),
			// 							operator: FilterOperator.Contains,
			// 							value1: aSearchItems[i].getValue()
			// 						});
			// 						aFilters.push(filter);
			// 					}

			// 				}
			// 				var aFiltersLast = [new Filter({
			// 						path: "Language",
			// 						operator: FilterOperator.EQ,
			// 						value1: sLanguage
			// 					}),
			// 					new Filter({
			// 						path: "CompanyCode",
			// 						operator: FilterOperator.EQ,
			// 						value1: CompanyCode
			// 					})
			// 				];
			// 				if (aFilters.length > 0) {
			// 					aFiltersLast.push(new Filter({
			// 						filters: aFilters,
			// 						and: false
			// 					}));
			// 				}

			// 				that._oMTableBKA.bindItems({
			// 					path: "BANKGLACCOUNTVH>/YY1_BANKGLACCOUNTVH",
			// 					template: new sap.m.ColumnListItem({
			// 						// type: "Navigation",
			// 						cells: [
			// 							new Text({
			// 								text: "{BANKGLACCOUNTVH>GLAccount}"
			// 							}),
			// 							new Text({
			// 								text: "{BANKGLACCOUNTVH>GLAccountName}"
			// 							}),
			// 							new Text({
			// 								text: "{BANKGLACCOUNTVH>GLAccountCurrency}"
			// 							})
			// 						]
			// 					}),
			// 					filters: aFiltersLast
			// 				});

			// 			},
			// 			clear: function (oEvent) {

			// 			}
			// 		});
			// 	}

			// 	if (!this._oValueHelpDialogBKA) {
			// 		this._oValueHelpDialogBKA = new ValueHelpDialog("idValueHelpBKA", {
			// 			supportRanges: false,
			// 			supportMultiselect: false,
			// 			// filterMode: true,
			// 			key: "GLAccount",
			// 			descriptionKey: "GLAccount",
			// 			title: "银行科目",
			// 			ok: function (oEvent) {

			// 				this.close();
			// 			},
			// 			cancel: function () {
			// 				this.close();
			// 			},
			// 			selectionChange: function (oEvent) {
			// 				var sPath = oEvent.getParameter("tableSelectionParams").listItem.getBindingContextPath();
			// 				// var sItemPath_G = that.getModel().getProperty("/valueHelpItemPath");
			// 				// that.getModel().setProperty(sItemPath_G + "/Material", that.getModel("Product").getProperty(sPath).Product);
			// 				// that.getModel().setProperty(sItemPath_G + "/MaterialDescription", that.getModel("Product").getProperty(sPath).ProductDescription);
			// 				// that.getModel().setProperty(sItemPath + "/Material",that.gt)
			// 				that._JSONModel.setProperty("/ClearHead/BANKACCOUNT", that.getModel("BANKGLACCOUNTVH").getProperty(sPath).GLAccount);
			// 				that._JSONModel.setProperty("/ClearHead/BANKACCOUNTDES", that.getModel("BANKGLACCOUNTVH").getProperty(sPath).GLAccountName);
			// 				that._JSONModel.setProperty("/ClearHead/CURRENCY", that.getModel("BANKGLACCOUNTVH").getProperty(sPath).GLAccountCurrency);
			// 				that._oMTableBKA.removeSelections(true);
			// 				var ClearHead = that._JSONModel.getData().ClearHead;
			// 				if (ClearHead.CURRENCY !== ClearHead.COMCURRENCY) {
			// 					that.getCurrencyRate();
			// 				} else {
			// 					that._JSONModel.setProperty("/ClearHead/RATE", 1);
			// 				}
			// 			}
			// 		});
			// 		this._oValueHelpDialogBKA.setTable(this._oMTableBKA);
			// 		this._oValueHelpDialogBKA.setFilterBar(this._oFilterBarBKA);
			// 	}

			// 	this._oValueHelpDialogBKA.open();

			// },
			onSearchCustomer: function (oEvent) {
				var that = this;
				var oCustomer = this.getView().byId("Customer");
				var oSRColumnModel = new JSONModel();
				oSRColumnModel.setData({
					cols: [{
						label: "客户",
						template: "BusinessPartner"
					}, {
						label: "客户描述",
						template: "BusinessPartnerName"
					}, {
						label: "客户简称",
						template: "SearchTerm1"
					}]
				});
				if (!this._oMTableSup) {
					this._oMTableSup = new mTable();
					this._oMTableSup.setModel(oSRColumnModel, "columns");
					this._oMTableSup.setModel(this.getModel("CUSTOMERVH"));
				}

				this._oMTableSup.getModel().attachBatchRequestCompleted(function (oEvent) {
					that._oValueHelpDialogSup.setContentHeight("100%");
				});

				if (!this._oFilterBarSup) {
					var BusinessPartnerMutiInput = new MultiInput({
						id: "BusinessPartner",
						showValueHelp: false
					});
					var BusinessPartnerNameMutiInput = new MultiInput({
						id: "BusinessPartnerName",
						showValueHelp: false
					});

					var SearchTerm1MutiInput = new MultiInput({
						id: "SearchTerm1",
						showValueHelp: false
					});
					BusinessPartnerMutiInput.addValidator(function (args) {
						var text = args.text;
						return new Token({
							key: text,
							text: text
						});
					});
					BusinessPartnerNameMutiInput.addValidator(function (args) {
						var text = args.text;
						return new Token({
							key: text,
							text: text
						});
					});
					SearchTerm1MutiInput.addValidator(function (args) {
						var text = args.text;
						return new Token({
							key: text,
							text: text
						});
					});

					this._oFilterBarSup = new FilterBar({
						advancedMode: true,
						filterBarExpanded: true, //Device.system.phone,
						filterGroupItems: [
							new FilterGroupItem({
								groupTitle: "More Fields",
								groupName: "gn1",
								name: "BusinessPartnerGroupItem",
								label: this.getModel("i18n").getResourceBundle().getText("Customer"),
								control: BusinessPartnerMutiInput,
								visibleInFilterBar: true
							}),
							new FilterGroupItem({
								groupTitle: "More Fields",
								groupName: "gn1",
								name: "BusinessPartnerNameGroupItem",
								label: this.getModel("i18n").getResourceBundle().getText("SearchTerm1"),
								control: BusinessPartnerNameMutiInput,
								visibleInFilterBar: true
							}),
							new FilterGroupItem({
								groupTitle: "More Fields",
								groupName: "gn1",
								name: "SearchTerm1GroupItem",
								label: this.getModel("i18n").getResourceBundle().getText("ShortName"),
								control: SearchTerm1MutiInput,
								visibleInFilterBar: true
							})
						],
						search: function (oEvent) {
							var aSearchItems = oEvent.getParameters().selectionSet;
							var aFilters = [];
							var LastFilter = [];
							for (var i = 0; i < aSearchItems.length; i++) {
								if (aSearchItems[i].getTokens()) {
									var tokens = aSearchItems[i].getTokens();
									for (var j = 0; j < tokens.length; j++) {
										aFilters.push(new Filter({
											path: aSearchItems[i].getId(),
											operator: FilterOperator.Contains,
											value1: tokens[j].getKey()
										}));
									}
								}
							}
							if (aFilters.length > 0) {
								var aSelectFilter = new Filter({
									filters: aFilters,
									and: false
								});
								LastFilter.push(aSelectFilter);
							}
							LastFilter.push(new Filter({
								path: "CompanyCode",
								operator: FilterOperator.EQ,
								value1: that.getModel("data").getProperty("/context/Header/STARTCOMPANY")
							}));

							that._oMTableSup.bindItems({
								path: "/YY1_CUMTOMERVH",
								template: new sap.m.ColumnListItem({
									cells: [
										new Text({
											text: "{BusinessPartner}"
										}),
										new Text({
											text: "{BusinessPartnerName}"
										}),
										new Text({
											text: "{SearchTerm1}"
										})
									]
								}),
								filters: LastFilter
							});

						},
						clear: function (oEvent) {}
					});
				}

				var that = this;
				if (!this._oValueHelpDialogSup) {
					this._oValueHelpDialogSup = new ValueHelpDialog("idValueHelpSup", {
						supportRanges: true,
						supportMultiselect: true,
						// filterMode: true,
						key: "BusinessPartner",
						descriptionKey: "BusinessPartnerName",
						title: this.getModel("i18n").getResourceBundle().getText("SearchCustomer"),
						ok: function (oEvent) {
							oCustomer.setTokens(oEvent.getParameter("tokens"));
							var tokens = oEvent.getParameter("tokens");
							var Customers = [];
							for (var i = 0; i < tokens.length; i++) {
								Customers.push({
									key: tokens[i].getKey(),
									text: tokens[i].getText()
								});
							}
							that.getModel("data").setProperty("/context/Header/Customers", Customers);
							this.close();
						},
						cancel: function () {
							this.close();
						}
					});
				}
				this._oValueHelpDialogSup.setRangeKeyFields([{
					label: this.getModel("i18n").getResourceBundle().getText("Customer"),
					key: "BusinessPartner"
				}, {
					label: this.getModel("i18n").getResourceBundle().getText("SearchTerm1"),
					key: "BusinessPartnerName"
				}]);
				this._oValueHelpDialogSup.setTable(this._oMTableSup);
				this._oValueHelpDialogSup.setFilterBar(this._oFilterBarSup);
				this._oValueHelpDialogSup.open();
				this._oValueHelpDialogSup.setRangeKeyFields([{
					label: this.getModel("i18n").getResourceBundle().getText("Customer"),
					key: "BusinessPartner"
				}]);
				// this._oValueHelpDialog.setBusy(true);

			},
			onSearchCurrency: function (oEvent) {
				var fcode = this.getfcode(oEvent);
				this._JSONModel.setProperty("/fcode", fcode);
				var that = this;
				//设置语言
				var sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
				switch (sLanguage) {
				case "zh-Hant":
				case "zh-TW":
					sLanguage = "ZF";
					break;
				case "zh-Hans":
				case "zh-CN":
					sLanguage = "ZH";
					break;
				case "EN":
				case "en":
					sLanguage = "EN";
					break;
				default:
					break;
				}
				if (!this._oMTableCUR) {
					var oSRColumnModel = new JSONModel();
					oSRColumnModel.setData({
						cols: [{
							label: this.getModel("i18n").getResourceBundle().getText("Currency"),
							template: "Currency"
						}, {
							label: this.getModel("i18n").getResourceBundle().getText("Description"),
							template: "CurrencyName"
						}]
					});
					this._oMTableCUR = new mTable();
					this._oMTableCUR.setModel(oSRColumnModel, "columns");
					this._oMTableCUR.setModel(this.getModel("CURRENCYVH"), "CURRENCYVH");
					this._oMTableCUR.getModel("CURRENCYVH").attachBatchRequestCompleted(function (oEvent) {
						that._oValueHelpDialogCUR.setContentHeight("100%");
					});
				}

				// that._oMTableCUR.bindItems({
				// 	path: "CURRENCYVH>/YY1_CURRVH",
				// 	template: new sap.m.ColumnListItem({
				// 		cells: [
				// 			new Text({
				// 				text: "{CURRENCYVH>Currency}"
				// 			}),
				// 			new Text({
				// 				text: "{CURRENCYVH>CurrencyName}"
				// 			})
				// 		]
				// 	}),
				// 	filters: [
				// 		new Filter({
				// 			path: "Language",
				// 			operator: FilterOperator.EQ,
				// 			value1: sLanguage
				// 		})
				// 	]
				// });

				if (!this._oFilterBarCUR) {
					if (!this._CurrencyInput) {
						this._CurrencyInput = new Input({
							id: "Currency"
						});
					}

					if (!this._CurrencyNameInput) {
						this._CurrencyNameInput = new Input({
							id: "CurrencyName"
						});
					}

					this._oFilterBarCUR = new FilterBar({
						advancedMode: true,
						filterBarExpanded: true, //Device.system.phone,
						//showGoOnFB: !Device.system.phone,
						filterGroupItems: [new FilterGroupItem({
								groupTitle: "More Fields",
								groupName: "gn1",
								name: "Currency",
								label: this.getModel("i18n").getResourceBundle().getText("Currency"),
								control: this._CurrencyInput,
								visibleInFilterBar: true
							}),
							new FilterGroupItem({
								groupTitle: "More Fields",
								groupName: "gn1",
								name: "CurrencyName",
								label: this.getModel("i18n").getResourceBundle().getText("Description"),
								control: this._CurrencyNameInput,
								visibleInFilterBar: true
							})
						],
						search: function (oEvent) {
							var aSearchItems = oEvent.getParameters().selectionSet;
							var aFilters = [];
							for (var i = 0; i < aSearchItems.length; i++) {
								// sMsg += "/" + aSearchItems[i].getValue();
								if (aSearchItems[i].getValue() != "") {
									var filter = new Filter({
										path: aSearchItems[i].getId(),
										operator: FilterOperator.Contains,
										value1: aSearchItems[i].getValue()
									});
									aFilters.push(filter);
								}

							}
							var aFiltersLast = [new Filter({
									path: "Language",
									operator: FilterOperator.EQ,
									value1: sLanguage
								})
								// new Filter({
								// 	path: "CompanyCode",
								// 	operator: FilterOperator.EQ,
								// 	value1: that.getModel("Payment").getProperty("/Header/ApplicteCompany")
								// })
							];
							if (aFilters.length > 0) {
								aFiltersLast.push(new Filter({
									filters: aFilters,
									and: false
								}));
							}
							that._oMTableCUR.bindItems({
								path: "CURRENCYVH>/YY1_CURRVH",
								template: new sap.m.ColumnListItem({
									cells: [
										new Text({
											text: "{CURRENCYVH>Currency}"
										}),
										new Text({
											text: "{CURRENCYVH>CurrencyName}"
										})
									]
								}),
								filters: aFiltersLast
							});
						},
						clear: function (oEvent) {

						}
					});
				}

				if (!this._oValueHelpDialogCUR) {
					this._oValueHelpDialogCUR = new ValueHelpDialog("idValueHelpCUR", {
						supportRanges: false,
						supportMultiselect: false,
						key: "Currency",
						descriptionKey: "CurrencyName",
						title: this.getModel("i18n").getResourceBundle().getText("Currency"),
						ok: function (oEvent) {
							this.close();
						},
						cancel: function () {
							this.close();
						},
						selectionChange: function (oEvent) {
							var fcode = that._JSONModel.getData().fcode;
							var sPath = oEvent.getParameter("tableSelectionParams").listItem.getBindingContextPath();
							switch (fcode) {
							case "TRANSCURRENCY":
								that.getModel("data").setProperty("/context/Header/TRANSCURRENCY", that.getModel("CURRENCYVH").getProperty(sPath).Currency);
								break;
							case "CLEARCURRENCY":
								that.getModel("data").setProperty("/context/Header/CLEARCURRENCY", that.getModel("CURRENCYVH").getProperty(sPath).Currency);
								break;
							}
							that._oMTableCUR.removeSelections(true);
							// var ClearHead = that._JSONModel.getData().ClearHead;
							// if (ClearHead.CURRENCY !== ClearHead.COMCURRENCY) {
							// 	that.getCurrencyRate();
							// } else {
							// 	that._JSONModel.setProperty("/ClearHead/RATE", 1);
							// }
						}
					});
				}
				this._oValueHelpDialogCUR.setTable(this._oMTableCUR);
				this._oValueHelpDialogCUR.setFilterBar(this._oFilterBarCUR);

				this._oValueHelpDialogCUR.open();
			},
			getfcode: function (oEvent) {
				// var sButId = oEvent.getParameter("id");
				// var aButId = sButId.split("-");
				// var iLast = parseInt(aButId.length) - 1;
				// var sOP = aButId[iLast].replace("button", "");
				// sOP = sOP.replace("but", "");
				// sOP = sOP.replace("bt", "");
				// return sOP;
				var sButId = oEvent.getParameter("id");
				var aButId = sButId.split("-");
				var sOP = aButId[6].replace("button", "");
				return sOP;
			},
			uploadAttachment: function (oData) {
				this.getModel().setProperty("/DocumentInfoRecord", oData);
				// 上传附件
				var oUploadCollection = this.byId("UploadCollectionAttach");
				oUploadCollection.upload();

				// 绑定Upload Collection的OData URL
				var path = "Attach>/A_DocumentInfoRecordAttch(DocumentInfoRecordDocType='" + oData.DocumentInfoRecordDocType +
					"',DocumentInfoRecordDocNumber='" + oData.DocumentInfoRecordDocNumber + "',DocumentInfoRecordDocVersion='" +
					oData.DocumentInfoRecordDocVersion + "',DocumentInfoRecordDocPart='" + oData.DocumentInfoRecordDocPart + "')";

				oUploadCollection.bindElement(path);
			},
			onChange: function (oEvent) {
				this.getModel().setProperty("/AttachUploaded", "true");
			},
			onBeforeUploadStarts: function (oEvent) {
				// 设置提交附件的参数
				var oCustomerHeaderSlug = new UploadCollectionParameter({
					name: "Slug",
					value: encodeURIComponent(oEvent.getParameter("fileName"))
				});
				oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

				var oBusinessObjectTypeName = new UploadCollectionParameter({
					name: "BusinessObjectTypeName",
					value: "DRAW"
				});
				oEvent.getParameters().addHeaderParameter(oBusinessObjectTypeName);

				var oLinkedSAPObjectKey = new UploadCollectionParameter({
					name: "LinkedSAPObjectKey",
					value: this.getModel().getProperty("/DocumentInfoRecord").DocumentInfoRecord
				});
				oEvent.getParameters().addHeaderParameter(oLinkedSAPObjectKey);

				var xCsrfToken = this.getModel("Attach").getSecurityToken();
				var oxsrfToken = new UploadCollectionParameter({
					name: "x-csrf-token",
					value: xCsrfToken
				});
				oEvent.getParameters().addHeaderParameter(oxsrfToken);
			},

			onUploadComplete: function (oEvent) {
				this.getModel("Attach").refresh();
			},
			getMediaUrl: function (sUrl) {
				// if (oContext.getProperty("media_src")) {
				// 	return oContext.getProperty("media_src");
				// } else {
				// 	return "null";
				// }
				if (sUrl) {
					var url = new URL(sUrl);
					var start = url.href.indexOf(url.origin);
					var sPath = url.href.substring(start + url.origin.length, url.href.length);
					return sPath.replace("/sap/opu/odata/sap", "/destinations/WT_S4HC");

				} else {
					return "";
				}
			},
			_fetchToken: function () {
				var token;
				$.ajax({
					url: "/bpmworkflowruntime/rest/v1/xsrf-token",
					method: "GET",
					async: false,
					headers: {
						"X-CSRF-Token": "Fetch"
					},
					success: function (result, xhr, data) {
						token = data.getResponseHeader("X-CSRF-Token");
					}
				});
				return token;
			},
			_startInstance: function (token) {
				var ClearHead = this.getModel("data").getProperty("/context/Header"); //ClearHead Data
				var ClearItem = this.getModel("data").getProperty("/context/ClearItem"); //ClearItem Data
				var CustomerData = this.getModel("data").getProperty("/context/CustomerData"); //ClearItem Data
				var GLAccountData = this.getModel("data").getProperty("/context/GLAccountData"); //ClearItem Data
				for (var i = 0; i < ClearItem.length; i++) {
					if (parseFloat(ClearItem[i].CLEARCURR) > 0) {
						ClearItem[i].DEBITCREDITCODE = "S";
					} else {
						ClearItem[i].DEBITCREDITCODE = "H";
					}

				}
				var that = this;
				var promise = new Promise(function (resolve, reject) {
					var oContext = {
						FLOW: ClearHead.FLOW,
						DocumentInfoRecord: that.getModel().getProperty("/DocumentInfoRecord"),
						Header: ClearHead,
						ClearItem: ClearItem,
						CustomerData: CustomerData,
						GLAccountData: GLAccountData,
						// FLOW: ClearHead.FLOW,
						// APPLICATIONDATE: ClearHead.APPLICATIONDATE,
						APPLICANT: ClearHead.APPLICANT
							// APPLICANTNAME: ClearHead.APPLICANTNAME,
							// COMPANYCODE: ClearHead.STARTCOMPANY,
							// COMPANYNAME: ClearHead.COMPANYNAME,
							// TRANSCURRENCY: ClearHead.TRANSCURRENCY,
							// CLEARCURRENCY: ClearHead.CLEARCURRENCY,
							// NOTE: ClearHead.NOTE,
					};
					$.ajax({
						url: "/bpmworkflowruntime/rest/v1/workflow-instances",
						method: "POST",
						async: false,
						contentType: "application/json",
						headers: {
							"X-CSRF-Token": token
						},
						data: JSON.stringify({
							definitionId: "workflow_receiptclear",
							context: oContext
						}),
						success: function (result, xhr, data) {
							resolve(result);
						},
						error: function (result, xhr, data) {
							reject(result);
						}
					});
				});
				return promise;
			},
			saveLogHeader: function (oHeader) {
				var ClearHead = this.getModel("data").getProperty("/context/Header"); //ClearHead Data
				var logheader = {
					STARTCOMPANY: ClearHead.STARTCOMPANY,
					FLOWID: "workflow_receiptclear",
					INSTANCEID: oHeader.id,
					DOCUMENT: ClearHead.FLOW,
					REQUESTER: ClearHead.APPLICANT,
					STATUS: ""
				};
				this.getModel("WORKFLOWLOG").create("/WORKFLOWHEAD", logheader);
			},
			onAdd: function () {
				var ClearHead = this.getModel("data").getProperty("/context/Header"); //ClearHead Data
				var GLAccountData = this.getModel("data").getProperty("/context/GLAccountData"); //ClearItem Data
				var item = [];
				if (GLAccountData.length === 0) {
					item[0] = {
						GLITEMNUM: 10,
						GLACCOUNT: "",
						GLACCOUNTNAME: "",
						DEBITCREDIT: "",
						TRANSCURR: 0,
						RATE: "",
						CLEARCURRENCY: ClearHead.CLEARCURRENCY,
						LOCALCURR: 0,
						NOTE: ""
					};
				} else {
					var NUM = GLAccountData.length;
					item[0] = {
						GLITEMNUM: GLAccountData[NUM - 1].GLITEMNUM + 10,
						GLACCOUNT: "",
						GLACCOUNTNAME: "",
						DEBITCREDIT: "",
						TRANSCURR: 0,
						RATE: "",
						CLEARCURRENCY: ClearHead.CLEARCURRENCY,
						LOCALCURR: 0,
						NOTE: ""
					};
				}
				GLAccountData.push(item[0]);
				this._JSONModel.setProperty("/GLAccountData", GLAccountData);
			},
			onLess: function () {
				var GLAccountData = this.getModel("data").getProperty("/context/GLAccountData"); //ClearItem Data
				var OGLTable = this.getView().byId("GLTable");
				var aSelectedIndices = [];
				var context = OGLTable.getSelectedContexts();
				if (context.length <= 0) {
					sap.m.MessageBox.warning("请至少选择一行", {
						title: "提示"
					});
					this.setBusy(false);
					return;
				}
				if (context.length !== 0) {
					for (var i = 0; i < context.length; i++) {
						var linetext = context[i].sPath.split("/");
						var line = linetext[2];
						aSelectedIndices[i] = {
							Line: line
						};
					}
				}
				for (var y = aSelectedIndices.length - 1; y >= 0; y--) {
					GLAccountData.splice(aSelectedIndices[y].Line, 1);
				}
				var num = 10;
				for (var m = 0; m < GLAccountData.length; m++) {
					GLAccountData[m].GLITEMNUM = num;
					num = num + 10;
				}
				this._JSONModel.setProperty("/GLAccountData", GLAccountData);
				OGLTable.removeSelections(true);
			},
			onSearchClearDetails: function () {
				this.setBusy(true);
				var that = this;
				var ClearHead = this.getModel("data").getProperty("/context/Header"); //ClearHead Data
				// 获取当前语言
				var sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
				switch (sLanguage) {
				case "zh-Hant":
				case "zh-TW":
					sLanguage = "ZF";
					break;
				case "zh-Hans":
				case "zh-CN":
					sLanguage = "ZH";
					break;
				case "EN":
				case "en":
					sLanguage = "EN";
					break;
				default:
					break;
				}
				var specialGLCodeFilter = new Filter({
					filters: [
						new Filter({
							path: "SpecialGLCode",
							operator: FilterOperator.EQ,
							value1: "A"
						}),
						new Filter({
							path: "SpecialGLCode",
							operator: FilterOperator.EQ,
							value1: "B"
						}),
						new Filter({
							path: "SpecialGLCode",
							operator: FilterOperator.EQ,
							value1: ""
						})
					],
					and: false
				});

				//获取客户
				var customerFilters = [];
				var aTokens = this.getView().byId("Customer").getTokens();
				for (var a = 0; a < aTokens.length; a++) {
					customerFilters.push(new Filter({
						path: "Customer",
						operator: FilterOperator.EQ,
						value1: aTokens[a].getKey()
					}));
				}
				var filtersLast = [
					new Filter({
						path: "CompanyCode",
						operator: FilterOperator.EQ,
						value1: ClearHead.STARTCOMPANY
					}),
					new Filter({
						path: "Ledger",
						operator: FilterOperator.EQ,
						value1: "2L"
					}),
					new Filter({
						path: "NetDueDate",
						operator: FilterOperator.LE,
						value1: ClearHead.NETDUEDATE
					}),
					new Filter({
						path: "ClearingAccountingDocument",
						operator: FilterOperator.EQ,
						value1: ""
					}),
					new Filter({
						path: "Language",
						operator: FilterOperator.EQ,
						value1: sLanguage
					}),
					new Filter({
						path: "TransactionCurrency",
						operator: FilterOperator.EQ,
						value1: ClearHead.TRANSCURRENCY
					}), ,
					new Filter({
						path: "FinancialAccountType",
						operator: FilterOperator.EQ,
						value1: "D"
					}),
					specialGLCodeFilter
				];
				if (customerFilters.length > 0) {
					filtersLast.push(new Filter({
						filters: customerFilters,
						and: false
					}));
				}

				var mParameters = {
					filters: filtersLast,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						var itemData = [];
						var FLOWITEM = 10;
						var DebitComSumH = 0; //本币贷
						var DebitComSumS = 0; //本币借
						var DebitTransSumH = 0; //交易贷
						var DebitTransSumS = 0; //交易借
						if (Arry.length > 0) {
							for (var i = 0; i < Arry.length; i++) {
								if (Arry[i].Customer === "") {
									Arry.splice(i, 1);
								} else {
									var n = itemData.length;
									itemData[n] = {
										FLOWITEM: FLOWITEM,
										CUSTOMER: Arry[i].Customer,
										SEARCHTERM1: Arry[i].SearchTerm1,
										ACCOUNTINGDOCUMEN: Arry[i].AccountingDocument,
										GLACCOUNT: Arry[i].GLAccount,
										GLACCOUNTNAME: Arry[i].GLAccountName,
										SG: Arry[i].SpecialGLCode,
										ASSIGNMENTRE: Arry[i].AssignmentReference,
										DOCUMENTITEMTEXT: Arry[i].DocumentItemText,
										POSTINGDATE: Arry[i].PostingDate,
										NETDUEDATE: Arry[i].NetDueDate,
										TRANSCURR: Arry[i].AmountInTransactionCurrency,
										TRANSCURRENCY: Arry[i].TransactionCurrency,
										RATE: parseFloat(parseFloat(Arry[i].AmountInCompanyCodeCurrency) / parseFloat(Arry[i].AmountInTransactionCurrency)).toFixed(
											5),
										COMPANYCODECURR: Arry[i].AmountInCompanyCodeCurrency,
										// CLEARCURR: -parseFloat(Arry[i].AmountInTransactionCurrency),
										CLEARCURRENCY: ClearHead.CLEARCURRENCY,
										// COMPCLEARCURR: -parseFloat(parseFloat(Arry[i].AmountInTransactionCurrency) * parseFloat(itemData[n].RATE)).toFixed(2),
										DEBITCREDITCODE: Arry[i].DebitCreditCode,
										CUSTOMERNAME: Arry[i].CustomerName
									};
									if (ClearHead.CLEARCURRENCY === "TWD") {
										itemData[n].CLEARCURR = -parseInt(itemData[n].TRANSCURR);
									} else {
										itemData[n].CLEARCURR = (parseFloat(-itemData[n].TRANSCURR).toFixed(2));
									}
									if (ClearHead.STARTCOMPANY === "6310") {
										itemData[n].COMPCLEARCURR = parseInt(parseFloat(itemData[n].CLEARCURR) * parseFloat(itemData[n].RATE));
									} else {
										itemData[n].COMPCLEARCURR = parseFloat(parseFloat(itemData[n].CLEARCURR) * parseFloat(itemData[n].RATE)).toFixed(2);
									}
									if (itemData[n].CLEARCURR < 0) {
										DebitTransSumH = DebitTransSumH + parseFloat(itemData[n].CLEARCURR); //交易
										DebitComSumH = DebitComSumH + parseFloat(itemData[n].COMPCLEARCURR); //本币
									} else {
										DebitTransSumS = DebitTransSumS + parseFloat(itemData[n].CLEARCURR); //
										DebitComSumS = DebitComSumS + parseFloat(itemData[n].COMPCLEARCURR); //
									}
									FLOWITEM = FLOWITEM + 10;
									n = n + 1;
								}
							}

						}
						//传数
						// for (var i = 0; i < oData.results.length; i++) {
						// 	var aData = {};
						// 	for (var j = 0; j < aPaths.length; j++) {
						// 		if (aPaths[j] === "ItemNum") {
						// 			// 序号流水+1
						// 			aData[aPaths[j]] = i + 1;
						// 		} else if (aPaths[j] === "PayCurrency") {
						// 			// 付款货币码从抬头付款货币码带出
						// 			aData[aPaths[j]] = that.getModel("Payment").getProperty("/Header/PayCurrency");
						// 		} else if (aPaths[j] === "PayAmount") {
						// 			// 付款金额默认 0 - 交易金额
						// 			aData[aPaths[j]] = 0 - oData.results[i].AmountInTransactionCurrency;
						// 		} else if (aPaths[j] === "PayAmountInCompanyCurrency") {
						// 			if (aData.hasOwnProperty("PayCurrency")) {
						// 				aData[aPaths[j]] = new Number(aData.PayAmount) * new Number(
						// 					that.getModel("Payment").getProperty("/Header/Rate"));
						// 			}

						// 		} else {
						// 			aData[aPaths[j]] = oData.results[i][aPaths[j]];
						// 		}
						// 	}
						// 	itemData.push(aData);
						// }

						// 		if (this.getModel("Payment").getProperty(sItemPath + "/PayCurrency")) {
						// 	this.getModel("Payment").setProperty(sItemPath + "/PayAmountInCompanyCurrency", new Number(oEvent.getParameter("value")) * new Number(
						// 		this.getModel("Payment").getProperty("/Header/Rate")));
						// }\
						that._JSONModel.setProperty("/ClearHead/SUMTRANSCURRS", DebitTransSumS); //借方金额合计(交易金额)
						that._JSONModel.setProperty("/ClearHead/SUMCOMPCURRS", DebitComSumS); //借方金额合计(本币金额)
						that._JSONModel.setProperty("/ClearHead/SUMTRANSCURRH", DebitTransSumH); //贷方金额合计(交易金额)
						that._JSONModel.setProperty("/ClearHead/SUMCOMPCURRH", DebitComSumH); //贷方金额合计(本币金额)
						that.dosum(itemData);
						that.getModel("data").setProperty("/context/ClearItem", itemData);
						that.setBusy(false);

						//计算小计
						// that.calculateSupplierSum();
						// that.getModel("settings").setProperty("/PaymentDetailBusy", false);
					},
					error: function (oError) {
						MessageToast.show("查询失败");
						that.setBusy(false);
					}
				};

				this.getModel("ReceiptClear").read("/YY1_RECEIPTCLEAR", mParameters);
			},
			dosum: function (items) {
				var items = this.getModel("data").getProperty("/context/ClearItem");
				var data1 = {};
				var data2 = {};
				// items.forEach(function (Item) {
				// 		if (temp[Item.CUSTOMER]) {
				// 			temp[Item.CUSTOMER].TRANSCURR += parseFloat(Item.TRANSCURR);
				// 			temp[Item.CUSTOMER].COMPANYCODECURR += parseFloat(Item.COMPANYCODECURR);
				// 		} else { 
				// 			temp[Item.CUSTOMER].TRANSCURR = parseFloat(Item.TRANSCURR);
				// 			temp[Item.CUSTOMER].COMPANYCODECURR = parseFloat(Item.COMPANYCODECURR);
				// 		}
				// 	})
				// items.forEach(function (Item) {
				// 	if (Item.Customer === currSumItem.Customer) {
				// 		currSumItem.AmountInTransactionCurrency += parseFloat(Item.AmountInTransactionCurrency);
				// 		currSumItem.AmountInCompanyCodeCurrency += parseFloat(Item.AmountInCompanyCodeCurrency);
				// 		currSumItem.PayAmount += parseFloat(Item.PayAmount);
				// 		currSumItem.PayAmountInCompanyCurrency += parseFloat(Item.PayAmountInCompanyCurrency);
				// 	}
				// });
				var map = {},
					dest = [];
				for (var i = 0; i < items.length; i++) {
					var ai = items[i];
					if (items[i].GLACCOUNT === "11910001") {
						if (!map[ai.CUSTOMER + ai.GLACCOUNT + ai.TRANSCURRENCY]) {
							dest.push({
								CUSTOMER: ai.CUSTOMER,
								SEARCHTERM1: ai.SEARCHTERM1,
								GLACCOUNT: ai.GLACCOUNT,
								RECURRENCY: ai.TRANSCURRENCY, //应收货币
								RETRANSCURR: ai.TRANSCURR, //应收交易
								RECOMPCURR: ai.COMPANYCODECURR, //应收本币
								TRANSCURRENCY: ai.CLEARCURRENCY,
								ADVANCETRANSCURR: 0,
								ADVANCECOMPCURR: 0
							});
							map[ai.CUSTOMER + ai.GLACCOUNT + ai.TRANSCURRENCY] = ai;
						} else {
							for (var j = 0; j < dest.length; j++) {
								var dj = dest[j];
								if (dj.CUSTOMER === ai.CUSTOMER & dj.GLACCOUNT === ai.GLACCOUNT & dj.RECURRENCY === ai.TRANSCURRENCY) {
									dj.RETRANSCURR = parseFloat(dj.RETRANSCURR) + parseFloat(ai.TRANSCURR);
									dj.RECOMPCURR = parseFloat(dj.RECOMPCURR) + parseFloat(ai.COMPANYCODECURR);
									break;
								}
							}
						}
					} else if (items[i].GLACCOUNT === "22210001") {
						if (!map[ai.CUSTOMER + ai.GLACCOUNT + ai.TRANSCURRENCY]) {
							dest.push({
								CUSTOMER: ai.CUSTOMER,
								SEARCHTERM1: ai.SEARCHTERM1,
								GLACCOUNT: ai.GLACCOUNT,
								ADVANCECURRENCY: ai.TRANSCURRENCY, //预收货币
								ADVANCETRANSCURR: ai.TRANSCURR, //预收交易
								ADVANCECOMPCURR: ai.COMPANYCODECURR, //预收本币
								TRANSCURRENCY: ai.CLEARCURRENCY,
								RETRANSCURR: 0,
								RECOMPCURR: 0
							});
							map[ai.CUSTOMER + ai.GLACCOUNT + ai.TRANSCURRENCY] = ai;
						} else {
							for (var j = 0; j < dest.length; j++) {
								var dj = dest[j];
								if (dj.CUSTOMER === ai.CUSTOMER & dj.GLACCOUNT === ai.GLACCOUNT & dj.ADVANCECURRENCY === ai.TRANSCURRENCY) {
									dj.ADVANCETRANSCURR = parseFloat(dj.ADVANCETRANSCURR) + parseFloat(ai.TRANSCURR);
									dj.ADVANCECOMPCURR = parseFloat(dj.ADVANCECOMPCURR) + parseFloat(ai.COMPANYCODECURR);
									break;
								}
							}
						}

					}
				}

				// for (var i in items) {
				// 	if (items[i].GLACCOUNT === "11910001") {
				// 		var key = items[i].CUSTOMER + items[i].GLACCOUNT + items[i].TRANSCURRENCY;
				// 		if (data1[key]) {
				// 			data1[key].TRANSCURR = parseFloat(data1[key].TRANSCURR) + parseFloat(items[i].TRANSCURR);
				// 			data1[key].COMPANYCODECURR = parseFloat(data1[key].COMPANYCODECURR) + parseFloat(items[i].COMPANYCODECURR);
				// 			data1[key].CUSTOMER = items[i].CUSTOMER;
				// 			data1[key].SEARCHTERM1 = items[i].SEARCHTERM1;
				// 			data1[key].RECURRENCY = items[i].TRANSCURRENCY;
				// 		} else {
				// 			data1[key] = {};
				// 			data1[key].TRANSCURR = parseFloat(items[i].TRANSCURR);
				// 			data1[key].COMPANYCODECURR = parseFloat(items[i].COMPANYCODECURR);
				// 			data1[key].CUSTOMER = items[i].CUSTOMER;
				// 			data1[key].SEARCHTERM1 = items[i].SEARCHTERM1;
				// 			data1[key].RECURRENCY = items[i].TRANSCURRENCY;
				// 		}
				// 	} else if (items[i].GLACCOUNT === "22210001") {
				// 		var key = items[i].CUSTOMER + items[i].GLACCOUNT + items[i].TRANSCURRENCY;
				// 		if (data2[key]) {
				// 			data2[key].TRANSCURR = parseFloat(data1[key].TRANSCURR) + parseFloat(items[i].TRANSCURR);
				// 			data2[key].COMPANYCODECURR = parseFloat(data2[key].COMPANYCODECURR) + parseFloat(items[i].COMPANYCODECURR);
				// 			data2[key].CUSTOMER = items[i].CUSTOMER;
				// 			data2[key].SEARCHTERM1 = items[i].SEARCHTERM1;
				// 			data2[key].ADVANCECURRENCY = items[i].TRANSCURRENCY;
				// 		} else {
				// 			data2[key] = {};
				// 			data2[key].TRANSCURR = parseFloat(items[i].TRANSCURR);
				// 			data2[key].COMPANYCODECURR = parseFloat(items[i].COMPANYCODECURR);
				// 			data2[key].CUSTOMER = items[i].CUSTOMER;
				// 			data2[key].SEARCHTERM1 = items[i].SEARCHTERM1;
				// 			data2[key].ADVANCECURRENCY = items[i].TRANSCURRENCY;
				// 		}

				// 	}
				// }
				var CUSITEMNO = 10;
				for (var n = 0; n < dest.length; n++) {
					dest[n].CUSITEMNO = CUSITEMNO;
					dest[n].BALANCETRANS = parseFloat(dest[n].RETRANSCURR) - parseFloat(dest[n].ADVANCETRANSCURR); //差额交易
					dest[n].BALANCECOMP = parseFloat(dest[n].RECOMPCURR) - parseFloat(dest[n].ADVANCECOMPCURR); //差额本币
					CUSITEMNO = CUSITEMNO + 10;
				}
				this._JSONModel.setProperty("/CustomerData", dest);
			},
			onSearchBankAccount: function (oEvent) {
				var context = oEvent.getSource().getBindingContext().sPath;
				var contexts = context.split("/");
				var n = contexts[2];
				this._JSONModel.setProperty("/nowTableNum", n);
				var that = this;
				//设置语言
				var sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
				switch (sLanguage) {
				case "zh-Hant":
				case "zh-TW":
					sLanguage = "ZF";
					break;
				case "zh-Hans":
				case "zh-CN":
					sLanguage = "ZH";
					break;
				case "EN":
				case "en":
					sLanguage = "EN";
					break;
				default:
					break;
				}
				var CompanyCode = this.getModel("data").getProperty("/context/Header/STARTCOMPANY");
				if (!this._oMTableBKA) {
					var oSRColumnModel = new JSONModel();
					oSRColumnModel.setData({
						cols: [{
							label: "科目",
							template: "GLAccount"
						}, {
							label: "科目描述",
							template: "GLAccountName"
						}, {
							label: "科目货币",
							template: "GLAccountCurrency"
						}]
					});
					this._oMTableBKA = new mTable();
					this._oMTableBKA.setModel(oSRColumnModel, "columns");
					this._oMTableBKA.setModel(this.getModel("BANKGLACCOUNTVH"), "BANKGLACCOUNTVH");
					this._oMTableBKA.getModel("BANKGLACCOUNTVH").attachBatchRequestCompleted(function (oEvent) {
						that._oValueHelpDialogBKA.setContentHeight("100%");
					});
				}
				if (!this._oFilterBarBKA) {
					this._oFilterBarBKA = new FilterBar({
						advancedMode: true,
						filterBarExpanded: true, //Device.system.phone,
						filterGroupItems: [new FilterGroupItem({
								groupTitle: "More Fields",
								groupName: "gn1",
								name: "GLAccount",
								label: "會計科目",
								control: new Input({
									id: "GLAccount"
								}),
								visibleInFilterBar: true
							}),
							new FilterGroupItem({
								groupTitle: "More Fields",
								groupName: "gn1",
								name: "GLAccountName",
								label: "科目描述",
								control: new Input({
									id: "GLAccountName"
								}),
								visibleInFilterBar: true
							})
						],
						search: function (oEvent) {
							var aSearchItems = oEvent.getParameters().selectionSet;
							var aFilters = [];
							for (var i = 0; i < aSearchItems.length; i++) {
								if (aSearchItems[i].getValue() != "") {
									var filter = new Filter({
										path: aSearchItems[i].getId(),
										operator: FilterOperator.Contains,
										value1: aSearchItems[i].getValue()
									});
									aFilters.push(filter);
								}

							}
							var aFiltersLast = [new Filter({
									path: "Language",
									operator: FilterOperator.EQ,
									value1: sLanguage
								}),
								new Filter({
									path: "CompanyCode",
									operator: FilterOperator.EQ,
									value1: CompanyCode
								})
							];
							if (aFilters.length > 0) {
								aFiltersLast.push(new Filter({
									filters: aFilters,
									and: false
								}));
							}

							that._oMTableBKA.bindItems({
								path: "BANKGLACCOUNTVH>/YY1_BANKGLACCOUNTVH",
								template: new sap.m.ColumnListItem({
									// type: "Navigation",
									cells: [
										new Text({
											text: "{BANKGLACCOUNTVH>GLAccount}"
										}),
										new Text({
											text: "{BANKGLACCOUNTVH>GLAccountName}"
										}),
										new Text({
											text: "{BANKGLACCOUNTVH>GLAccountCurrency}"
										})
									]
								}),
								filters: aFiltersLast
							});

						},
						clear: function (oEvent) {}
					});
				}
				if (!this._oValueHelpDialogBKA) {
					this._oValueHelpDialogBKA = new ValueHelpDialog("idValueHelpBKA", {
						supportRanges: false,
						supportMultiselect: false,
						// filterMode: true,
						key: "GLAccount",
						descriptionKey: "GLAccount",
						title: "银行科目",
						ok: function (oEvent) {

							this.close();
						},
						cancel: function () {
							this.close();
						},
						selectionChange: function (oEvent) {
							var n = that._JSONModel.getProperty("/nowTableNum");
							var table = that.getModel("data").getProperty("/context/GLAccountData");
							var sPath = oEvent.getParameter("tableSelectionParams").listItem.getBindingContextPath();
							table[n].GLACCOUNT = that.getModel("BANKGLACCOUNTVH").getProperty(sPath).GLAccount;
							table[n].GLACCOUNTNAME = that.getModel("BANKGLACCOUNTVH").getProperty(sPath).GLAccountName;
							that.getModel("data").setProperty("/context/GLAccountData", table);
							// that._JSONModel.setProperty("/GLAccountData[n]/GLACCOUNT", that.getModel("BANKGLACCOUNTVH").getProperty(sPath).GLAccount);
							// that._JSONModel.setProperty("/GLAccountData[n]/GLACCOUNTNAME", that.getModel("BANKGLACCOUNTVH").getProperty(sPath).GLAccountName);
							// that._JSONModel.setProperty("/REData/CURRENCY", that.getModel("BANKGLACCOUNTVH").getProperty(sPath).GLAccountCurrency);
							that._oMTableBKA.removeSelections(true);
							// var REData = that._JSONModel.getData().REData;
							// if (REData.CURRENCY !== REData.COMCURRENCY) {
							// 	that.getCurrencyRate();
							// } else {
							// 	that._JSONModel.setProperty("/REData/RATE", 1);
							// }
						}
					});
					this._oValueHelpDialogBKA.setTable(this._oMTableBKA);
					this._oValueHelpDialogBKA.setFilterBar(this._oFilterBarBKA);
				}
				this._oValueHelpDialogBKA.open();

			},
			//取汇率
			getCurrencyRate: function () {
				this.setBusy(true);
				var REData = this._JSONModel.getData().REData;
				// var oFilter1 = new sap.ui.model.Filter("ExchangeRateEffectiveDate", sap.ui.model.FilterOperator.EQ, new Date());
				var oFilter2 = new sap.ui.model.Filter("TargetCurrency", sap.ui.model.FilterOperator.EQ, REData.COMCURRENCY);
				var oFilter3 = new sap.ui.model.Filter("SourceCurrency", sap.ui.model.FilterOperator.EQ, REData.CURRENCY);
				var oFilter4 = new sap.ui.model.Filter("ExchangeRateType", sap.ui.model.FilterOperator.EQ, "M");
				var aFilters = [oFilter2, oFilter3, oFilter4];
				var mParameters = {
					filters: aFilters,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						for (var p = 0; p < Arry.length; p++) {
							var datetime = new Date(Arry[p].ExchangeRateEffectiveDate).getTime();
							Arry[p].datetime = datetime;
						}
						Arry.sort(sortDate);

						function sortDate(a, b) {
							return b.datetime - a.datetime;
						}
						if (Arry.length > 0) {
							this._JSONModel.setProperty("/REData/RATE", Arry[0].ExchangeRate); //汇率 
						} else {
							this._JSONModel.setProperty("/REData/RATE", "1"); //汇率
						}
						// this._JSONModel.setProperty("/REData/RATE", "1"); //汇率
						this.setBusy(false);
					}.bind(this),
					error: function (oError) {
						this.setBusy(false);
					}.bind(this)
				};
				this.getModel("RATEVH").read("/YY1_RATEVH", mParameters);
			},
			onChangeCurr: function () {
				var ClearItem = this.getModel("data").getProperty("/context/ClearItem"); //明细数据
				var GLAccountData = this.getModel("data").getProperty("/context/GLAccountData"); //总账科目数据
				var lv_SumClearS = 0; //清账金额>0
				var lv_SumClearH = 0; //清账金额<0
				var lv_SumGLTransS = 0; //借方金额汇总(S) 交易
				var lv_SumGLCompS = 0; //借方金额汇总(S) 本币
				var lv_SumGLTransH = 0; //贷方金额汇总(H) 交易
				var lv_SumGLCompH = 0; //贷方金额汇总(H) 本币
				for (var i = 0; i < ClearItem.length; i++) {
					if (ClearItem[i].CLEARCURR !== "") {
						if (parseFloat(ClearItem[i].CLEARCURR) > 0) {
							lv_SumClearS = lv_SumClearS + parseFloat(ClearItem[i].CLEARCURR);
						} else if (parseFloat(ClearItem[i].CLEARCURR) < 0) {
							lv_SumClearH = lv_SumClearH + parseFloat(ClearItem[i].CLEARCURR);
						}
					}
				}
				if (GLAccountData.length > 0) {
					for (var i = 0; i < GLAccountData.length; i++) {
						if (GLAccountData[i].DEBITCREDIT === 'S') {
							lv_SumGLTransS = lv_SumGLTransS + parseFloat(GLAccountData[i].TRANSCURR);
							lv_SumGLCompS = lv_SumGLCompS + parseFloat(GLAccountData[i].LOCALCURR);
						} else if (GLAccountData[i].DEBITCREDIT === 'H') {
							lv_SumGLTransH = lv_SumGLTransH + parseFloat(GLAccountData[i].TRANSCURR);
							lv_SumGLCompH = lv_SumGLCompH + parseFloat(GLAccountData[i].LOCALCURR);
						}
					}
				}
				this.getModel("data").setProperty("/context/Header/SUMTRANSCURRS", lv_SumClearS + lv_SumGLTransS); //借方金额汇总(交易)
				this.getModel("data").setProperty("/context/Header/SUMCOMPCURRS", lv_SumClearS + lv_SumGLCompS); //借方金额汇总(本币)
				this.getModel("data").setProperty("/context/Header/SUMTRANSCURRH", lv_SumClearH + lv_SumGLTransH); //贷方方金额汇总(交易)
				this.getModel("data").setProperty("/context/Header/SUMCOMPCURRH", lv_SumClearH + lv_SumGLCompH); //贷方方金额汇总(本币)
			}
		});
	});