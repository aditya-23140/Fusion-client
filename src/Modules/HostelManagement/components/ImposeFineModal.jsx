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
  Select,
  Button,
  Stack,
  Group,
} from "@mantine/core";

function ImposeFineModal({ opened, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    student_id: "",
    fine_type: "",
    amount: 0,
    reason: "",
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
          <Select
            label="Fine Type"
            placeholder="Select fine type"
            required
            data={[
              { value: "Late Entry", label: "Late Entry" },
              { value: "Property Damage", label: "Property Damage" },
              { value: "Mess Dues", label: "Mess Dues" },
              { value: "Discipline", label: "Discipline" },
              { value: "Other", label: "Other" },
            ]}
            value={formData.fine_type}
            onChange={(value) => handleChange("fine_type", value)}
          />
          <NumberInput
            label="Amount (â‚¹)"
            placeholder="Enter fine amount"
            required
            min={0}
            value={formData.amount}
            onChange={(value) => handleChange("amount", value)}
          />
          <Textarea
            label="Reason"
            placeholder="Enter reason for fine"
            required
            minRows={3}
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
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
  loading: PropTypes.bool.isRequired,
};

export default ImposeFineModal;
