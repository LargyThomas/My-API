// Receive the request / call service / send response
const { findAllAnimals } = require('./animals.service');

// Function to parse pagination parameters from the request query
function parsePagination(query) {
    const MAX_LIMIT = 20;

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || MAX_LIMIT));
    const offset = (page - 1) * limit;
    
    return { page, limit, offset };
}

// Controller function to handle the request for retrieving all animals
const allAnimals = async (req, res) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);
        const result = await findAllAnimals({ page, limit, offset });
        
        res.status(200).json({ message: "Animals information has been recovered.\n", data: result.data, pagination: result.pagination});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error server. Please try again later.\n" });
    }
};

module.exports = { allAnimals };