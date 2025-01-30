import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, Search, User, MapPin, Phone, CreditCard, Check, X, Loader2 } from "lucide-react";
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
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredPersons = missingPersons.filter(person =>
    (person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person._id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === "all" ||
      (filter === "male" && person.gender.toLowerCase() === "male") ||
      (filter === "female" && person.gender.toLowerCase() === "female") ||
      (filter === "minors" && person.age < 18))
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
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input type="text" placeholder="Search by name or ID..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {["all", "male", "female", "minors"].map(type => (
                <Button key={type} variant={filter === type ? "default" : "outline"} onClick={() => setFilter(type)} className="flex-1 sm:flex-none">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersons.map(person => (
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
  const [processingStatus, setProcessingStatus] = useState(ProcessingStatus.IDLE);
  const [matchResult, setMatchResult] = useState(null);

  const handleProcessing = async () => {
    setProcessingStatus(ProcessingStatus.LOADING);
    try {
      const response = await fetch("http://127.0.0.1:8000/match2/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: person.photo })
      });
      const data = await response.json();
      setMatchResult(response.ok ? data : data.message || "No match found");
      setProcessingStatus(response.ok ? ProcessingStatus.SUCCESS : ProcessingStatus.ERROR);
    } catch (error) {
      setProcessingStatus(ProcessingStatus.ERROR);
      setMatchResult("An error occurred while processing the request.");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <StatusButton status={processingStatus} onClick={handleProcessing} />
        <img src={person.photo} alt={person.name} className="w-full h-64 object-cover bg-gray-100" />
        <Badge className="absolute top-4 right-4 bg-blue-500">{person._id}</Badge>
      </CardHeader>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{person.name}</h2>
        <p className="text-sm text-gray-600">{person.age} years, {person.gender}</p>
        {matchResult && <p className="mt-4 text-gray-600"><strong>Match Result:</strong> {matchResult}</p>}
      </CardContent>
    </Card>
  );
};

export default MissingPersons;
