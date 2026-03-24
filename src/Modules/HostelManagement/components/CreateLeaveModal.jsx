/**
 * CreateLeaveModal Component
 * Modal form for creating a new leave request
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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

export default function CreateLeaveModal({
  opened,
  onClose,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    start_date: null,
    end_date: null,
    reason: "",
    phone_number: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      start_date: formData.start_date?.toISOString().split("T")[0],
      end_date: formData.end_date?.toISOString().split("T")[0],
    };
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Apply for Leave" size="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <DateInput
                label="Start Date"
                placeholder="Select start date"
                required
                value={formData.start_date}
                onChange={(value) => handleChange("start_date", value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateInput
                label="End Date"
                placeholder="Select end date"
                required
                value={formData.end_date}
                onChange={(value) => handleChange("end_date", value)}
              />
            </Grid.Col>
          </Grid>
          <Textarea
            label="Reason"
            placeholder="Enter reason for leave"
            required
            minRows={3}
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
          />
          <TextInput
            label="Contact Phone"
            placeholder="Enter contact number"
            required
            value={formData.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
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
  loading: PropTypes.bool,
};
