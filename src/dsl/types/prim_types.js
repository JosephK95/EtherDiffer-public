const Web3 = require("web3");
const utils = Web3.utils;

T_Null = {
    is_T: true,
    name: "Null",
    isValid: function(val) {	
        return val == null;
    },
    mutable: function(T) {
        return T.name == this.name; 
    }
}

T_Boolean = {
    is_T: true,
    name: "Boolean",
    isValid: function(val) {	
        return typeof val == "boolean";
    },
    mutable: function(T) {
        return T.name == this.name;
    }
}

T_Number = {
    is_T: true,
    name: "Number",
    isValid: function(val) {
        return typeof val == "number";
    },
    mutable: function(T) {
        return T.name == this.name;    
    }   
}

T_String = {
    is_T: true,
    name: "String",
    isValid: function(val) {	
        return typeof val == "string";
    },
    mutable: function(T) {
         return (T.name == this.name ||
		 T.name == "Address" ||
		 T.name == "Hex" ||
		 T.name == "Hex32" ||
		 T.name == "NumberString");
    }	
}

T_Address = {
    is_T: true,
    name: "Address",
    isValid: function(val) {	
        return utils.isAddress(val);
    },
    mutable: function(T) {
        return T.name == this.name;    	
    }
}

T_NumberString = {
    is_T: true,
    name: "NumberString",
    isValid: function(val) {	
        return (typeof val == "string" && !isNaN(val));
    },
    mutable: function(T) {
        return T.name == this.name;
    }   
}

T_Hex = {
    is_T: true,
    name: "Hex",
    isValid: function(val) {	
        return utils.isHexStrict(val);
    },
    mutable: function(T) {
        return (T.name == this.name ||
		T.name == "Address" ||
		T.name == "Hex32");
    }
}

T_Hex8 = {
    is_T: true,
    name: "Hex8",
    isValid: function(val) {	
        return (utils.isHexStrict(val) && (val.length == 18));
    }
}

T_Hex32 = {
    is_T: true,
    name: "Hex32",
    isValid: function(val) {	
        return (utils.isHexStrict(val) && (val.length == 66));
    },
    mutable: function(T) {
        return T.name == this.name;
    }
}

T_Hex256 = {
    is_T: true,
    name: "Hex256",
    isValid: function(val) {	
        return (utils.isHexStrict(val) && (val.length == 514));
    }
}

T_Any = {
    is_T: true,
    name: "Any",
    isValid: function(val) {
        return true;
    }
}

function unroll_value(val) {
    return prim_unroll_value(this, val);
}

T_Null["unroll_value"] = unroll_value;

T_Boolean["unroll_value"] = unroll_value;
T_Number["unroll_value"] = unroll_value;
T_String["unroll_value"] = unroll_value;
T_Address["unroll_value"] = unroll_value;
T_NumberString["unroll_value"] = unroll_value;

T_Hex["unroll_value"] = unroll_value;
T_Hex8["unroll_value"] = unroll_value;
T_Hex32["unroll_value"] = unroll_value;
T_Hex256["unroll_value"] = unroll_value;

T_Any["unroll_value"] = unroll_value;
