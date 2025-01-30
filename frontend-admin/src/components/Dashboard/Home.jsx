import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EyeIcon, Check, X, Loader2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from 'axios';
// Processing Status Enum
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
        return "bg-green-500 hover:bg-green-600 text-white";
      case ProcessingStatus.ERROR:
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "";
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`h-8 w-8 rounded-full ${getButtonClasses()}`}
      onClick={onClick}
      disabled={status === ProcessingStatus.LOADING}
    >
      {getStatusDisplay()}
    </Button>
  );
};

const ReportDetailsModal = ({ report, isOpen, onClose }) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <img
              src={report?.imageUrl}
              alt="Report location"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <StatusButton 
                status={processingStatus} 
                onClick={handleProcessing}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{report?.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Latitude</p>
                  <p className="text-sm text-gray-600">{report?.latitude}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Longitude</p>
                  <p className="text-sm text-gray-600">{report?.longitude}</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Reported on: {new Date(report?.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FoundReportsTable = () => {
  const [foundReports, setFoundReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReports, setSelectedReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/images");
        const data = await response.json();
        setFoundReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleView = (report) => {
    setSelectedReport(report);
  };

  const handleCheckboxChange = async (reportId) => {
    try {
      const response = await axios.post(`http://localhost:4001/api/set-ngo/${reportId}`);
      
      if (response.status === 200) {
        // Update the selected reports
        setFoundReports((prevReports) =>
          prevReports.map((report) =>
            report._id === reportId ? { ...report, ngo: true } : report
          )
        );
      }
    } catch (error) {
      console.error("Error updating NGO status:", error);
    }
  };

  return (
    <Card className="w-[48%]">
      <CardHeader>
        <CardTitle className="text-xl">Recent Found Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Found Reports</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
                <TableHead className="w-24 text-center">Mark NGO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foundReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{report.description}</span>
                      <span className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(report)}
                      className="hover:bg-gray-100"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={report.ngo}
                      onChange={() => handleCheckboxChange(report._id)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ReportDetailsModal 
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </Card>
  );
};

const Home = () => {
  return (
    <div>
      <div className='mx-9'>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 w-full mt-4">
          {/* Dashboard Cards */}
        </div>

        {/* Area Chart Component */}
        <div className="mt-8 flex justify-between mb-10">
          <FoundReportsTable />
          <div className='w-[48%] '>
            <iframe
              src="/maharashtra_heatmap.html"
              title="Maharashtra Heatmap"
              style={{ border: 'none', width: '100%', height: '100%' }}
              className='rounded-lg'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
