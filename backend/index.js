import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express'
import qs from 'qs'
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises'
import cors from 'cors';
import aadharRoute from './aadharRoute.js'
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { uploadOnCloudinary } from './cloudinary.js';
import dotenv from "dotenv";
import fileUpload from 'express-fileupload';
import multer from "multer";
import bodyParser from "body-parser";
import { upload } from './multer.middleware.js';


dotenv.config();
// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded data
app.use(fileUpload()); 

// Database models
const AadharDataSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    number: {
        type: String,
        unique: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 150
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    photo: {
        type: String, 
    },
    fingerprint: {
        type: String,
    }
});

const MissingPersonSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 150
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    appearance: {
        height: {
            type: String,
            trim: true
        },
        clothes: {
            type: String,
            trim: true
        }
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    aadharData: AadharDataSchema,
    missingDate: {
        type: Date,
        required: true
    },
    missingTime: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Add indexes for frequently queried fields
MissingPersonSchema.index({ name: 1 });


// Create and export the model
const MissingPerson = mongoose.model('MissingPerson', MissingPersonSchema);


// Missing person search
app.get('/api/missingSearch', async (req, res) => {
    const {
        DateFrom = "15/01/2025",
        DateTo = "16/01/2025",
        AgeFrom = 0,
        AgeTo = 100,
        FirstName,
        MiddleName,
        LastName,
        District,
        page = 1,
        pageSize = 10
    } = req.query;


    let data = qs.stringify(
        {
            'ctl00$ScriptManager1': 'ctl00$ContentPlaceHolder1$UpdatePanel2|ctl00$ContentPlaceHolder1$btnSearch',
            '__EVENTTARGET': '',
            '__EVENTARGUMENT': '',
            '__LASTFOCUS': '',
            '__VIEWSTATE': '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',
            '__VIEWSTATEGENERATOR': 'EFD4CB67',
            '__VIEWSTATEENCRYPTED': '',
            '__PREVIOUSPAGE': 'f1oaHWSivrivfNZ2DjLAjNTvkyqLxb4-ahnXWNi2krD9cpht9j9u8U81BmvhTW0IWz50nxLsrlHPfF4yL-v8DfC-i796o4h0OTeYErHmlLT8qGj00',
            '__EVENTVALIDATION': '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',
            'ctl00$ContentPlaceHolder1$ddlSearch': 'Select',
            'ctl00$ContentPlaceHolder1$txtInput': 'Search Query',
            'ctl00$hdnSessionIdleTime': '',
            'ctl00$hdnUserUniqueId': '',
            'ctl00$ContentPlaceHolder1$txtDateRangeFrom': DateFrom,
            'ctl00$ContentPlaceHolder1$meeDateRangeFrom_ClientState': '',
            'ctl00$ContentPlaceHolder1$txtFirstName': '',
            'ctl00$ContentPlaceHolder1$txtDateRangeTo': DateTo,
            'ctl00$ContentPlaceHolder1$meeDateRangeTo_ClientState': '',
            'ctl00$ContentPlaceHolder1$txtMiddleName': '',
            'ctl00$ContentPlaceHolder1$txtAgefrom': AgeFrom,
            'ctl00$ContentPlaceHolder1$txtAgeTo': AgeTo,
            'ctl00$ContentPlaceHolder1$txtLastName': '',
            'ctl00$ContentPlaceHolder1$ddlDistrict': '',
            'ctl00$ContentPlaceHolder1$ddlGender': '',
            'ctl00$ContentPlaceHolder1$ucRecordView$ddlPageSize': '0',
            '__ASYNCPOST': 'true',
            'ctl00$ContentPlaceHolder1$btnSearch': 'Search'
        });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://citizen.mahapolice.gov.in/Citizen/MH/SearchView.aspx',
        headers: {
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Requested-With': 'XMLHttpRequest',
            'X-MicrosoftAjax': 'Delta=true',
            'sec-ch-ua-platform': '"Windows"',
            'Accept': '*/*',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Host': 'citizen.mahapolice.gov.in',
            'Cookie': 'ASP.NET_SessionId=yp1w0kgknt5dvkaulywrhsck',
            'Origin': 'https://citizen.mahapolice.gov.in',
            'Referer': 'https://citizen.mahapolice.gov.in/Citizen/MH/SearchView.aspx'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        const $ = cheerio.load(response.data);

        const totalRecords = $('#ContentPlaceHolder1_lbltotalrecord').text().trim();
        const missingPersons = [];

        $('table.GridTable tr').each((index, element) => {
            // Skip the header row
            if (index === 0) return;

            // Find all columns (td elements) within the current row
            const columns = $(element).find('td');

            // console.log("Cols", columns)

            // Extract and log data from each column
            const serialNo = columns.eq(0).text().trim();
            const imageUrl = columns.eq(1).find('img').attr('src');
            const dateOfRegistration = columns.eq(2).text().trim();
            const missingPersonName = columns.eq(3).text().trim();
            const age = columns.eq(4).text().trim();
            const incidentPlace = columns.eq(5).text().trim();
            const policeStation = columns.eq(6).text().trim();
            const district = columns.eq(7).text().trim();

            missingPersons.push({
                srNo: parseInt(serialNo),
                imageUrl: imageUrl,
                dateOfRegistration: dateOfRegistration,
                nameOfMissingPerson: missingPersonName,
                age: parseInt(age),
                incidentPlace: incidentPlace,
                policeStation: policeStation,
                district: district
            });

            if (serialNo == 50) {
                return false; // Correct way to break out of a jQuery each loop
            }


        });

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + parseInt(pageSize);
        const paginatedPersons = missingPersons.slice(startIndex, endIndex);

        res.json({
            totalRecords: missingPersons.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(missingPersons.length / pageSize),
            pageSize: parseInt(pageSize),
            missingPersons: paginatedPersons
        });

    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Get img from url
app.get('/api/missing-person-image/:imgId', async (req, res) => {
    try {
        const imgId = req.params.imgId;
        const response = await axios({
            method: 'get',
            url: `https://citizen.mahapolice.gov.in/Citizen/PersonImageHandler.ashx?ImID=${imgId}&langcd=rGgGlAiFprg=&PersonType=mkcqhSd+vTY=`,
            headers: {
                'Cookie': 'ASP.NET_SessionId=yp1w0kgknt5dvkaulywrhsck',
            },
            responseType: 'stream'
        });

        // Forward the image response headers
        res.set('Content-Type', response.headers['content-type']);

        // Pipe the image data to the response
        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Error fetching image');
    }
});

// Middleware to handle file uploads
app.post('/api/complaint',upload.single('photo'),(req,res) => {
    console.log(req.body);
    console.log(req.files);
})


mongoose.connect(process.env.MONGODB_URL).
    then((response) => {
        console.log("Connected to DB");
        app.listen(4001, () => {
            console.log("Listening on port 4001");
        })
    }).catch((err) => {
        console.log(err);
    })