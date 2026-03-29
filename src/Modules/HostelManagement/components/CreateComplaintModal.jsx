/**
 * CreateComplaintModal Component
 * Modal form for filing a new complaint
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Select, Textarea, Button, Stack, Group } from "@mantine/core";

function CreateComplaintModal({ opened, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    complaint_type: "",
    description: "",
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
          <Select
            label="Complaint Type"
            placeholder="Select type"
            required
            data={[
              { value: "Ragging", label: "Ragging" },
              { value: "Maintenance", label: "Maintenance" },
              { value: "Mess", label: "Mess" },
              { value: "Other", label: "Other" },
            ]}
            value={formData.complaint_type}
            onChange={(value) => handleChange("complaint_type", value)}
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
  loading: PropTypes.bool.isRequired,
};

export default CreateComplaintModal;
