<!DOCTYPE html>
<html>
<head>
    <title>Thank You</title>
</head>
<body>
    <h1>Thank you, {{ $donorName ?? 'Donor' }}!</h1>
    <p>We received your donation of ${{ number_format($amount, 2) }} for "{{ $campaignTitle }}".</p>
    <p>Your support means the world to us.</p>
</body>
</html>
