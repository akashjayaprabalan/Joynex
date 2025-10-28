import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Input, Button } from '@components/ui';
import { createGroup } from '@services/groupService';

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    timeSlot: '',
    description: '',
    location: '',
    locationLink: '',
    maxMembers: '',
    contactMethod: '',
    contactInfo: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const groupTypes = ['Poker', 'Sports', 'Study', 'Party', 'Gaming', 'Other'];
  const contactMethods = ['Instagram', 'WhatsApp', 'WeChat', 'Phone'];

  const validateForm = () => {
    if (!formData.name.trim()) return 'Group name is required';
    if (!formData.type) return 'Please select a group type';
    if (!formData.date) return 'Date is required';
    if (!formData.timeSlot) return 'Time is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.locationLink.trim()) return 'Google Maps link is required';
    if (!formData.locationLink.includes('maps.google.com')) {
      return 'Please provide a valid Google Maps link';
    }
    if (!formData.maxMembers || formData.maxMembers < 2) {
      return 'Group must have at least 2 members';
    }
    if (!formData.contactMethod) return 'Please select a contact method';
    if (!formData.contactInfo.trim()) return 'Contact info is required';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { error } = await createGroup(formData);
      if (error) throw error;

      // Redirect to My Groups page
      navigate('/my-groups');
    } catch (error) {
      console.error('Error creating group:', error);
      setError(error.message || 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-8">
      <Card className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Create a New Group</h1>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Group Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Type
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={loading}
                required
              >
                <option value="">Select Type</option>
                {groupTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <Input
              label="Maximum Members"
              type="number"
              min="2"
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              disabled={loading}
              required
            />

            <Input
              label="Time"
              type="time"
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., South Lawn, University of Melbourne"
            disabled={loading}
            required
          />

          <Input
            label="Google Maps Link"
            type="url"
            value={formData.locationLink}
            onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })}
            placeholder="https://maps.google.com/..."
            disabled={loading}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Method
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contactMethod}
                onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                disabled={loading}
                required
              >
                <option value="">Select Method</option>
                {contactMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <Input
              label="Contact Info"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              placeholder="Your username or number"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your group and any important details..."
              disabled={loading}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={loading}
              disabled={loading}
            >
              Create Group
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
};

export default Create;
