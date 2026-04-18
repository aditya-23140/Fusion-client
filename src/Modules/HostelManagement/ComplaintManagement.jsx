/**
 * ComplaintManagement - Thin View
 * Manages hostel complaints (UC-006, UC-007, UC-008, UC-009)
 * Orchestrates components and handles state, calls api.js
 * Role-based visibility:
 * - Student: Submit complaints, view own complaints
 * - Caretaker: View all complaints, resolve, escalate
 * - Warden: View escalated complaints, resolve
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
  Tabs,
  Badge,
  Text,
  Select,
} from "@mantine/core";
import {
  IconPlus,
  IconAlertCircle,
  IconUser,
  IconList,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import ComplaintCard from "./components/ComplaintCard";
import CreateComplaintModal from "./components/CreateComplaintModal";
import {
  fetchComplaints,
  fetchMyComplaints,
  escalateComplaint,
  resolveComplaint,
} from "./api";

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState("");
  const [resolutionRemarks, setResolutionRemarks] = useState("");
  const [activeTab, setActiveTab] = useState("my");
  const [statusFilter, setStatusFilter] = useState(null);

  const userRole = useSelector((state) => state.user.role);
  const isStaff = userRole === "caretaker" || userRole === "warden";
  const isStudent = userRole === "student";

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const promises = [];

      // Students see their own complaints; staff see all
      if (isStudent) {
        promises.push(fetchMyComplaints());
        const [myData] = await Promise.all(promises);
        setMyComplaints(myData);
      } else {
        promises.push(
          fetchComplaints(),
          fetchMyComplaints().catch(() => []),
        );
        const [allData, myData] = await Promise.all(promises);
        setComplaints(allData);
        setMyComplaints(myData);
      }
    } catch (err) {
      setError("Failed to load complaints. Please try again.");
      console.error(err);
    }
  }, [isStudent]);

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
        message: "Complaint escalated to Warden successfully",
        color: "green",
      });
      setEscalateModalOpen(false);
      setEscalationReason("");
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.detail || "Failed to escalate complaint",
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
        message: "Please provide resolution remarks (minimum 10 characters)",
        color: "red",
      });
      return;
    }

    if (resolutionRemarks.trim().length < 10) {
      notifications.show({
        title: "Error",
        message: "Resolution remarks must be at least 10 characters",
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
        message: err.response?.data?.detail || "Failed to resolve complaint",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter complaints by status
  const getFilteredComplaints = (list) => {
    if (!statusFilter) return list;
    return list.filter((c) => c.status === statusFilter);
  };

  // Stats for header
  const activeCount = complaints.filter(
    (c) => c.status === "submitted" || c.status === "under_review",
  ).length;
  const escalatedCount = complaints.filter(
    (c) => c.status === "escalated",
  ).length;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Complaint Management</Title>
          {isStudent && (
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setModalOpen(true)}
            >
              New Complaint
            </Button>
          )}
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle />} color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Stats cards for staff */}
        {isStaff && (
          <Group grow>
            <Card withBorder p="lg">
              <Stack gap={4}>
                <Text size="sm" fw={500} c="dimmed">
                  Active Complaints
                </Text>
                <Text fw={700} size="xl" c="blue">
                  {activeCount}
                </Text>
              </Stack>
            </Card>
            <Card withBorder p="lg">
              <Stack gap={4}>
                <Text size="sm" fw={500} c="dimmed">
                  Escalated
                </Text>
                <Text fw={700} size="xl" c="orange">
                  {escalatedCount}
                </Text>
              </Stack>
            </Card>
            <Card withBorder p="lg">
              <Stack gap={4}>
                <Text size="sm" fw={500} c="dimmed">
                  Total
                </Text>
                <Text fw={700} size="xl">
                  {complaints.length}
                </Text>
              </Stack>
            </Card>
          </Group>
        )}

        {/* Status filter */}
        {isStaff && (
          <Select
            placeholder="Filter by status"
            clearable
            data={[
              { value: "submitted", label: "Submitted" },
              { value: "under_review", label: "Under Review" },
              { value: "escalated", label: "Escalated" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "Closed" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ maxWidth: 250 }}
          />
        )}

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List mb="md">
            <Tabs.Tab
              value="my"
              leftSection={<IconUser size={14} />}
              rightSection={<Badge size="sm">{myComplaints.length}</Badge>}
            >
              {isStudent ? "My Complaints" : "My Complaints"}
            </Tabs.Tab>
            {isStaff && (
              <Tabs.Tab
                value="all"
                leftSection={<IconList size={14} />}
                rightSection={<Badge size="sm">{complaints.length}</Badge>}
              >
                All Complaints
              </Tabs.Tab>
            )}
            {userRole === "warden" && (
              <Tabs.Tab
                value="escalated"
                leftSection={<IconAlertTriangle size={14} />}
                rightSection={
                  <Badge size="sm" color="orange">
                    {escalatedCount}
                  </Badge>
                }
              >
                Escalated
              </Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="my">
            <Stack gap="md">
              {myComplaints.length === 0 ? (
                <Card withBorder p="xl">
                  <Text c="dimmed" ta="center">
                    {isStudent
                      ? "You haven't filed any complaints yet."
                      : "No complaints assigned to you."}
                  </Text>
                </Card>
              ) : (
                getFilteredComplaints(myComplaints).map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onView={() => setSelectedComplaint(complaint)}
                    showActions={false}
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>

          {isStaff && (
            <Tabs.Panel value="all">
              <Stack gap="md">
                {getFilteredComplaints(complaints).length === 0 ? (
                  <Card withBorder p="xl">
                    <Text c="dimmed" ta="center">
                      No complaints found.
                    </Text>
                  </Card>
                ) : (
                  getFilteredComplaints(complaints).map((complaint) => (
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
                      canEscalate={
                        userRole === "caretaker" &&
                        (complaint.status === "submitted" ||
                          complaint.status === "under_review")
                      }
                      canResolve={
                        isStaff &&
                        complaint.status !== "resolved" &&
                        complaint.status !== "closed"
                      }
                      showActions
                    />
                  ))
                )}
              </Stack>
            </Tabs.Panel>
          )}

          {userRole === "warden" && (
            <Tabs.Panel value="escalated">
              <Stack gap="md">
                {complaints.filter((c) => c.status === "escalated").length ===
                0 ? (
                  <Card withBorder p="xl">
                    <Text c="dimmed" ta="center">
                      No escalated complaints.
                    </Text>
                  </Card>
                ) : (
                  complaints
                    .filter((c) => c.status === "escalated")
                    .map((complaint) => (
                      <ComplaintCard
                        key={complaint.id}
                        complaint={complaint}
                        onView={() => setSelectedComplaint(complaint)}
                        onResolve={() => {
                          setSelectedComplaint(complaint);
                          setResolveModalOpen(true);
                        }}
                        canResolve
                        showActions
                      />
                    ))
                )}
              </Stack>
            </Tabs.Panel>
          )}
        </Tabs>

        <CreateComplaintModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={() => {
            setModalOpen(false);
            loadData();
          }}
          loading={submitting}
        />

        {/* Escalate Modal */}
        <Modal
          opened={escalateModalOpen}
          onClose={() => setEscalateModalOpen(false)}
          title="Escalate Complaint to Warden"
          centered
        >
          <Stack gap="md">
            {selectedComplaint && (
              <Alert color="blue" variant="light">
                <Text size="sm" fw={500}>
                  Complaint #{selectedComplaint.id}: {selectedComplaint.title}
                </Text>
              </Alert>
            )}
            <Textarea
              label="Escalation Reason"
              placeholder="Why is this complaint being escalated to the Warden?"
              required
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
                Escalate to Warden
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Resolve Modal */}
        <Modal
          opened={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          title="Resolve Complaint"
          centered
        >
          <Stack gap="md">
            {selectedComplaint && (
              <Alert color="green" variant="light">
                <Text size="sm" fw={500}>
                  Complaint #{selectedComplaint.id}: {selectedComplaint.title}
                </Text>
              </Alert>
            )}
            <Textarea
              label="Resolution Remarks"
              placeholder="How was this complaint resolved? (min 10 characters)"
              required
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
                Mark Resolved
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
