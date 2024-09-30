from flask import Flask, render_template, request, jsonify
import whisper

app = Flask(__name__)
model = whisper.load_model("base")

@app.route('/')
def index():
    render_template('index.html')

@app.route('transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    audio_file.save('audio.wav')

    result = model.transcribe("audio.wav")
    transcription = result["text"]

    word_count = len(transcription.split())
    filler_words = ['um', 'uh', 'like', 'you know', 'so']
    fillers_found = [word for word in transcription.split() if word.lower() in filler_words]

    analysis = {
        'transcription': transcription,
        'word_count': word_count,
        'filler_words': fillers_found
    }

    return jsonify(analysis)

if __name__ == '__main__':
    app.run(debug=True)
