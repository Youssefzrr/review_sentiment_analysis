document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const reviewText = document.getElementById('reviewText').value.trim();

        if (!reviewText) {
            showResult('Please enter a review.', 'warning');
            return;
        }

        const data = [{ review: reviewText }];

        // Send the review to the Flask backend
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const prediction = data[0].prediction;
                const sentiment = prediction.toLowerCase() === 'positive' ? 'Positive 😊' : 'Negative 😞';
                const alertType = prediction.toLowerCase() === 'positive' ? 'success' : 'danger';
                showResult(`Sentiment: ${sentiment}`, alertType);
            } else {
                showResult('Unexpected response format from the server.', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = error.message || 'An error occurred while processing your request.';
            showResult(`Error: ${errorMessage}`, 'danger');
        });
    });

    function showResult(message, type) {
        const resultDiv = document.getElementById('result');
        resultDiv.className = `alert alert-${type} mt-4`;
        resultDiv.textContent = message;
        resultDiv.classList.remove('d-none');
    }