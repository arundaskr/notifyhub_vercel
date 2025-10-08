"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Card, Label } from "flowbite-react";
import { reminderService } from "@/app/services/api";

const CreateInvoice = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
    userId: "1", // Static for now
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await reminderService.createReminder(formData);
      router.push("/apps/invoice/list");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New Reminder</h2>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter reminder title"
              required
            />
          </div>
          {error && <p className="text-red-500">{error.message}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Reminder"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateInvoice;
