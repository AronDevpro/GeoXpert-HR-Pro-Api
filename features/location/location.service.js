
export const fetchLocation = async (data) => {
    try {
        const query = data.query;
        const limit = data.limit || 10;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?addressdetails=1&q=${query}&format=jsonv2&limit=${limit}`);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error searching: ${error.message}`);
    }
};