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
    aadharData: {
      name: "",
      number: null,
      age: null,
      gender: "",
      dob: "",
      address: "",
      phone: {
        number: null,
        location: ""
      },
      email: "",
      photo: "",
      fingerprint: ""
    },
    missingDate: "",
    missingTime: ""
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
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,  // Keep the file itself
      }));
  
      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        photoPreview: imageUrl,  // Store a preview
      }));
    }
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
          
          showToast("Aadhaar QR scanned successfully! Form fields have been auto-filled.", "success");
        } catch (error) {
          showToast("Error scanning Aadhaar QR code", "error");
          console.error("Error parsing Aadhaar data:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      console.log("FormData",formData);
      
      const submissionData = new FormData();
      if (formData.photo) {
        submissionData.append("file", formData.photo); // Use formData.photo instead of undefined selectedFile
      }
      submissionData.append("name", formData.name);
      submissionData.append("age", formData.age);
      submissionData.append("gender", formData.gender);
      submissionData.append("phone", formData.phone);
      submissionData.append("address", formData.address);
      submissionData.append("missingDate", formData.missingDate);
      submissionData.append("missingTime", formData.missingTime);

      // Append appearance details
      submissionData.append("appearance[height]", formData.appearance.height);
      submissionData.append("appearance[clothes]", formData.appearance.clothes);

      // Append Aadhaar details if available
      if (formData.aadharData.number) {
        submissionData.append("aadhar[name]", formData.aadharData.name);
        submissionData.append("aadhar[number]", formData.aadharData.number);
        submissionData.append("aadhar[age]", formData.aadharData.age);
        submissionData.append("aadhar[gender]", formData.aadharData.gender);
        submissionData.append("aadhar[dob]", formData.aadharData.dob);
        submissionData.append("aadhar[address]", formData.aadharData.address);
        submissionData.append("aadhar[phone][number]", formData.aadharData.phone.number);
        submissionData.append("aadhar[phone][location]", formData.aadharData.phone.location);
        submissionData.append("aadhar[email]", formData.aadharData.email);
        submissionData.append("aadhar[photo]", formData.aadharData.photo);
        submissionData.append("aadhar[fingerprint]", formData.aadharData.fingerprint);
      }

      const response = await fetch("http://localhost:3001/api/complaints", {
        method: "POST",
        body: submissionData, // ✅ No need to stringify
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      showToast("Your complaint has been successfully registered.", "success");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      showToast(err.message || "There was an error submitting your complaint. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
};


  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(formData)

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
                  <Select name="gender" onValueChange={(value) => handleInputChange({ target: { name: 'gender', value }})}>
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

            {/* Last Seen Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Last Seen Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="missingDate">Date Last Seen</Label>
                  <Input
                    id="missingDate"
                    name="missingDate"
                    type="date"
                    value={formData.missingDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="missingTime">Time Last Seen</Label>
                  <Input
                    id="missingTime"
                    name="missingTime"
                    type="time"
                    value={formData.missingTime}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Last Known Location</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter the last known location or address"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Documents Upload Section */}
            <div className="space-y-6">
  <h3 className="text-lg font-semibold text-gray-900">Documents & Photos</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label htmlFor="photo">Recent Photo</Label>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            id="photo"
            name = "photo"
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
        {formData.photoPreview && (
          <div className="relative">
            <img
              src={formData.photoPreview}
              alt="Photo preview"
              className="w-48 h-48 object-cover rounded-lg border border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-0"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  photo: "",
                  photoPreview: ""
                }));
              }}
            >
          
            </Button>
          </div>
        )}
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="aadhar">Aadhaar Card QR</Label>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            id="aadhar"
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
        {formData.qrPreview && (
          <div className="relative">
            <img
              src={formData.qrPreview}
              alt="QR preview"
              className="w-48 h-48 object-cover rounded-lg border border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-0"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  qrPreview: ""
                }));
              }}
            >
      
            </Button>
          </div>
        )}
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
            <Alert className={`fixed bottom-4 right-4 w-96 ${
              toast.type === 'success' ? 'bg-green-50 border-green-200' : 
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