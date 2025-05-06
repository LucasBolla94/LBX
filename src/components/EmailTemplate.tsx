import * as React from 'react';

interface Props {
  name: string;
  title?: string;
  email: string;
  telegram?: string;
  walletAddress?: string;
  message: string;
}

export function EmailTemplate({
  name,
  title,
  email,
  telegram,
  walletAddress,
  message,
}: Props) {
  return (
    <div style={{ fontFamily: 'Arial', fontSize: '14px', color: '#333' }}>
      <h2>📨 New Contact Message</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Title:</strong> {title || 'N/A'}</p>
      <p><strong>Telegram:</strong> {telegram || 'N/A'}</p>
      <p><strong>Wallet Address:</strong> {walletAddress || 'Not Connected'}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>{message}</p>
    </div>
  );
}
