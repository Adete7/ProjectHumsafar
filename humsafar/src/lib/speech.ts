import { LanguageCode } from '@/types';

// BCP-47 language tag mapping
export const LANG_BCP47_MAP: Record<string, LanguageCode> = {
  hi: 'hi-IN',
  en: 'en-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  'hi-IN': 'hi-IN',
  'en-IN': 'en-IN',
  'ta-IN': 'ta-IN',
  'te-IN': 'te-IN',
  'bn-IN': 'bn-IN',
  'mr-IN': 'mr-IN',
  'gu-IN': 'gu-IN',
};

const DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  'hi-IN': {
    'MEDICINE_TAKEN': 'दवा ले ली गई है। बहुत बढ़िया!',
    'SOS_TRIGGERED': 'आपातकालीन सहायता अलर्ट परिवार को भेज दिया गया है।',
    'CHECKING_SCAM': 'संदेश की सुरक्षा जांच हो रही है। कृपया प्रतीक्षा करें।',
    'BILL_PAID': 'बिल का सुरक्षित भुगतान सफलतापूर्वक हो गया है।',
    'GREETING': 'नमस्ते दादाजी! आपका हमसफ़र तैयार है।',
    'MIC_LISTENING': 'मैं सुन रहा हूँ, कृपया बोलिए...',
    'MIC_DENIED': 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में अनुमति दें।',
    'MIC_TIMEOUT': 'कोई आवाज़ सुनाई नहीं दी। कृपया दोबारा प्रयास करें।',
  },
  'en-IN': {
    'MEDICINE_TAKEN': 'Medicine recorded as taken. Great job!',
    'SOS_TRIGGERED': 'Emergency SOS alert broadcast to family members.',
    'CHECKING_SCAM': 'Analyzing message for fraud threats. Please wait.',
    'BILL_PAID': 'Bill paid successfully with security cap active.',
    'GREETING': 'Welcome! Your Humsafar companion is ready.',
    'MIC_LISTENING': 'Listening... Please speak now.',
    'MIC_DENIED': 'Microphone permission was denied. Please allow microphone access.',
    'MIC_TIMEOUT': 'No speech detected. Please try tapping the microphone again.',
  },
  'ta-IN': {
    'MEDICINE_TAKEN': 'மருந்து உட்கொள்ளப்பட்டது. நன்று!',
    'SOS_TRIGGERED': 'அவசர உதவி எச்சரிக்கை குடும்பத்திற்கு அனுப்பப்பட்டது.',
    'CHECKING_SCAM': 'மோசடி செய்தி சரிபார்க்கப்படுகிறது. காத்திருக்கவும்.',
    'BILL_PAID': 'பில் பாதுகாப்பாக செலுத்தப்பட்டது.',
    'GREETING': 'வணக்கம்! உங்கள் ஹம்சஃபர் தயார்.',
    'MIC_LISTENING': 'கேட்கிறேன், தயவுசெய்து பேசுங்கள்...',
    'MIC_DENIED': 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது.',
    'MIC_TIMEOUT': 'குரல் கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
  'te-IN': {
    'MEDICINE_TAKEN': 'మందులు తీసుకున్నారు. చాలా మంచిది!',
    'SOS_TRIGGERED': 'అత్యవసర సహాయ హెచ్చరిక కుటుంబానికి పంపబడింది.',
    'CHECKING_SCAM': 'మోసపూరిత సందేశం తనిఖీ చేయబడుతోంది.',
    'BILL_PAID': 'బిల్లు సురక్షితంగా చెల్లించబడింది.',
    'GREETING': 'నమస్కారం! మీ హమ్‌సఫర్ సిద్ధంగా ఉంది.',
    'MIC_LISTENING': 'వింటున్నాను, దయచేసి మాట్లాడండి...',
    'MIC_DENIED': 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది.',
    'MIC_TIMEOUT': 'స్వరం వినిపించలేదు. మళ్లీ ప్రయత్నించండి.',
  },
  'bn-IN': {
    'MEDICINE_TAKEN': 'ওষুধ গ্রহণ করা হয়েছে। খুব ভালো!',
    'SOS_TRIGGERED': 'পরিবারকে জরুরী সতর্কবার্তা পাঠানো হয়েছে।',
    'CHECKING_SCAM': 'প্রতারণামূলক বার্তা পরীক্ষা করা হচ্ছে।',
    'BILL_PAID': 'বিল নিরাপদে পরিশোধ করা হয়েছে।',
    'GREETING': 'নমস্কার! আপনার হামসফর প্রস্তুত।',
    'MIC_LISTENING': 'শুনছি, অনুগ্রহ করে বলুন...',
    'MIC_DENIED': 'মাইক্রোফোনের অনুমতি পাওয়া যায়নি।',
    'MIC_TIMEOUT': 'কোন শব্দ শোনা যায়নি। আবার চেষ্টা করুন।',
  },
  'mr-IN': {
    'MEDICINE_TAKEN': 'औषध घेतले आहे. छान!',
    'SOS_TRIGGERED': 'कुटुंबाला तातडीची मदत अलर्ट पाठवला आहे.',
    'CHECKING_SCAM': 'फसवणूक संदेश तपासला जात आहे.',
    'BILL_PAID': 'बिल सुरक्षितपणे भरले आहे.',
    'GREETING': 'नमस्कार! तुमचा हमसफर सज्ज आहे.',
    'MIC_LISTENING': 'ऐकत आहे, कृपया बोला...',
    'MIC_DENIED': 'मायक्रोफोन परवानगी नाकारली गेली.',
    'MIC_TIMEOUT': 'आवाज आला नाही. कृपया पुन्हा प्रयत्न करा.',
  },
  'gu-IN': {
    'MEDICINE_TAKEN': 'દવા લઈ લીધી છે. સરસ!',
    'SOS_TRIGGERED': 'પરિવારને કટોકટી ચેતવણી મોકલાઈ છે.',
    'CHECKING_SCAM': 'છેતરપિંડી સંદેશ તપાસાઈ રહ્યો છે.',
    'BILL_PAID': 'બિલ સુરક્ષિત રીતે ચૂકવાઈ ગયું છે.',
    'GREETING': 'નમસ્તે! તમારો હમસફર તૈયાર છે.',
    'MIC_LISTENING': 'સાંભળી રહ્યો છું, કૃપા કરીને બોલો...',
    'MIC_DENIED': 'માઇક્રોફોન પરવાનગી મળી નથી.',
    'MIC_TIMEOUT': 'અવાજ સંભળાયો નથી. ફરી પ્રયાસ કરો.',
  },
};

