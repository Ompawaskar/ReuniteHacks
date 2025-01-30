import React, { useState } from "react";
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

const missingPersons = [
  {
    "id": "MP-2024-08-20-001",
    "name": "John Doe",
    "photo": "https://3.imimg.com/data3/FO/QR/MY-14683381/missing-person-tracing-500x500.png",
    "age": 30,
    "gender": "Male",
    "appearance": {
      "height": "6 feet",
      "clothes": "Black mask, dark clothing"
    },
    "phone": "+91-XXXXXXXXXX",
    "address": "Some address",
    "aadhar": "1234 5678 9101",
    "aadharData": {
      'email_mobile_status': '3',
      'referenceid': '151120210414002351360360',
      'name': 'John Doe',
      'dob': '12-08-1994',
      'gender': 'M',
      'careof': '',
      'district': 'Mumbai',
      'landmark': 'Near Gateway of India',
      'house': 'B/202, Louis Palace',
      'location': '',
      'pincode': '400065',
      'postoffice': '',
      'state': 'Maharashtra',
      'street': 'Colaba Causeway',
      'subdistrict': '',
      'vtc': 'Colaba',
      'aadhaar_last_4_digit': '1234',
      'aadhaar_last_digit': '1',
      'email': true,
      'mobile': true,
      'fingerprint': "link-to-fingerprint-image",
      'photo': "link-to-photo-image"
    }
  },
  {
    "id": "MP-2024-08-15-002",
    "name": "Jane Smith",
    "photo": "https://3.imimg.com/data3/FO/QR/MY-14683381/missing-person-tracing-500x500.png",
    "age": 25,
    "gender": "Female",
    "appearance": {
      "height": "5'8\"",
      "clothes": "Red cap, blue jeans"
    },
    "phone": "+91-XXXXXXXXXX",
    "address": "Another address",
    "aadhar": "2234 5678 9101",
    "aadharData": {
      'email_mobile_status': '2',
      'referenceid': '161120210414003251360',
      'name': 'Jane Smith',
      'dob': '25-02-1999',
      'gender': 'F',
      'careof': '',
      'district': 'Mumbai',
      'landmark': 'Near Taj Mahal Hotel',
      'house': 'B/405, Green Palace',
      'location': '',
      'pincode': '400065',
      'postoffice': '',
      'state': 'Maharashtra',
      'street': 'Nariman Point',
      'subdistrict': '',
      'vtc': 'Nariman Point',
      'aadhaar_last_4_digit': '5678',
      'aadhaar_last_digit': '9',
      'email': true,
      'mobile': true,
      'fingerprint': "link-to-fingerprint-image",
      'photo': "link-to-photo-image"
    }
  },
  {
    "id": "MP-2024-08-20-003",
    "name": "Alice Johnson",
    "photo": "https://3.imimg.com/data3/FO/QR/MY-14683381/missing-person-tracing-500x500.png",
    "age": 16,
    "gender": "Female",
    "appearance": {
      "height": "5'4\"",
      "clothes": "Pink dress, white shoes"
    },
    "phone": "+91-XXXXXXXXXX",
    "address": "Another address",
    "aadhar": "3234 5678 9101",
    "aadharData": {
      'email_mobile_status': '2',
      'referenceid': '161120210414003251360',
      'name': 'Alice Johnson',
      'dob': '25-02-2008',
      'gender': 'F',
      'careof': '',
      'district': 'Mumbai',
      'landmark': 'Near Taj Mahal Hotel',
      'house': 'B/405, Green Palace',
      'location': '',
      'pincode': '400065',
      'postoffice': '',
      'state': 'Maharashtra',
      'street': 'Nariman Point',
      'subdistrict': '',
      'vtc': 'Nariman Point',
      'aadhaar_last_4_digit': '5678',
      'aadhaar_last_digit': '9',
      'email': true,
      'mobile': true,
      'fingerprint': "link-to-fingerprint-image",
      'photo': "link-to-photo-image"
    }
  }
];

const MissingPersons = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredPersons = missingPersons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "male" && person.gender.toLowerCase() === "male") ||
      (filter === "female" && person.gender.toLowerCase() === "female") ||
      (filter === "minors" && person.age < 18); // Filter for minors
    return matchesSearch && matchesFilter;
  });

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
            <AnimatedGroup key={person.id} preset="scale">
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
    aadharData: person.aadharData
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
            {person.id}
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
        </div>

        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="aadharData" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>View Aadhar Details</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Reference ID</p>
                  <p className="text-gray-600">{formData.aadharData.referenceid}</p>
                </div>
                <div>
                  <p className="font-medium">Date of Birth</p>
                  <p className="text-gray-600">{formData.aadharData.dob}</p>
                </div>
                <div>
                  <p className="font-medium">District</p>
                  <p className="text-gray-600">{formData.aadharData.district}</p>
                </div>
                <div>
                  <p className="font-medium">State</p>
                  <p className="text-gray-600">{formData.aadharData.state}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button className="w-full flex items-center justify-center gap-2">
          <Download size={16} />
          Download Full Report
        </Button>
      </CardContent>
    </Card>
  );
};

export default MissingPersons;