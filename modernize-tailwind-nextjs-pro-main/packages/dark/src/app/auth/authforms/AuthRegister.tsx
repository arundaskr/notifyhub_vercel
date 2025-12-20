"use client";
import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/api";

const AuthRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    if (!formData.name.trim()) {
      setError("Username is required");
      return;
    }

    if (!formData.email.trim().toLowerCase().endsWith("@gmail.com")) {
      setError("Only Gmail addresses are allowed.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // 1. Signup
      const signupResponse = await authService.signup({
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // 2. Silent Login to get Access Token for MFA Setup
      let accessToken = "";
      try {
        const tokenResp = await authService.fetchAccessToken({
            username: formData.name.trim(),
            password: formData.password,
        });
        accessToken = tokenResp.access_token;
      } catch (tokenErr) {
        console.error("Silent login failed:", tokenErr);
        // We might still proceed if we want to try re-login in next step, 
        // but ideally this should work if signup worked.
      }

      const signupSession = {
        username: formData.name.trim(),
        password: formData.password, // Keep for fallback re-login if needed
        email: formData.email.trim(),
        mfa: signupResponse.mfa,
        accessToken: accessToken, // Store token
      };
      
      sessionStorage.setItem(
        "notifyhub_signup_session",
        JSON.stringify(signupSession)
      );
      router.push("/auth/mfa-setup");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </>
  );
};

export default AuthRegister;
