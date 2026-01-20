
import { useState, useEffect } from 'react';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    try {
      const storedLeads = localStorage.getItem('leads');
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const addLead = (lead) => {
    try {
      const newLead = {
        ...lead,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedLeads = [...leads, newLead];
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
      setLeads(updatedLeads);
      return newLead;
    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    }
  };

  const deleteLead = (leadId) => {
    try {
      const updatedLeads = leads.filter(lead => lead.id !== leadId);
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
      setLeads(updatedLeads);
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  };

  const clearAllLeads = () => {
    try {
      localStorage.removeItem('leads');
      setLeads([]);
    } catch (error) {
      console.error('Error clearing leads:', error);
      throw error;
    }
  };

  return {
    leads,
    addLead,
    deleteLead,
    clearAllLeads,
    refreshLeads: loadLeads
  };
};
