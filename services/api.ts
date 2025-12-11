import { BirthdayData } from '../types';

// Switching to ByteBin which returns the key in the JSON body.
// This avoids the "Location Header" CORS issue prevalent on mobile browsers with JsonBlob.
const API_BASE_URL = 'https://bytebin.lucko.me';

export const saveBirthdayData = async (data: BirthdayData): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Storage service error: ${response.status}`);
    }

    const responseData = await response.json();
    
    // ByteBin returns { "key": "..." }
    if (!responseData.key) {
        throw new Error("Invalid response from storage service");
    }

    return responseData.key;
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