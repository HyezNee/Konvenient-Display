window.onload = function() {
    var bridge = new WebOSServiceBridge();
    var bridge2 = new WebOSServiceBridge();
    /*
    *  getTimeApi calls gettime of systemservice, a module in the platform.
    */
    var getTimeApi = 'luna://com.webos.service.systemservice/clock/getTime';
    var getTimeParams = '{}';

    /*
    *  helloApi calls the hello method of js_service template provided by CLI.
    *  In this case, the service name is used as default name "com.domain.app.service" is.
    *  If you change this service name, you need to change the service name of the following API.
    *
    *  If you change the name to helloparmas as you want, the contents will be reflected on the screen.
    */
    var interval = document.getElementById("time_to_use").value;
    var hour = interval / 60;
    if(hour < 10) {
        hour = "0" + hour;
    }
    var min = interval % 60;
    if(min < 10) {
        min = "0" + min;
    }
    var alarmApi = 'luna://com.webos.service.alarm/set';
    var alarmParams = '{ "key":"kids",\
                        "uri":"luna://com.webos.service.power/shutdown/machineOff",\
                        "params":{\"reason\":\"localKey\"},\
                        "in":"00:00:10",\
                        "wakeup":true }';
    // 기능 동작 안됨. 왜?ㅜㅜ
    //":"' + hour + ':' + min + ':00",\

    function getTime_callback(msg){
        var arg = JSON.parse(msg);
        if (arg.returnValue) {
            var utcDate = arg.utc + document.getElementById("time_to_use").value * 60;
            console.log(arg.utc + " / " + utcDate);
            var date = new Date(utcDate * 1000);
            var month = date.getMonth() + 1
            document.getElementById("off_time").innerHTML = month + '월 ' + date.getDate() + '일 ' + date.getHours() + ' : ' + date.getMinutes();
            console.log("[APP_NAME: example web app] GETTIME_SUCCESS UTC : " + arg.utc);
            //webOSSystem.PmLogString(6, "GETTIME_SUCCESS", '{"APP_NAME": "example web app"}', "UTC : " + arg.utc);
        }
        else {
            console.error("[APP_NAME: example web app] GETTIME_FAILED errorText : " + arg.errorText);
            //webOSSystem.PmLogString(3, "GETTIME_FAILED", '{"APP_NAME": "example web app"}', "errorText : " + arg.errorText);
        }
    }

    function alarm_callback(msg){
        var arg = JSON.parse(msg);
        if (arg.returnValue) {
            console.log("[APP_NAME: alarm app] CALLALARM_SUCCESS key : " + arg.key + ", response : " + arg.returnValue);
        }
        else {
            console.error("[APP_NAME: alarm app] CALLALARM_FAILED errorText : " + arg.errorText);
        }
    }

    document.getElementById("start_alarm").onclick = function() {
        bridge.onservicecallback = getTime_callback;
        bridge.call(getTimeApi, getTimeParams);
        bridge2.onservicecallback = alarm_callback;
        bridge2.call(alarmApi, alarmParams);
    };
}

$(document).ready(function(){

    //시작 button click
    $("#start_alarm").click(function(){
        var input = $("#time_to_use").val().trim();
        var result = /^\d*$/.test(input);
        if(input != '' & result)
            $("#alarm_on").css("display", "block");
    });
});