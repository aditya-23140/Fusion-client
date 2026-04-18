/**
 * CreateComplaintModal Component
 * Modal form for filing a new complaint
 * Supports: category, title, description, priority, location (UC-006)
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Select,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { createComplaint } from "../api";

function CreateComplaintModal({
  opened,
  onClose,
  onSubmit,
  loading: externalLoading,
}) {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    priority: "medium",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.title || formData.title.length < 5)
      newErrors.title = "Title must be at least 5 characters";
    if (!formData.description || formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await createComplaint(formData);
      notifications.show({
        title: "Success",
        message: "Complaint submitted successfully",
        color: "green",
      });
      setFormData({
        category: "",
        title: "",
        description: "",
        priority: "medium",
        location: "",
      });
      setErrors({});
      onSubmit();
    } catch (err) {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to submit complaint",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const isLoading = submitting || externalLoading;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="File a Complaint"
      size="md"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Select
            label="Category"
            placeholder="Select complaint category"
            required
            data={[
              { value: "facility", label: "Facility / Maintenance" },
              { value: "food", label: "Food / Mess" },
              { value: "security", label: "Security" },
              { value: "ragging", label: "Ragging" },
              { value: "other", label: "Other" },
            ]}
            value={formData.category}
            onChange={(value) => handleChange("category", value)}
            error={errors.category}
          />
          <TextInput
            label="Title"
            placeholder="Brief title for your complaint"
            required
            value={formData.title}
            onChange={(e) => handleChange("title", e.currentTarget.value)}
            error={errors.title}
          />
          <Textarea
            label="Description"
            placeholder="Describe your complaint in detail"
            required
            minRows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.currentTarget.value)}
            error={errors.description}
          />
          <Select
            label="Priority"
            placeholder="Select priority level"
            data={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
            value={formData.priority}
            onChange={(value) => handleChange("priority", value)}
          />
          <TextInput
            label="Location"
            placeholder="e.g., Room 204, Block A"
            value={formData.location}
            onChange={(e) => handleChange("location", e.currentTarget.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Submit Complaint
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

CreateComplaintModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

CreateComplaintModal.defaultProps = {
  loading: false,
};

export default CreateComplaintModal;
