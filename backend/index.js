import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express'
import qs from 'qs'
import axios from 'axios';
import * as cheerio from 'cheerio';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Missing person search
app.get('/api/missingSearch', async (req, res) => {
    const {
      DateFrom = "15/01/2025",
      DateTo = "16/01/2025" ,
      AgeFrom = 0,
      AgeTo = 100,
      FirstName,
      MiddleName,
      LastName,
      District
    } = req.query;
  
    let data = qs.stringify(
      {
        'ctl00$ScriptManager1': 'ctl00$ContentPlaceHolder1$UpdatePanel2|ctl00$ContentPlaceHolder1$btnSearch',
        '__EVENTTARGET': '',
        '__EVENTARGUMENT': '',
        '__LASTFOCUS': '',
        '__VIEWSTATE': '0Va6/vcgQQo8diuTdYTozmLsokb9wsHxSF4AlalYqkoVaLu6It4J+RC7TH8uMjN4jFErpyggpfUPN++mOHrZsuhBS0GxpOFugL9Wl0Scsw8Ep1tWJA02Ntq1DIzd7hQkGAOB6QTziusFeZvwW3yfm+CpLrk6UeWmJEvyBjHit/MpIJJ+toEpcoBRI8J22bZ3H1NhNynqLdz+6ZTHGG7iSbFP9jnm3kF/BfWczcO3NU1wsYst2jQRCMenNMxa/uCPK+/X038wLWY+4W5pN1zz3cwqYW243syHiEAcbvC/voEOJCRfl6JTgnABWNwA0YbOB7eAzQC7xBHAHlAjZTz87gC51a0rx7KU9Xc1vFTAOLKwiE8Z21/vyYXmg+zKs5NmAGEDJPKbGVifvEoEr4bZgIo7qVeGEJCyLYadMNKO0UwsCUzGcLracBaKeUVvqybbbbgrd+RBjmwvs3rYO+9jeOpnfF42SBOUJJacuTgHDDaYBRbyB7CG7EbqHceqlfJ2Jl2HvNNKdyzTeX06WxcOYrLJHuM5JAlgvsnNbEjACWG0kot71F70xB2yuLJ40uRza21fzJnDsjaX69ZsAdHWMoDACDH4z09qB4a71ZP6+zJwanvhGwD8wzthfzaCaWlEAuk1/W9HZKK1ewx2p/h5qnr0b8Mw0RqMYZScZ12247tXdVecQjaIDeI7rwHJu6cHFok6DEB7MlUwPfHNjuu6wogJ2vF3+tVlpVMnAV+ac66efy3p2JnmeL3JxjoJvlUIeLoSF6Rqlj8bn/VMWZYTlZQr8cK85S1OMJ6w51Ab+m6lHqVdX8nSAlHG01F27H3O0426mSzyQVJ9vsHlHJxjLJYwMuqDo5kaSfjPJ9RJpnygizPPL7Ww7YarBRjHt8MD6G4VAtfk5HdZsDB3WRCK5gFt0jxyXp7V9IJT54Y8xjPQ8Ntf6hTRzi59CAJee4HlBlJm1b7Do9fo4iDtDYGydr6skd+m6fbiQtdKIUvrEqggioByYhfuxHdDCvM4iBYKK2/cGgGcPLdmQTsn4XowQ6rksTGzGlUMe7dACSvQsvV5ukE3JWcVrAGdIncew2QrS9MJt6XE1AKfyS7SDGlY1qbQt4gNgKR81aErTQuGi0epbCKECuT0/h9x7M4ENqBRm3co1u5SiSAtrw9SZc1Eh7wd8iCqdo+Bsy5Fl6sDQ+DQPg1qI16a0Tk7i3IiOfy/gS+22ELQmI1/c55ZLciCh8OI/3HfFU+4KZmXxIQWC+eAOxrE/x8HyxDN4bOwrdq5krcLgiUcI9IehjHqiBjg5eL7aFOYpKBzn3FnCE9yeahiYG5MbgldClEcytQIbif0T0TZpprwE0jjQm814LlY8/b22tpSknshL0kIW7qrrh13rTkBhAVvWz/IanMb3grwhC0iSx9yXwvCSEOP8meuCErnkEUW49vUe6JFq2hcQdLCMZtNnOWQsFMfPFOUqvLsqfTv3ln52dW8zLSvOmk3Lf/fDObxqohkY7O2JhDKHKO6NVxNg7tqNGZC680QRqdt5GpYP948GSSVtYFRhouahKXwAofXfzmzZt5QsyaNH8o2kQ5pN5kd2wCxWefE+b/9r83Uv7hAWMwNawuORCWM1e9G89iiTFkdcYSU5p0bLBRf+6m3Ag98Mo+8bnWLx5HHpodMca28TZbfla7skDrHsnzQHMaoDMXNnPY4yg7itWSB3Te81D3HktE8o8yrw4oHBICLMfaBmvqXTV39kDmNyIxm4TbViw43elWRWkj6CAposXpfw7vcDCIs/HRMnXBTGDO29A+kHW/jcsUABw1Myt2yPOvqgzOYzD2QlO68D0PDuQII9i5pe7eKXI64Eb/D5p1m8mF9OpiM+nHNd6liNabyHEZ5ghrZgR99HVQq+Zn4NAR9eB6hksZABDNDQ7OGtda24s5geJGX82dgqvti9wvBZGzBQ0+HCJf5KyrjfHNQZCRPOngsCwhyU2hdnnVUec4+noVjV2F81AwKtmoR3McqErqEKJlXdAVvRd+SgE2dQwnLmwEmLAmsCHI6alb3zVH/lW0WLix48bdY6GB88/243SxCBPppwG8uHTWd557vXnXwPJB/S7dnCbX9+1W/2r5O7v1D50I0+yHbHlcXyDHWAjlBeLRnZ1PR3f0/h3oyxgyljsgwc9GDQWuP3kSFOZdNhnezFHJ+kTv5bTlsD6hpZI4cFacxUpMY9TUJSrjqjPuD/lPx83oGAf1clI0YBwOBwenxuM1r29wXRoQDLhqnB34cXXpGApfg4Kx+P8tux9MKKnVzHq8KykGHhtBFdrOlhNhd17fyGoJYQsf3J/IhhKGXGIr6LFOZyBopCSU+Ki0bV9In9D107GGMU7u4S+F+aM319vmr9BQXXPjbYUG7UEGUlmXtnyhkDkbd275LMkTJPolaqCObcDRlhbhjHo6qccBpGbLa+2xxdqNCQG8DpZG66AAEj2OWdh4CaaaCjFAJBy2AONjw7+gaz2Y57r0pZaL6EN0broDgzVWF+5zSKkp3WiXq04j6i74uHpx8lCi7oL0J2Ibyo9pO54vyZdSRTaaX8J05SpQJwVR4UVBU2ByJqnqHDNaHQ+K+91wWCb9KLRpf3wwVEExbJJRaA0rPC6XUyinXXElPP96T3jxL7U6z5ESk1XCBNkA2D74thBB0jXhW60pREniMJ0SYcoE56seQiwuvNsGJlUbpDCZuHLslRA+pnOpiY0FYEJOhiwd5pJP1ZaWKZqahJAiwYZwPFDeWwLY75zmug4hoNAGBkpWMz+p9yGhsdREXUdaMxzs59B8GWRjeEXVP6RDeI5C3YNvDzdMqRDKPw1QlVKbYA7JOnaCtz216fWEDAWTup60JjlKmUGcuU931S6j7coxeLEBRL+C7mpnwD1ta40WcLK2xe9o6eeXGuZQTvImzsdExrCo2Gk5mb/dUqoR6warGVTNV98f1mxDIJqYPe2zgyTkYbTs687sMiwDY9JDj0IEkvWDBHN0NIAjWomFTS0tJp5tqZZ1MO3Gxaok8ZX+5F2jacZLpReQ4ZqGcZXR+BQ0eXuMyO0TJUwFhIG4Dlw/ryxEahAK0dalvDYKzgFfS7bA9uGImaTpzuHqguPG1m2Yd3T0UfcgVt6oocufjHCM2BqxHb+26Vub0WtoJE8AcxcIVsKi54kAlUMi5MD5LblYc7hXpI+MCOdbTaiLsrZqwApj52adxW3gFOOj7hmu7Q6AAg/jqGOHNQjOmnhGTPauzso8qT/KVK+IQNgabXL/ndnpCLABZXfJVOIsh05MHKxPOT1b3Evfqxq7JCBhkgUrDOJYD4NC4i9M6uf39tV2us2RMRC1dUuju58meI7YzlOSlnVg+1E2vgUiX5p91P3ih',
        '__VIEWSTATEGENERATOR': 'EFD4CB67',
        '__VIEWSTATEENCRYPTED': '',
        '__PREVIOUSPAGE': 'GLeyRDvHr4JXq41A9VW3uqrJRJF4Kl_4R0AKnVr6FqQLD0UQx_BfT1Pr0zPq9DAMxBTQuuFkRAHUzNuD4YqVHeqxLEyc1i3jykdhynvp3oeNj2pQ0',
        '__EVENTVALIDATION': 'HlxEh4GZQ4JnepXYdAMMN2qpv9ASIAQSgH9jfyWwDz7JDuOqATHyoIyKv1yE0xV5NzLRfIkWfXHeLpJJajXuwdXfZhiyyCdkV1S9DVIwBETrtBmAHICypofrBGbXAEGzg0dJhFjmlmDMOEzcfQyKSAiY9uzCzntyxewVE028eTkKGv8o5EoEZPY96ZddVoysOvR9/RitC4w6O4M6bTFwiea5T940buwFa+X7zVqsXbdTDFszaLREgH2O5rpVNQnGivHJt4tIMBB4IiogktzhWKeNc3epEeDvdqCwVbDIhrH53PoNjOrlW99AIrzi4eCEcyqHa1K0NFIDhGzZo2PVJQLcx6VHF53TXEMcdUFqpl3vdZTTvZfXly5+qtqm4apu62pmhH6R0gm3ePXymr36lgSUvUGRKGmAfGiyWfb/hPxY69NN2o415iWL8QH6uar/nJl/nK7AoVm/KitbNNcovphKD3DXRHgFviOgj0GB8ECkXG8TcNwd9y9Xu3i4pZvI+LAHhhpL7jggjA0L5StB/88l8CPNL8LqLuchHOK1ErW1ss1LfEUufufA8fAJ1HgCoJVWP+LOg0XfOX0fwIRqsaeM0+tycd8dTJ5WwYrdBv7nVRLJLbhrnoKAOjIQf2813LN0mGh5dnViJZ/nTbSHju9Ljln+/VwcxgmgFXNqfEKWTztI3ZwuFsPcOX8/AFkKn5Xa3649gpkZajxBOhTuwjtC+MbcNsP/v29iFJi2DyXbODRiYAnTITLFdQq1KAmkqq6LyhLYoPAFYIybS7jJTYndgCoHyoXANOHtJvZmbE9W1gtT7EZlWUWSJC/VI/JGrRZDmsHvdEpBMroVu9HeRNGvhdALNnD53cTklfQo5dr7/hIlnyj7fR/xJ0kPvtZjISSPSayX9Fomp6oApD6Sri20bA84Vnx81jkzadFPOXsikqJu',
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
      console.log("Response received:", response.status, response.statusText);
      const $ = cheerio.load(response.data);
      console.log('Cheerio initialized');
  
      const totalRecords = $('#ContentPlaceHolder1_lbltotalrecord').text().trim();
  
      console.log('Starting to parse table rows');
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
  
      res.json({
        totalRecords: missingPersons.length,
        missingPersons: missingPersons
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
});

// Generate csv file
app.get('/api/missingSearch2', async (req, res) => {
    const {
      DateFrom = "15/01/2025",
      DateTo = "16/01/2025" ,
      AgeFrom = 0,
      AgeTo = 100,
      FirstName,
      MiddleName,
      LastName,
      District
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
        '__PREVIOUSPAGE': 'GLeyRDvHr4JXq41A9VW3uqrJRJF4Kl_4R0AKnVr6FqQLD0UQx_BfT1Pr0zPq9DAMxBTQuuFkRAHUzNuD4YqVHeqxLEyc1i3jykdhynvp3oeNj2pQ0',
        '__EVENTVALIDATION': 'HlxEh4GZQ4JnepXYdAMMN2qpv9ASIAQSgH9jfyWwDz7JDuOqATHyoIyKv1yE0xV5NzLRfIkWfXHeLpJJajXuwdXfZhiyyCdkV1S9DVIwBETrtBmAHICypofrBGbXAEGzg0dJhFjmlmDMOEzcfQyKSAiY9uzCzntyxewVE028eTkKGv8o5EoEZPY96ZddVoysOvR9/RitC4w6O4M6bTFwiea5T940buwFa+X7zVqsXbdTDFszaLREgH2O5rpVNQnGivHJt4tIMBB4IiogktzhWKeNc3epEeDvdqCwVbDIhrH53PoNjOrlW99AIrzi4eCEcyqHa1K0NFIDhGzZo2PVJQLcx6VHF53TXEMcdUFqpl3vdZTTvZfXly5+qtqm4apu62pmhH6R0gm3ePXymr36lgSUvUGRKGmAfGiyWfb/hPxY69NN2o415iWL8QH6uar/nJl/nK7AoVm/KitbNNcovphKD3DXRHgFviOgj0GB8ECkXG8TcNwd9y9Xu3i4pZvI+LAHhhpL7jggjA0L5StB/88l8CPNL8LqLuchHOK1ErW1ss1LfEUufufA8fAJ1HgCoJVWP+LOg0XfOX0fwIRqsaeM0+tycd8dTJ5WwYrdBv7nVRLJLbhrnoKAOjIQf2813LN0mGh5dnViJZ/nTbSHju9Ljln+/VwcxgmgFXNqfEKWTztI3ZwuFsPcOX8/AFkKn5Xa3649gpkZajxBOhTuwjtC+MbcNsP/v29iFJi2DyXbODRiYAnTITLFdQq1KAmkqq6LyhLYoPAFYIybS7jJTYndgCoHyoXANOHtJvZmbE9W1gtT7EZlWUWSJC/VI/JGrRZDmsHvdEpBMroVu9HeRNGvhdALNnD53cTklfQo5dr7/hIlnyj7fR/xJ0kPvtZjISSPSayX9Fomp6oApD6Sri20bA84Vnx81jkzadFPOXsikqJu',
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
        const missingPersons = [];
        
        $('table.GridTable tr').each((index, element) => {
            if (index === 0) return;
            
            const columns = $(element).find('td');
            const relativeImageUrl = columns.eq(1).find('img').attr('src');
            
            // Fix image URL by preserving the handler path
            const absoluteImageUrl = relativeImageUrl ? 
                `https://citizen.mahapolice.gov.in/Citizen${relativeImageUrl.replace('..', '')}` : 
                null;
            
            const person = {
                srNo: parseInt(columns.eq(0).text().trim()),
                imageUrl: absoluteImageUrl,
                dateOfRegistration: columns.eq(2).text().trim(),
                nameOfMissingPerson: columns.eq(3).text().trim(),
                age: parseInt(columns.eq(4).text().trim()),
                incidentPlace: columns.eq(5).text().trim(),
                policeStation: columns.eq(6).text().trim(),
                district: columns.eq(7).text().trim()
            };
            
            missingPersons.push(person);
            
            if (person.srNo == 50) return false;
        });

        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            path: path.join(__dirname, 'missing_persons.csv'),
            header: [
                {id: 'srNo', title: 'SR_NO'},
                {id: 'imageUrl', title: 'IMAGE_URL'},
                {id: 'dateOfRegistration', title: 'DATE_OF_REGISTRATION'},
                {id: 'nameOfMissingPerson', title: 'NAME'},
                {id: 'age', title: 'AGE'},
                {id: 'incidentPlace', title: 'INCIDENT_PLACE'},
                {id: 'policeStation', title: 'POLICE_STATION'},
                {id: 'district', title: 'DISTRICT'}
            ]
        });

        // Write data to CSV
        await csvWriter.writeRecords(missingPersons);

        res.json({
            totalRecords: missingPersons.length,
            missingPersons: missingPersons,
            csvPath: path.join(__dirname, 'missing_persons.csv')
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});

app.listen(4001);