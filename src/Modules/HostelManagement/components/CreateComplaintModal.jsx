/**
 * CreateComplaintModal Component
 * Modal form for filing a new complaint
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, TextInput, Textarea, Button, Stack, Group } from "@mantine/core";

export default function CreateComplaintModal({
  opened,
  onClose,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    description: "",
    contact_number: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal opened={opened} onClose={onClose} title="File a Complaint" size="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Contact Number"
            placeholder="Enter your contact number"
            required
            value={formData.contact_number}
            onChange={(e) => handleChange("contact_number", e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Describe your complaint in detail"
            required
            minRows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
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
