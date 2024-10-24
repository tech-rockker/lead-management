import React from "react";
import { Table, Space, Tooltip, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteLead } from "../../services/leadService";

const { confirm } = Modal;

const allLeadsTable = ({
  leads,
  onDelete,
  onUpdate,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange,
  openNotificationWithIcon,
}) => {
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this lead?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteLead(id);
          message.success("Lead deleted successfully");
          onDelete(id); // Call the function to update the UI after deletion
        } catch (error) {
          openNotificationWithIcon("error", error.response.data.message);

        }
      },
      onCancel() {
        // console.log("Cancel deletion");
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone", // New column for phone number
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <span>{status.name}</span>, // Display status name
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Update">
            <EditOutlined
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => onUpdate(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => showDeleteConfirm(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
// console.log('total', total)
  return (
    <Table
      columns={columns}
      dataSource={leads}
      rowKey="id"
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
      }}
      loading={loading}
    />
  );
};

export default allLeadsTable;
