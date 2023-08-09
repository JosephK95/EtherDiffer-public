T_Array = function(_base_T) {
    if (!_base_T.is_T) {
        console.error("[ERROR] The given type \"" + _base_T + "\" is not valid");
    }
    return { is_T: true,
	     name: "Array(" + _base_T.name + ")",
	     base_T: _base_T,
             isValid: function(arr) {
	         return (Array.isArray(arr) && arr.every(elem => _base_T.isValid(elem)));
             },
	     mutable: function(T) {
	         return T.name == this.name;
	     },
	     unroll_value: function(arr) {
	         if (!Array.isArray(arr)) {
	             return [ { "rv" : arr } , {} ];
		 } else {
                     let prop_val_maps = {}, mismatch_maps = {};
		     prop_val_maps["rv"] = arr;

	             arr.forEach((elem, index) => {
		         prop_val_maps["rv[" + index.toString() + "]"] = elem;
	             });
	             return [ prop_val_maps, mismatch_maps ];        
	         }
   	     } }
}

T_Or = function(T1, T2) {
    if (!T1.is_T) {
        console.error("[ERROR] The given type \"" + T1 + "\" is not valid");
    }
    if (!T2.is_T) {
        console.error("[ERROR] The given type \"" + T2 + "\" is not valid");
    }
    return { is_T: true,
	     is_Or: true,
	     name: "(" + T1.name + " | " + T2.name + ")",
	     _T1: T1,
	     _T2: T2,
             isValid: function(val) {	
                 return (T1.isValid(val) || T2.isValid(val));
             },
	     mutable: function(T) {
	         return T1.mutable(T) || T2.mutable(T);
	     },
	     unroll_value: function(val) {
	         if (!this.isValid(val)) {
	             return [ { "rv": val }, {} ];
		 } else if (T1.isValid(val)) {
	             return T1.unroll_value(val);
		 } else {
	             return T2.unroll_value(val);
		 }
	     } }
}
