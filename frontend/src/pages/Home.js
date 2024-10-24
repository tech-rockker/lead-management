import React, { useEffect, useMemo, useState } from "react";
import { Button, Input } from "antd";
import LeadTable from "../components/Leads/allLeadsTable";
import AddLeadModal from "../components/Leads/AddLeadModal";
import UpdateLeadModal from "../components/Leads/UpdateLeadModal"; // Import your UpdateLeadModal component
import {
  createLead,
  fetchLeads,
  searchLeads,
  updateLead,
} from "../services/leadService";

const Home = ({ openNotificationWithIcon }) => {
  const [visible, setVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false); // Track the update modal visibility
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0); // To track total number of leads
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [pageSize, setPageSize] = useState(20); // Define the page size
  const [currentLead, setCurrentLead] = useState(null); // Track the lead to update

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setUpdateModalVisible(false); // Hide update modal
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async (page = 1, pageSize = 20) => {
    setLoading(true); // Show loading
    try {
      const response = await fetchLeads(page, pageSize);
      setLeads(response.data.data);
      setCurrentPage(page); // Update current page
    //   console.log("response >>>", response);
      setPageSize(pageSize); // Update current page size

      setTotal(response.data.total); // Set total number of items
    } catch (error) {
    //   console.error("Error loading leads:", error);
    } finally {
      setLoading(false); // Hide loading
    }
  };

  const handleCreate = async (newLead) => {
    setLoading(true);
    try {
      await createLead(newLead);
      loadLeads(currentPage); // Reload leads after creating a new one
      openNotificationWithIcon("success", "Lead Created successfully");

      setVisible(false); // Close the modal
    } catch (error) {
    //   console.error("Error creating lead:", error);

      openNotificationWithIcon("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (key) => {
    const newLeads = leads.filter((lead) => lead.id !== key);
    setLeads(newLeads);
    // console.log("key >>> ", key, leads);
  };

  // Show update modal and set the current lead to update
  const handleUpdate = (lead) => {
    setCurrentLead(lead);
    setUpdateModalVisible(true);
  };

  const handleUpdateSubmit = async (updatedLeadData) => {
    // console.log("handleUpdateSubmit", updatedLeadData);
    setLoading(true);
    try {
      // Make API call to update the lead and get the updated lead
      const response = await updateLead(currentLead.id, updatedLeadData);

      // Update the leads state with the updated lead from the response
      const updatedLead = response.data.lead; // Extract the updated lead from the response
      const updatedLeads = leads.map((lead) =>
        lead.id === currentLead.id ? updatedLead : lead
      );
    //   console.log("updatedLead >>", updatedLead, updatedLeads);

      setLeads(updatedLeads);

      // Hide the update modal
      setUpdateModalVisible(false);
      openNotificationWithIcon("success", "Lead Updated successfully");
    } catch (error) {
    //   console.error("Error updating lead:", error);
      openNotificationWithIcon("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = useMemo(
    () =>
      leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) // Consider email in the search
      ),
    [leads, searchTerm]
  );

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Search by name or email"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={showModal}>
          Add Lead
        </Button>
      </div>
      <LeadTable
        leads={filteredLeads}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={total}
        onPageChange={(page, pageSize) => loadLeads(page, pageSize)}
        openNotificationWithIcon={openNotificationWithIcon}
      />
      <AddLeadModal
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
      />

      {currentLead && (
        <UpdateLeadModal
          visible={updateModalVisible}
          onCancel={handleCancel}
          lead={currentLead}
          onUpdate={handleUpdateSubmit} // Handle update form submission
        />
      )}
    </div>
  );
};

export default Home;
