<!DOCTYPE html>
<html>
<head>
    <title>New Donation</title>
</head>
<body>
    <h1>New Donation Received!</h1>
    <p><strong>Amount:</strong> ${{ number_format($amount, 2) }}</p>
    <p><strong>Campaign:</strong> {{ $campaignTitle }}</p>
    <p><strong>Donor:</strong> {{ $donorName ?? 'Anonymous' }} ({{ $donorEmail }})</p>
</body>
</html>
