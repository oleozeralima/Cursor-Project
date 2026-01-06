// Supabase integration for quiz answers
// This file handles saving and loading quiz responses to/from Supabase

// Save quiz answers to Supabase
async function saveAnswersToSupabase(answers) {
    console.log('💾 saveAnswersToSupabase called with', answers.length, 'answers');
    
    // Always save to localStorage first (backup)
    localStorage.setItem('hypeAnswers', JSON.stringify(answers));
    
    if (!checkSupabaseAvailableQuiz()) {
        console.warn('⚠️ Supabase not available, saved to localStorage only');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
    if (!currentUser.id) {
        console.warn('⚠️ User has no ID, saved to localStorage only');
        return;
    }
    
    console.log('✅ Supabase available, saving answers for user:', currentUser.id);
    
    try {
        const client = getSupabaseClientQuiz();
        
        // Prepare responses to insert (only valid answers)
        const responses = answers
            .map((answer, index) => ({
                user_id: currentUser.id,
                question_id: index + 1, // Questions are 1-indexed
                answer: answer
            }))
            .filter(r => r.answer !== null && r.answer !== undefined && r.answer !== 0);
        
        console.log('📤 Inserting', responses.length, 'responses to Supabase');
        
        if (responses.length > 0) {
            // Delete existing responses for this user first
            const { error: deleteError } = await client
                .from('quiz_responses')
                .delete()
                .eq('user_id', currentUser.id);
            
            if (deleteError) {
                console.warn('⚠️ Error deleting old responses (might not exist):', deleteError);
            }
            
            // Insert new responses
            const { data, error } = await client
                .from('quiz_responses')
                .insert(responses)
                .select();
            
            if (error) {
                console.error('❌ Error saving answers to Supabase:', error);
                throw error;
            } else {
                console.log('✅ Successfully saved', data.length, 'responses to Supabase');
            }
        } else {
            console.log('ℹ️ No valid responses to save');
        }
    } catch (error) {
        console.error('❌ Error connecting to Supabase:', error);
        // Data already saved to localStorage as backup
    }
}

// Helper function to check if Supabase is available
function checkSupabaseAvailableQuiz() {
    if (typeof window.isSupabaseAvailable === 'function') {
        return window.isSupabaseAvailable();
    }
    if (typeof isSupabaseAvailable === 'function') {
        return isSupabaseAvailable();
    }
    const client = window.supabaseClient;
    return client !== null && typeof client !== 'undefined' && typeof client.from === 'function';
}

// Helper function to get Supabase client
function getSupabaseClientQuiz() {
    return window.supabaseClient || (typeof supabaseClient !== 'undefined' ? supabaseClient : null);
}

// Load quiz answers from Supabase
async function loadAnswersFromSupabase(totalQuestions) {
    if (!checkSupabaseAvailableQuiz()) {
        // Fallback to localStorage
        const saved = localStorage.getItem('hypeAnswers');
        if (saved) {
            const loadedAnswers = JSON.parse(saved);
            if (loadedAnswers.length === totalQuestions) {
                return loadedAnswers.map(value => (value === 0 ? null : value));
            }
        }
        return null;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
    if (!currentUser.id) {
        // Fallback to localStorage
        const saved = localStorage.getItem('hypeAnswers');
        if (saved) {
            const loadedAnswers = JSON.parse(saved);
            if (loadedAnswers.length === totalQuestions) {
                return loadedAnswers.map(value => (value === 0 ? null : value));
            }
        }
        return null;
    }
    
    try {
        const client = getSupabaseClientQuiz();
        const { data, error } = await client
            .from('quiz_responses')
            .select('question_id, answer')
            .eq('user_id', currentUser.id)
            .order('question_id', { ascending: true });
        
        if (error) {
            console.error('Error loading answers from Supabase:', error);
            // Fallback to localStorage
            const saved = localStorage.getItem('hypeAnswers');
            if (saved) {
                const loadedAnswers = JSON.parse(saved);
                if (loadedAnswers.length === totalQuestions) {
                    return loadedAnswers.map(value => (value === 0 ? null : value));
                }
            }
            return null;
        }
        
        if (data && data.length > 0) {
            // Convert array of responses to answer array
            const answers = new Array(totalQuestions).fill(null);
            data.forEach(response => {
                const index = response.question_id - 1; // Convert to 0-based index
                if (index >= 0 && index < totalQuestions) {
                    answers[index] = response.answer;
                }
            });
            
            // Also save to localStorage as backup
            localStorage.setItem('hypeAnswers', JSON.stringify(answers));
            
            return answers;
        }
        
        // No data found, try localStorage
        const saved = localStorage.getItem('hypeAnswers');
        if (saved) {
            const loadedAnswers = JSON.parse(saved);
            if (loadedAnswers.length === totalQuestions) {
                return loadedAnswers.map(value => (value === 0 ? null : value));
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error connecting to Supabase:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('hypeAnswers');
        if (saved) {
            const loadedAnswers = JSON.parse(saved);
            if (loadedAnswers.length === totalQuestions) {
                return loadedAnswers.map(value => (value === 0 ? null : value));
            }
        }
        return null;
    }
}

// Save quiz session (when quiz is completed)
async function saveQuizSession(answers, big5Scores) {
    console.log('💾 saveQuizSession called');
    console.log('Answers:', answers);
    console.log('Big5 Scores:', big5Scores);
    
    if (!checkSupabaseAvailableQuiz()) {
        console.warn('⚠️ Supabase not available, skipping session save');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
    if (!currentUser.id) {
        console.warn('⚠️ User has no ID, skipping session save');
        return;
    }
    
    console.log('✅ Saving quiz session for user:', currentUser.id);
    
    try {
        const client = getSupabaseClientQuiz();
        const { data, error } = await client
            .from('quiz_sessions')
            .insert([{
                user_id: currentUser.id,
                answers: answers,
                big5_scores: big5Scores
            }])
            .select();
        
        if (error) {
            console.error('❌ Error saving quiz session to Supabase:', error);
        } else {
            console.log('✅ Successfully saved quiz session to Supabase:', data);
        }
    } catch (error) {
        console.error('❌ Error connecting to Supabase:', error);
    }
}
