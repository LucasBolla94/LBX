import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { EmailTemplate } from '@/components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, title, email, telegram, walletAddress, message } = body;

    if (!email || !name || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const subject = `[${title || 'Contact'}] Message from ${name}`;

    const { data, error } = await resend.emails.send({
      from: 'Contato LBX <noreply@lbxgroup.online>',
      to: 'lucasbolla.uk@gmail.com',
      subject,
      react: EmailTemplate({
        name,
        email,
        title,
        telegram,
        walletAddress,
        message,
      }),
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
