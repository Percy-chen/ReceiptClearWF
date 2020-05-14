{
	"contents": {
		"bcccec82-2516-41ff-a583-29c914a53a5e": {
			"classDefinition": "com.sap.bpm.wfs.Model",
			"id": "workflow_receiptclear",
			"subject": "收款清账单据${context.FLOW}",
			"name": "workflow_receiptclear",
			"lastIds": "d15ec25e-3e4e-4571-a706-82814dd270b8",
			"events": {
				"da07f9f2-42e4-4d5e-abaf-bfaecc490715": {
					"name": "开始"
				},
				"856400c4-8b7b-4608-b00d-d14c9ed9a72f": {
					"name": "结束"
				}
			},
			"activities": {
				"f16272ea-a1a8-4ac0-8280-622fd2b5ebca": {
					"name": "获取财务审批人"
				},
				"0f3f4a2f-4ee8-4950-8a8f-f89b27a04137": {
					"name": "审批人信息处理"
				},
				"0b0af23b-ed9b-40f0-9bc3-f7b51535f5d7": {
					"name": "财务审批过账"
				},
				"f7e3ed93-6f4e-4d74-b7f5-728ddd6dba97": {
					"name": "is Approved?"
				},
				"dca884d2-87d1-4a17-a1e9-2b6aa5990749": {
					"name": "业助认领收款"
				},
				"61820cbb-08ce-4b6e-b33c-3429867016b6": {
					"name": "打印"
				},
				"d2fae78a-1950-4280-be1d-7ee847e1832d": {
					"name": "业助打印"
				}
			},
			"sequenceFlows": {
				"8f14cfc9-578e-4293-a085-8d74787bb7fd": {
					"name": "SequenceFlow1"
				},
				"48975194-9f6f-40fc-84f1-0b59b2c4e66f": {
					"name": "SequenceFlow2"
				},
				"fb75ab7f-6834-4838-b3f7-4ee0da05758a": {
					"name": "SequenceFlow3"
				},
				"5bf603b6-2cf4-4519-ae57-8fcdeea4d2ed": {
					"name": "SequenceFlow4"
				},
				"be4c4132-7ac6-4810-8ce0-9059f1912c9e": {
					"name": "YES"
				},
				"f08909f6-01fb-40ce-9d21-75ceed965663": {
					"name": "NO"
				},
				"f002e260-afea-46e2-b2fc-2a3ee06ac6b6": {
					"name": "SequenceFlow7"
				},
				"b1341e0c-9093-4ee1-a2b9-70e2c4778f5e": {
					"name": "SequenceFlow8"
				},
				"7380c79a-806c-4648-8bfe-0ca125b97e55": {
					"name": "SequenceFlow9"
				}
			},
			"diagrams": {
				"8aa81296-cbb8-483b-8e51-e116f6e77e09": {}
			}
		},
		"da07f9f2-42e4-4d5e-abaf-bfaecc490715": {
			"classDefinition": "com.sap.bpm.wfs.StartEvent",
			"id": "startevent1",
			"name": "开始"
		},
		"856400c4-8b7b-4608-b00d-d14c9ed9a72f": {
			"classDefinition": "com.sap.bpm.wfs.EndEvent",
			"id": "endevent1",
			"name": "结束"
		},
		"f16272ea-a1a8-4ac0-8280-622fd2b5ebca": {
			"classDefinition": "com.sap.bpm.wfs.ServiceTask",
			"destination": "APLEXHANAWORKFLOW",
			"path": "/WORKFLOWNODE.xsodata/WORKFLOWNODE?$filter= FLOWID eq 'workflow_receiptclear' and NODEID eq '0010' and STARTCOMPANY eq '${context.Header.STARTCOMPANY}'",
			"httpMethod": "GET",
			"responseVariable": "${context.User}",
			"id": "servicetask1",
			"name": "获取财务审批人"
		},
		"0f3f4a2f-4ee8-4950-8a8f-f89b27a04137": {
			"classDefinition": "com.sap.bpm.wfs.ScriptTask",
			"reference": "/scripts/workflow_receiptclear/DEALINFO.js",
			"id": "scripttask1",
			"name": "审批人信息处理"
		},
		"0b0af23b-ed9b-40f0-9bc3-f7b51535f5d7": {
			"classDefinition": "com.sap.bpm.wfs.UserTask",
			"subject": "收款清账单据${context.FLOW}审批",
			"priority": "MEDIUM",
			"isHiddenInLogForParticipant": false,
			"userInterface": "sapui5://html5apps/receiptclearwf/ClearApproval/webapp/ClearApproval",
			"recipientUsers": "${context.approvalTree[\"node0010\"][\"subNode0010\"].account}",
			"userInterfaceParams": [{
				"key": "node",
				"value": "0010"
			}, {
				"key": "subnode",
				"value": "0010"
			}],
			"id": "usertask1",
			"name": "财务审批过账"
		},
		"f7e3ed93-6f4e-4d74-b7f5-728ddd6dba97": {
			"classDefinition": "com.sap.bpm.wfs.ExclusiveGateway",
			"id": "exclusivegateway1",
			"name": "is Approved?",
			"default": "be4c4132-7ac6-4810-8ce0-9059f1912c9e"
		},
		"dca884d2-87d1-4a17-a1e9-2b6aa5990749": {
			"classDefinition": "com.sap.bpm.wfs.UserTask",
			"subject": "收款清账单据${context.FLOW}审批",
			"priority": "MEDIUM",
			"isHiddenInLogForParticipant": false,
			"userInterface": "sapui5://html5apps/receiptclearwf/ClearSubmit/webapp/ClearSubmit",
			"recipientUsers": "${context.APPLICANT}",
			"userInterfaceParams": [{
				"key": "node",
				"value": "0030"
			}, {
				"key": "subnode",
				"value": "0010"
			}],
			"id": "usertask2",
			"name": "业助认领收款"
		},
		"61820cbb-08ce-4b6e-b33c-3429867016b6": {
			"classDefinition": "com.sap.bpm.wfs.ScriptTask",
			"reference": "/scripts/workflow_receiptclear/Print.js",
			"id": "scripttask2",
			"name": "打印"
		},
		"d2fae78a-1950-4280-be1d-7ee847e1832d": {
			"classDefinition": "com.sap.bpm.wfs.UserTask",
			"subject": "收款清账单据${context.FLOW}打印",
			"priority": "MEDIUM",
			"isHiddenInLogForParticipant": false,
			"userInterface": "sapui5://html5apps/receiptclearwf/ClearApproval/webapp/ClearApproval",
			"recipientUsers": "${context.Header.APPLICANT}",
			"userInterfaceParams": [{
				"key": "node",
				"value": "0020"
			}, {
				"key": "subnode",
				"value": "0010"
			}],
			"id": "usertask3",
			"name": "业助打印"
		},
		"8f14cfc9-578e-4293-a085-8d74787bb7fd": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow1",
			"name": "SequenceFlow1",
			"sourceRef": "da07f9f2-42e4-4d5e-abaf-bfaecc490715",
			"targetRef": "61820cbb-08ce-4b6e-b33c-3429867016b6"
		},
		"48975194-9f6f-40fc-84f1-0b59b2c4e66f": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow2",
			"name": "SequenceFlow2",
			"sourceRef": "f16272ea-a1a8-4ac0-8280-622fd2b5ebca",
			"targetRef": "0f3f4a2f-4ee8-4950-8a8f-f89b27a04137"
		},
		"fb75ab7f-6834-4838-b3f7-4ee0da05758a": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow3",
			"name": "SequenceFlow3",
			"sourceRef": "0f3f4a2f-4ee8-4950-8a8f-f89b27a04137",
			"targetRef": "0b0af23b-ed9b-40f0-9bc3-f7b51535f5d7"
		},
		"5bf603b6-2cf4-4519-ae57-8fcdeea4d2ed": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow4",
			"name": "SequenceFlow4",
			"sourceRef": "0b0af23b-ed9b-40f0-9bc3-f7b51535f5d7",
			"targetRef": "f7e3ed93-6f4e-4d74-b7f5-728ddd6dba97"
		},
		"be4c4132-7ac6-4810-8ce0-9059f1912c9e": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow5",
			"name": "YES",
			"sourceRef": "f7e3ed93-6f4e-4d74-b7f5-728ddd6dba97",
			"targetRef": "856400c4-8b7b-4608-b00d-d14c9ed9a72f"
		},
		"f08909f6-01fb-40ce-9d21-75ceed965663": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"condition": "${context.approved==false}",
			"id": "sequenceflow6",
			"name": "NO",
			"sourceRef": "f7e3ed93-6f4e-4d74-b7f5-728ddd6dba97",
			"targetRef": "dca884d2-87d1-4a17-a1e9-2b6aa5990749"
		},
		"f002e260-afea-46e2-b2fc-2a3ee06ac6b6": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow7",
			"name": "SequenceFlow7",
			"sourceRef": "dca884d2-87d1-4a17-a1e9-2b6aa5990749",
			"targetRef": "f16272ea-a1a8-4ac0-8280-622fd2b5ebca"
		},
		"b1341e0c-9093-4ee1-a2b9-70e2c4778f5e": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow8",
			"name": "SequenceFlow8",
			"sourceRef": "61820cbb-08ce-4b6e-b33c-3429867016b6",
			"targetRef": "d2fae78a-1950-4280-be1d-7ee847e1832d"
		},
		"7380c79a-806c-4648-8bfe-0ca125b97e55": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow9",
			"name": "SequenceFlow9",
			"sourceRef": "d2fae78a-1950-4280-be1d-7ee847e1832d",
			"targetRef": "f16272ea-a1a8-4ac0-8280-622fd2b5ebca"
		},
		"8aa81296-cbb8-483b-8e51-e116f6e77e09": {
			"classDefinition": "com.sap.bpm.wfs.ui.Diagram",
			"symbols": {
				"d2dad5ed-d19c-4322-a27a-5c556ba226b7": {},
				"3b525d6e-1dd6-4b3a-945b-c5df266c082a": {},
				"3a9c213b-4c7b-42e8-a28c-286eb3cc2af0": {},
				"fe394dba-16af-46d6-96f0-8fb604fd4609": {},
				"a12b0f7f-0141-4597-bb00-586878ad0317": {},
				"fa26d85f-8b66-45b1-b56a-0c02105867a3": {},
				"fe109c03-7d3a-4fb6-ab68-61797d1785b8": {},
				"eda03ecb-3f45-4b07-9ce7-a34fcbd5608f": {},
				"1caec862-274e-4599-9181-1bc619d96324": {},
				"5af5e866-4b53-430f-8c56-18511caa35c1": {},
				"2ffc5243-abef-4fad-9b7c-a2cee4afdc33": {},
				"db4f4814-08a5-4251-b76c-1636f5d7fa50": {},
				"e4fef11b-d436-4380-946a-fd998a3e6c08": {},
				"15f67b0b-e82d-461c-ba51-5c82701f0062": {},
				"19e5b974-6681-49b2-83df-54933d0c3329": {},
				"db550457-3b78-478c-840d-feafc67e72ed": {},
				"a58254d7-8484-4d3f-8f66-6b84e2f90c3b": {},
				"20cdbf91-61e5-4898-9972-2a9ccbd39dd9": {}
			}
		},
		"d2dad5ed-d19c-4322-a27a-5c556ba226b7": {
			"classDefinition": "com.sap.bpm.wfs.ui.StartEventSymbol",
			"x": 8,
			"y": 85.5,
			"width": 32,
			"height": 32,
			"object": "da07f9f2-42e4-4d5e-abaf-bfaecc490715"
		},
		"3b525d6e-1dd6-4b3a-945b-c5df266c082a": {
			"classDefinition": "com.sap.bpm.wfs.ui.EndEventSymbol",
			"x": 713.9999964237213,
			"y": 84,
			"width": 35,
			"height": 35,
			"object": "856400c4-8b7b-4608-b00d-d14c9ed9a72f"
		},
		"3a9c213b-4c7b-42e8-a28c-286eb3cc2af0": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "24,101.5 24,167 93.99620819091797,167 93.99621125123532,246",
			"sourceSymbol": "d2dad5ed-d19c-4322-a27a-5c556ba226b7",
			"targetSymbol": "19e5b974-6681-49b2-83df-54933d0c3329",
			"object": "8f14cfc9-578e-4293-a085-8d74787bb7fd"
		},
		"fe394dba-16af-46d6-96f0-8fb604fd4609": {
			"classDefinition": "com.sap.bpm.wfs.ui.ServiceTaskSymbol",
			"x": 94,
			"y": 70.5,
			"width": 100,
			"height": 60,
			"object": "f16272ea-a1a8-4ac0-8280-622fd2b5ebca"
		},
		"a12b0f7f-0141-4597-bb00-586878ad0317": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "194,101.49999985098839 263.9999988079071,101.49999985098839",
			"sourceSymbol": "fe394dba-16af-46d6-96f0-8fb604fd4609",
			"targetSymbol": "fa26d85f-8b66-45b1-b56a-0c02105867a3",
			"object": "48975194-9f6f-40fc-84f1-0b59b2c4e66f"
		},
		"fa26d85f-8b66-45b1-b56a-0c02105867a3": {
			"classDefinition": "com.sap.bpm.wfs.ui.ScriptTaskSymbol",
			"x": 263.9999988079071,
			"y": 72.49999970197678,
			"width": 100,
			"height": 60,
			"object": "0f3f4a2f-4ee8-4950-8a8f-f89b27a04137"
		},
		"fe109c03-7d3a-4fb6-ab68-61797d1785b8": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "363.9999988079071,102.49999970197678 413.9999988079071,102.49999970197678",
			"sourceSymbol": "fa26d85f-8b66-45b1-b56a-0c02105867a3",
			"targetSymbol": "eda03ecb-3f45-4b07-9ce7-a34fcbd5608f",
			"object": "fb75ab7f-6834-4838-b3f7-4ee0da05758a"
		},
		"eda03ecb-3f45-4b07-9ce7-a34fcbd5608f": {
			"classDefinition": "com.sap.bpm.wfs.ui.UserTaskSymbol",
			"x": 413.9999988079071,
			"y": 72.49999970197678,
			"width": 100,
			"height": 60,
			"object": "0b0af23b-ed9b-40f0-9bc3-f7b51535f5d7"
		},
		"1caec862-274e-4599-9181-1bc619d96324": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "513.9999988079071,102.49999970197678 583.9999976158142,102.49999970197678",
			"sourceSymbol": "eda03ecb-3f45-4b07-9ce7-a34fcbd5608f",
			"targetSymbol": "5af5e866-4b53-430f-8c56-18511caa35c1",
			"object": "5bf603b6-2cf4-4519-ae57-8fcdeea4d2ed"
		},
		"5af5e866-4b53-430f-8c56-18511caa35c1": {
			"classDefinition": "com.sap.bpm.wfs.ui.ExclusiveGatewaySymbol",
			"x": 583.9999976158142,
			"y": 81.49999970197678,
			"object": "f7e3ed93-6f4e-4d74-b7f5-728ddd6dba97"
		},
		"2ffc5243-abef-4fad-9b7c-a2cee4afdc33": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "625.9999976158142,101.99999985098839 713.9999964237213,101.99999985098839",
			"sourceSymbol": "5af5e866-4b53-430f-8c56-18511caa35c1",
			"targetSymbol": "3b525d6e-1dd6-4b3a-945b-c5df266c082a",
			"object": "be4c4132-7ac6-4810-8ce0-9059f1912c9e"
		},
		"db4f4814-08a5-4251-b76c-1636f5d7fa50": {
			"classDefinition": "com.sap.bpm.wfs.ui.UserTaskSymbol",
			"x": 347.9999964237213,
			"y": -25,
			"width": 100,
			"height": 60,
			"object": "dca884d2-87d1-4a17-a1e9-2b6aa5990749"
		},
		"e4fef11b-d436-4380-946a-fd998a3e6c08": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "625.9999976158142,102.49999970197678 676,102.5 676,-5 347.9999964237213,-5",
			"sourceSymbol": "5af5e866-4b53-430f-8c56-18511caa35c1",
			"targetSymbol": "db4f4814-08a5-4251-b76c-1636f5d7fa50",
			"object": "f08909f6-01fb-40ce-9d21-75ceed965663"
		},
		"15f67b0b-e82d-461c-ba51-5c82701f0062": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "347.9999964237213,-2.749999850988388 144,-2.749999761581421 144,100.5",
			"sourceSymbol": "db4f4814-08a5-4251-b76c-1636f5d7fa50",
			"targetSymbol": "fe394dba-16af-46d6-96f0-8fb604fd4609",
			"object": "f002e260-afea-46e2-b2fc-2a3ee06ac6b6"
		},
		"19e5b974-6681-49b2-83df-54933d0c3329": {
			"classDefinition": "com.sap.bpm.wfs.ui.ScriptTaskSymbol",
			"x": 43.99621125123532,
			"y": 216,
			"width": 100,
			"height": 60,
			"object": "61820cbb-08ce-4b6e-b33c-3429867016b6"
		},
		"db550457-3b78-478c-840d-feafc67e72ed": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "93.99621125123532,246 257.998104095459,246",
			"sourceSymbol": "19e5b974-6681-49b2-83df-54933d0c3329",
			"targetSymbol": "a58254d7-8484-4d3f-8f66-6b84e2f90c3b",
			"object": "b1341e0c-9093-4ee1-a2b9-70e2c4778f5e"
		},
		"a58254d7-8484-4d3f-8f66-6b84e2f90c3b": {
			"classDefinition": "com.sap.bpm.wfs.ui.UserTaskSymbol",
			"x": 207.99810409545898,
			"y": 216,
			"width": 100,
			"height": 60,
			"object": "d2fae78a-1950-4280-be1d-7ee847e1832d"
		},
		"20cdbf91-61e5-4898-9972-2a9ccbd39dd9": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "257.998104095459,246 257.99810791015625,173 144,173 144,100.5",
			"sourceSymbol": "a58254d7-8484-4d3f-8f66-6b84e2f90c3b",
			"targetSymbol": "fe394dba-16af-46d6-96f0-8fb604fd4609",
			"object": "7380c79a-806c-4648-8bfe-0ca125b97e55"
		},
		"d15ec25e-3e4e-4571-a706-82814dd270b8": {
			"classDefinition": "com.sap.bpm.wfs.LastIDs",
			"sequenceflow": 9,
			"startevent": 1,
			"endevent": 1,
			"usertask": 3,
			"servicetask": 1,
			"scripttask": 2,
			"exclusivegateway": 1
		}
	}
}