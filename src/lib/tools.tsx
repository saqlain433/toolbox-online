


import type { Tool } from '@/types';
import {
  SigmaSquare,
  Eraser,
  QrCode,
  Palette,
  Pipette,
  Youtube,
  Download,
  FileJson,
  Sparkles,
  Type,
  Text,
  Brain,
  Calculator,
  AudioLines,
  Mic,
  Clock,
  Hash,
  Lock,
  Percent,
  Link2,
  MailCheck,
  CreditCard,
  Scale,
  Thermometer,
  Timer,
  Shuffle,
  RemoveFormatting,
  SortAsc,
  Notebook,
  SpellCheck,
  Repeat,
  Binary,
  Globe,
  Tag,
  Minimize,
  Image as ImageIcon,
  FileText,
  CalendarDays,
  Parentheses,
  UploadCloud,
} from 'lucide-react';

// Dynamically import tool components to enable code splitting
import dynamic from 'next/dynamic';

const SeoOptimizerTool = dynamic(() => import('@/components/tools/SeoOptimizerTool').then(mod => mod.SeoOptimizerTool));
const WordCounterTool = dynamic(() => import('@/components/tools/WordCounterTool').then(mod => mod.WordCounterTool));
const QrCodeGeneratorTool = dynamic(() => import('@/components/tools/QrCodeGeneratorTool').then(mod => mod.QrCodeGeneratorTool));
const ColorPickerTool = dynamic(() => import('@/components/tools/ColorPickerTool').then(mod => mod.ColorPickerTool));
const RgbToHexTool = dynamic(() => import('@/components/tools/RgbToHexTool').then(mod => mod.RgbToHexTool));
const YoutubeThumbnailDownloaderTool = dynamic(() => import('@/components/tools/YoutubeThumbnailDownloaderTool').then(mod => mod.YoutubeThumbnailDownloaderTool));
const TextToSpeechTool = dynamic(() => import('@/components/tools/TextToSpeechTool').then(mod => mod.TextToSpeechTool));
const CharacterCounterTool = dynamic(() => import('@/components/tools/CharacterCounterTool').then(mod => mod.CharacterCounterTool));
const CaseConverterTool = dynamic(() => import('@/components/tools/CaseConverterTool').then(mod => mod.CaseConverterTool));
const LoremIpsumGeneratorTool = dynamic(() => import('@/components/tools/LoremIpsumGeneratorTool').then(mod => mod.LoremIpsumGeneratorTool));
const RandomPasswordGeneratorTool = dynamic(() => import('@/components/tools/RandomPasswordGeneratorTool').then(mod => mod.RandomPasswordGeneratorTool));
const HexToRgbTool = dynamic(() => import('@/components/tools/HexToRgbTool').then(mod => mod.HexToRgbTool));
const AgeCalculatorTool = dynamic(() => import('@/components/tools/AgeCalculatorTool').then(mod => mod.AgeCalculatorTool));
const SpeechToTextTool = dynamic(() => import('@/components/tools/SpeechToTextTool').then(mod => mod.SpeechToTextTool));
const BmiCalculatorTool = dynamic(() => import('@/components/tools/BmiCalculatorTool').then(mod => mod.BmiCalculatorTool));
const PercentageCalculatorTool = dynamic(() => import('@/components/tools/PercentageCalculatorTool').then(mod => mod.PercentageCalculatorTool));
const JsonFormatterTool = dynamic(() => import('@/components/tools/JsonFormatterTool').then(mod => mod.JsonFormatterTool));
const ImageCompressorTool = dynamic(() => import('@/components/tools/ImageCompressorTool').then(mod => mod.ImageCompressorTool));

// Text Utilities implementations
const TextRepeaterTool = dynamic(() => import('@/components/tools/TextRepeaterTool').then(mod => mod.TextRepeaterTool));
const RemoveDuplicateLinesTool = dynamic(() => import('@/components/tools/RemoveDuplicateLinesTool').then(mod => mod.RemoveDuplicateLinesTool));
const TextSortingTool = dynamic(() => import('@/components/tools/TextSortingTool').then(mod => mod.TextSortingTool));
const PalindromeCheckerTool = dynamic(() => import('@/components/tools/PalindromeCheckerTool').then(mod => mod.PalindromeCheckerTool));
const TextDiffCheckerTool = dynamic(() => import('@/components/tools/TextDiffCheckerTool').then(mod => mod.TextDiffCheckerTool));


