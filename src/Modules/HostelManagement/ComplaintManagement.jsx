/**
 * ComplaintManagement Feature
 * Manages hostel complaints
 */

import React, { useState, useEffect, useCallback } from "react";
import { Flex, Title, Button, Alert, Tabs } from "@mantine/core";
import {
  IconPlus,
  IconAlertCircle,
  IconList,
  IconUser,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import ComplaintsTable from "./components/ComplaintsTable";
import CreateComplaintModal from "./components/CreateComplaintModal";
import { fetchComplaints, fetchMyComplaints, fileComplaint } from "./api";

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("my");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [complaintsData, myComplaintsData] = await Promise.all([
        fetchComplaints(),
        fetchMyComplaints(),
      ]);
      setComplaints(complaintsData);
      setMyComplaints(myComplaintsData);
    } catch (err) {
      setError("Failed to load complaints. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFileComplaint = async (formData) => {
    try {
      setSubmitting(true);
      await fileComplaint(formData);
      notifications.show({
        title: "Success",
        message: "Complaint filed successfully",
        color: "green",
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to file complaint",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex direction="column" gap="md">
      <Flex justify="space-between" align="center">
        <Title order={2}>Complaints</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          File Complaint
        </Button>
      </Flex>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="my" leftSection={<IconUser size={14} />}>
            My Complaints
          </Tabs.Tab>
          <Tabs.Tab value="all" leftSection={<IconList size={14} />}>
            All Complaints
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="my">
          <ComplaintsTable complaints={myComplaints} loading={loading} />
        </Tabs.Panel>

        <Tabs.Panel value="all">
          <ComplaintsTable complaints={complaints} loading={loading} />
        </Tabs.Panel>
      </Tabs>

      <CreateComplaintModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFileComplaint}
        loading={submitting}
      />
    </Flex>
  );
}
