/**
 * CreateNoticeModal Component
 * Modal form for creating a new notice
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Button,
  Stack,
  Group,
  FileInput,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";

function CreateNoticeModal({ opened, onClose, onSubmit, loading, halls = [] }) {
  const [formData, setFormData] = useState({
    hall_id: "",
    head_line: "",
    description: "",
    content: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("hall_id", formData.hall_id);
    submitData.append("head_line", formData.head_line);
    submitData.append("description", formData.description);
    if (formData.content) {
      submitData.append("content", formData.content);
    }
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create Notice" size="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Select
            label="Hall"
            placeholder="Select hall"
            required
            data={halls.map((h) => ({
              value: String(h.id),
              label: h.hall_name,
            }))}
            value={formData.hall_id}
            onChange={(value) => handleChange("hall_id", value)}
          />
          <TextInput
            label="Headline"
            placeholder="Enter notice headline"
            required
            value={formData.head_line}
            onChange={(e) => handleChange("head_line", e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Enter notice description"
            minRows={3}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <FileInput
            label="Attachment"
            placeholder="Upload file"
            leftSection={<IconUpload size={16} />}
            value={formData.content}
            onChange={(file) => handleChange("content", file)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Notice
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

CreateNoticeModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  halls: PropTypes.arrayOf(PropTypes.shape({})),
};

export default CreateNoticeModal;
