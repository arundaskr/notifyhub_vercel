"use client";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/api";

export default function AuthLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const trimmedUsername = formData.username.trim();
      if (trimmedUsername.includes("@") && !trimmedUsername.toLowerCase().endsWith("@gmail.com")) {
        setError("Please use your Gmail address.");
        return;
      }

      setIsSubmitting(true);

      try {
        const resp = await authService.loginPassword(
          formData.username.trim(),
          formData.password
        );

        if (resp.mfa_required) {
            // MFA is required
            const loginSession = {
                username: formData.username.trim(),
                password: formData.password,
                mfa_challenge_id: resp.mfa_challenge_id
            };
            sessionStorage.setItem("notifyhub_login_session", JSON.stringify(loginSession));
            router.push("/auth/auth1/two-steps");
            return;
        }

        if (resp.access_token) {
            // Success (No MFA)
            localStorage.setItem("notifyhub_access_token", resp.access_token);
            router.push("/");
            return;
        }
        
        throw new Error(resp.message || "Login failed");

      } catch (err: any) {
         setError(err?.message || "Login failed");
         setIsSubmitting(false);
      }
  };

  return (
    <>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            sizing="md"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
          </div>
          <TextInput
            id="password"
            type="password"
            sizing="md"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember this Device
            </Label>
          </div>
          <Link href={"/auth/auth1/forgot-password"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <Button 
            color={"primary"} 
            type="submit"
            className="w-full rounded-md"
            disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </>
  );
};
