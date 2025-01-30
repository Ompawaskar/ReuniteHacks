import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, Search, MapPin, Check, X, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from '@/components/ui/animated-group';

const ProcessingStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const StatusButton = ({ status, onClick }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case ProcessingStatus.LOADING:
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case ProcessingStatus.SUCCESS:
        return <Check className="h-4 w-4" />;
      case ProcessingStatus.ERROR:
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getButtonClasses = () => {
    switch (status) {
      case ProcessingStatus.SUCCESS:
        return "bg-green-500 hover:bg-green-600";
      case ProcessingStatus.ERROR:
        return "bg-red-500 hover:bg-red-600";
      default:
        return "";
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`absolute top-4 left-4 h-8 w-8 rounded-full ${getButtonClasses()}`}
      onClick={onClick}
      disabled={status === ProcessingStatus.LOADING}
    >
      {getStatusDisplay()}
    </Button>
  );
};

const Table2= () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/images");
        const filteredImages = response.data.filter(image => image.ngo);
        setImages(filteredImages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const filteredImages = images.filter(image =>
    image.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Missing Persons Registry</h1>

          <div className="relative flex items-center max-w-3xl mx-auto mb-6">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by description..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <AnimatedGroup key={image._id} preset="scale">
              <MissingPersonCard image={image} />
            </AnimatedGroup>
          ))}
        </div>
      </div>
    </div>
  );
};

const MissingPersonCard = ({ image }) => {
  const [processingStatus, setProcessingStatus] = useState(ProcessingStatus.IDLE);

  const handleProcessing = async () => {
    setProcessingStatus(ProcessingStatus.LOADING);

    try {
      // Simulate backend processing
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Randomly succeed or fail for demonstration
          Math.random() > 0.5 ? resolve() : reject();
        }, 2000);
      });

      setProcessingStatus(ProcessingStatus.SUCCESS);
    } catch (error) {
      setProcessingStatus(ProcessingStatus.ERROR);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <StatusButton
            status={processingStatus}
            onClick={handleProcessing}
          />
          <img
            src={image.imageUrl}
            alt={image.description}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-4 right-4 bg-blue-500">
            {image._id}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{image.description}</h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {image.latitude}, {image.longitude}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Table2