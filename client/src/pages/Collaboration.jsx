import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  ShareIcon, 
  UserGroupIcon, 
  EnvelopeIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  UserPlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const Collaboration = () => {
  const [activeTab, setActiveTab] = useState('sharing');
  const [sharedItems, setSharedItems] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  
  const { files } = useSelector(state => state.files);
  const { user } = useSelector(state => state.auth);
  const { showToast } = useToast();

  // Load shared items and teams on component mount
  useEffect(() => {
    loadSharedItems();
    loadTeams();
  }, []);

  const loadSharedItems = async () => {
    try {
      const response = await api.get('/api/collaboration/shared-items');
      setSharedItems(response.data || []);
    } catch (error) {
      console.error('Failed to load shared items:', error);
    }
  };

  const loadTeams = async () => {
    try {
      const response = await api.get('/api/collaboration/teams');
      setTeams(response.data || []);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  };

  // Share file or chart
  const shareItem = async () => {
    if (!selectedFile || !shareEmail) {
      showToast('Please select a file and enter an email address', 'error');
      return;
    }

    setIsSharing(true);
    try {
      const response = await api.post('/api/collaboration/share', {
        itemId: selectedFile.fileName,
        itemType: 'file',
        recipientEmail: shareEmail,
        message: shareMessage,
        permissions: 'view' // Can be 'view', 'edit', 'admin'
      });

      showToast('Item shared successfully!', 'success');
      setShareEmail('');
      setShareMessage('');
      setSelectedFile(null);
      setShowShareModal(false);
      loadSharedItems(); // Refresh the list
    } catch (error) {
      showToast('Failed to share item', 'error');
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Create team workspace
  const createTeam = async () => {
    if (!newTeamName.trim()) {
      showToast('Please enter a team name', 'error');
      return;
    }

    try {
      const response = await api.post('/api/collaboration/teams', {
        name: newTeamName,
        description: newTeamDescription,
        members: [user?.email]
      });

      showToast('Team created successfully!', 'success');
      setNewTeamName('');
      setNewTeamDescription('');
      setShowTeamModal(false);
      loadTeams(); // Refresh the list
    } catch (error) {
      showToast('Failed to create team', 'error');
      console.error('Team creation error:', error);
    }
  };

  // Invite user to team
  const inviteToTeam = async (teamId) => {
    if (!inviteEmail.trim()) {
      showToast('Please enter an email address', 'error');
      return;
    }

    try {
      await api.post(`/api/collaboration/teams/${teamId}/invite`, {
        email: inviteEmail
      });

      showToast('Invitation sent successfully!', 'success');
      setInviteEmail('');
    } catch (error) {
      showToast('Failed to send invitation', 'error');
      console.error('Invite error:', error);
    }
  };

  // Generate shareable link
  const generateShareLink = async (itemId) => {
    try {
      const response = await api.post('/api/collaboration/generate-link', {
        itemId,
        itemType: 'file'
      });

      const link = response.data.link;
      navigator.clipboard.writeText(link);
      showToast('Shareable link copied to clipboard!', 'success');
    } catch (error) {
      showToast('Failed to generate shareable link', 'error');
      console.error('Link generation error:', error);
    }
  };

  // Revoke access
  const revokeAccess = async (shareId) => {
    try {
      await api.delete(`/api/collaboration/shared-items/${shareId}`);
      showToast('Access revoked successfully!', 'success');
      loadSharedItems(); // Refresh the list
    } catch (error) {
      showToast('Failed to revoke access', 'error');
      console.error('Revoke error:', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Collaboration & Sharing</h1>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('sharing')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sharing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShareIcon className="h-5 w-5 inline mr-2" />
              File & Chart Sharing
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'teams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className="h-5 w-5 inline mr-2" />
              Team Workspaces
            </button>
          </nav>
        </div>
      </div>

      {/* File & Chart Sharing Tab */}
      {activeTab === 'sharing' && (
        <div className="space-y-6">
          {/* Share New Item */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Share Files & Charts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select File/Chart</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={selectedFile?.fileName || ''}
                  onChange={(e) => {
                    const file = files.find(f => f.fileName === e.target.value);
                    setSelectedFile(file);
                  }}
                >
                  <option value="">Choose a file to share</option>
                  {files.map(file => (
                    <option key={file.fileName} value={file.fileName}>
                      {file.originalName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Email</label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter email address"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Message (Optional)</label>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                rows="3"
                placeholder="Add a personal message..."
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                disabled={!selectedFile || !shareEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Share Item
              </button>
              
              {selectedFile && (
                <button
                  onClick={() => generateShareLink(selectedFile.fileName)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Generate Link
                </button>
              )}
            </div>
          </div>

          {/* Shared Items List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shared Items</h2>
            
            {sharedItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No shared items yet</p>
            ) : (
              <div className="space-y-4">
                {sharedItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.itemName}</h3>
                      <p className="text-sm text-gray-600">
                        Shared with: {item.recipientEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        Shared on: {new Date(item.sharedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => generateShareLink(item.itemId)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Copy link"
                      >
                        <LinkIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => revokeAccess(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Revoke access"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Workspaces Tab */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          {/* Create New Team */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Team Workspaces</h2>
              <button
                onClick={() => setShowTeamModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Team
              </button>
            </div>
            
            {teams.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No teams created yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <div key={team.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{team.name}</h3>
                      <button
                        onClick={() => inviteToTeam(team.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Invite member"
                      >
                        <UserPlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{team.description}</p>
                    <div className="text-xs text-gray-500">
                      {team.memberCount || 0} members
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Email</label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2"
                  rows="3"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Add a personal message..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option value="view">View only</option>
                  <option value="edit">Can edit</option>
                  <option value="admin">Full access</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={shareItem}
                disabled={isSharing}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSharing ? 'Sharing...' : 'Share'}
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Team Name</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2"
                  rows="3"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Describe your team's purpose..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={createTeam}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Team
              </button>
              <button
                onClick={() => setShowTeamModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaboration; 