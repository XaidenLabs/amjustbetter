<!DOCTYPE html>
<html>
<head>
    <title>Donation Receipt</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; }
        .header { text-align: center; margin-bottom: 40px; }
        .details { margin-bottom: 30px; }
        .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #777; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Official Donation Receipt</h1>
        <p>Receipt #{{ $donation->id }}</p>
    </div>

    <div class="details">
        <p><strong>Date:</strong> {{ $donation->created_at->format('M d, Y') }}</p>
        <p><strong>Donor:</strong> {{ $donation->donor_name ?? $donation->donor_email }}</p>
        <p><strong>Campaign:</strong> {{ $donation->campaign->title }}</p>
        
        <h3>Payment Details</h3>
        <table>
            <tr>
                <td>Amount</td>
                <td>${{ number_format($donation->amount_gross, 2) }}</td>
            </tr>
            <tr>
                <td>Status</td>
                <td>{{ $donation->payment_status }}</td>
            </tr>
            <tr class="total">
                <td>Total Paid</td>
                <td>${{ number_format($donation->amount_gross, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Thank you for your generous support!</p>
        <p>This receipt is generated automatically for your records.</p>
        <p>{{ config('app.name') }}</p>
    </div>
</body>
</html>
