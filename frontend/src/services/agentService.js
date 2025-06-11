const API_BASE_URL ='http://localhost:8000';
// Real API service
export const agentService = {
  getAgents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token
        }

      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  },

  createAgent: async (agentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          agent_name: agentData.name,
          agent_type: agentData.category
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  },

  updateAgent: async (agentId, agentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          agent_id: agentId,
          agent_name: agentData.name,
          agent_type: agentData.category
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  },

  deleteAgent: async (agentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          agent_id: agentId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  }
};
