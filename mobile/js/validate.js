$(function () {
	$.extend($.fn.validatebox.defaults.rules, {
    	maxlength:{
	    	validator:function(value, param) {
	    		if (value.length > param[0]) {
	    			return false;
	    		} else {
	    			return true;
	    		}
	    	},
	    	message: '此输入项最多只能输入 {0} 个字符'
    	},
    	/**
    	 * 名称验证
    	 */
    	name: {
    		validator:function (value) {
    			return /^[\u0391-\uFFE5]+$/.test(value);
    		},
    		message : '只能输入汉字'
		   },
	   /**
    	 * 名称验证
    	 */
    	num: {
    		validator:function (value) {
    			return /^[0-9]+$/.test(value);
    		},
    		message : '只能输入数字'
		   },
        /**
         * 手机号码验证
         */
        mobile: {
            validator:function (value) {
                return /^(13|15|18)\d{9}$/i.test(value);
            },
            message: '手机号码格式不正确'
        },
        /**
         * 固定号码验证
         */
        homeMobile: {
            validator:function (value) {
                return /^((\d2,3)|(\d{3}\-))?(0\d2,3|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
            },
            message: '固定号码格式不正确'
        },
        /**
         * 验证真实姓名，可以是中文或英文
         */
        trueName: {
            validator:function (value) {
                return /[a-zA-Z\u4E00-\u9FA5]+$/i.test(value);
            },
            message: '请输入正确姓名格式'
        },
        /**
         * 验证登陆姓名，可以是数字或英文
         */
        loginName: {
            validator:function (value) {
                return /^[a-zA-Z0-9]$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
            },
            message: '请输入登陆姓名格式'
        },
        /**
         * 两次密码一致性验证
         */
        equalPassword:{
            validator:function(value, param){
                return $(param[0]).val() == value;
            },
            message: '两次密码输入不一致'
        },
        /**
         * 验证邮政编码
         */
        zip: {
            validator: function (value) {
                return /^[1-9]\d{5}$/i.test(value);
            },
            message: '邮政编码格式不正确'
        },
        /**
         * 验证身份证
         */
        idcard: {
            validator:function (value) {
                return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
            },
            message: '身份证号码格式不正确'
        },
        /**
         * 用户登录名唯一性验证
         */
        onlyLoginName:{
            validator:function(value, param) {
                var flag = false;
                if (value.length != 0) {
                    $.ajax({
                        type:"POST",
                        async:false,
                        url:contextPath + "/user/validateLoginName?loginName=" +
                        value + "&oldLoginName=" + param[0],
                        success:function(result) {
                            var msg = JSON.parse(result);
                            if (msg.result) {
                                flag = false;
                            } else {
                                flag = true;
                            }
                        }
                    });
                }
                return flag;
            },
            message:"已存在相同的登录名"
        },
        /**
         * 验证值是否为整数
         */
        isInteger:{
            validator:function(value) {
                return /^[0-9]*$/i.test(value);
            },
            message: '该输入项必须为整数'
        },
        /**
         * 验证字符创是否含有分隔符
         */
        splitSign: {
    		validator:function (value) {
    			return !(value.indexOf("!@#$%") > -1);
    		},
    		message : '不能包含"!@#$%"'
    	},
        /**
         * 验证字典类型是否存在
         */
        dictionaryType: {
            validator: function (value) {
                var flag = false;
                if (value.length != 0) {
                    $.ajax({
                        type: "POST",
                        async: false,
                        data: {
                        	"type": value
                        },
                        url: contextPath + "/dataDictionary/validDataDictionaryTypeIsExist",
                        success:function(result) {
                            var msg = JSON.parse(result);
                            if (msg.result) {
                                flag = false;
                            } else {
                                flag = true;
                            }
                        }
                    });
                }
                return flag;
            },
            message : '已存在相同字典类型'
        },
        /**
         * 验证字典名称是否存在
         */
        dictionaryName: {
            validator: function (value) {
                var flag = false;
                if (value.length != 0) {
                    $.ajax({
                        type: "POST",
                        async: false,
                        data: {"dictionaryName": value},
                        url: contextPath + "/dataDictionary/validDataDictionNameIsExist",
                        success:function(result) {
                            var msg = JSON.parse(result);
                            if (msg.result) {
                                flag = false;
                            } else {
                                flag = true;
                            }
                        }
                    });
                }
                return flag;
            },
            message : '已存在相同字典名称'
        },
        /**
         * 限制先后两个时间之间的大小关系
         */
        limitFirstAndSecondTimeRelationship: {
        	validator: function (value, params) {
        		var firstTime = $("#" + params[0]).datebox("getValue");
        		if (firstTime > value) {
        			return false;
        		} else {
        			return true;
        		}
        	},
        	message : '起始时间不能后于结束时间'
        },
        /**
         * 用户密码验证
         */
        checkUserPassword: {
            validator:function(value) {
                var flag = false;
                var userPassword = value;
                if(userPassword.length != 0) {
                    $.ajax({
                        type:"POST",
                        async:false,
                        url:contextPath + "/user/checkUserPassword?userPassword=" + userPassword,
                        success:function(result) {
                            result = JSON.parse(result);
                            if (result == false) {
                                flag = false;
                            } else {
                                flag = true;
                            }
                        }
                    });
                }
                return flag;
            },
            message:"输入密码不符"
        },
        
        /////////////////////mobile valid js/////////////////////////
        
        checkLoginNameAndPassword: {
        	validator: function(value) {
        		var login = false;
        		var loginPassword = $("#password").passwordbox("getValue");
        		$.ajax({
					async: false,
					url: "json/loginInfo.json",
					dataType: "json",
					success: function(data) {
						if (data.length > 0) {
							for (var i = 0; i < data.length; i++) {
								if (data[i].loginName == value && data[i].password == loginPassword) {
									login = true;
									break;
								}
							}
						}
					}
				});
        		return login;
        	},
        	message: "userName or password is wrong!"
        }
    });
});