from flask import Flask, request, jsonify
from flask_cors import CORS
from model import risk_model

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'Saral Shiksha Dropout Risk ML Microservice',
        'algorithm': 'RandomForestClassifier (scikit-learn)',
        'version': '1.0.0'
    })

@app.route('/predict-risk', methods=['POST'])
def predict():
    try:
        data = request.get_json() or {}
        prediction = risk_model.predict_risk(data)
        return jsonify(prediction)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'risk_score': 0.5,
            'risk_level': 'MEDIUM',
            'shap_explanations': [],
            'source': 'microservice-error-fallback'
        }), 500

if __name__ == '__main__':
    print("=====================================================")
    print(" Saral Shiksha ML Microservice running on port 5001")
    print(" Endpoint: POST http://127.0.0.1:5001/predict-risk")
    print("=====================================================")
    app.run(host='127.0.0.1', port=5001, debug=False)
