import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { fetchStatuses, updateLead } from '../../services/leadService';

const { Option } = Select;

const UpdateLeadModal = (props) => {
    const { visible, onCancel, lead, onUpdate } = props
  const [form] = Form.useForm();
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    if (lead) {
      form.setFieldsValue({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        lead_status_id: lead.status?.id, // Pre-fill status
      });
    }
    fetchLeadStatuses();
  }, [lead]);

  const fetchLeadStatuses = async () => {
    try {
      const response = await fetchStatuses();
      setStatuses(response.data);
    } catch (error) {
    //   console.error('Error fetching statuses:', error);
    }
  };

  const handleUpdate = (values) => {
    
    // console.log("onSubmitUpdate prop:", props); // Log the function to check
        
    //   await updateLead(lead.id, values); // Sends lead_status_id with other data
    onUpdate(values);
    
  };

  return (
    <Modal
      visible={visible}
      title="Update Lead"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={() => form.submit()}>
          Update
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleUpdate} layout="vertical">
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
          name="lead_status_id"  // Field name changed to lead_status_id
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

export default UpdateLeadModal;
