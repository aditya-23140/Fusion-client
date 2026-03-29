/**
 * LeaveManagement Feature
 * Manages hostel leave requests
 */

import React, { useState, useEffect, useCallback } from "react";
import { Card, Title, Button, Group, Alert, Tabs } from "@mantine/core";
import {
  IconPlus,
  IconAlertCircle,
  IconList,
  IconUser,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import LeavesTable from "./components/LeavesTable";
import CreateLeaveModal from "./components/CreateLeaveModal";
import {
  fetchLeaves,
  fetchMyLeaves,
  createLeave,
  updateLeaveStatus,
} from "./api";

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("my");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [leavesData, myLeavesData] = await Promise.all([
        fetchLeaves(),
        fetchMyLeaves(),
      ]);
      setLeaves(leavesData);
      setMyLeaves(myLeavesData);
    } catch (err) {
      setError("Failed to load leaves. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateLeave = async (formData) => {
    try {
      setSubmitting(true);
      await createLeave(formData);
      notifications.show({
        title: "Success",
        message: "Leave request submitted successfully",
        color: "green",
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to submit leave request",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveLeave = async (leave) => {
    try {
      await updateLeaveStatus({ leave_id: leave.id, status: "Approved" });
      notifications.show({
        title: "Success",
        message: "Leave approved successfully",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to approve leave",
        color: "red",
      });
    }
  };

  const handleRejectLeave = async (leave) => {
    try {
      await updateLeaveStatus({ leave_id: leave.id, status: "Rejected" });
      notifications.show({
        title: "Success",
        message: "Leave rejected",
        color: "green",
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to reject leave",
        color: "red",
      });
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>Leave Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          Apply Leave
        </Button>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="my" leftSection={<IconUser size={14} />}>
            My Leaves
          </Tabs.Tab>
          <Tabs.Tab value="all" leftSection={<IconList size={14} />}>
            All Leaves
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="my">
          <LeavesTable leaves={myLeaves} loading={loading} />
        </Tabs.Panel>

        <Tabs.Panel value="all">
          <LeavesTable
            leaves={leaves}
            loading={loading}
            showActions
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />
        </Tabs.Panel>
      </Tabs>

      <CreateLeaveModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateLeave}
        loading={submitting}
      />
    </Card>
  );
}
