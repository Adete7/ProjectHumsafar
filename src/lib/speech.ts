import { LanguageCode, LanguageOption } from "@/types";

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "hi-IN", label: "हिंदी", nativeName: "हिन्दी", greeting: "नमस्ते दादाजी! हमसफ़र में आपका स्वागत है।" },
  { code: "en-IN", label: "English", nativeName: "English (India)", greeting: "Hello! Welcome to your Humsafar companion." },
  { code: "ta-IN", label: "தமிழ்", nativeName: "தமிழ்", greeting: "வணக்கம்! ஹம்சஃபர் உங்களை வரவேற்கிறது." },
  { code: "te-IN", label: "తెలుగు", nativeName: "తెలుగు", greeting: "నమస్కారం! హంసఫర్‌కు స్వాగతం." },
  { code: "bn-IN", label: "বাংলা", nativeName: "বাংলা", greeting: "নমস্কার! হামসফরে আপনাকে স্বাগতম।" },
  { code: "mr-IN", label: "मराठी", nativeName: "मराठी", greeting: "नमस्कार! हमसफर मध्ये आपले स्वागत आहे." },
  { code: "gu-IN", label: "ગુજરાતી", nativeName: "ગુજરાતી", greeting: "નમસ્તે! હમસફરમાં આપનું સ્વાગત છે." },
];

