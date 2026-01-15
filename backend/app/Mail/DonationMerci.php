<?php

namespace App\Mail;

use App\Models\Donation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DonationMerci extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public Donation $donation)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thank you for your donation!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.donation.merci',
            with: [
                'amount' => $this->donation->amount_gross,
                'campaignTitle' => $this->donation->campaign->title,
                'donorName' => $this->donation->donor_name,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('emails.receipt', ['donation' => $this->donation]);

        return [
            \Illuminate\Mail\Mailables\Attachment::fromData(fn () => $pdf->output(), 'DonationReceipt.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
