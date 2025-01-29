import React, { useState } from "react";
import { Download } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";; // Using shadcn components for accordion
import jsPDF from 'jspdf';



const missingPersons = [
  {
    "id": "MP-2024-08-20-001",
    "name": "John Doe",
    "photo": "https://example.com/missing1.jpg",
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
    "photo": "https://example.com/missing2.jpg",
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
  }
];

const MissingPersons = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Missing Persons</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {missingPersons.map((person) => (
          <MissingPersonCard key={person.id} person={person} />
        ))}
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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text("Missing Person Report", 105, 15, { align: "center" });

    const img = new Image();
    img.src = person.photo;
    img.onload = () => {
      let imgWidth = 70;
      let imgHeight = (img.height * imgWidth) / img.width;
      if (imgHeight > 60) {
        imgHeight = 60;
        imgWidth = (img.width * imgHeight) / img.height;
      }
      doc.addImage(img, 'JPEG', 140, 25, imgWidth, imgHeight);
      addTextContent(doc);
    };

    img.onerror = () => {
      addTextContent(doc);
    };
  };

  const addTextContent = (doc) => {
    doc.setFontSize(12);
    doc.text(`Name: ${formData.name}`, 20, 30);
    doc.text(`Age: ${formData.age}`, 20, 40);
    doc.text(`Gender: ${formData.gender}`, 20, 50);
    doc.text(`Height: ${formData.appearance.height}`, 20, 60);
    doc.text(`Clothes: ${formData.appearance.clothes}`, 20, 70);
    doc.text(`Phone: ${formData.phone}`, 20, 80);
    doc.text(`Address: ${formData.address}`, 20, 90);
    doc.text(`Aadhar: ${formData.aadhar}`, 20, 100);
    doc.text(`Aadhar Data: ${formData.aadharData}`, 20, 110);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col shadow-lg">
      <div className="h-48 overflow-hidden relative">
        <img
          src={person.photo}
          alt={person.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{person.name}</h2>
          <span className="text-sm text-gray-500">{person.id}</span>
        </div>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600"><strong>Age:</strong> {person.age}</p>
          <p className="text-sm text-gray-600"><strong>Gender:</strong> {person.gender}</p>
          <p className="text-sm text-gray-600"><strong>Height:</strong> {person.appearance.height}</p>
          <p className="text-sm text-gray-600"><strong>Clothes:</strong> {person.appearance.clothes}</p>
        </div>
        <div className="space-y-2 mb-4">
          <p className="text-sm"><strong>Phone:</strong> {person.phone}</p>
          <p className="text-sm"><strong>Address:</strong> {person.address}</p>
          <p className="text-sm"><strong>Aadhar:</strong> {person.aadhar}</p>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="aadharData">
            <AccordionTrigger className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">
              View Aadhar Data
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-gray-50 rounded-b-lg">
              <p><strong>Name:</strong> {formData.aadharData.name}</p>
              <p><strong>Reference ID:</strong> {formData.aadharData.referenceid}</p>
              <p><strong>Date of Birth:</strong> {formData.aadharData.dob}</p>
              <p><strong>Gender:</strong> {formData.aadharData.gender}</p>
              <p><strong>District:</strong> {formData.aadharData.district}</p>
              <p><strong>Landmark:</strong> {formData.aadharData.landmark}</p>
              <p><strong>Location:</strong> {formData.aadharData.location}</p>
              <p><strong>Pincode:</strong> {formData.aadharData.pincode}</p>
              <p><strong>State:</strong> {formData.aadharData.state}</p>
              <p><strong>Street:</strong> {formData.aadharData.street}</p>
              <p><strong>Aadhaar Last 4 Digits:</strong> {formData.aadharData.aadhaar_last_4_digit}</p>
              <p><strong>Email:</strong> {formData.aadharData.email ? 'Yes' : 'No'}</p>
              <p><strong>Mobile:</strong> {formData.aadharData.mobile ? 'Yes' : 'No'}</p>
              <p><strong>Fingerprint:</strong> <a href={formData.aadharData.fingerprint} target="_blank" rel="noopener noreferrer">View Fingerprint</a></p>
              <p><strong>Photo:</strong> <a href={formData.aadharData.photo} target="_blank" rel="noopener noreferrer">View Photo</a></p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center"
            onClick={generatePDF}
          >
            <Download size={16} className="mr-2" />
            Full Report Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissingPersons;