// Placeholder components for complex tools
const PlaceholderTool = ({ name }: { name: string }) => (
  <div className="p-6 border rounded-lg bg-card shadow-sm">
    <div className="flex flex-col items-center justify-center text-center h-full">
      <UploadCloud className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2 text-foreground">{name}</h2>
      <p className="text-muted-foreground">This tool is under construction. Check back soon!</p>
    </div>
  </div>
);

const YoutubeToMp3Tool = () => <PlaceholderTool name="YouTube to MP3 Converter" />;
const YoutubeToMp4Tool = () => <PlaceholderTool name="YouTube to MP4 Converter" />;
const LoanCalculatorTool = () => <PlaceholderTool name="Loan Calculator" />;
const Base64EncoderTool = () => <PlaceholderTool name="Base64 Encoder" />;
const Base64DecoderTool = () => <PlaceholderTool name="Base64 Decoder" />;
const XmlFormatterTool = () => <PlaceholderTool name="XML Formatter" />;
const HtmlMinifierTool = () => <PlaceholderTool name="HTML Minifier" />;
const CssMinifierTool = () => <PlaceholderTool name="CSS Minifier" />;
const JavaScriptMinifierTool = () => <PlaceholderTool name="JavaScript Minifier" />;
const ImageToBase64Tool = () => <PlaceholderTool name="Image to Base64" />;
const Base64ToImageTool = () => <PlaceholderTool name="Base64 to Image" />;
const TimeConverterTool = () => <PlaceholderTool name="Time Converter" />;
const EpochToHumanDateConverterTool = () => <PlaceholderTool name="Epoch to Human Date Converter" />;
const OnlineNotepadTool = () => <PlaceholderTool name="Online Notepad" />;
const NumberToWordsConverterTool = () => <PlaceholderTool name="Number to Words Converter" />;
const WordsToNumberConverterTool = () => <PlaceholderTool name="Words to Number Converter" />;
const TextEncryptorDecryptorTool = () => <PlaceholderTool name="Text Encryptor/Decryptor" />;
const BinaryToDecimalConverterTool = () => <PlaceholderTool name="Binary to Decimal Converter" />;
const DecimalToBinaryConverterTool = () => <PlaceholderTool name="Decimal to Binary Converter" />;
const IpAddressCheckerTool = () => <PlaceholderTool name="IP Address Checker" />;
const DomainAgeCheckerTool = () => <PlaceholderTool name="Domain Age Checker" />;
const MetaTagGeneratorTool = () => <PlaceholderTool name="Meta Tag Generator" />;
const UtmLinkGeneratorTool = () => <PlaceholderTool name="UTM Link Generator" />;
const EmailValidatorTool = () => <PlaceholderTool name="Email Validator" />;
const CreditCardValidatorTool = () => <PlaceholderTool name="Credit Card Validator" />;
const Md5HashGeneratorTool = () => <PlaceholderTool name="MD5 Hash Generator" />;
const Sha256HashGeneratorTool = () => <PlaceholderTool name="SHA256 Hash Generator" />;
const UnitConverterTool = () => <PlaceholderTool name="Unit Converter" />;
const TemperatureConverterTool = () => <PlaceholderTool name="Temperature Converter" />;
const StopwatchTool = () => <PlaceholderTool name="Stopwatch" />;
const CountdownTimerTool = () => <PlaceholderTool name="Countdown Timer" />;


