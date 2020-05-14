sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("ClearApproval.controller.App", {

		onInit: function () {},

		formatDate: function (v) {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				style: "medium"
			}, sap.ui.getCore().getConfiguration().getLocale());
			return oDateFormat.format(v);
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
				// var sPath = url.href.substring(start, start + url.origin.length);
				var sPath = url.href.substring(start + url.origin.length, url.href.length);
				return sPath.replace("/sap/opu/odata/sap", "/html5apps/ecrapproval/destinations/WT_S4HC");

			} else {
				return "";
			}
		},
		fmoneyTrans: function (s) {
			var ClearHead = this.getModel("data").getProperty("/context/Header");
			if (ClearHead.CLEARCURRENCY === "TWD") {
				var n = 0;
			} else {
				var n = 2;
			}
			// n = n > 0 & n <= 20 ? n : 2;
			if (s) {
				s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
				if (n === 0) {
					var l = s.split(".")[0].split("").reverse();
					// r = s.split(".")[1];
					var t = "";
					for (var i = 0; i < l.length; i++) {
						t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
					}
					return t.split("").reverse().join("");
				} else {
					var l = s.split(".")[0].split("").reverse(),
						r = s.split(".")[1];
					var t = "";
					for (var i = 0; i < l.length; i++) {
						t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
					}
					return t.split("").reverse().join("") + "." + r;
				}
			} else {
				return s;
			}
		},
		fmoneyComp: function (s) {
			var ClearHead = this.getModel("data").getProperty("/context/Header");
			if (ClearHead.STARTCOMPANY === "6310") {
				var n = 0;
			} else {
				var n = 2;
			}
			// n = n > 0 & n <= 20 ? n : 2;
			if (s) {
				s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
				if (n === 0) {
					var l = s.split(".")[0].split("").reverse();
					// r = s.split(".")[1];
					var t = "";
					for (var i = 0; i < l.length; i++) {
						t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
					}
					return t.split("").reverse().join("");
				} else {
					var l = s.split(".")[0].split("").reverse(),
						r = s.split(".")[1];
					var t = "";
					for (var i = 0; i < l.length; i++) {
						t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
					}
					return t.split("").reverse().join("") + "." + r;
				}
			} else {
				return s;
			}
		}
	});
});