export const LOCALIZED_STRINGS: Record<LanguageCode, Record<string, string>> = {
  "hi-IN": {
    appTitle: "हमसफ़र",
    welcome: "नमस्ते! आज आप कैसा महसूस कर रहे हैं?",
    medicineTaken: "शाबाश! दवा ले ली गई है। हमने परिवार को सूचित कर दिया है।",
    sosTriggered: "आपातकालीन एसओएस शुरू हो गया है! तुरंत परिवार को संदेश भेजा जा रहा है।",
    sosCancelled: "एसओएस रद्द कर दिया गया है। आप सुरक्षित हैं।",
    checkingScam: "संदेश की जांच हो रही है। कृपया प्रतीक्षा करें...",
    scamSafe: "यह संदेश बिल्कुल सुरक्षित लगता है। चिंता न करें।",
    scamWarning: "सावधान! यह एक धोखाधड़ी या फर्जी संदेश हो सकता है। किसी को पैसे या ओटीपी न दें।",
    callingFamily: "फोन मिलाया जा रहा है...",
    billPaid: "बिल का भुगतान सफलतापूर्वक हो गया है।",
    billLimitExceeded: "सावधान! यह बिल सुरक्षा सीमा ₹3,000 से अधिक है। परिवार के पिन की आवश्यकता है।",
    geofenceBreach: "चेतावनी! आप सुरक्षित क्षेत्र से बाहर हैं। परिवार को स्थान भेजा गया है।",
    doctorBooked: "डॉक्टर का अपॉइंटमेंट बुक हो गया है। समय पर याद दिलाएंगे।",
    voiceListening: "सुन रहा हूँ... बोलिए",
  },
  "en-IN": {
    appTitle: "Humsafar",
    welcome: "Hello! How are you feeling today?",
    medicineTaken: "Wonderful! Medicine taken. We have updated your guardian.",
    sosTriggered: "Emergency SOS triggered! Alerting your guardian right now.",
    sosCancelled: "Emergency SOS cancelled. You are safe.",
    checkingScam: "Analyzing message for fraud. Please hold on...",
    scamSafe: "This message is completely safe. No need to worry.",
    scamWarning: "Warning! This appears to be a fraudulent scam message. Do not share OTP or money.",
    callingFamily: "Connecting your call now...",
    billPaid: "Bill payment completed successfully.",
    billLimitExceeded: "Safety Alert! Amount exceeds the ₹3,000 ceiling. Guardian PIN required.",
    geofenceBreach: "Alert! You have moved outside the designated safe zone. Family notified.",
    doctorBooked: "Doctor appointment confirmed. Guardian has been synced.",
    voiceListening: "Listening... Please speak.",
  },
  "ta-IN": {
    appTitle: "ஹம்சஃபர்",
    welcome: "வணக்கம்! இன்று உங்கள் உடல்நலம் எப்படி உள்ளது?",
    medicineTaken: "மிக நன்று! மருந்து உட்கொள்ளப்பட்டது. குடும்பத்திற்கு தெரிவிக்கப்பட்டது.",
    sosTriggered: "அவசர உதவி கோரப்பட்டது! உடனடியாக குடும்பத்திற்கு தகவல் அனுப்பப்படுகிறது.",
    sosCancelled: "அவசர உதவி ரத்து செய்யப்பட்டது. நீங்கள் பாதுகாப்பாக உள்ளீர்கள்.",
    checkingScam: "செய்தி சரிபார்க்கப்படுகிறது. தயவுசெய்து காத்திருங்கள்...",
    scamSafe: "இந்த செய்தி முற்றிலும் பாதுகாப்பானது.",
    scamWarning: "எச்சரிக்கை! இது ஒரு மோசடி செய்தியாக இருக்கலாம். பணம் அல்லது ஓடிபி பகிர வேண்டாம்.",
    callingFamily: "அழைப்பு இணைக்கப்படுகிறது...",
    billPaid: "கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது.",
    billLimitExceeded: "பாதுகாப்பு எச்சரிக்கை! கட்டணம் ₹3,000க்கு மேல் உள்ளது. பின் குறியீடு தேவை.",
    geofenceBreach: "எச்சரிக்கை! நீங்கள் பாதுகாப்பான பகுதிக்கு வெளியே சென்றுவிட்டீர்கள்.",
    doctorBooked: "மருத்துவர் சந்திப்பு உறுதி செய்யப்பட்டது.",
    voiceListening: "கேட்கிறேன்... பேசுங்கள்.",
  },
  "te-IN": {
    appTitle: "హంసఫర్",
    welcome: "నమస్కారం! ఈరోజు మీ ఆరోగ్యం ఎలా ఉంది?",
    medicineTaken: "చాలా మంచిది! మందులు తీసుకున్నారు. కుటుంబానికి సమాచారం పంపబడింది.",
    sosTriggered: "అత్యవసర సహాయం ప్రారంభించబడింది! కుటుంబ సభ్యులను హెచ్చరిస్తున్నాము.",
    sosCancelled: "అత్యవసర రద్దు చేయబడింది. మీరు సురక్షితంగా ఉన్నారు.",
    checkingScam: "సందేశాన్ని పరిశీలిస్తున్నాము...",
    scamSafe: "ఈ సందేశం పూర్తిగా సురక్షితమైనది.",
    scamWarning: "హెచ్చరిక! ఇది మోసపూరిత సందేశం కావచ్చు. డబ్బు లేదా ఓటీపీ పంపవద్దు.",
    callingFamily: "కాల్ కనెక్ట్ అవుతోంది...",
    billPaid: "బిల్లు చెల్లింపు పూర్తయింది.",
    billLimitExceeded: "రక్షణ హెచ్చరిక! బిల్లు మొత్తం ₹3,000 కంటే ఎక్కువ. పిన్ అవసరం.",
    geofenceBreach: "హెచ్చరిక! మీరు సేఫ్ జోన్ వెలుపల ఉన్నారు.",
    doctorBooked: "డాక్టర్ అపాయింట్‌మెంట్ ఖరారైంది.",
    voiceListening: "వింటున్నాను... మాట్లాడండి.",
  },
  "bn-IN": {
    appTitle: "হামসফর",
    welcome: "নমস্কার! আজ আপনার শরীর কেমন আছে?",
    medicineTaken: "খুব ভালো! ওষুধ গ্রহণ করা হয়েছে। পরিবারকে জানানো হয়েছে।",
    sosTriggered: "জরুরী সংকেত পাঠানো হয়েছে! পরিবারের সাথে যোগাযোগ করা হচ্ছে।",
    sosCancelled: "জরুরী সংকেত বাতিল করা হয়েছে। আপনি নিরাপদ।",
    checkingScam: "মেসেজটি যাচাই করা হচ্ছে...",
    scamSafe: "এই বার্তাটি সম্পূর্ণ নিরাপদ।",
    scamWarning: "সতর্কতা! এটি একটি প্রতারণামূলক মেসেজ হতে পারে। কোনো টাকা বা ওটিপি দেবেন না।",
    callingFamily: "কল সংযোগ করা হচ্ছে...",
    billPaid: "বিল সফলভাবে পরিশোধ করা হয়েছে।",
    billLimitExceeded: "নিরাপত্তা সতর্কতা! বিল ₹৩,০০০ এর বেশি। পিন প্রয়োজন।",
    geofenceBreach: "সতর্কতা! আপনি নিরাপদ সীমার বাইরে আছেন।",
    doctorBooked: "ডাক্তারের অ্যাপয়েন্টমেন্ট নিশ্চিত করা হয়েছে।",
    voiceListening: "শুনছি... বলুন।",
  },
  "mr-IN": {
    appTitle: "हमसफर",
    welcome: "नमस्कार! आज आपली प्रकृती कशी आहे?",
    medicineTaken: "छान! औषध घेतले आहे. कुटुंबाला कळवले गेले आहे.",
    sosTriggered: "तातडीची मदत मागवली आहे! कुटुंबाला संदेश पाठवला जात आहे.",
    sosCancelled: "मदत मागणी रद्द करण्यात आली आहे. आपण सुरक्षित आहात.",
    checkingScam: "संदेशाची तपासणी होत आहे...",
    scamSafe: "हा संदेश पूर्णपणे सुरक्षित आहे.",
    scamWarning: "सावधान! हा एक फसवणूक संदेश असू शकतो. कोणालाही पैसे किंवा ओटीपी देऊ नका.",
    callingFamily: "कॉल लावला जात आहे...",
    billPaid: "बिल यशस्वीरित्या भरले गेले आहे.",
    billLimitExceeded: "सुरक्षा चेतावणी! रक्कम ₹३,००० पेक्षा जास्त आहे. पिन आवश्यक आहे.",
    geofenceBreach: "चेतावणी! आपण सुरक्षित परिसराच्या बाहेर आहात.",
    doctorBooked: "डॉक्टरांची भेट निश्चित झाली आहे.",
    voiceListening: "ऐकत आहे... बोला.",
  },
  "gu-IN": {
    appTitle: "હમસફર",
    welcome: "નમસ્તે! આજે તમારું સ્વાસ્થ્ય કેવું છે?",
    medicineTaken: "સરસ! દવા લઈ લીધી છે. પરિવારને જાણ કરવામાં આવી છે.",
    sosTriggered: "કટોકટી મદદ શરૂ થઈ છે! કુટુંબને સંદેશ મોકલવામાં આવી રહ્યો છે.",
    sosCancelled: "મદદ વિનંતી રદ કરવામાં આવી છે. તમે સુરક્ષિત છો.",
    checkingScam: "સંદેશ તપાસવામાં આવી રહ્યો છે...",
    scamSafe: "આ સંદેશ સંપૂર્ણપણે સલામત છે.",
    scamWarning: "સાવચેત! આ કપટપૂર્ણ છેતરપિંડી સંદેશ હોઈ શકે છે. પૈસા કે ઓટીપી શેર કરશો નહીં.",
    callingFamily: "કોલ જોડાઈ રહ્યો છે...",
    billPaid: "બિલ સફળતાપૂર્વક ચૂકવાઈ ગયું છે.",
    billLimitExceeded: "સુરક્ષા ચેતવણી! બિલ ₹3,000 થી વધુ છે. પિન જરૂરી છે.",
    geofenceBreach: "ચેતવણી! તમે સુરક્ષિત વિસ્તારની બહાર છો.",
    doctorBooked: "ડૉક્ટર એપોઇન્ટમેન્ટ કન્ફર્મ થઈ ગઈ છે.",
    voiceListening: "સાંભળું છું... બોલો.",
  },
};

