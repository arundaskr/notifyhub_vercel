"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, Badge, Button, Spinner, Alert, Tabs, TextInput } from "flowbite-react";
import { reminderService } from "@/app/services/api";
import Link from "next/link";

interface Reminder {
  id: string;
  title: string;
  completed: boolean;
}

const InvoiceList = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const response = await reminderService.getReminders();
        setReminders(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-6">
        <Spinner size="xl" />
      </div>
    );

  if (error)
    return <Alert color="failure">Error: {error}</Alert>;

  const filteredReminders = reminders
    .filter((r) =>
      filter === "all" ? true : filter === "completed" ? r.completed : !r.completed
    )
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Reminders</h2>

      <Tabs
        aria-label="Reminder tabs"
        variant="underline"
        onActiveTabChange={(index) => {
          if (index === 0) setFilter("all");
          if (index === 1) setFilter("pending");
          if (index === 2) setFilter("completed");
        }}
      >
        <Tabs.Item title="All" />
        <Tabs.Item title="Pending" />
        <Tabs.Item title="Completed" />
      </Tabs>

      <div className="mt-4 flex justify-between items-center">
        <TextInput
          placeholder="Search reminders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link href="/apps/invoice/create">
          <Button color="primary">+ New Reminder</Button>
        </Link>
      </div>

      {filteredReminders.length === 0 ? (
        <p className="text-gray-500 mt-6">No reminders found.</p>
      ) : (
        <Table className="mt-6">
          <Table.Head>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Sender Email</Table.HeadCell>
            <Table.HeadCell>Sender Name</Table.HeadCell>
            <Table.HeadCell>Receiver Email</Table.HeadCell>
            <Table.HeadCell>Interval Type</Table.HeadCell>
            <Table.HeadCell>Start Date</Table.HeadCell>
            <Table.HeadCell>End Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredReminders.map((reminder) => (
              <Table.Row key={reminder.id}>
                <Table.Cell>{reminder.title}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>
                  {reminder.completed ? (
                    <Badge color="success">Completed</Badge>
                  ) : (
                    <Badge color="warning">Pending</Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default InvoiceList;
