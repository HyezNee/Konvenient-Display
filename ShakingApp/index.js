window.onload = function() {
    var bridge = new WebOSServiceBridge();
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
    var helloApi = 'luna://com.domain.app.service/hello';
    var helloParams = '{"name":"webOS"}';

    function getTime_callback(msg){
        var arg = JSON.parse(msg);
        if (arg.returnValue) {
            console.log("[APP_NAME: example web app] GETTIME_SUCCESS UTC : " + arg.utc);
            //webOSSystem.PmLogString(6, "GETTIME_SUCCESS", '{"APP_NAME": "example web app"}', "UTC : " + arg.utc);
        }
        else {
            console.error("[APP_NAME: example web app] GETTIME_FAILED errorText : " + arg.errorText);
            //webOSSystem.PmLogString(3, "GETTIME_FAILED", '{"APP_NAME": "example web app"}', "errorText : " + arg.errorText);
        }
    }

    function hello_callback(msg){
        var arg = JSON.parse(msg);
        if (arg.returnValue) {
            document.getElementById("txt_msg").innerHTML = arg.Response;
            console.log("[APP_NAME: example web app] CALLHELLO_SUCCESS response : " + arg.Response);
            //webOSSystem.PmLogString(6, "CALLHELLO_SUCCESS", '{"APP_NAME": "example web app"}', "response : " + arg.Response);
        }
        else {
            console.error("[APP_NAME: example web app] CALLHELLO_FAILED errorText : " + arg.errorText);
            //webOSSystem.PmLogString(3, "CALLHELLO_FAILED", '{"APP_NAME": "example web app"}', "errorText : " + arg.errorText);
        }
    }

    
    bridge.onservicecallback = getTime_callback;
    bridge.call(getTimeApi, getTimeParams);
    document.getElementById("txt_msg").onclick = function() {
        bridge.onservicecallback = hello_callback;
        bridge.call(helloApi, helloParams);
    };
    
}
$(document).ready(function(){
    //멀미 필터 키고 끄기
    if($("#onnoff").prop("chekced")){

    }else{
        $("#detail").css("visibility", "hidden");
    }
    $("#onnoff").change(function(){
        if($("#onnoff").is(":checked")){
            console.log("on");
            //멀미 필터 켜짐
            $("#onnoff").attr("checked",true);
            $(".slider").attr("before",true);
            $("#detail").css("visibility", "visible");
        }else{
            //멀미 필터 꺼짐
            console.log("off");
            $("#onnoff").prop("checked",false);
            $(".slider").attr("before",false);
            $("#detail").css("visibility", "hidden");
            reset();
        }
    });

    $("#opaValue").change(function(){
        //console.log($("#opaValue").val());
        $("#value").text($("#opaValue").val());
    });    
    
    $("#selection").change(function(){
        console.log($("#selection option:selected").val());
    });

    $("#save").click(function(){
        alert("save value");
    });

    $("#exit").click(function(){
        alert("exit the app");
    });
});

function reset(){
    $("#value").text(50);
    $("#opaValue").val(50);
    var num=$("#selection option:selected").val();
    $("#selection").val(num).prop("selected", false);
    $("#selection").val("").prop("selected", true);
}