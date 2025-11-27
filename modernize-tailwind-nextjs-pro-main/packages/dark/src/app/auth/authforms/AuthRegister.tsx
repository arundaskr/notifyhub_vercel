"use client";
import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AuthRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("otp", data.otp);
        router.push("/auth/auth1/otp-verification");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to send OTP");
    }
  };

  return (
    <>
      <form className="mt-6">
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" className="font-semibold" />
          </div>
          <TextInput
            id="name"
            type="text"
            sizing="md"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label
              htmlFor="email"
              value="Email Address"
              className="font-semibold"
            />
          </div>
          <TextInput
            id="email"
            type="email"
            sizing="md"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label
              htmlFor="password"
              value="Password"
              className="font-semibold"
            />
          </div>
          <TextInput
            id="password"
            type="password"
            sizing="md"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label
              htmlFor="confirmPassword"
              value="Confirm Password"
              className="font-semibold"
            />
          </div>
          <TextInput
            id="confirmPassword"
            type="password"
            sizing="md"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button
          color={"primary"}
          className="w-full rounded-md"
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </form>
    </>
  );
};

export default AuthRegister;
