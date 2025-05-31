import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { PencilIcon, TrashIcon, ArrowLeftOnRectangleIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

function Dashboard() {
  const { user, logout } = useUser();
  const [userData, setUserData] = useState({
    fullname: user.name || '',
    email: user.email || '',
    phone: '',
    bio: '',
    avatar: '',
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const APP_API_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${APP_API_URL}/api/userdata/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserData({
          fullname: response.data.fullname || user.name || '',
          email: response.data.email || user.email || '',
          phone: response.data.phone || '',
          bio: response.data.bio || '',
          avatar: response.data.avatar || '',
        });
      } catch (err) {
        toast.error('Failed to fetch user data', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
        });
        console.error(err);
      }
    };
    if (user.auth) {
      fetchUserData();
    }
  }, [user.id, user.auth, user.name, user.email]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
      return;
    }
    setFile(selectedFile);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadAvatar = async () => {
    if (!file) {
      toast.error('Please select an image', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post(`${APP_API_URL}/api/userdata/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
        params: { user_id: user.id },
      });
      setUserData({ ...userData, avatar: response.data.url });
      toast.success('Avatar uploaded successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload avatar', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
      console.error(err);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleUpdateUserData = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error('Invalid email format', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
      return;
    }

    try {
      const response = await axios.put(`${APP_API_URL}/api/userdata/${user.id}`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUserData(response.data);
      setIsEditing(false);
      toast.success('User data updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user data', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
      console.error(err);
    }
  };

  const handleDeleteUser = () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;

    axios
      .delete(`${APP_API_URL}/api/userdata/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => {
        logout();
        toast.success('Account deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
        });
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || 'Failed to delete account', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
        });
        console.error(err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 sm:p-0 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-white shadow-lg">
            <div className="flex justify-center mt-6 relative">
              <div
                className="cursor-pointer hover:opacity-80 transition"
                onClick={handleAvatarClick}
              >
                <img
                  src={userData.avatar || '/assets/images/gearment.png'}
                  alt="User Avatar"
                  className="w-40 h-40 object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>
            <div className="flex justify-center mt-2">
              <Button
                onClick={handleAvatarClick}
                className="w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600"
              >
                <ArrowUpOnSquareIcon className="w-5 h-5 mr-2" />
                Upload Avatar
              </Button>
            </div>

            {file && (
              <div className="flex justify-center mt-4">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-40 h-40 rounded-lg object-cover border-2 border-gray-200"
                />
              </div>
            )}
            {file && (
              <div className="flex justify-center mt-2">
                <Button
                  onClick={handleUploadAvatar}
                  disabled={uploading}
                  loading={uploading}
                  className="w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600"
                >
                  <ArrowUpOnSquareIcon className="w-5 h-5 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {isEditing ? (
                <form onSubmit={handleUpdateUserData}>
                  <TextField
                    label="Full Name"
                    placeholder="Full Name"
                    name="fullname"
                    type="text"
                    value={userData.fullname}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="Email"
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="Phone"
                    placeholder="Enter your phone"
                    name="phone"
                    type="text"
                    value={userData.phone}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Bio"
                    placeholder="Tell us about yourself"
                    name="bio"
                    type="textarea"
                    value={userData.bio}
                    onChange={handleInputChange}
                  />
                  <div className="flex space-x-4 mt-4">
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                      <PencilIcon className="w-5 h-5 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      className="w-full bg-gray-500 hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className='space-y-3 rounded-lg border border-gray-200 p-4'>
                    <div>
                      <p className="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Name:
                      </p>
                      <p className="text-gray-900">{userData.fullname || user.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Email:
                      </p>
                      <p className="text-gray-900">{userData.email || user.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Phone:
                      </p>
                      <p className="text-gray-900">{userData.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Bio:
                      </p>
                      <p className="text-gray-900">{userData.bio || 'N/A'}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
              <Button
                onClick={handleDeleteUser}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete Account
              </Button>
              <Button
                onClick={logout}
                className="w-full bg-gray-500 hover:bg-gray-600"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-brand-100 dark:bg-white/5">
          <div className="max-w-xs">
            <img
              src="/assets/images/hello-world.png"
              alt="Hello World"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;