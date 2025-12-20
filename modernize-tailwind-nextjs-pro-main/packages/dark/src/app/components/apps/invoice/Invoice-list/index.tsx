'use client';
import React, { useEffect, useState, useContext } from "react";
import { Checkbox, Table, TextInput, Button, Modal, Badge, Tooltip, Alert, Spinner } from "flowbite-react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { reminderService } from "@/app/services/api";
import { UserDataContext } from "@/app/context/UserDataContext";
import { Reminder } from "@/types/apps/invoice";

interface ReminderListProps {
  filter?: string;
}

function ReminderList({ filter }: ReminderListProps) {
  const { reminders, user, permissions } = useContext(UserDataContext); // Use Context
  
  // DEBUG: Check what the UI receives
  useEffect(() => {
    console.log("ReminderList UI Received:", reminders);
  }, [reminders]);

  // const [reminders, setReminders] = useState<Reminder[]>([]); // Removed local state
  const [loading, setLoading] = useState(false); // Context handles loading usually, but we can simplify
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Removed useEffect fetch


  const handleConfirmDelete = async () => {
    try {
      await Promise.all(selectedReminders.map(id => reminderService.deleteReminder(id)));
      // Context will update automatically due to refetchQueries
      setSelectedReminders([]);
      setOpenDeleteDialog(false);
    } catch (err) {
      setError("Failed to delete reminders.");
    }
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedReminders(newSelectAll ? (reminders || []).map(r => r.id) : []);
  };

  const toggleSelectReminder = (id: string) => {
    setSelectedReminders(prev =>
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  // Apply filter based on filter type
  const applyFilter = (reminderList: Reminder[]) => {
    if (!filter) return reminderList;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'pending':
        return reminderList.filter(r => r.active && new Date(r.reminderEndDate) > now);
      case '7days':
        return reminderList.filter(r => {
          const endDate = new Date(r.reminderEndDate);
          return endDate >= now && endDate <= sevenDaysFromNow;
        });
      case '30days':
        return reminderList.filter(r => {
          const endDate = new Date(r.reminderEndDate);
          return endDate >= now && endDate <= thirtyDaysFromNow;
        });
      case 'completed':
        return reminderList.filter(r => r.completed || !r.active);
      case 'active':
        return reminderList.filter(r => r.active);
      default:
        return reminderList;
    }
  };

  const filteredReminders = applyFilter(reminders || []).filter(r =>
    (r.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.senderName || "").toLowerCase().includes(searchTerm.toLowerCase()) // senderName is optional in Reminder interface
  );

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><Spinner size="xl" /></div>;
  if (error) return <Alert color="failure">{error}</Alert>;

  const getFilterLabel = (filterType: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending Notifications',
      '7days': 'In 7 Days',
      '30days': 'In 30 Days',
      completed: 'Completed',
      active: 'Active Notifications'
    };
    return labels[filterType] || filterType;
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Notifications</h2>
        {filter && (
          <Badge color="info" className="text-sm">
            {getFilterLabel(filter)}
          </Badge>
        )}
      </div>
      <div className="sm:flex justify-between my-6 gap-3">
        <TextInput
          id="search"
          type="text"
          className="form-control"
          placeholder="Search by title or sender"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2 sm:mt-0 mt-4">
          {filter && (
            <Button 
              as={Link} 
              href="/apps/invoice/list" 
              color="gray" 
              className="sm:w-fit w-full rounded-md"
            >
              Clear Filter
            </Button>
          )}
          <Button as={Link} href="/apps/invoice/create" color={"primary"} className="sm:w-fit w-full rounded-md">
            + New Reminder
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox checked={selectAll} onChange={toggleSelectAll} />
            </Table.HeadCell>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Sender Email</Table.HeadCell>
            <Table.HeadCell>Receivers Email</Table.HeadCell>
            <Table.HeadCell>Active</Table.HeadCell>
            <Table.HeadCell className="text-center">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredReminders.map((reminder: Reminder) => {
              const startOfWeek = new Date();
              startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
              
              const isCompanyAdmin = permissions?.includes('reminders.manage_company');
              const isDeptAdmin = permissions?.includes('reminders.manage_department');
              const isOwner = user?.email === reminder.senderEmail;
              
              const canManage = isCompanyAdmin || isDeptAdmin || isOwner;

              return (
              <Table.Row key={reminder.id} className="bg-white dark:bg-gray-800">
                <Table.Cell className="p-4">
                  <Checkbox
                    checked={selectedReminders.includes(reminder.id)}
                    onChange={() => toggleSelectReminder(reminder.id)}
                    disabled={!canManage} 
                  />
                </Table.Cell>
                <Table.Cell>{reminder.id}</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {reminder.title}
                </Table.Cell>
                <Table.Cell>{reminder.senderEmail}</Table.Cell>
                <Table.Cell>{reminder.receiverEmail}</Table.Cell>
                <Table.Cell>
                  <Badge color={reminder.active ? 'success' : 'warning'}>
                    {reminder.active ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-center">
                  <div className="flex justify-center gap-3">
                    {canManage && (
                    <>
                    <Tooltip content="Edit Reminder">
                      <Link href={`/apps/invoice/edit/${reminder.id}`}>
                        <Button size="xs" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Icon icon="tabler:pencil" height={18} />
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip content="Delete Reminder">
                      <Button
                        size="xs"
                        color={"red"}
                        onClick={() => {
                          setSelectedReminders([reminder.id]);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Icon icon="tabler:trash" height={18} />
                      </Button>
                    </Tooltip>
                    </>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            );
            })}
          </Table.Body>
        </Table>
      </div>
      <Modal show={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} size="md">
        <Modal.Body className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Are you sure you want to delete the selected reminders?</h3>
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button color="gray" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReminderList;