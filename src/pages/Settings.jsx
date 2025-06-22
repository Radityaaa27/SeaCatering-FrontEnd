import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiCamera, FiSave } from 'react-icons/fi';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setValue('name', userData.name);
          setValue('email', userData.email);
          setPreviewImage(userData.profile_picture 
            ? `http://127.0.0.1:8000/storage/${userData.profile_picture}`
            : `https://ui-avatars.com/api/?name=${userData.name}&background=random`);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (data.password) formData.append('password', data.password);
      if (profilePicture) formData.append('profile_picture', profilePicture);

      const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setUser(prevUser => ({
            ...prevUser,
            name: data.name,
            email: data.email,
            profile_picture: result.profile_picture || prevUser.profile_picture
          }));
  
        // Simpan ke localStorage
        if (result.profile_picture) {
          localStorage.setItem('profilePicture', result.profile_picture);
        } else if (previewImage && previewImage.startsWith('blob:')) {
          // Jika gambar baru diupload tapi server tidak mengembalikan path
          // Kita bisa menyimpan previewImage sebagai base64 di localStorage
          const canvas = document.createElement('canvas');
          const img = document.createElement('img');
          img.src = previewImage;
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            localStorage.setItem('profilePicture', dataUrl);
          };
        }
        
        // Trigger update in Navbar
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        setMessage({ text: result.message || 'Error updating profile', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Profile Settings</h1>
      
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
        <div className="profile-picture-section">
          <div className="picture-container">
            <img 
              src={previewImage} 
              alt="Profile" 
              className="profile-picture"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
              }}
            />
            <label htmlFor="profile-upload" className="upload-button">
              <FiCamera className="icon" />
              <span>Change Photo</span>
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <FiUser className="icon" /> Name
          </label>
          <input
            id="name"
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <FiMail className="icon" /> Email
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            <FiLock className="icon" /> New Password (leave blank to keep current)
          </label>
          <input
            id="password"
            type="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            {...register('password', {
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Saving...' : (
            <>
              <FiSave className="icon" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}