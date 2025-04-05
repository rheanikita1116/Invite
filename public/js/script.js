let mediaRecorder;
let recordedChunks = [];

const preview = document.getElementById('preview');
const playback = document.getElementById('playback');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const saveBtn = document.getElementById('save');

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    preview.srcObject = stream;

    // Use WebM because MP4 isn't supported by MediaRecorder in most browsers
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      playback.src = url;

      saveBtn.disabled = false;
      saveBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reaction.mp4'; // Note: Still webm format with .mp4 extension
        a.click();
      };
    };

    startBtn.onclick = () => {
      recordedChunks = [];
      mediaRecorder.start();
      startBtn.disabled = true;
      stopBtn.disabled = false;
      saveBtn.disabled = true;
    };

    stopBtn.onclick = () => {
      mediaRecorder.stop();
      startBtn.disabled = false;
      stopBtn.disabled = true;
    };
  })
  .catch(error => {
    console.error("Camera access error:", error);
    alert("Could not access your webcam and microphone.");
  });