/**
 * Text-to-Speech Engine with Regional Dialect Matching and Safe Fallbacks
 */
export function speakText(text: string, langCodeInput: string = 'hi-IN'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const langCode: LanguageCode = LANG_BCP47_MAP[langCodeInput] || 'hi-IN';

  // Cancel ongoing speech to avoid queue buildup
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.85; // Slowed articulation tailored for senior citizens
  utterance.pitch = 1.0;

  const selectVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const shortLang = langCode.split('-')[0].toLowerCase();

    // 1. Exact BCP-47 match (e.g. hi-IN)
    let matched = voices.find((v) => v.lang.toLowerCase() === langCode.toLowerCase());

    // 2. Language prefix match (e.g. hi)
    if (!matched) {
      matched = voices.find((v) => v.lang.toLowerCase().startsWith(shortLang));
    }

    // 3. Indian English fallback (familiar cadence for Indian devices)
    if (!matched) {
      matched = voices.find((v) => v.lang.toLowerCase().startsWith('en-in'));
    }

    // 4. Any English or default voice
    if (!matched) {
      matched = voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0];
    }

    if (matched) {
      utterance.voice = matched;
    }
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      selectVoice();
      window.speechSynthesis.speak(utterance);
    };
  } else {
    selectVoice();
    window.speechSynthesis.speak(utterance);
  }
}

export function speakPhrase(textKey: string, langCodeInput: string = 'hi-IN', customText?: string): void {
  const langCode: LanguageCode = LANG_BCP47_MAP[langCodeInput] || 'hi-IN';
  const phrase = customText || DICTIONARY[langCode]?.[textKey] || DICTIONARY['en-IN'][textKey] || textKey;
  speakText(phrase, langCode);
}

/**
 * Microphone Speech Recognition with Visual Feedback and Graceful Error Handling
 */
export function startListening(
  langCodeInput: string = 'hi-IN',
  onResult: (text: string) => void,
  onError?: (err: any) => void,
  onStart?: () => void,
  onEnd?: () => void
): any {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("Speech recognition is not supported in this browser environment.");
    const unsupportedErr = new Error("SPEECH_NOT_SUPPORTED");
    if (onError) onError(unsupportedErr);
    speakPhrase('MIC_DENIED', langCodeInput, 'इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है।');
    return null;
  }

  const langCode: LanguageCode = LANG_BCP47_MAP[langCodeInput] || 'hi-IN';
  const recognition = new SpeechRecognition();

  recognition.lang = langCode;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results?.[0]?.[0]?.transcript || '';
    if (transcript) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn("Speech recognition error event:", event.error);
    if (event.error === 'not-allowed') {
      speakPhrase('MIC_DENIED', langCode);
    } else if (event.error === 'no-speech') {
      speakPhrase('MIC_TIMEOUT', langCode);
    }
    if (onError) onError(event);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (e) {
    console.error("Failed to start speech recognition:", e);
    if (onError) onError(e);
    return null;
  }
}