export const toolsList: Tool[] = [
  {
    slug: 'seo-optimizer',
    name: 'SEO Optimizer (AI)',
    description: 'Generate SEO-friendly descriptions for your content using AI.',
    longDescription: 'Leverage artificial intelligence to craft compelling, SEO-optimized meta descriptions for your tools or content. Enhance visibility and click-through rates.',
    keywords: ['seo', 'ai content', 'meta description', 'optimizer', 'content generator'],
    icon: Brain,
    category: 'AI & SEO',
    component: SeoOptimizerTool,
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences and paragraphs in your text.',
    longDescription: 'Easily count the number of words, characters (with/without spaces), sentences, and paragraphs in any text. Useful for writers, students, and content creators.',
    keywords: ['word count', 'character count', 'sentence count', 'paragraph count', 'text analysis'],
    icon: SigmaSquare,
    category: 'Text Utilities',
    component: WordCounterTool,
  },
  {
    slug: 'character-counter', 
    name: 'Character Counter', 
    description: 'Count characters in text, with and without spaces.', 
    longDescription: 'A simple tool to count the total characters in a piece of text, including an option to count characters excluding spaces.',
    keywords: ['character count', 'text tool', 'letter count', 'string length'], 
    icon: Type, 
    category: 'Text Utilities', 
    component: CharacterCounterTool 
  },
  {
    slug: 'case-converter', 
    name: 'Case Converter', 
    description: 'Convert text to UPPERCASE, lowercase, Title Case, or Sentence case.', 
    longDescription: 'Easily change the capitalization of your text. Supports UPPECASE, lowercase, Title Case (first letter of each word capitalized), and Sentence case (first letter of each sentence capitalized).',
    keywords: ['case converter', 'text formatting', 'uppercase', 'lowercase', 'title case', 'sentence case'], 
    icon: Text, 
    category: 'Text Utilities', 
    component: CaseConverterTool 
  },
  {
    slug: 'lorem-ipsum-generator', 
    name: 'Lorem Ipsum Generator', 
    description: 'Generate placeholder text (Lorem Ipsum) for your designs.', 
    longDescription: 'Quickly generate Lorem Ipsum placeholder text. Specify the number of paragraphs, sentences, or words you need for your mockups and designs.',
    keywords: ['lorem ipsum', 'dummy text', 'placeholder text', 'text generator'], 
    icon: FileText, 
    category: 'Generators', 
    component: LoremIpsumGeneratorTool 
  },
  {
    slug: 'random-password-generator', 
    name: 'Random Password Generator', 
    description: 'Create strong, secure, and random passwords.', 
    longDescription: 'Generate highly secure random passwords with customizable length and character types (uppercase, lowercase, numbers, symbols). Enhance your online security.',
    keywords: ['password generator', 'security', 'random password', 'strong password'], 
    icon: Lock, 
    category: 'Generators', 
    component: RandomPasswordGeneratorTool 
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create custom QR codes for URLs, text, contact info, and more.',
    longDescription: 'Generate QR codes instantly for various types of data including URLs, text, email addresses, phone numbers, and Wi-Fi credentials. Customize and download your QR codes.',
    keywords: ['qr code', 'generator', 'barcode', 'link shortener', 'mobile marketing'],
    icon: QrCode,
    category: 'Generators',
    component: QrCodeGeneratorTool,
  },
  {
    slug: 'youtube-to-mp3-converter',
    name: 'YouTube to MP3 Converter',
    description: 'Convert YouTube videos to MP3 audio files.',
    longDescription: 'Extract audio from YouTube videos and save them as MP3 files. This tool is currently under construction.',
    keywords: ['youtube', 'mp3', 'converter', 'audio extractor', 'download music'],
    icon: Youtube,
    category: 'Converters',
    component: YoutubeToMp3Tool,
  },
  {
    slug: 'youtube-to-mp4-converter',
    name: 'YouTube to MP4 Converter',
    description: 'Download YouTube videos as MP4 files.',
    longDescription: 'Download YouTube videos in MP4 format for offline viewing. This tool is currently under construction.',
    keywords: ['youtube', 'mp4', 'video downloader', 'converter', 'offline video'],
    icon: Youtube,
    category: 'Converters',
    component: YoutubeToMp4Tool,
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors from a visual palette and get their HEX, RGB, HSL codes.',
    longDescription: 'An interactive color picker tool to select colors, view their HEX, RGB, and HSL values, and create color palettes. Ideal for designers and developers.',
    keywords: ['color picker', 'hex code', 'rgb value', 'hsl value', 'design tool', 'palette generator'],
    icon: Palette,
    category: 'Design Tools',
    component: ColorPickerTool,
  },
  {
    slug: 'rgb-to-hex-converter',
    name: 'RGB to HEX Converter',
    description: 'Convert RGB color values to their HEXadecimal representation.',
    longDescription: 'Quickly convert RGB color codes (e.g., rgb(255, 0, 0)) to their corresponding HEX format (e.g., #FF0000). Essential for web designers and developers.',
    keywords: ['rgb to hex', 'color converter', 'web design', 'css colors', 'hex code'],
    icon: Pipette,
    category: 'Converters',
    component: RgbToHexTool,
  },
  {
    slug: 'hex-to-rgb-converter', 
    name: 'HEX to RGB Converter', 
    description: 'Convert HEX color codes to RGB values.', 
    longDescription: 'Convert hexadecimal color codes (e.g., #FF0000) to their RGB representation (e.g., rgb(255, 0, 0)). Useful for web development and design tasks.',
    keywords: ['hex to rgb', 'color converter', 'web design', 'css colors', 'rgb values'], 
    icon: Pipette, 
    category: 'Converters', 
    component: HexToRgbTool 
  },
  {
    slug: 'youtube-thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    description: 'Download high-quality thumbnails from YouTube videos.',
    longDescription: 'Easily download YouTube video thumbnails in various resolutions (HD, SD). Just paste the video URL and get the image.',
    keywords: ['youtube thumbnail', 'downloader', 'video image', 'youtube tool'],
    icon: Download,
    category: 'Media Tools',
    component: YoutubeThumbnailDownloaderTool,
  },
  {
    slug: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert written text into natural-sounding speech online.',
    longDescription: 'Transform your text into audible speech with various voice options and settings. Useful for accessibility, learning, or content creation.',
    keywords: ['text to speech', 'tts', 'voice generator', 'read aloud', 'accessibility'],
    icon: AudioLines,
    category: 'Text Utilities',
    component: TextToSpeechTool,
  },
  { 
    slug: 'age-calculator', 
    name: 'Age Calculator', 
    description: 'Calculate age based on date of birth and a target date.', 
    longDescription: 'Determine age in years, months, and days by providing a birth date and an optional target date (defaults to today). Useful for various age-related calculations.',
    keywords: ['age calculator', 'date calculation', 'birthday calculator', 'chronological age'], 
    icon: CalendarDays, 
    category: 'Calculators', 
    component: AgeCalculatorTool 
  },
  { 
    slug: 'speech-to-text', 
    name: 'Speech to Text', 
    description: 'Convert spoken words into written text using your microphone.', 
    longDescription: 'Use your browser\'s speech recognition capabilities to transcribe audio into text in real-time. Supports multiple languages.',
    keywords: ['speech to text', 'voice recognition', 'transcription', 'dictation'], 
    icon: Mic, 
    category: 'Text Utilities', 
    component: SpeechToTextTool 
  },
  { 
    slug: 'bmi-calculator', 
    name: 'BMI Calculator', 
    description: 'Calculate your Body Mass Index (BMI) using metric or imperial units.', 
    longDescription: 'Determine your Body Mass Index by entering your height and weight. Supports both metric (cm, kg) and imperial (ft, in, lbs) units.',
    keywords: ['bmi calculator', 'health tool', 'body mass index', 'weight management'], 
    icon: Calculator, 
    category: 'Calculators', 
    component: BmiCalculatorTool 
  },
  { 
    slug: 'loan-calculator', 
    name: 'Loan Calculator', 
    description: 'Calculate loan payments, interest, and amortization schedules.', 
    longDescription: 'Estimate your loan payments, total interest paid, and view an amortization schedule based on loan amount, interest rate, and term. This tool is currently under construction.',
    keywords: ['loan calculator', 'finance tool', 'mortgage calculator', 'amortization'], 
    icon: Calculator, 
    category: 'Calculators', 
    component: LoanCalculatorTool 
  },
  { 
    slug: 'percentage-calculator', 
    name: 'Percentage Calculator', 
    description: 'Calculate various percentage problems easily.', 
    longDescription: 'Perform various percentage calculations, such as finding X% of Y, determining what percentage X is of Y, or calculating percentage change.',
    keywords: ['percentage calculator', 'math tool', 'percent', 'discount calculator'], 
    icon: Percent, 
    category: 'Calculators', 
    component: PercentageCalculatorTool 
  },
  { 
    slug: 'base64-encoder', 
    name: 'Base64 Encoder', 
    description: 'Encode your text or data into Base64 format.', 
    longDescription: 'Convert plain text or other data into its Base64 encoded string representation. This tool is currently under construction.',
    keywords: ['base64 encode', 'data encoding', 'string encoding', 'developer tool'], 
    icon: Parentheses, 
    category: 'Developer Tools', 
    component: Base64EncoderTool 
  },
  { 
    slug: 'base64-decoder', 
    name: 'Base64 Decoder', 
    description: 'Decode Base64 encoded strings back to their original form.', 
    longDescription: 'Convert Base64 encoded strings back into their original human-readable format. This tool is currently under construction.',
    keywords: ['base64 decode', 'data decoding', 'string decoding', 'developer tool'], 
    icon: Parentheses, 
    category: 'Developer Tools', 
    component: Base64DecoderTool 
  },
  { 
    slug: 'json-formatter', 
    name: 'JSON Formatter', 
    description: 'Format and validate JSON data for readability or minify it.', 
    longDescription: 'Beautify (pretty-print) your JSON data to make it human-readable or minify it to reduce size. Also validates JSON structure.',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json minifier', 'developer tool'], 
    icon: FileJson, 
    category: 'Developer Tools', 
    component: JsonFormatterTool 
  },
  { 
    slug: 'xml-formatter', 
    name: 'XML Formatter', 
    description: 'Format and validate XML data for improved readability.', 
    longDescription: 'Beautify (pretty-print) your XML data to make it easier to read and understand. This tool is currently under construction.',
    keywords: ['xml formatter', 'xml validator', 'xml beautifier', 'developer tool'], 
    icon: FileJson, // Consider a more specific XML icon if available or custom SVG
    category: 'Developer Tools', 
    component: XmlFormatterTool 
  },
  { 
    slug: 'html-minifier', 
    name: 'HTML Minifier', 
    description: 'Minify HTML code to reduce file size and improve load times.', 
    longDescription: 'Remove unnecessary characters from HTML code, like whitespace and comments, to reduce file size. This tool is currently under construction.',
    keywords: ['html minifier', 'code optimization', 'web performance', 'developer tool'], 
    icon: Minimize, 
    category: 'Developer Tools', 
    component: HtmlMinifierTool 
  },
  { 
    slug: 'css-minifier', 
    name: 'CSS Minifier', 
    description: 'Minify CSS code to reduce file size for faster website loading.', 
    longDescription: 'Compress CSS code by removing unnecessary characters, such as whitespace and comments, to optimize file size. This tool is currently under construction.',
    keywords: ['css minifier', 'code optimization', 'stylesheet optimization', 'developer tool'], 
    icon: Minimize, 
    category: 'Developer Tools', 
    component: CssMinifierTool 
  },
  { 
    slug: 'javascript-minifier', 
    name: 'JavaScript Minifier', 
    description: 'Minify JavaScript code for smaller file sizes and faster execution.', 
    longDescription: 'Reduce the size of JavaScript files by removing whitespace, comments, and shortening variable names (optional). This tool is currently under construction.',
    keywords: ['js minifier', 'javascript optimization', 'code compression', 'developer tool'], 
    icon: Minimize, 
    category: 'Developer Tools', 
    component: JavaScriptMinifierTool 
  },
  { 
    slug: 'image-to-base64', 
    name: 'Image to Base64', 
    description: 'Convert images (JPEG, PNG, etc.) into Base64 encoded strings.', 
    longDescription: 'Encode image files into Base64 strings, useful for embedding images directly in HTML or CSS. This tool is currently under construction.',
    keywords: ['image to base64', 'image encoding', 'data uri', 'web development'], 
    icon: ImageIcon, 
    category: 'Converters', 
    component: ImageToBase64Tool 
  },
  { 
    slug: 'base64-to-image', 
    name: 'Base64 to Image', 
    description: 'Convert Base64 encoded strings back into viewable images.', 
    longDescription: 'Decode Base64 strings to render them as images in your browser. This tool is currently under construction.',
    keywords: ['base64 to image', 'image decoding', 'data uri', 'web development'], 
    icon: ImageIcon, 
    category: 'Converters', 
    component: Base64ToImageTool 
  },
  { 
    slug: 'time-converter', 
    name: 'Time Converter', 
    description: 'Convert between different units of time (seconds, minutes, hours, etc.).', 
    longDescription: 'Easily convert time values between various units, such as seconds, minutes, hours, days, and weeks. This tool is currently under construction.',
    keywords: ['time converter', 'unit conversion', 'time calculation', 'duration converter'], 
    icon: Clock, 
    category: 'Converters', 
    component: TimeConverterTool 
  },
  { 
    slug: 'epoch-to-human-date-converter', 
    name: 'Epoch to Human Date Converter', 
    description: 'Convert Epoch timestamps (Unix time) to human-readable dates.', 
    longDescription: 'Translate Unix epoch timestamps into easily understandable date and time formats. This tool is currently under construction.',
    keywords: ['epoch converter', 'timestamp tool', 'unix time', 'date conversion'], 
    icon: CalendarDays, 
    category: 'Converters', 
    component: EpochToHumanDateConverterTool 
  },
  { 
    slug: 'text-repeater', 
    name: 'Text Repeater', 
    description: 'Repeat a piece of text a specified number of times.', 
    longDescription: 'Generate repeated text quickly. Enter your text and the number of repetitions desired.',
    keywords: ['text repeater', 'string tool', 'repeat text', 'content generation'], 
    icon: Repeat, 
    category: 'Text Utilities', 
    component: TextRepeaterTool 
  },
  { 
    slug: 'remove-duplicate-lines', 
    name: 'Remove Duplicate Lines', 
    description: 'Remove duplicate lines from a block of text.', 
    longDescription: 'Clean up your text by removing any lines that are exact duplicates, keeping only unique lines. Options for case sensitivity and whitespace trimming.',
    keywords: ['duplicate lines remover', 'text cleanup', 'unique lines', 'data processing'], 
    icon: RemoveFormatting, 
    category: 'Text Utilities', 
    component: RemoveDuplicateLinesTool 
  },
  { 
    slug: 'text-sorting-tool', 
    name: 'Text Sorting Tool', 
    description: 'Sort lines of text alphabetically, by length, or numerically.', 
    longDescription: 'Organize lines of text by sorting them in ascending or descending order. Supports alphabetical, length-based, and numeric sorting.',
    keywords: ['text sorter', 'alphabetical sort', 'line sorting', 'data organization', 'numeric sort'], 
    icon: SortAsc, 
    category: 'Text Utilities', 
    component: TextSortingTool 
  },
  { 
    slug: 'online-notepad', 
    name: 'Online Notepad', 
    description: 'A simple online notepad for quick notes and temporary text storage.', 
    longDescription: 'Jot down quick notes, ideas, or temporary text with this simple browser-based notepad. This tool is currently under construction.',
    keywords: ['notepad online', 'text editor', 'quick notes', 'scratchpad'], 
    icon: Notebook, 
    category: 'Productivity', 
    component: OnlineNotepadTool 
  },
  { 
    slug: 'palindrome-checker', 
    name: 'Palindrome Checker', 
    description: 'Check if a word, phrase, or number is a palindrome.', 
    longDescription: 'Determine if the entered text or number reads the same forwards and backward (is a palindrome). Options to ignore case and punctuation.',
    keywords: ['palindrome checker', 'string tool', 'word game', 'reverse text'], 
    icon: SpellCheck, 
    category: 'Text Utilities', 
    component: PalindromeCheckerTool 
  },
  { 
    slug: 'number-to-words-converter', 
    name: 'Number to Words Converter', 
    description: 'Convert numbers into their word representation (e.g., 123 to "one hundred twenty-three").', 
    longDescription: 'Translate numerical figures into written words, useful for checks, legal documents, or readability. This tool is currently under construction.',
    keywords: ['number to words', 'text conversion', 'spell number', 'numeric to text'], 
    icon: Type, 
    category: 'Converters', 
    component: NumberToWordsConverterTool 
  },
  { 
    slug: 'words-to-number-converter', 
    name: 'Words to Number Converter', 
    description: 'Convert number words (e.g., "one hundred twenty-three") to digits (123).', 
    longDescription: 'Translate written number words back into their numerical digit form. This tool is currently under construction.',
    keywords: ['words to number', 'text conversion', 'text to numeric', 'data entry'], 
    icon: Calculator, 
    category: 'Converters', 
    component: WordsToNumberConverterTool 
  },
  { 
    slug: 'text-encryptor-decryptor', 
    name: 'Text Encryptor/Decryptor', 
    description: 'Encrypt and decrypt text using common algorithms (e.g., AES - placeholder).', 
    longDescription: 'Secure your text by encrypting it, and decrypt it back when needed. (Note: Actual strong encryption is complex for client-side). This tool is currently under construction.',
    keywords: ['text encryption', 'text decryption', 'security', 'cipher', 'privacy tool'], 
    icon: Lock, 
    category: 'Security', 
    component: TextEncryptorDecryptorTool 
  },
  { 
    slug: 'binary-to-decimal-converter', 
    name: 'Binary to Decimal Converter', 
    description: 'Convert binary numbers (base-2) to decimal numbers (base-10).', 
    longDescription: 'Translate binary numbers into their decimal equivalents. This tool is currently under construction.',
    keywords: ['binary to decimal', 'number system', 'base conversion', 'computer science'], 
    icon: Binary, 
    category: 'Converters', 
    component: BinaryToDecimalConverterTool 
  },
  { 
    slug: 'decimal-to-binary-converter', 
    name: 'Decimal to Binary Converter', 
    description: 'Convert decimal numbers (base-10) to binary numbers (base-2).', 
    longDescription: 'Translate decimal numbers into their binary equivalents. This tool is currently under construction.',
    keywords: ['decimal to binary', 'number system', 'base conversion', 'computer science'], 
    icon: Binary, 
    category: 'Converters', 
    component: DecimalToBinaryConverterTool 
  },
  { 
    slug: 'ip-address-checker', 
    name: 'IP Address Checker', 
    description: 'Check your public IP address and get related information.', 
    longDescription: 'Find out your current public IP address and potentially other network-related details. This tool is currently under construction.',
    keywords: ['ip address', 'network tool', 'my ip', 'geolocation (placeholder)'], 
    icon: Globe, 
    category: 'Network Tools', 
    component: IpAddressCheckerTool 
  },
  { 
    slug: 'domain-age-checker', 
    name: 'Domain Age Checker', 
    description: 'Check the age of a domain name (requires external API - placeholder).', 
    longDescription: 'Discover how old a domain name is by checking its registration date. (Note: Requires external service integration). This tool is currently under construction.',
    keywords: ['domain age', 'seo tool', 'whois lookup (placeholder)', 'website analysis'], 
    icon: Globe, 
    category: 'SEO Tools', 
    component: DomainAgeCheckerTool 
  },
  { 
    slug: 'meta-tag-generator', 
    name: 'Meta Tag Generator', 
    description: 'Generate HTML meta tags for SEO and social sharing.', 
    longDescription: 'Create essential HTML meta tags (title, description, keywords, Open Graph, Twitter Cards) for your web pages. This tool is currently under construction.',
    keywords: ['meta tag generator', 'seo tool', 'html meta tags', 'open graph', 'twitter cards'], 
    icon: Tag, 
    category: 'SEO Tools', 
    component: MetaTagGeneratorTool 
  },
  { 
    slug: 'utm-link-generator', 
    name: 'UTM Link Generator', 
    description: 'Generate UTM tracking links for your marketing campaigns.', 
    longDescription: 'Easily create URLs with UTM parameters to track the effectiveness of your online marketing campaigns. This tool is currently under construction.',
    keywords: ['utm generator', 'marketing tool', 'campaign tracking', 'url builder'], 
    icon: Link2, 
    category: 'Marketing Tools', 
    component: UtmLinkGeneratorTool 
  },
  { 
    slug: 'email-validator', 
    name: 'Email Validator', 
    description: 'Validate the format of email addresses (syntax check).', 
    longDescription: 'Check if an email address is syntactically correct. (Note: Does not verify actual existence). This tool is currently under construction.',
    keywords: ['email validator', 'data validation', 'email format', 'syntax check'], 
    icon: MailCheck, 
    category: 'Validation Tools', 
    component: EmailValidatorTool 
  },
  { 
    slug: 'credit-card-validator', 
    name: 'Credit Card Validator', 
    description: 'Validate credit card numbers using the Luhn algorithm (for format checking only).', 
    longDescription: 'Check if a credit card number is potentially valid based on the Luhn algorithm. Does not verify authenticity or funds. This tool is currently under construction.',
    keywords: ['credit card validator', 'luhn algorithm', 'format validation', 'security (test tool)'], 
    icon: CreditCard, 
    category: 'Validation Tools', 
    component: CreditCardValidatorTool 
  },
  { 
    slug: 'md5-hash-generator', 
    name: 'MD5 Hash Generator', 
    description: 'Generate MD5 hash for any given text or string.', 
    longDescription: 'Create an MD5 hash from your input text. MD5 is a widely used cryptographic hash function. This tool is currently under construction.',
    keywords: ['md5 generator', 'hashing tool', 'cryptography (basic)', 'checksum'], 
    icon: Hash, 
    category: 'Security', 
    component: Md5HashGeneratorTool 
  },
  { 
    slug: 'sha256-hash-generator', 
    name: 'SHA256 Hash Generator', 
    description: 'Generate SHA256 hash for your text or data.', 
    longDescription: 'Produce a SHA256 hash from your input text. SHA256 is a secure hashing algorithm. This tool is currently under construction.',
    keywords: ['sha256 generator', 'hashing tool', 'cryptography', 'secure hash'], 
    icon: Hash, 
    category: 'Security', 
    component: Sha256HashGeneratorTool 
  },
  { 
    slug: 'unit-converter', 
    name: 'Unit Converter', 
    description: 'Convert various units (length, weight, volume, etc. - placeholder).', 
    longDescription: 'A comprehensive tool to convert between different units of measurement like length, weight, volume, and more. This tool is currently under construction.',
    keywords: ['unit converter', 'measurement tool', 'conversion calculator', 'metric imperial'], 
    icon: Scale, 
    category: 'Converters', 
    component: UnitConverterTool 
  },
  { 
    slug: 'temperature-converter', 
    name: 'Temperature Converter', 
    description: 'Convert temperatures between Celsius, Fahrenheit, and Kelvin.', 
    longDescription: 'Easily switch temperature values between Celsius (°C), Fahrenheit (°F), and Kelvin (K). This tool is currently under construction.',
    keywords: ['temperature converter', 'conversion tool', 'celsius', 'fahrenheit', 'kelvin'], 
    icon: Thermometer, 
    category: 'Converters', 
    component: TemperatureConverterTool 
  },
  { 
    slug: 'stopwatch', 
    name: 'Stopwatch', 
    description: 'An online stopwatch to measure elapsed time with lap functionality.', 
    longDescription: 'A simple and accurate online stopwatch to time events, with options for laps and splits. This tool is currently under construction.',
    keywords: ['stopwatch', 'timer online', 'lap timer', 'time measurement'], 
    icon: Timer, 
    category: 'Productivity', 
    component: StopwatchTool 
  },
  { 
    slug: 'countdown-timer', 
    name: 'Countdown Timer', 
    description: 'Set an online countdown timer for various purposes.', 
    longDescription: 'A versatile online countdown timer. Set a specific duration and get alerted when the time is up. This tool is currently under construction.',
    keywords: ['countdown timer', 'timer online', 'alarm', 'time management'], 
    icon: Timer, 
    category: 'Productivity', 
    component: CountdownTimerTool 
  },
  { 
    slug: 'text-diff-checker', 
    name: 'Text Diff Checker', 
    description: 'Compare two blocks of text and highlight the differences.', 
    longDescription: 'Easily find the differences between two pieces of text. Ideal for comparing documents or code snippets. Supports character, word, and line-level diffs.',
    keywords: ['text diff', 'compare text', 'difference checker', 'file comparison'], 
    icon: Shuffle, 
    category: 'Text Utilities', 
    component: TextDiffCheckerTool 
  },
  { 
    slug: 'image-compressor', 
    name: 'Image Compressor', 
    description: 'Compress JPEG, PNG, and WEBP images client-side to reduce file size.', 
    longDescription: 'Reduce the file size of your images without significant quality loss. Supports JPEG, PNG, and WEBP formats with adjustable compression levels. All processing is done in your browser.',
    keywords: ['image compressor', 'optimize images', 'reduce image size', 'jpeg compression', 'png compression', 'webp compression'], 
    icon: ImageIcon, 
    category: 'Media Tools', 
    component: ImageCompressorTool 
  },
];


export const getToolBySlug = (slug: string): Tool | undefined => {
  return toolsList.find(tool => tool.slug === slug);
};

export const getToolsByCategory = (): Record<string, Tool[]> => {
  return toolsList.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);
};

export const allTools = toolsList;

