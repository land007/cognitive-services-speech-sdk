(function() {
  "use strict";
  var sdk = require("microsoft-cognitiveservices-speech-sdk");
  var fs = require("fs");
  var subscriptionKey = "6e83631f53fb4a07b0cde7cf8fab0b26";
  var serviceRegion = "westus"; // e.g., "westus"
  var filename = "YourAudioFile.wav"; // 16000 Hz, Mono
  var pushStream = sdk.AudioInputStream.createPushStream();
  fs.createReadStream(filename).on('data', function(arrayBuffer) {
    pushStream.write(arrayBuffer.slice());
	pushStream.write(arrayBuffer.slice());
  }).on('end', function() {
    pushStream.close();
  });
  console.log("Now recognizing from: " + filename);
  var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  speechConfig.speechRecognitionLanguage = "zh-CN";
  var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  recognizer.recognized = (r, event) => {
    console.log(event);
  };
  recognizer.startContinuousRecognitionAsync();
}());
  