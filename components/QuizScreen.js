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
import {saveQuizHistoryToFirebase, saveQuizSessionToFirebase} from "../services/firebaseService";

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

const QuizScreen = ({ navigation , topicId , questions , currentIndex , setCurrentIndex , score , setScore }) => {

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);


  // --- 2. HANDLE ANSWER PRESS ---
  const handleAnswer = async (answer) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    await saveQuizSessionToFirebase(topicId, questions, currentIndex + 1, newScore);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(newScore);
      }
    }, 1000);

  };

  const finishQuiz = async (finalScore) => {
    setIsFinished(true);
    try {
      await saveQuizHistoryToFirebase(topicId , finalScore);
      // Optionally, remove the Firebase session so next quiz is fresh
      await saveQuizSessionToFirebase(topicId, [], 0, 0);
    } catch (e) {
      console.log('Failed to save progress', e);
    }
  };



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