import {useEffect, useState} from "react";
import {Toast} from 'toastify-react-native';
import {getQuizSessionFromFirebase, saveQuizSessionToFirebase} from "../services/firebaseService";
import {getQuestions} from "../services/api";
import QuizScreen from "./QuizScreen";
import {ActivityIndicator, Text, View} from "react-native";

const CATEGORY_MAP = {
    science: 17,
    history: 23,
    geography: 22,
    sports: 21,
    movies: 11,
    technology: 18,
};

const decodeHtml = (html) => {
    return html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
};

const QuizController = ({route , navigation}) => {
    const {topicId} = route?.params;
    const [questions , setQuestions] = useState([]);
    const [currentIndex , setCurrentIndex] = useState(0);
    const [score , setScore] = useState(0);
    const [loading , setLoading] = useState(true);


    const initQuiz = async () => {
        try{
            const session = await getQuizSessionFromFirebase(topicId);

            console.log(session);
            if(session?.questions?.length) {
                console.log("here in true")
                setQuestions(session.questions);
                setCurrentIndex(session.currentIndex || 0);
                setScore(session.score || 0);
            } else{
               const categoryId = CATEGORY_MAP[topicId] || 0;
               const questionsResponse = await getQuestions(categoryId);
               const data = questionsResponse.data;
               const formatted = data.results.map((q) => {
                    const allAnswers = [...q.incorrect_answers.slice(0, 2), q.correct_answer];
                    const shuffled = allAnswers.sort(() => Math.random() - 0.5);
                    return {
                        question: decodeHtml(q.question),
                        correctAnswer: decodeHtml(q.correct_answer),
                        options: shuffled.map(decodeHtml),
                        userAnswer: null, // placeholder
                    };
               });
               setQuestions(formatted);
               setCurrentIndex(0);
               setScore(0);

               await saveQuizSessionToFirebase(topicId , formatted , 0 , 0);
            }
        }catch (e) {
            console.log(`Error : ${e}`);
            Toast.error("Could not load quiz." , 'bottom');
        } finally {
          setLoading(false);
        }
    }

    useEffect(() => {
        initQuiz();
    }, [topicId]);

    useEffect(() => {
        console.log(questions);
    }, [questions]);

    if(loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10 }}>Preparing your quiz...</Text>
            </View>
        );
    }

    return (
        <QuizScreen
            navigation={navigation}
            topicId={topicId}
            questions={questions}
            currentIndex={currentIndex}
            score={score}
            setCurrentIndex={setCurrentIndex}
            setScore={setScore}
        />
    );

}



export default QuizController;