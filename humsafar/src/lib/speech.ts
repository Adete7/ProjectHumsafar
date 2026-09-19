import { LanguageCode } from '@/types';

const DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  'en-IN': {
    'MEDICINE_TAKEN': 'Medicine taken',
    'SOS_TRIGGERED': 'Emergency SOS triggered',
    'CHECKING_SCAM': 'Checking scam',
    'BILL_PAID': 'Bill paid successfully',
  },
  'hi-IN': {
    'MEDICINE_TAKEN': 'दवा ले ली गई है',
    'SOS_TRIGGERED': 'आपातकालीन एसओएस शुरू हो गया है',
    'CHECKING_SCAM': 'संदेश की जांच हो रही है',
    'BILL_PAID': 'बिल का भुगतान हो गया',
  },
  'ta-IN': {
    'MEDICINE_TAKEN': 'மருந்து உட்கொள்ளப்பட்டது',
    'SOS_TRIGGERED': 'அவசர உதவி கோரப்பட்டது',
    'CHECKING_SCAM': 'மோசடி சரிபார்க்கப்படுகிறது',
    'BILL_PAID': 'பில் செலுத்தப்பட்டது',
  },
  'te-IN': {
    'MEDICINE_TAKEN': 'మందులు తీసుకున్నారు',
    'SOS_TRIGGERED': 'అత్యవసర సహాయం ప్రారంభించబడింది',
    'CHECKING_SCAM': 'స్కామ్ తనిఖీ చేయబడుతోంది',
    'BILL_PAID': 'బిల్లు చెల్లించబడింది',
  },
  'bn-IN': {
    'MEDICINE_TAKEN': 'ওষুধ গ্রহণ করা হয়েছে',
    'SOS_TRIGGERED': 'জরুরী সংকেত পাঠানো হয়েছে',
    'CHECKING_SCAM': 'প্রতারণা পরীক্ষা করা হচ্ছে',
    'BILL_PAID': 'বিল পরিশোধ করা হয়েছে',
  },
  'mr-IN': {
    'MEDICINE_TAKEN': 'औषध घेतले आहे',
    'SOS_TRIGGERED': 'तातडीची मदत मागवली आहे',
    'CHECKING_SCAM': 'फसवणूक तपासली जात आहे',
    'BILL_PAID': 'बिल भरले',
  },
  'gu-IN': {
    'MEDICINE_TAKEN': 'દવા લઈ લીધી છે',
    'SOS_TRIGGERED': 'કટોકટી મદદ શરૂ થઈ છે',
    'CHECKING_SCAM': 'છેતરપિંડી તપાસાઈ રહી છે',
    'BILL_PAID': 'બિલ ચૂકવાઈ ગયું છે',
  }
};

export function speakPhrase(textKey: string, langCode: LanguageCode, customText?: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const phrase = customText || DICTIONARY[langCode]?.[textKey] || DICTIONARY['en-IN'][textKey] || textKey;
  
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = langCode;
  utterance.rate = 0.85; // Slowed down for seniors
  utterance.pitch = 1.0;

  // Try to find a local voice
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}

export function startListening(langCode: LanguageCode, onResult: (text: string) => void, onError?: (err: any) => void) {
  if (typeof window === 'undefined') return null;
  
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("Speech recognition not supported in this browser.");
    if (onError) onError(new Error("Not supported"));
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = langCode;
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  if (onError) {
    recognition.onerror = onError;
  }

  try {
    recognition.start();
  } catch(e) {
    console.error("Error starting recognition", e);
    if(onError) onError(e);
  }

  return recognition;
}
