var util = (function(){
	function PadLeft(val, totalLen, ch){
		var  len = (totalLen - String(val).length)+1;
		return len > 0? new Array(len).join(ch || '0')+val : val;
	}
	
	function DateToString(date,format) {
		var year = date.getFullYear();
		var month = PadLeft(date.getMonth()+1,2);
		var day = PadLeft(date.getDate(),2);
		var hour = PadLeft(date.getHours(),2);
		var minute = PadLeft(date.getMinutes(),2);
		var second = PadLeft(date.getSeconds(),2);
		var str = format;
		str = str.replace("YYYY",year);
		str = str.replace("MM",month);
		str = str.replace("dd",day);
		str = str.replace("HH",hour);
		str = str.replace("mm",minute);
		str = str.replace("ss",second);

		return str;		
	}
	return {
		PadLeft: PadLeft,
		DateToString: DateToString
	};
})();