/**
 * Text-to-Speech Engine with 0.85 rate (slow, audible, calm)
 */
export function speakPhrase(textOrKey: string, langCode: LanguageCode = "hi-IN"): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any overlapping utterance

      const phrases = LOCALIZED_STRINGS[langCode] || LOCALIZED_STRINGS["hi-IN"];
      const spokenText = phrases[textOrKey] || textOrKey;

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 0.85; // Slowed for seniors
      utterance.pitch = 1.0;
      utterance.lang = langCode;

      // Select matching regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.toLowerCase() === langCode.toLowerCase() || v.lang.startsWith(langCode.slice(0, 2))
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

/**
 * Stop any ongoing speech
 */
export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Synthesizes comforting and clear audio tones via Web Audio API
 */
export function playChime(type: "success" | "alert" | "sos" | "pill" | "tick"): void {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (type === "pill" || type === "success") {
      // Pleasant two-tone chime (523Hz C5 -> 659Hz E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.5);
    } else if (type === "sos") {
      // Loud warning pulse (880Hz A5)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === "tick") {
      // Soft countdown tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else {
      // Neutral alert chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // AudioContext failure gracefully ignored
  }
}

// Speech recognition type definitions
interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: { [subIndex: number]: SpeechRecognitionResultItem };
}

interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstanceLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
}

/**
 * Start Speech-to-Text listening with browser API and polyfill resilience
 */
export function createSpeechRecognizer(
  langCode: LanguageCode,
  onResult: (transcript: string) => void,
  onError?: (err: string) => void,
  onEnd?: () => void
): { start: () => void; stop: () => void } | null {
  if (typeof window === "undefined") return null;

  const SpeechRecognitionConstructor =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstanceLike }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstanceLike }).webkitSpeechRecognition;

  if (!SpeechRecognitionConstructor) {
    if (onError) onError("Browser does not support Web Speech Recognition.");
    return null;
  }

  try {
    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript.trim());
      }
    };

    recognition.onerror = (event: unknown) => {
      if (onError) onError(String(event));
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    return {
      start: () => {
        try {
          recognition.start();
        } catch {
          // might be already running
        }
      },
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch {
    return null;
  }
}
