from flask import Flask, request, jsonify, render_template
from prediction import Prediction

app = Flask(__name__)
predictor = Prediction()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided."}), 400

    if isinstance(data, dict):
        data = [data]
    elif not isinstance(data, list):
        return jsonify({"error": "Input should be a list of objects or a single object."}), 400

    reviews = [item.get('review', '') for item in data]
    if not all(reviews):
        return jsonify({"error": "Each object should have a 'review' key with non-empty value."}), 400

    try:
        results = predictor.classify_reviews(reviews)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify([{"review": review, "prediction": prediction}
                    for review, prediction in zip(reviews, results)])

if __name__ == '__main__':
    app.run(debug=True)
