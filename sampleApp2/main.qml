import QtQuick 2.4
import WebOSServices 1.0
import Eos.Window 0.1
import PmLog 1.0

WebOSWindow {
    id: root
    width: 1920
    height: 1080
    visible: true
    appId: "com.sample2.app"
    title: "QML app"
    color: "lightblue"
    displayAffinity: params["displayAffinity"]

    Text {
        id: mainText
        anchors.centerIn: parent
        font.family: "Helvetica"
        font.pointSize: 50
        text: "Hello, QML Application!!"
    }

    property var launchParams: params
    onLaunchParamsChanged: {
        pmLog.info("LAUNCH_PARAMS", {"params": launchParams})
    }

    Service {
        id: systemService
        appId: "com.sample2.app"

        function getTime() {
            call("luna://com.webos.service.systemservice","/clock/getTime","{}")
        }

        onResponse: {
            var jsonObject = JSON.parse(payload);
            pmLog.info("GETTIME", {"utc": jsonObject.utc});
            mainText.text = "UTC : " + jsonObject.utc
        }

        onError: {
            var jsonObject = JSON.parse(payload);
            pmLog.error("GETTIME", {"error": jsonObject});
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: systemService.getTime()
    }

    onWindowStateChanged: {
        pmLog.info("WINDOW_CHANGED", {"status": windowState})
    }

    PmLog {
        id: pmLog
        context: "QMLApp"
    }

    Rectangle {
        id: button
        width: 100
        height: 30
        color: "green"
        radius: 5
        anchors.left: mainText.right
        anchors.bottom: mainText.bottom

        Text {
            id: buttonText
            text: qsTr("뒤로 가기") // qstr이 뭐지.....
            color: "white"
            anchors.centerIn: parent
        }

        Service {
            id: systemService2
            appId: "com.sample2.app"

            function back() {
                call("luna://com.webos.service.applicationmanager","/pause","{\"id\":\"com.sample2.app\"}")
                buttonText.text = qsTr("back")
            }

            onResponse: {
                var jsonObject = JSON.parse(payload);
                pmLog.info("BACK", {"isSuccess": jsonObject.returnValue});
                buttonText.text = qsTr("성공")
            }

            onError: {
                var jsonObject = JSON.parse(payload);
                pmLog.error("BACK", {"error": jsonObject});
                buttonText.text = qsTr("에러")
            }
        }

        MouseArea {
            anchors.fill: parent
            
            onClicked: {
                systemService2.back()
                //buttonText.text = qsTr("클릭")
            }
        }
    }
}
