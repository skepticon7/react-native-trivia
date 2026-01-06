import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react-native';

// Map your local topic IDs to OpenTDB Category IDs
const CATEGORY_MAP = {
  science: 17,
  history: 23,
  geography: 22,
  sports: 21,
  movies: 11,
  technology: 18,
};

// Helper to decode HTML entities (API returns "Don&quot;t" instead of "Don't")
const decodeHtml = (html) => {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

const QuizScreen = ({ route, navigation }) => {
  const { topicId } = route.params; // Get topic passed from Home
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // --- 1. FETCH QUESTIONS ---
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const categoryId = CATEGORY_MAP[topicId] || 9; // Default to General Knowledge if map fails
      const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        // Format questions
        const formattedQuestions = data.results.map((q) => {
          // Get 1 correct + 2 incorrect (to make 3 choices total as requested)
          const incorrect = q.incorrect_answers.slice(0, 2); 
          const allAnswers = [...incorrect, q.correct_answer];
          
          // Shuffle answers
          const shuffled = allAnswers.sort(() => Math.random() - 0.5);

          return {
            question: decodeHtml(q.question),
            correctAnswer: decodeHtml(q.correct_answer),
            options: shuffled.map(a => decodeHtml(a)),
          };
        });
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      Alert.alert("Error", "Could not load questions. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLE ANSWER PRESS ---
  const handleAnswer = (answer) => {
    if (selectedAnswer) return; // Prevent double clicking

    setSelectedAnswer(answer);
    
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Wait 1 second, then go to next question
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(isCorrect ? score + 1 : score); // Pass updated score
      }
    }, 1000);
  };

  // --- 3. FINISH QUIZ LOGIC ---
  const finishQuiz = async (finalScore) => {
    setIsFinished(true);
    
    // Save to History via AsyncStorage
    const newEntry = {
      topic: topicId,
      score: finalScore,
      total: 10,
      date: new Date().toISOString(),
    };

    try {
      // 1. Update Quiz History list
      const existingHistory = await AsyncStorage.getItem('quizHistory');
      const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
      historyArray.push(newEntry);
      await AsyncStorage.setItem('quizHistory', JSON.stringify(historyArray));

      // 2. Update Daily Progress
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem('lastQuizDate');
      let dailyCount = 0;
      
      if (storedDate === today) {
        const storedCount = await AsyncStorage.getItem('quizzesToday');
        dailyCount = storedCount ? parseInt(storedCount) : 0;
      }
      
      // Increment only if less than 10 (or keep going if you want)
      if (dailyCount < 10) {
        await AsyncStorage.setItem('quizzesToday', (dailyCount + 1).toString());
        await AsyncStorage.setItem('lastQuizDate', today);
      }
      
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  // --- 4. RENDER UI ---

  // Loading State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Preparing your quiz...</Text>
      </View>
    );
  }

  // Result State
  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.emojiDisplay}>🏆</Text>
          <Text style={styles.resultTitle}>Quiz Completed!</Text>
          <Text style={styles.resultScore}>You scored {score} / 10</Text>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Quiz Playing State
  const currentQuestion = questions[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Question {currentIndex + 1}/10
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${(currentIndex + 1) * 10}%` }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.questionText}>
          {currentQuestion?.question}
        </Text>

        <View style={styles.optionsContainer}>
          {currentQuestion?.options.map((option, index) => {
            // Determine Button Style
            let btnStyle = styles.optionBtn;
            let textStyle = styles.optionText;
            let IconComponent = null;

            if (selectedAnswer) {
              if (option === currentQuestion.correctAnswer) {
                // This is the correct answer -> Green
                btnStyle = [styles.optionBtn, styles.correctBtn];
                textStyle = [styles.optionText, styles.whiteText];
                IconComponent = <CheckCircle size={20} color="#fff" />;
              } else if (option === selectedAnswer) {
                // This is the WRONG answer the user picked -> Red
                btnStyle = [styles.optionBtn, styles.wrongBtn];
                textStyle = [styles.optionText, styles.whiteText];
                IconComponent = <XCircle size={20} color="#fff" />;
              } else {
                // Unselected options -> Dimmed
                btnStyle = [styles.optionBtn, { opacity: 0.5 }];
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={btnStyle}
                onPress={() => handleAnswer(option)}
                disabled={selectedAnswer !== null} // Disable clicks after choice
              >
                <Text style={textStyle}>{option}</Text>
                {IconComponent}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Progress Bar
  progressBarBg: {
    height: 6,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#09090b', // Primary Black
    borderRadius: 3,
  },

  // Question Area
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center', // Centers content vertically
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#09090b',
    textAlign: 'center',
    marginBottom: 40,
  },
  
  // Options
  optionsContainer: {
    gap: 16,
  },
  optionBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1, // Wraps text if long
  },
  
  // States
  correctBtn: {
    backgroundColor: '#22c55e', // Green
    borderColor: '#22c55e',
  },
  wrongBtn: {
    backgroundColor: '#ef4444', // Red
    borderColor: '#ef4444',
  },
  whiteText: {
    color: '#fff',
  },

  // Results Screen
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emojiDisplay: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#09090b',
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 20,
    color: '#71717a',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#09090b',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizScreen;