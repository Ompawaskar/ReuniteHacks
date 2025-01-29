import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { auth } from '../../../firebase';
import QrScanner from 'qr-scanner';

const ComplaintForm = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    age: "",
    gender: "",
    appearance: {
      height: "",
      clothes: "",
    },
    phone: "",
    address: "",
    aadhar: "",
    aadharData: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:3001/api/users/${user.uid}`);
          setUserDetails(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAppearanceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      photo: e.target.files[0]
    }));
  };

  const handleAadharUpload = async (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      aadhar: file
    }));

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = await QrScanner.scanImage(reader.result);
        setFormData(prev => ({
          ...prev,
          aadharData: result
        }));
        showToast("Aadhaar QR scanned successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    for (const key in formData) {
      if (key === 'appearance') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      await axios.post('http://localhost:3001/api/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast("Your complaint has been successfully registered.", "success");
      setFormData({
        name: "",
        photo: "",
        age: "",
        gender: "",
        appearance: { height: "", clothes: "" },
        phone: "",
        address: "",
        aadhar: "",
        aadharData: ""
      });
    } catch (err) {
      console.error('Error submitting complaint:', err);
      showToast("There was an error submitting your complaint. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(formData)
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className='flex justify-center max-w-7xl mx-auto py-12 px-4 '>
        <form onSubmit={submitHandler} className='grid grid-cols-2 gap-6 bg-white p-10 rounded-xl shadow-md w-full max-w-4xl'>
          <div className='space-y-4'>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" />
            <Label>Age</Label>
            <Input name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" type="number" />
            <Label>Gender</Label>
            <Input name="gender" value={formData.gender} onChange={handleInputChange} placeholder="Gender" />
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" />
            <Label>Address</Label>
            <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" />
          </div>
          <div className='space-y-4'>
            <Label>Height</Label>
            <Input name="height" value={formData.appearance.height} onChange={handleAppearanceChange} placeholder="Height" />
            <Label>Clothes Description</Label>
            <Input name="clothes" value={formData.appearance.clothes} onChange={handleAppearanceChange} placeholder="Clothes Description" />
            <Label>Upload Photo</Label>
            <Input type="file" onChange={handleFileChange} accept="image/*" />
            <Label>Upload Aadhaar QR</Label>
            <Input type="file" onChange={handleAadharUpload} accept="image/*" />
          </div>
          <Button type="submit" className='col-span-2 w-full bg-[#115579]' disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Complaint'}</Button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
