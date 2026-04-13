/**
 * ComplaintManagement - Thin View
 * Manages hostel complaints
 * Orchestrates components and handles state, calls api.js
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  Title,
  Button,
  Group,
  Alert,
  Stack,
  Modal,
  Textarea,
} from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import ComplaintCard from "./components/ComplaintCard";
import CreateComplaintModal from "./components/CreateComplaintModal";
import { fetchComplaints, escalateComplaint, resolveComplaint } from "./api";

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState("");
  const [resolutionRemarks, setResolutionRemarks] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const complaintsData = await fetchComplaints();
      setComplaints(complaintsData);
    } catch (err) {
      setError("Failed to load complaints. Please try again.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEscalate = async () => {
    if (!selectedComplaint || !escalationReason.trim()) {
      notifications.show({
        title: "Error",
        message: "Please provide a reason for escalation",
        color: "red",
      });
      return;
    }

    try {
      setSubmitting(true);
      await escalateComplaint(selectedComplaint.id, {
        escalation_reason: escalationReason,
      });
      notifications.show({
        title: "Success",
        message: "Complaint escalated successfully",
        color: "green",
      });
      setEscalateModalOpen(false);
      setEscalationReason("");
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to escalate complaint",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedComplaint || !resolutionRemarks.trim()) {
      notifications.show({
        title: "Error",
        message: "Please provide resolution remarks",
        color: "red",
      });
      return;
    }

    try {
      setSubmitting(true);
      await resolveComplaint(selectedComplaint.id, {
        resolution_remarks: resolutionRemarks,
      });
      notifications.show({
        title: "Success",
        message: "Complaint resolved successfully",
        color: "green",
      });
      setResolveModalOpen(false);
      setResolutionRemarks("");
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.error || "Failed to resolve complaint",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Complaint Management</Title>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setModalOpen(true)}
          >
            New Complaint
          </Button>
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle />} color="red" title="Error">
            {error}
          </Alert>
        )}

        <Stack gap="md">
          {complaints.length === 0 ? (
            <Card withBorder p="xl">
              <p>No complaints found</p>
            </Card>
          ) : (
            complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onView={() => setSelectedComplaint(complaint)}
                onEscalate={() => {
                  setSelectedComplaint(complaint);
                  setEscalateModalOpen(true);
                }}
                onResolve={() => {
                  setSelectedComplaint(complaint);
                  setResolveModalOpen(true);
                }}
                canEscalate={complaint.status === "open"}
                canResolve={complaint.status === "in_progress"}
                showActions
              />
            ))
          )}
        </Stack>

        <CreateComplaintModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={() => {
            setModalOpen(false);
            loadData();
          }}
          loading={submitting}
        />

        <Modal
          opened={escalateModalOpen}
          onClose={() => setEscalateModalOpen(false)}
          title="Escalate Complaint"
          centered
        >
          <Stack gap="md">
            <Textarea
              label="Escalation Reason"
              placeholder="Why is this complaint being escalated?"
              minRows={3}
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.currentTarget.value)}
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                onClick={() => setEscalateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="orange"
                loading={submitting}
                onClick={handleEscalate}
              >
                Escalate
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          title="Resolve Complaint"
          centered
        >
          <Stack gap="md">
            <Textarea
              label="Resolution Remarks"
              placeholder="How was this complaint resolved?"
              minRows={3}
              value={resolutionRemarks}
              onChange={(e) => setResolutionRemarks(e.currentTarget.value)}
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                onClick={() => setResolveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="green"
                loading={submitting}
                onClick={handleResolve}
              >
                Resolve
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
