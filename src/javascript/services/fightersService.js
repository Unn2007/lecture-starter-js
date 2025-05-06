import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    #endpointFighter = '../../../resources/api/details/fighter/';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        // todo: implement this method
        // endpoint - `details/fighter/${id}.json`;

        try {
            const response = await fetch(`${this.#endpointFighter}${id}.json`);

            return response.json();
        } catch (error) {
            console.error('Failed to fetch fighter details:', error);
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
