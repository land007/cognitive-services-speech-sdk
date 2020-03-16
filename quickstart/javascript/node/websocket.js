(function() {
  "use strict";
  const sdk = require("microsoft-cognitiveservices-speech-sdk");
  const fs = require("fs");
  const WebSocket = require('ws');
  const wav = require('wav');
  const wss = new WebSocket.Server({ port: 80 });
  var subscriptionKey = "6e83631f53fb4a07b0cde7cf8fab0b26";
  var serviceRegion = "westus"; // e.g., "westus"
  var filename = "YourAudioFile.wav"; // 16000 Hz, Mono
  var pushStream = sdk.AudioInputStream.createPushStream();
  console.log(pushStream.write.toString());
  fs.createReadStream(filename).on('data', function(arrayBuffer) {
    pushStream.write(arrayBuffer.slice());
  }).on('end', function() {
//    pushStream.close();
  });
  var jq = function(buff) {
		return buff.slice(buff.indexOf('\n') + 1, buff.length);
	};
  let i = 0;
  var myFilePath = __dirname + '/test.wav';
  var data = new Buffer(0);
  var fileWriter = new wav.FileWriter(myFilePath, {
	    channels: 1,
	    sampleRate: 16000,
	    bitDepth: 16
	  });
  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
//    	let base64data = message.toString('base64');
//    	console.log(base64data);
//      console.log(message);
//        console.log('message', message.length);
      if(message.length == 4197) {// || message.length == 172
//    	  if(i == 11) {
//        	  fs.writeFile(myFilePath, message, {flag: 'a'}, function (err) {
//	       		   if(err) {
//	       		    console.error(err);
//	       		    } else {
//	       		       console.log('写入成功');
//	       		    }
//	       		});
//    	  }
          message = jq(message);//替代品 https://recordrtc.org/
          message = jq(message);//方法 https://stackoverflow.com/questions/34319617/recording-binary-stream-to-wav-file-over-websocket-with-ssl
          message = jq(message);
//          data = Buffer.concat([data, message], data.length + message.length);
          pushStream.write(message);
      } else {
    	  console.log('《', message, "》");
      }
//      console.log('received: %s', i);
      i++
    });
    ws.on('close', function() {
        fileWriter.write(data);
        fileWriter.end();
      });
    ws.send('something');
  });
  console.log("Now recognizing from: " + filename);
  var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
//  console.log(audioConfig);
  var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  speechConfig.speechRecognitionLanguage = "zh-CN";
//  console.log(speechConfig);
  var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  recognizer.recognized = (r, event) => {
    console.log(event);
  };
  recognizer.startContinuousRecognitionAsync();
}());
  