import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { fetchStatuses } from '../../services/leadService';

const { Option } = Select;

const AddLeadModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetchLeadStatuses(); // Fetch statuses when the modal is opened
  }, []);

  const fetchLeadStatuses = async () => {
    try {
      const response = await fetchStatuses();
      setStatuses(response.data);
    } catch (error) {
    }
  };

  const handleCreate = (values) => {
    onCreate(values); // Call the onCreate function from props to handle the creation
  };

  return (
    <Modal
      visible={visible}
      title="Add Lead"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Add Lead
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleCreate} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter the email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter the phone number' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lead_status_id"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select placeholder="Select status">
            {statuses.map((status) => (
              <Option key={status.id} value={status.id}>
                {status.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLeadModal;
