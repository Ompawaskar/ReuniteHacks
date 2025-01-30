import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { auth } from '../../../firebase';
import QrScanner from 'qr-scanner';

import { Camera, X as XIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const ComplaintForm = () => {

  const initialFormState = {
    name: '',
    age: '',
    gender: '',
    phone: '',
    appearance: {
      height: '',
      clothes: '',
    },
    missingDate: '',
    missingTime: '',
    address: '',
    photo: null,

  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAppearanceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [name]: value }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, photo: file }));
  };


  const handleAadharUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = await QrScanner.scanImage(reader.result);
          // Assuming the QR scan result contains the Aadhaar data in the required format
          const aadharData = JSON.parse(result);

          // Update both aadharData and form fields
          setFormData(prev => ({
            ...prev,
            // Update aadharData object
            aadharData: {
              name: aadharData.name || "",
              number: aadharData.number || null,
              age: aadharData.age || null,
              gender: aadharData.gender || "",
              dob: aadharData.dob || "",
              address: aadharData.address || "",
              phone: {
                number: aadharData.phone?.number || null,
                location: aadharData.phone?.location || ""
              },
              email: aadharData.email || "",
              photo: aadharData.photo || "",
              fingerprint: aadharData.fingerprint || ""
            },
            // Auto-fill relevant form fields
            name: aadharData.name || prev.name,
            age: aadharData.age?.toString() || prev.age,
            gender: aadharData.gender?.toLowerCase() || prev.gender,
            phone: aadharData.phone?.number?.toString() || prev.phone,

          }));

        } catch (error) {
          console.error("Error parsing Aadhaar data:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    const formDataToSend = new FormData();

    // Append basic fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'appearance' && value !== null) {
        formDataToSend.append(key, value);
      }
    });

    // Append appearance fields
    Object.entries(formData.appearance).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    console.log(formData);

    try {
      const response = await fetch('http://localhost:4001/api/complaint', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Submission failed. Please try again.');
      }

      setToast({ type: 'success', message: 'Report submitted successfully!' });
      setFormData(initialFormState);
    } catch (error) {
      setToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold text-gray-900">Missing Person Report</CardTitle>
            <CardDescription className='text-center'>
              Please provide as much detail as possible to help locate the missing person
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={submitHandler} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" onValueChange={(value) => handleInputChange({ target: { name: 'gender', value } })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Description Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Physical Description</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      name="height"
                      value={formData.appearance.height}
                      onChange={handleAppearanceChange}
                      placeholder="Enter height (cm)"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clothes">Clothing Description</Label>
                    <Textarea
                      id="clothes"
                      name="clothes"
                      value={formData.appearance.clothes}
                      onChange={handleAppearanceChange}
                      placeholder="Describe what they were wearing"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Documents & Photos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="photo">Recent Photo</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="photo"
                        name="photo"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById('photo').click()}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhaar Card QR</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="aadhar"
                        name="aadhar"
                        type="file"
                        onChange={handleAadharUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById('aadhar').click()}
                      >
                        Upload Aadhaar QR
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            

            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>

          {/* Toast Notification */}
          {toast && (
            <Alert className={`fixed bottom-4 right-4 w-96 ${toast.type === 'success' ? 'bg-green-50 border-green-200' :
                toast.type === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
              }`}>
              <AlertTitle>{toast.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{toast.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
        </div>
  );
};

export default ComplaintForm;