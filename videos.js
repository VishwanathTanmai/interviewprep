let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let currentQuestionIndex = 0;

// Get the video element
const videoElement = document.getElementById('videoElement');

// Get the video container
const videoContainer = document.getElementById('videoContainer');

// Get the question elements
const questionTitle = document.getElementById('questionTitle');
const questionText = document.getElementById('questionText');

// Get the buttons
const startStopButton = document.getElementById('startStopButton');
const pauseResumeButton = document.getElementById('pauseResumeButton');
const downloadButton = document.getElementById('downloadButton');
const nextButton = document.getElementById('nextButton');

// List of interview questions
const questions = [
    "What interests you in this position?",
    "Tell us about your previous experience.",
    "How do you handle challenges in the workplace?",
    "What are your strengths and weaknesses?",
    "What are your career goals?",
    "What are your salary expectations?",
    "What do you know about our company?",
    "Why should we hire you?",
];

function playPauseVideo() {
    if (videoElement.paused) {
        videoElement.play();
        playPauseButton.textContent = 'Pause';
    } else {
        videoElement.pause();
        playPauseButton.textContent = 'Play';
    }
}

// Event listener for the play/pause button
playPauseButton.addEventListener('click', playPauseVideo);

// Function to request camera access and start recording
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        videoContainer.style.display = "block";
        displayQuestion();

        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function () {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            downloadButton.href = url;
            downloadButton.download = 'recorded-video.webm';
        };

        mediaRecorder.start();
    } catch (err) {
        console.error('Error accessing the camera:', err);
    }
}

// Function to display the current question
function displayQuestion() {
    questionTitle.textContent = `Question ${currentQuestionIndex + 1}:`;
    questionText.textContent = questions[currentQuestionIndex];
}

// Event listener for the start/stop button
startStopButton.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
        nextButton.disabled = false;
        playPauseButton.disabled = false;
        downloadButton.disabled = false;
    }
    isRecording = !isRecording;
    startStopButton.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
    if (isRecording) {
        startStopButton.classList.remove('btn-primary');
        startStopButton.classList.add('btn-danger');
    } else {
        startStopButton.classList.remove('btn-danger');
        startStopButton.classList.add('btn-primary');
    }
});

// Event listener for the "Next Question" button
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        nextButton.disabled = false;
        downloadButton.disabled = false;
        playPauseButton.textContent = 'Play'; // Reset play/pause button text
        videoElement.pause(); // Pause the video when moving to the next question
    }
});

// Call displayQuestion() to show the first question on page load
displayQuestion();

downloadButton.addEventListener('click', () => {
    if (recordedChunks.length > 0) {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Set the URL and filename for the download link
        downloadButton.href = url;
        downloadButton.download = 'recorded-video.webm';

        // Programmatically trigger the download
        downloadButton.click();
    } else {
        alert("No recorded video available to download.");
    }
});

