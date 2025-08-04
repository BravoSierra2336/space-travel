import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpaceTravelApi from '../services/SpaceTravelApi';
import styles from '../App.module.css';

function ConstructionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    description: '',
    pictureUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Spacecraft name is required';
    }

    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.pictureUrl && !isValidUrl(formData.pictureUrl)) {
      newErrors.pictureUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await SpaceTravelApi.buildSpacecraft({
        name: formData.name.trim(),
        capacity: parseInt(formData.capacity),
        description: formData.description.trim(),
        pictureUrl: formData.pictureUrl.trim() || undefined
      });

      if (response.isError) {
        throw new Error('Failed to build spacecraft');
      }

      alert(`Spacecraft "${formData.name}" has been successfully constructed!`);
      navigate('/spacecrafts');
    } catch (err) {
      alert('Error building spacecraft: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.backButton}>
        <Link to="/spacecrafts" className="btn btn-secondary">
          ← Back to Fleet
        </Link>
      </div>

      <div className={styles.pageHeader}>
        <h1>Spacecraft Construction</h1>
        <p>Design and build a new spacecraft for your fleet</p>
      </div>

      <div className={styles.constructionForm}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Spacecraft Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter spacecraft name..."
              maxLength={100}
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Passenger Capacity *</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="Enter passenger capacity..."
              min="1"
              max="1000000"
            />
            {errors.capacity && <div className="error">{errors.capacity}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your spacecraft's features, capabilities, and design..."
              rows="6"
              maxLength={2000}
            ></textarea>
            {errors.description && <div className="error">{errors.description}</div>}
            <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '5px' }}>
              {formData.description.length}/2000 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pictureUrl">Picture URL (Optional)</label>
            <input
              type="url"
              id="pictureUrl"
              name="pictureUrl"
              value={formData.pictureUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/spacecraft-image.jpg"
            />
            {errors.pictureUrl && <div className="error">{errors.pictureUrl}</div>}
          </div>

          <div className="flex gap-20 justify-center">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '🔧 Building...' : '🚀 Build Spacecraft'}
            </button>
            <Link to="/spacecrafts" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="text-center mt-20">
        <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Construction Guidelines</h3>
        <div style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.8 }}>
          <p style={{ marginBottom: '10px' }}>
            • All spacecraft are initially stationed on Earth
          </p>
          <p style={{ marginBottom: '10px' }}>
            • Capacity determines maximum passengers that can be transported
          </p>
          <p style={{ marginBottom: '10px' }}>
            • Detailed descriptions help with mission planning
          </p>
          <p>
            • Picture URLs should link to spacecraft images (optional)
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConstructionPage;
