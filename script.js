// Speech-to-text using browser's Web Speech API
let recognition;
document.getElementById("recordButton").addEventListener("click", function () {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser doesn't support speech recognition. Try using Chrome.");
        return;
    }

    if (!recognition) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onstart = function () {
            document.getElementById("recordingStatus").innerText = "Recording... Speak now!";
        };
        
        recognition.onresult = function (event) {
            let transcript = "";
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            document.getElementById("transcript").innerText = transcript;
            document.getElementById("transcriptContainer").style.display = "block";
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error:", event.error);
            alert("Error occurred: " + event.error);
        };

        recognition.onend = function () {
            document.getElementById("recordingStatus").innerText = "Recording stopped.";
        };
    }

    recognition.start();
});

// Upload audio file for speech-to-text conversion (Backend required)
function uploadAudio() {
    let fileInput = document.getElementById("audioFile");

    if (!fileInput.files.length) {
        alert("Please select an audio file!");
        return;
    }

    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("audio", file);

    fetch("http://localhost:5000/upload", { // Change this URL to your Azure backend
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.transcript) {
            document.getElementById("transcript").innerText = data.transcript;
            document.getElementById("transcriptContainer").style.display = "block";
        } else {
            alert("Error processing the audio!");
        }
    })
    .catch(error => {
        console.error("Upload error:", error);
        alert("Error uploading file. Check console logs.");
    });
}
