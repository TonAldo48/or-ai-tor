let mediaRecorder;
let audioChuncks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        document.getElementById("status").innerText = "Recording...";

        mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChuncks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChuncks, {type: "audio/wav"});
            const formData = new FormData();
            formData.append("audio", audioBlob, "audio.wav");

            fetch("/transcribe", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    document.getElementById("transcription").innerText =
                        "Transcription: " + data.transcription;
                    document.getElementById(
                        "analysis"
                    ).innerText = `Word Count: ${
                        data.word_count
                    }, Filler Words: ${data.filler_words.join(", ")}`;
                    document.getElementById("status").innerText =
                        "Recording Stoppped";
                });
        });
    });
}

function stopRecording() {
    mediaRecorder.stop()
    document.getElementById('status').innerText = "Processing...";
}