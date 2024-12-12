document.getElementById('convert').addEventListener('click', async () => {
  const btcValue = document.getElementById('btc').value;

  // Validate input
  if (!btcValue || btcValue <= 0) {
    alert('Please enter a valid BTC amount');
    return;
  }

  try {
    // Send POST request to  backend
    const response = await fetch('http://localhost:4000/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ btc: btcValue }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch conversion rate');
    }

    const data = await response.json();

    // Display the converted value
    const idrValue = data?.convertedValue?.value || 0;
    document.getElementById(
      'result'
    ).textContent = `IDR: ${idrValue.toLocaleString('id-ID')}`;
  } catch (error) {
    console.error(error);
    alert('An error occurred while converting BTC to IDR');
  }
});
