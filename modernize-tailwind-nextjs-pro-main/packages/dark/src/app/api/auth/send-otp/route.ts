import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "YOUR_ETHEREAL_USER", // generated ethereal user
      pass: "YOUR_ETHEREAL_PASSWORD", // generated ethereal password
    },
  });

  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: '"Modernize" <noreply@modernize.com>', // sender address
      to: email, // list of receivers
      subject: "Your OTP for registration", // Subject line
      text: `Your OTP is ${otp}`, // plain text body
      html: `<b>Your OTP is ${otp}</b>`, // html body
    });

    return NextResponse.json({ otp });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
