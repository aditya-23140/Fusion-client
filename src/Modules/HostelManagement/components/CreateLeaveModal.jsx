/**
 * CreateLeaveModal Component (UC-001)
 * Modal form for creating a new leave request
 * Supports: dates, reason, address, phone, file upload for supporting docs
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Grid,
  FileInput,
  Text,
  Alert,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconUpload, IconInfoCircle } from "@tabler/icons-react";

function CreateLeaveModal({ opened, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    start_date: null,
    end_date: null,
    reason: "",
    address_during_leave: "",
    phone: "",
  });
  const [supportDoc, setSupportDoc] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";
    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date < formData.start_date
    ) {
      newErrors.end_date = "End date must be after start date";
    }
    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }
    if (
      !formData.address_during_leave ||
      formData.address_during_leave.trim().length < 5
    ) {
      newErrors.address_during_leave = "Address is required";
    }
    if (!formData.phone) newErrors.phone = "Contact phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      start_date: formData.start_date?.toISOString().split("T")[0],
      end_date: formData.end_date?.toISOString().split("T")[0],
    };

    // If file upload is present, use FormData
    if (supportDoc) {
      const fd = new FormData();
      Object.entries(submitData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) fd.append(key, value);
      });
      fd.append("supporting_document", supportDoc);
      onSubmit(fd);
    } else {
      onSubmit(submitData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleClose = () => {
    setFormData({
      start_date: null,
      end_date: null,
      reason: "",
      address_during_leave: "",
      phone: "",
    });
    setSupportDoc(null);
    setErrors({});
    onClose();
  };

  // Calculate duration
  const duration =
    formData.start_date && formData.end_date
      ? Math.ceil(
          (formData.end_date - formData.start_date) / (1000 * 60 * 60 * 24),
        ) + 1
      : null;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Apply for Leave"
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <DateInput
                label="Start Date"
                placeholder="Select start date"
                required
                minDate={new Date()}
                value={formData.start_date}
                onChange={(value) => handleChange("start_date", value)}
                error={errors.start_date}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateInput
                label="End Date"
                placeholder="Select end date"
                required
                minDate={formData.start_date || new Date()}
                value={formData.end_date}
                onChange={(value) => handleChange("end_date", value)}
                error={errors.end_date}
              />
            </Grid.Col>
          </Grid>

          {duration && duration > 0 && (
            <Alert
              color="blue"
              variant="light"
              icon={<IconInfoCircle size={16} />}
            >
              <Text size="sm">
                Leave duration: <strong>{duration} day(s)</strong>
              </Text>
            </Alert>
          )}

          <Textarea
            label="Reason"
            placeholder="Enter detailed reason for leave"
            required
            minRows={3}
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.currentTarget.value)}
            error={errors.reason}
          />
          <Textarea
            label="Address During Leave"
            placeholder="Enter address where you'll be staying"
            required
            value={formData.address_during_leave}
            onChange={(e) =>
              handleChange("address_during_leave", e.currentTarget.value)
            }
            error={errors.address_during_leave}
          />
          <TextInput
            label="Contact Phone"
            placeholder="Enter contact number"
            required
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.currentTarget.value)}
            error={errors.phone}
          />
          <FileInput
            label="Supporting Document"
            description="Upload medical certificate or parental consent (optional)"
            placeholder="Click to upload"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            leftSection={<IconUpload size={16} />}
            value={supportDoc}
            onChange={setSupportDoc}
            clearable
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit Leave Request
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

CreateLeaveModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default CreateLeaveModal;
