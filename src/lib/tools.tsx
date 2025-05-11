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

// Placeholder components for complex tools
const PlaceholderTool = ({ name }: { name: string }) => (
  <div className="p-4 border rounded-lg bg-card">
    <h2 className="text-xl font-semibold mb-2">{name}</h2>
    <p className="text-muted-foreground">This tool is under construction. Check back soon!</p>
     <p className="text-sm mt-2 text-destructive">Note: Full client-side implementation of tools like YouTube converters is highly complex and may have limitations.</p>
  </div>
);

const YoutubeToMp3Tool = () => <PlaceholderTool name="YouTube to MP3 Converter" />;
const YoutubeToMp4Tool = () => <PlaceholderTool name="YouTube to MP4 Converter" />;
const CharacterCounterTool = () => <PlaceholderTool name="Character Counter" />;
const CaseConverterTool = () => <PlaceholderTool name="Case Converter" />;
const LoremIpsumGeneratorTool = () => <PlaceholderTool name="Lorem Ipsum Generator" />;
const RandomPasswordGeneratorTool = () => <PlaceholderTool name="Random Password Generator" />;
const HexToRgbTool = () => <PlaceholderTool name="HEX to RGB Converter" />;
const SpeechToTextTool = () => <PlaceholderTool name="Speech to Text" />;
const AgeCalculatorTool = () => <PlaceholderTool name="Age Calculator" />;
const BmiCalculatorTool = () => <PlaceholderTool name="BMI Calculator" />;
const LoanCalculatorTool = () => <PlaceholderTool name="Loan Calculator" />;
const PercentageCalculatorTool = () => <PlaceholderTool name="Percentage Calculator" />;
const Base64EncoderTool = () => <PlaceholderTool name="Base64 Encoder" />;
const Base64DecoderTool = () => <PlaceholderTool name="Base64 Decoder" />;
const JsonFormatterTool = () => <PlaceholderTool name="JSON Formatter" />;
const XmlFormatterTool = () => <PlaceholderTool name="XML Formatter" />;
const HtmlMinifierTool = () => <PlaceholderTool name="HTML Minifier" />;
const CssMinifierTool = () => <PlaceholderTool name="CSS Minifier" />;
const JavaScriptMinifierTool = () => <PlaceholderTool name="JavaScript Minifier" />;
const ImageToBase64Tool = () => <PlaceholderTool name="Image to Base64" />;
const Base64ToImageTool = () => <PlaceholderTool name="Base64 to Image" />;
const TimeConverterTool = () => <PlaceholderTool name="Time Converter" />;
const EpochToHumanDateConverterTool = () => <PlaceholderTool name="Epoch to Human Date Converter" />;
const TextRepeaterTool = () => <PlaceholderTool name="Text Repeater" />;
const RemoveDuplicateLinesTool = () => <PlaceholderTool name="Remove Duplicate Lines Tool" />;
const TextSortingTool = () => <PlaceholderTool name="Text Sorting Tool" />;
const OnlineNotepadTool = () => <PlaceholderTool name="Online Notepad" />;
const PalindromeCheckerTool = () => <PlaceholderTool name="Palindrome Checker" />;
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
const TextDiffCheckerTool = () => <PlaceholderTool name="Text Diff Checker" />;
const ImageCompressorTool = () => <PlaceholderTool name="Image Compressor" />;


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
    description: 'Count words and characters in your text quickly and accurately.',
    longDescription: 'Easily count the number of words and characters in any text. Useful for writers, students, and anyone needing to meet length requirements.',
    keywords: ['word count', 'character count', 'text analysis', 'writing tool'],
    icon: SigmaSquare,
    category: 'Text Utilities',
    component: WordCounterTool,
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
    description: 'Convert YouTube videos to MP3 audio files. (Placeholder)',
    longDescription: 'Extract audio from YouTube videos and save them as MP3 files. Note: Full client-side implementation is complex and may be limited.',
    keywords: ['youtube', 'mp3', 'converter', 'audio extractor', 'download music'],
    icon: Youtube,
    category: 'Converters',
    component: YoutubeToMp3Tool,
  },
  {
    slug: 'youtube-to-mp4-converter',
    name: 'YouTube to MP4 Converter',
    description: 'Download YouTube videos as MP4 files. (Placeholder)',
    longDescription: 'Download YouTube videos in MP4 format for offline viewing. Note: Full client-side implementation is complex and may be limited.',
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
  // Add more tools here following the pattern, using PlaceholderTool for now
  { slug: 'character-counter', name: 'Character Counter', description: 'Count characters in text.', keywords: ['character count', 'text tool'], icon: Type, category: 'Text Utilities', component: CharacterCounterTool },
  { slug: 'case-converter', name: 'Case Converter', description: 'Convert text to UPPERCASE, lowercase, etc.', keywords: ['case converter', 'text formatting'], icon: Text, category: 'Text Utilities', component: CaseConverterTool },
  { slug: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', keywords: ['lorem ipsum', 'dummy text'], icon: FileText, category: 'Generators', component: LoremIpsumGeneratorTool },
  { slug: 'random-password-generator', name: 'Random Password Generator', description: 'Create strong, random passwords.', keywords: ['password generator', 'security'], icon: Lock, category: 'Generators', component: RandomPasswordGeneratorTool },
  { slug: 'hex-to-rgb-converter', name: 'HEX to RGB Converter', description: 'Convert HEX color codes to RGB.', keywords: ['hex to rgb', 'color converter'], icon: Pipette, category: 'Converters', component: HexToRgbTool },
  { slug: 'speech-to-text', name: 'Speech to Text', description: 'Convert spoken words into text.', keywords: ['speech to text', 'voice recognition'], icon: Mic, category: 'Text Utilities', component: SpeechToTextTool },
  { slug: 'age-calculator', name: 'Age Calculator', description: 'Calculate age from date of birth.', keywords: ['age calculator', 'date calculation'], icon: CalendarDays, category: 'Calculators', component: AgeCalculatorTool },
  { slug: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate Body Mass Index.', keywords: ['bmi calculator', 'health tool'], icon: Calculator, category: 'Calculators', component: BmiCalculatorTool },
  { slug: 'loan-calculator', name: 'Loan Calculator', description: 'Calculate loan payments.', keywords: ['loan calculator', 'finance tool'], icon: Calculator, category: 'Calculators', component: LoanCalculatorTool },
  { slug: 'percentage-calculator', name: 'Percentage Calculator', description: 'Calculate percentages easily.', keywords: ['percentage calculator', 'math tool'], icon: Percent, category: 'Calculators', component: PercentageCalculatorTool },
  { slug: 'base64-encoder', name: 'Base64 Encoder', description: 'Encode text to Base64.', keywords: ['base64 encode', 'data encoding'], icon: Parentheses, category: 'Developer Tools', component: Base64EncoderTool },
  { slug: 'base64-decoder', name: 'Base64 Decoder', description: 'Decode Base64 to text.', keywords: ['base64 decode', 'data decoding'], icon: Parentheses, category: 'Developer Tools', component: Base64DecoderTool },
  { slug: 'json-formatter', name: 'JSON Formatter', description: 'Format and validate JSON data.', keywords: ['json formatter', 'json validator'], icon: FileJson, category: 'Developer Tools', component: JsonFormatterTool },
  { slug: 'xml-formatter', name: 'XML Formatter', description: 'Format and validate XML data.', keywords: ['xml formatter', 'xml validator'], icon: FileJson, category: 'Developer Tools', component: XmlFormatterTool },
  { slug: 'html-minifier', name: 'HTML Minifier', description: 'Minify HTML code.', keywords: ['html minifier', 'code optimization'], icon: Minimize, category: 'Developer Tools', component: HtmlMinifierTool },
  { slug: 'css-minifier', name: 'CSS Minifier', description: 'Minify CSS code.', keywords: ['css minifier', 'code optimization'], icon: Minimize, category: 'Developer Tools', component: CssMinifierTool },
  { slug: 'javascript-minifier', name: 'JavaScript Minifier', description: 'Minify JavaScript code.', keywords: ['js minifier', 'code optimization'], icon: Minimize, category: 'Developer Tools', component: JavaScriptMinifierTool },
  { slug: 'image-to-base64', name: 'Image to Base64', description: 'Convert images to Base64 strings.', keywords: ['image to base64', 'image encoding'], icon: ImageIcon, category: 'Converters', component: ImageToBase64Tool },
  { slug: 'base64-to-image', name: 'Base64 to Image', description: 'Convert Base64 strings to images.', keywords: ['base64 to image', 'image decoding'], icon: ImageIcon, category: 'Converters', component: Base64ToImageTool },
  { slug: 'time-converter', name: 'Time Converter', description: 'Convert between time units.', keywords: ['time converter', 'unit conversion'], icon: Clock, category: 'Converters', component: TimeConverterTool },
  { slug: 'epoch-to-human-date-converter', name: 'Epoch to Human Date Converter', description: 'Convert Epoch timestamps to readable dates.', keywords: ['epoch converter', 'timestamp tool'], icon: CalendarDays, category: 'Converters', component: EpochToHumanDateConverterTool },
  { slug: 'text-repeater', name: 'Text Repeater', description: 'Repeat text multiple times.', keywords: ['text repeater', 'string tool'], icon: Repeat, category: 'Text Utilities', component: TextRepeaterTool },
  { slug: 'remove-duplicate-lines', name: 'Remove Duplicate Lines', description: 'Remove duplicate lines from text.', keywords: ['duplicate lines remover', 'text cleanup'], icon: RemoveFormatting, category: 'Text Utilities', component: RemoveDuplicateLinesTool },
  { slug: 'text-sorting-tool', name: 'Text Sorting Tool', description: 'Sort lines of text alphabetically.', keywords: ['text sorter', 'alphabetical sort'], icon: SortAsc, category: 'Text Utilities', component: TextSortingTool },
  { slug: 'online-notepad', name: 'Online Notepad', description: 'Simple online notepad.', keywords: ['notepad online', 'text editor'], icon: Notebook, category: 'Productivity', component: OnlineNotepadTool },
  { slug: 'palindrome-checker', name: 'Palindrome Checker', description: 'Check if text is a palindrome.', keywords: ['palindrome checker', 'string tool'], icon: SpellCheck, category: 'Text Utilities', component: PalindromeCheckerTool },
  { slug: 'number-to-words-converter', name: 'Number to Words Converter', description: 'Convert numbers to words.', keywords: ['number to words', 'text conversion'], icon: Type, category: 'Converters', component: NumberToWordsConverterTool },
  { slug: 'words-to-number-converter', name: 'Words to Number Converter', description: 'Convert words to numbers.', keywords: ['words to number', 'text conversion'], icon: Calculator, category: 'Converters', component: WordsToNumberConverterTool },
  { slug: 'text-encryptor-decryptor', name: 'Text Encryptor/Decryptor', description: 'Encrypt and decrypt text.', keywords: ['text encryption', 'text decryption', 'security'], icon: Lock, category: 'Security', component: TextEncryptorDecryptorTool },
  { slug: 'binary-to-decimal-converter', name: 'Binary to Decimal Converter', description: 'Convert binary numbers to decimal.', keywords: ['binary to decimal', 'number system'], icon: Binary, category: 'Converters', component: BinaryToDecimalConverterTool },
  { slug: 'decimal-to-binary-converter', name: 'Decimal to Binary Converter', description: 'Convert decimal numbers to binary.', keywords: ['decimal to binary', 'number system'], icon: Binary, category: 'Converters', component: DecimalToBinaryConverterTool },
  { slug: 'ip-address-checker', name: 'IP Address Checker', description: 'Check your IP address.', keywords: ['ip address', 'network tool'], icon: Globe, category: 'Network Tools', component: IpAddressCheckerTool },
  { slug: 'domain-age-checker', name: 'Domain Age Checker', description: 'Check the age of a domain.', keywords: ['domain age', 'seo tool'], icon: Globe, category: 'SEO Tools', component: DomainAgeCheckerTool },
  { slug: 'meta-tag-generator', name: 'Meta Tag Generator', description: 'Generate HTML meta tags.', keywords: ['meta tag generator', 'seo tool'], icon: Tag, category: 'SEO Tools', component: MetaTagGeneratorTool },
  { slug: 'utm-link-generator', name: 'UTM Link Generator', description: 'Generate UTM tracking links.', keywords: ['utm generator', 'marketing tool'], icon: Link2, category: 'Marketing Tools', component: UtmLinkGeneratorTool },
  { slug: 'email-validator', name: 'Email Validator', description: 'Validate email addresses.', keywords: ['email validator', 'data validation'], icon: MailCheck, category: 'Validation Tools', component: EmailValidatorTool },
  { slug: 'credit-card-validator', name: 'Credit Card Validator', description: 'Validate credit card numbers (Luhn).', keywords: ['credit card validator', 'luhn algorithm'], icon: CreditCard, category: 'Validation Tools', component: CreditCardValidatorTool },
  { slug: 'md5-hash-generator', name: 'MD5 Hash Generator', description: 'Generate MD5 hashes.', keywords: ['md5 generator', 'hashing tool'], icon: Hash, category: 'Security', component: Md5HashGeneratorTool },
  { slug: 'sha256-hash-generator', name: 'SHA256 Hash Generator', description: 'Generate SHA256 hashes.', keywords: ['sha256 generator', 'hashing tool'], icon: Hash, category: 'Security', component: Sha256HashGeneratorTool },
  { slug: 'unit-converter', name: 'Unit Converter', description: 'Convert various units (length, weight).', keywords: ['unit converter', 'measurement tool'], icon: Scale, category: 'Converters', component: UnitConverterTool },
  { slug: 'temperature-converter', name: 'Temperature Converter', description: 'Convert C/F/K temperatures.', keywords: ['temperature converter', 'conversion tool'], icon: Thermometer, category: 'Converters', component: TemperatureConverterTool },
  { slug: 'stopwatch', name: 'Stopwatch', description: 'Online stopwatch timer.', keywords: ['stopwatch', 'timer online'], icon: Timer, category: 'Productivity', component: StopwatchTool },
  { slug: 'countdown-timer', name: 'Countdown Timer', description: 'Online countdown timer.', keywords: ['countdown timer', 'timer online'], icon: Timer, category: 'Productivity', component: CountdownTimerTool },
  { slug: 'text-diff-checker', name: 'Text Diff Checker', description: 'Compare two texts and find differences.', keywords: ['text diff', 'compare text'], icon: Shuffle, category: 'Text Utilities', component: TextDiffCheckerTool },
  { slug: 'image-compressor', name: 'Image Compressor', description: 'Compress images client-side.', keywords: ['image compressor', 'optimize images'], icon: ImageIcon, category: 'Media Tools', component: ImageCompressorTool },
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
