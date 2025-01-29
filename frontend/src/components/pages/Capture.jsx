import React, { useState, useRef } from "react";
import { Upload, Phone, Building2, Hospital } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../shared/Navbar";

const API_KEY = 'AlzaSyEXf1pHlDApK6GkXKEOupdgmrEyzWOeG3h'; // Replace with your actual API key

const PhotoUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchPlaceDetails = async (placeId) => {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
        fields: 'formatted_phone_number',
        key: API_KEY
      });

      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/place/details/json?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result.formatted_phone_number || 'N/A';
    } catch (error) {
      console.error('Error fetching place details:', error);
      return 'N/A';
    }
  };

  const fetchNearbyLocations = async (coords) => {
    setIsLoadingLocations(true);
    try {
      const categories = [
        { type: 'police', category: 'government' },
        { type: 'hospital', category: 'hospitals' },
        { type: 'local_government_office', category: 'government' },
        { type: 'fire_station', category: 'others' }
      ];

      const results = {
        government: [],
        hospitals: [],
        others: []
      };

      await Promise.all(
        categories.map(async ({ type, category }) => {
          const params = new URLSearchParams({
            location: `${coords.latitude},${coords.longitude}`,
            radius: '5000',
            type: type,
            language: 'en',
            key: API_KEY
          });

          const response = await fetch(
            `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?${params}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Process and add phone numbers for each place
          const placesWithDetails = await Promise.all(
            data.results.map(async (place) => {
              const phone = await fetchPlaceDetails(place.place_id);
              const distance = calculateDistance(
                coords.latitude,
                coords.longitude,
                place.geometry.location.lat,
                place.geometry.location.lng
              );

              return {
                name: place.name,
                distance: `${distance.toFixed(1)}km`,
                phone: phone
              };
            })
          );

          results[category].push(...placesWithDetails);
        })
      );

      // Sort and limit results
      for (let category in results) {
        results[category].sort((a, b) => 
          parseFloat(a.distance) - parseFloat(b.distance)
        );
        results[category] = results[category].slice(0, 3);
      }

      setNearbyLocations(results);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      setError('Failed to fetch nearby locations. Please try again.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.");
      return;
    }

    setSelectedImage(file);
    setError(null);
    captureLocation();
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        fetchNearbyLocations(coords);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Failed to capture location. Please enable location access.");
      }
    );
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitData = async () => {
    if (!selectedImage || !description) {
      setError("Please provide an image and a description.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("description", description);
      if (location) {
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);
      }

      const response = await fetch("http://localhost:3000/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image and data");
      }

      console.log("Upload successful");
      setIsSubmitted(true);
      setSelectedImage(null);
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to submit data. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const LocationsTable = ({ title, icon: Icon, locations }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-[#115579]" />
        <h3 className="text-lg font-semibold text-[#115579]">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Distance</th>
              <th className="px-4 py-2 text-left">Contact</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">{loc.name}</td>
                <td className="px-4 py-2">{loc.distance}</td>
                <td className="px-4 py-2">
                  <a href={`tel:${loc.phone}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                    <Phone className="w-4 h-4" />
                    {loc.phone}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const LeftContent = () => {
    if (!isSubmitted && nearbyLocations) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#115579] mb-4">
              Nearby Emergency Contacts
            </h2>
            <p className="text-gray-600 mb-6">
              Here are the nearest emergency services and authorities that can help:
            </p>
          </div>
          
          {isLoadingLocations ? (
            <div className="text-center py-8">
              <p>Loading nearby locations...</p>
            </div>
          ) : (
            <>
              <LocationsTable 
                title="Government Authorities" 
                icon={Building2} 
                locations={nearbyLocations.government} 
              />
              
              <LocationsTable 
                title="Hospitals & Emergency Care" 
                icon={Hospital} 
                locations={nearbyLocations.hospitals} 
              />
              
              <LocationsTable 
                title="Other Emergency Services" 
                icon={Phone} 
                locations={nearbyLocations.others} 
              />
            </>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#115579] mb-4">
            Help Us Locate Missing Persons
          </h1>
          <p className="text-gray-600 mb-4">
            Your contribution can make a significant difference in reuniting families. 
            If you have information about a missing person, please share it with us.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Guidelines for Submission</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="font-medium mr-2">📸</span>
                Upload a clear, recent photo (max 5MB)
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">📝</span>
                Provide detailed description
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">📍</span>
                Allow location access for accurate reporting
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">⚡</span>
                Submit as soon as possible after sighting
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left side content */}
          <div className="space-y-6">
            <LeftContent />
          </div>

          {/* Right side form */}
          <Card className="w-full">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-[#115579] mb-4">
                Submit Information
              </h2>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#115579] hover:bg-[#0e4d6c] text-white rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  Upload Image
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </label>

                {selectedImage && (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Please provide detailed description of the person and where they were seen..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#115579] focus:border-transparent"
                    rows="4"
                  ></textarea>
                </div>

                {location && (
                  <p className="text-gray-600 text-sm">
                    📍 Location captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                )}

                <button
                  onClick={submitData}
                  className={`w-full px-4 py-3 rounded-lg transition-colors ${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#115579] hover:bg-[#0e4d6c] text-white"
                  }`}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Submit Report"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;