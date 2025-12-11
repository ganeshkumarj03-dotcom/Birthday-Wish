import { BirthdayData } from '../types';

// We are now using JSONBlob.com as a free, no-login cloud database.
// This allows the data to be saved on a server so it can be accessed 
// from any device (Laptop -> Mobile).

const API_BASE_URL = 'https://jsonblob.com/api/jsonBlob';

export const saveBirthdayData = async (data: BirthdayData): Promise<string> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // The API returns the location of the saved data in the header
    // Example: https://jsonblob.com/api/jsonBlob/12345-67890-abcd
    const location = response.headers.get('Location') || response.headers.get('location');
    
    if (!location) {
        throw new Error("No location header returned from storage service. Your browser might be blocking headers.");
    }

    // Extract the ID from the end of the URL
    const id = location.split('/').pop();
    
    if (!id) {
         throw new Error("Could not parse ID from location header");
    }

    return id;
  } catch (error) {
    console.error("Error saving to database:", error);
    throw error;
  }
};

export const getBirthdayData = async (id: string): Promise<BirthdayData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data as BirthdayData;
  } catch (error) {
    console.error("Error fetching from database:", error);
    return null;
  }
};