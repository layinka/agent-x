import axios from 'axios';

export class DefiLlamaApi {
  private readonly Base_URL = 'https://api.llama.fi';
  private readonly Yield_Url = 'https://yields.llama.fi';

  constructor() // private readonly apiKey: string
  {}

  //   Get Protocols Request
  async makeRequest<T>(endpoint: string): Promise<any> {
    const url = `${this.Base_URL}${endpoint}`;

    try {
      const response = await axios.get(url.toString(), {
        headers: { Accept: 'application/json' },
      });

      if (!response.data) {
        throw new Error('No data returned from Defi Llama API');
      }

      return response.data;
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  async makeProtocolRequestWithParams<T>(
    endpoint: string,
    params: string,
  ): Promise<any> {
    const url = `${this.Base_URL}${endpoint}/${params}`;

    try {
      const response = await axios.get(url.toString(), {
        headers: { Accept: 'application/json' },
      });

      if (!response.data) {
        throw new Error('No data returned from API');
      }

      return response.data;
    } catch (error) {
      return ` Error fetching data: ${error}.`;
    }
  }

  // Get Yields and Pools  Request
  async makeYieldsRequest<T>(endpoint: string): Promise<any[]> {
    const url = `${this.Yield_Url}${endpoint}`;
    try {
      const response = await axios.get(url.toString(), {
        headers: { Accept: 'application/json' },
        // timeout: 60000,
      });

      // Validate the response data
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('No data returned from API or data is not an object');
      }

      // Extract the array from the 'data' key
      const dataArray = response.data.data;
      if (!Array.isArray(dataArray)) {
        throw new Error(
          "Unexpected data format: Expected an array under 'data'",
        );
      }
      return dataArray;
    } catch (error) {
      console.error('Error fetching data: ', error);
      throw error;
    }
  }
}
