"use client";
import { Button, Label, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [storedOtp, setStoredOtp] = useState<string | null>(null);

  useEffect(() => {
    const otpFromStorage = localStorage.getItem("otp");
    setStoredOtp(otpFromStorage);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (otp === storedOtp) {
      localStorage.removeItem("otp");
      router.push("/");
    } else {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">OTP Verification</h2>
        <form>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="otp" value="Enter OTP" className="font-semibold" />
            </div>
            <TextInput
              id="otp"
              type="text"
              sizing="md"
              className="form-control"
              value={otp}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button
            color={"primary"}
            className="w-full rounded-md"
            onClick={handleSubmit}
          >
            Verify OTP
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
