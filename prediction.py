import joblib
from typing import List

class Prediction:
    def __init__(self):
        self.model = joblib.load('notebooks/model.pkl')
        self.vectorizer = joblib.load('notebooks/vectorizer.pkl')

    def classify_reviews(self, reviews: List[str]) -> List[str]:
        tfidf_vector = self.vectorizer.transform(reviews)
        predictions = self.model.predict(tfidf_vector)
        return ["Positive" if pred == 1 else "Negative" for pred in predictions]