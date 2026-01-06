import axios from 'axios';
export const getQuestions = async (categoryId) => {
    const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`;
    try {
        return await axios.get(url);
    }catch (e) {
        throw e;
    }
}