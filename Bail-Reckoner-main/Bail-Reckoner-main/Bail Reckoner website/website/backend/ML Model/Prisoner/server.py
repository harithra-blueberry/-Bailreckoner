from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load the trained model
with open('C:\\Users\\Arun Prasad\\OneDrive\\Desktop\\Bail Reckoner website\\website\\backend\\ML Model\\Prisoner\\prisonar_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Load dataset
dataset_path = 'D:\\Bail reckoner\\dataset\\prisonar_dataset.csv'
dataset = pd.read_csv(dataset_path)
dataset.dropna(inplace=True)  # Remove empty rows if any

# Create a vectorizer for the dataset
vectorizer = TfidfVectorizer()
dataset_vectors = vectorizer.fit_transform(dataset['Offense'])  # Vectorize all offenses

# Define an API endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    case_description = data.get('case_description')

    if not case_description:
        return jsonify({'error': 'No case description provided'}), 400

    # Transform the input offense using the dataset-based vectorizer
    input_vector = vectorizer.transform([case_description])

    # Compute cosine similarity with all dataset offenses
    similarities = cosine_similarity(input_vector, dataset_vectors)
    most_similar_index = similarities.argmax()

    # Get bailability based on the most similar offense
    prediction = dataset.iloc[most_similar_index]['Bailable']
    matched_offense = dataset.iloc[most_similar_index]['Offense']

    return jsonify({
        'case_description': case_description,
        'matched_offense': matched_offense,
        'bailability': prediction
    })

if __name__ == '__main__':
    app.run(port=5001)
