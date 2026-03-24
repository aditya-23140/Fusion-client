/**
 * ImposeFineModal Component
 * Modal form for imposing a fine on a student
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Stack,
  Group,
} from "@mantine/core";

export default function ImposeFineModal({
  opened,
  onClose,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    student_id: "",
    student_name: "",
    reason: "",
    amount: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Impose Fine" size="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Student ID"
            placeholder="Enter student ID"
            required
            value={formData.student_id}
            onChange={(e) => handleChange("student_id", e.target.value)}
          />
          <TextInput
            label="Student Name"
            placeholder="Enter student name"
            required
            value={formData.student_name}
            onChange={(e) => handleChange("student_name", e.target.value)}
          />
          <Textarea
            label="Reason"
            placeholder="Enter reason for fine (e.g., Late Entry, Property Damage, Mess Dues)"
            required
            minRows={3}
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
          />
          <NumberInput
            label="Amount (₹)"
            placeholder="Enter fine amount"
            required
            min={0}
            value={formData.amount}
            onChange={(value) => handleChange("amount", value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Impose Fine
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

ImposeFineModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ImposeFineModal.defaultProps = {
  loading: false,
};
