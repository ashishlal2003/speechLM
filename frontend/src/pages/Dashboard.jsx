import React, { useState, useEffect } from 'react';
import {
  Plus,
  Bot,
  Search,
  ShoppingCart,
  Edit3,
  Trash2,
  X,
  Sparkles,
  Brain,
} from 'lucide-react';
import CreateAgentPopup from '../components/dashboard/CreateAgentPopup';
import DeleteConfirmationPopup from '../components/dashboard/DeleteConfirmationPopup';
import { agentService } from '../services/agentService';

const Dashboard = () => {
  const handleNavigate = (type) => {
    console.log('Navigate to agent', type);
  };

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [deleteAgent, setDeleteAgent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'general'
  });

  const categories = [
    {
      id: 'general',
      name: 'General',
      icon: Bot,
      color: 'from-blue-500 to-purple-600',
      description: 'All-purpose AI assistant for everyday tasks'
    },
    {
      id: 'research',
      name: 'Research',
      icon: Brain,
      color: 'from-green-500 to-teal-600',
      description: 'Specialized in research and analysis'
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: ShoppingCart,
      color: 'from-orange-500 to-red-600',
      description: 'Your personal shopping assistant'
    }
  ];

  const filterTabs = [
    { id: 'all', name: 'All', icon: Sparkles },
    ...categories
  ];

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await agentService.getAgents();
      setAgents(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Failed to load agents. Please try again.');
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search agents
  const filteredAgents = agents.filter(agent => {
    const matchesFilter = activeFilter === 'all' ||
      (agent.category || agent.agent_type) === activeFilter;
    const matchesSearch = (agent.name || agent.agent_name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Bot;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'from-gray-500 to-gray-600';
  };

  const handleCategorySelect = (category) => {
    setFormData({ name: '', category: category.id });
    setIsEditing(false);
    setSelectedAgent(null);
    setShowCreatePopup(true);
  };

  const handleAddNewAgent = () => {
    setFormData({ name: '', category: 'general' });
    setIsEditing(false);
    setSelectedAgent(null);
    setShowCreatePopup(true);
  };

  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name || agent.agent_name,
      category: agent.category || agent.agent_type
    });
    setIsEditing(true);
    setShowCreatePopup(true);
  };

  const handleDeleteAgent = (agent) => {
    setDeleteAgent(agent);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!deleteAgent) return;

    try {
      setApiLoading(true);
      await agentService.deleteAgent(deleteAgent.id || deleteAgent._id);
      await fetchAgents();
      setShowDeletePopup(false);
      setDeleteAgent(null);
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError('Failed to delete agent. Please try again.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleSubmitAgent = async () => {
    if (!formData.name.trim()) return;

    try {
      setApiLoading(true);
      setError(null);

      if (isEditing && selectedAgent) {
        // Update existing agent
        await agentService.updateAgent(selectedAgent.id || selectedAgent._id, formData);
      } else {
        // Create new agent
        await agentService.createAgent(formData);
      }

      await fetchAgents();
      setShowCreatePopup(false);
      setFormData({ name: '', category: 'general' });
      setSelectedAgent(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving agent:', error);
      setError(isEditing ? 'Failed to update agent. Please try again.' : 'Failed to create agent. Please try again.');
    } finally {
      setApiLoading(false);
    }
  };

  const closeCreatePopup = () => {
    setShowCreatePopup(false);
    setFormData({ name: '', category: 'general' });
    setSelectedAgent(null);
    setIsEditing(false);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setDeleteAgent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 mt-16">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Personalized AI Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create and manage your AI agents to streamline your workflow
          </p>
        </div>
      </div>

      {/* Sticky Filter Section */}
      {agents.length > 0 && (
        <div className="sticky top-16 z-20 backdrop-blur-md border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {filterTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Search and Add New Agent */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your agents by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                />
              </div>
              <button
                onClick={handleAddNewAgent}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Add New Agent
              </button>
            </div>
            {/* Results Summary */}
            <div className="my-4">
              <p className="text-gray-600">
                {filteredAgents.length === agents.length
                  ? `Showing all ${agents.length} agents`
                  : `Showing ${filteredAgents.length} of ${agents.length} agents`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-7xl">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your agents...</p>
            </div>
          </div>
        )}

        {/* No Agents - Category Selection */}
        {!loading && agents.length === 0 && (
          <div className="py-12">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
              Choose a category to create your first agent
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 mx-auto`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-center text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Agents Grid - Scrollable */}
        {!loading && agents.length > 0 && (
          <div className="py-8">
            {/* No Results */}
            {filteredAgents.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No agents found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? `No agents match "${searchTerm}"`
                    : `No agents in the ${activeFilter} category`
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Agents Grid */}
            {filteredAgents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {filteredAgents.map((agent) => {
                  const IconComponent = getCategoryIcon(agent.category || agent.agent_type);
                  const colorClass = getCategoryColor(agent.category || agent.agent_type);

                  return (
                    <div
                      key={agent.id || agent._id}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAgent(agent)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit agent"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete agent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {agent.name || agent.agent_name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize mb-4">
                        {agent.category || agent.agent_type}
                      </p>

                      <button
                        onClick={handleNavigate(agent.category || agent.agent_type)}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                      >
                        Open Agent
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Agent Popup */}
      <CreateAgentPopup
        isOpen={showCreatePopup}
        isEditing={isEditing}
        formData={formData}
        categories={categories}
        onClose={closeCreatePopup}
        onSubmit={handleSubmitAgent}
        onChange={setFormData}
        loading={apiLoading}
      />

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        isOpen={showDeletePopup}
        onClose={closeDeletePopup}
        onConfirm={confirmDelete}
        loading={apiLoading}
        agentName={deleteAgent?.name || deleteAgent?.agent_name || 'this agent'}
      />
    </div>
  );
};

export default Dashboard;