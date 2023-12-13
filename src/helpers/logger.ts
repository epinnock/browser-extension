import { LOGGING_ENDPOINT } from "../constants";


export async function logToRemote(data: any, url: string = LOGGING_ENDPOINT): Promise<Response> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
    } catch (error: any) {
        console.log(`Failed to send POST request: ${error.message}`);
        throw error;
    }
}
   
