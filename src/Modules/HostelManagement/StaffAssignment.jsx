/**
 * StaffAssignment - Super Admin Feature
 * Assign wardens and caretakers to halls
 * Input: User email, Hall, Role (Warden/Caretaker)
 */

import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Title,
  Button,
  Group,
  Stack,
  Alert,
  Select,
  Table,
  Badge,
  ActionIcon,
  Tooltip,
  Modal,
  Loader,
  Center,
} from "@mantine/core";
import { IconPlus, IconAlertCircle, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import axios from "axios";
import { fetchFacultyList, fetchStaffList } from "./api";

const API_BASE_URL = "http://127.0.0.1:8000/api/hostel";

export default function StaffAssignment() {
  const [halls, setHalls] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const form = useForm({
    initialValues: {
      staffId: "", // Will be like "faculty_<id>" or "staff_<id>"
      hall_id: "",
      role: "", // "warden" or "caretaker"
    },
    validate: {
      staffId: (value) => (value ? null : "Staff member is required"),
      hall_id: (value) => (value ? null : "Hall is required"),
      role: (value) => (value ? null : "Role is required"),
    },
  });
  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      // Fetch halls
      const hallsResponse = await axios.get(`${API_BASE_URL}/halls/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const hallsData = Array.isArray(hallsResponse.data)
        ? hallsResponse.data
        : hallsResponse.data.results || [];
      setHalls(
        hallsData.map((h) => ({
          value: h.id.toString(),
          label: h.hall_name || `Hall ${h.hall_id}`,
        })),
      ); // Fetch faculty list
      try {
        const facultyResponse = await fetchFacultyList();
        const facultyData = Array.isArray(facultyResponse)
          ? facultyResponse
          : facultyResponse.results || [];
        setFaculty(
          facultyData.map((f) => ({
            value: `faculty_${f.id}`,
            label: `${f.first_name} ${f.last_name} (${f.email})`,
            email: f.email,
          })),
        );
      } catch (err) {
        console.warn("Could not fetch faculty list:", err);
        setFaculty([]);
      }

      // Fetch staff list
      try {
        const staffResponse = await fetchStaffList();
        const staffData = Array.isArray(staffResponse)
          ? staffResponse
          : staffResponse.results || [];
        setStaff(
          staffData.map((s) => ({
            value: `staff_${s.id}`,
            label: `${s.first_name} ${s.last_name} (${s.email})`,
            email: s.email,
          })),
        );
      } catch (err) {
        console.warn("Could not fetch staff list:", err);
        setStaff([]);
      }

      // Fetch current assignments
      const assignmentsResponse = await axios.get(
        `${API_BASE_URL}/admin/assignments/`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      setAssignments(
        Array.isArray(assignmentsResponse.data)
          ? assignmentsResponse.data
          : assignmentsResponse.data.results || [],
      );
    } catch (err) {
      console.error("Failed to load data:", err);
      notifications.show({
        title: "Error",
        message: "Failed to load halls and assignments",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
  // Fetch halls and assignments on mount
  useEffect(() => {
    loadData();
  }, []);
  const handleAssignStaff = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");

      // Get email from the selected staff/faculty
      let selectedEmail = "";
      if (values.role === "warden") {
        const selectedFaculty = faculty.find((f) => f.value === values.staffId);
        selectedEmail = selectedFaculty?.email;
      } else {
        const selectedStaffMember = staff.find(
          (s) => s.value === values.staffId,
        );
        selectedEmail = selectedStaffMember?.email;
      }

      if (!selectedEmail) {
        notifications.show({
          title: "Error",
          message: "Could not find email for selected staff member",
          color: "red",
        });
        return;
      }

      const endpoint =
        values.role === "warden"
          ? `${API_BASE_URL}/admin/assign-warden/`
          : `${API_BASE_URL}/admin/assign-caretaker/`;

      await axios.post(
        endpoint,
        {
          email: selectedEmail,
          hall_id: parseInt(values.hall_id, 10),
        },
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      notifications.show({
        title: "Success",
        message: `${values.role === "warden" ? "Warden" : "Caretaker"} assigned successfully`,
        color: "green",
      });

      form.reset();
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Failed to assign staff",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAssignment = async () => {
    if (!selectedAssignment) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");

      await axios.delete(
        `${API_BASE_URL}/admin/assignments/${selectedAssignment.id}/`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      notifications.show({
        title: "Success",
        message: "Assignment removed",
        color: "green",
      });

      setDeleteModalOpen(false);
      setSelectedAssignment(null);
      loadData();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to remove assignment",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <div>
          <Title order={2}>Staff Assignment</Title>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>
            Assign Wardens and Caretakers to Halls
          </p>
        </div>

        <Alert icon={<IconAlertCircle />} color="blue" title="About Assignment">
          Assign users as Wardens or Caretakers to specific halls. They will
          gain the corresponding role in addition to their existing roles.
          Wardens handle approvals and complaints, while Caretakers manage daily
          operations.
        </Alert>

        {/* Assignment Form */}
        <Card withBorder p="lg">
          <Stack gap="md">
            <Title order={4}>Assign New Staff</Title>{" "}
            <form onSubmit={form.onSubmit(handleAssignStaff)}>
              <Stack gap="md">
                <Select
                  label="Role"
                  placeholder="Select role"
                  data={[
                    { value: "warden", label: "Warden" },
                    { value: "caretaker", label: "Caretaker" },
                  ]}
                  value={form.values.role}
                  onChange={(value) => form.setFieldValue("role", value || "")}
                  error={form.errors.role}
                  required
                />

                <Select
                  label="Staff Member"
                  placeholder="Search and select staff"
                  data={form.values.role === "warden" ? faculty : staff}
                  value={form.values.staffId}
                  onChange={(value) =>
                    form.setFieldValue("staffId", value || "")
                  }
                  error={form.errors.staffId}
                  required
                  searchable
                  clearable
                  disabled={!form.values.role}
                />

                <Select
                  label="Hall"
                  placeholder="Select a hall"
                  data={halls}
                  value={form.values.hall_id}
                  onChange={(value) =>
                    form.setFieldValue("hall_id", value || "")
                  }
                  error={form.errors.hall_id}
                  required
                  searchable
                />

                <Group justify="flex-end">
                  <Button
                    type="submit"
                    loading={submitting}
                    leftSection={<IconPlus size={16} />}
                  >
                    Assign Staff
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Card>

        {/* Current Assignments */}
        <Card withBorder p="lg">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={4}>Current Assignments</Title>
              <Badge>{assignments.length}</Badge>
            </Group>

            {assignments.length === 0 ? (
              <Alert icon={<IconAlertCircle />} color="yellow">
                No staff assignments yet.
              </Alert>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Hall</Table.Th>
                      <Table.Th>Role</Table.Th>
                      <Table.Th>Assigned Date</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {assignments.map((assignment) => (
                      <Table.Tr key={assignment.id}>
                        <Table.Td>{assignment.staff_name}</Table.Td>
                        <Table.Td>{assignment.email}</Table.Td>
                        <Table.Td>{assignment.hall_name}</Table.Td>
                        <Table.Td>
                          <Badge
                            color={
                              assignment.role === "warden" ? "blue" : "purple"
                            }
                          >
                            {assignment.role}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {new Date(
                            assignment.assigned_date,
                          ).toLocaleDateString()}
                        </Table.Td>
                        <Table.Td>
                          <Tooltip label="Remove assignment">
                            <ActionIcon
                              color="red"
                              variant="light"
                              size="sm"
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </Stack>
        </Card>
      </Stack>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedAssignment(null);
        }}
        title="Remove Assignment"
        centered
      >
        <Stack gap="md">
          <p>
            Are you sure you want to remove this assignment?{" "}
            {selectedAssignment?.staff_name} will no longer be{" "}
            {selectedAssignment?.role} of {selectedAssignment?.hall_name}.
          </p>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedAssignment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              loading={submitting}
              onClick={handleRemoveAssignment}
            >
              Remove
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
