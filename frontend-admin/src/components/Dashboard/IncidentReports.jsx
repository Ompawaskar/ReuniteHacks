import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, Search, User, MapPin, Phone, CreditCard, Check, X, Loader2 } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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

const MissingPersons = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/complaints");
        setMissingPersons(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredPersons = missingPersons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "male" && person.gender.toLowerCase() === "male") ||
      (filter === "female" && person.gender.toLowerCase() === "female") ||
      (filter === "minors" && person.age < 18); // Filter for minors
    return matchesSearch && matchesFilter;
  });

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

          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search by name or ID..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="flex-1 sm:flex-none"
              >
                All
              </Button>
              <Button
                variant={filter === "male" ? "default" : "outline"}
                onClick={() => setFilter("male")}
                className="flex-1 sm:flex-none"
              >
                Male
              </Button>
              <Button
                variant={filter === "female" ? "default" : "outline"}
                onClick={() => setFilter("female")}
                className="flex-1 sm:flex-none"
              >
                Female
              </Button>
              <Button
                variant={filter === "minors" ? "default" : "outline"}
                onClick={() => setFilter("minors")}
                className="flex-1 sm:flex-none"
              >
                Minors
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersons.map((person) => (
            <AnimatedGroup key={person._id} preset="scale">
              <MissingPersonCard person={person} />
            </AnimatedGroup>
          ))}
        </div>
      </div>
    </div>
  );
};

const MissingPersonCard = ({ person }) => {
  const [formData, setFormData] = useState({
    name: person.name,
    photo: person.photo,
    age: person.age,
    gender: person.gender,
    appearance: {
      height: person.appearance.height,
      clothes: person.appearance.clothes,
    },
    phone: person.phone,
    address: person.address,
    aadhar: person.aadhar,
    aadharData: person.aadharData.number
  });

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
            src={person.photo}
            alt={person.name}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-4 right-4 bg-blue-500">
            {person._id}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{person.name}</h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <User size={16} className="mr-1" />
              {person.age} years
            </span>
            <span>{person.gender}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-2">
            <User size={16} className="mt-1 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Appearance</p>
              <p className="text-sm text-gray-600">
                {person.appearance.height}, {person.appearance.clothes}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone size={16} className="mt-1 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Contact</p>
              <p className="text-sm text-gray-600">{person.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-1 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Last Known Location</p>
              <p className="text-sm text-gray-600">{person.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CreditCard size={16} className="mt-1 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Aadhar Number</p>
              <p className="text-sm text-gray-600">{person.aadharData.number}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissingPersons;
