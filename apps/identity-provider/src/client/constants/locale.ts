const allLocales = [
  { af: 'Afrikaans' },
  { sq: 'Albanian' },
  { am: 'Amharic' },
  { ar_DZ: 'Arabic - Algeria' },
  { ar_BH: 'Arabic - Bahrain' },
  { ar_EG: 'Arabic - Egypt' },
  { ar_IQ: 'Arabic - Iraq' },
  { ar_JO: 'Arabic - Jordan' },
  { ar_KW: 'Arabic - Kuwait' },
  { ar_LB: 'Arabic - Lebanon' },
  { ar_LY: 'Arabic - Libya' },
  { ar_MA: 'Arabic - Morocco' },
  { ar_OM: 'Arabic - Oman' },
  { ar_QA: 'Arabic - Qatar' },
  { ar_SA: 'Arabic - Saudi Arabia' },
  { ar_SY: 'Arabic - Syria' },
  { ar_TN: 'Arabic - Tunisia' },
  { ar_AE: 'Arabic - United Arab Emirates' },
  { ar_YE: 'Arabic - Yemen' },
  { hy: 'Armenian' },
  { as: 'Assamese' },
  { az_AZ: 'Azeri - Cyrillic' },
  { eu: 'Basque' },
  { be: 'Belarusian' },
  { bn: 'Bengali - Bangladesh' },
  { bs: 'Bosnian' },
  { bg: 'Bulgarian' },
  { my: 'Burmese' },
  { ca: 'Catalan' },
  { zh_CN: 'Chinese - China' },
  { zh_HK: 'Chinese - Hong Kong SAR' },
  { zh_MO: 'Chinese - Macau SAR' },
  { zh_SG: 'Chinese - Singapore' },
  { zh_TW: 'Chinese - Taiwan' },
  { hr: 'Croatian' },
  { cs: 'Czech' },
  { da: 'Danish' },
  { dv: 'Divehi; Dhivehi; Maldivian' },
  { nl_BE: 'Dutch - Belgium' },
  { nl_NL: 'Dutch - Netherlands' },
  { en_AU: 'English - Australia' },
  { en_BZ: 'English - Belize' },
  { en_CA: 'English - Canada' },
  { en_CB: 'English - Caribbean' },
  { en_GB: 'English - Great Britain' },
  { en_IN: 'English - India' },
  { en_IE: 'English - Ireland' },
  { en_JM: 'English - Jamaica' },
  { en_NZ: 'English - New Zealand' },
  { en_PH: 'English - Phillippines' },
  { en_ZA: 'English - Southern Africa' },
  { en_TT: 'English - Trinidad' },
  { en_US: 'English - United States' },
  { et: 'Estonian' },
  { fo: 'Faroese' },
  { fa: 'Farsi - Persian' },
  { fi: 'Finnish' },
  { fr_BE: 'French - Belgium' },
  { fr_CA: 'French - Canada' },
  { fr_FR: 'French - France' },
  { fr_LU: 'French - Luxembourg' },
  { fr_CH: 'French - Switzerland' },
  { mk: 'FYRO Macedonia' },
  { gd_IE: 'Gaelic - Ireland' },
  { gd: 'Gaelic - Scotland' },
  { de_AT: 'German - Austria' },
  { de_DE: 'German - Germany' },
  { de_LI: 'German - Liechtenstein' },
  { de_LU: 'German - Luxembourg' },
  { de_CH: 'German - Switzerland' },
  { el: 'Greek' },
  { gn: 'Guarani - Paraguay' },
  { gu: 'Gujarati' },
  { he: 'Hebrew' },
  { hi: 'Hindi' },
  { hu: 'Hungarian' },
  { is: 'Icelandic' },
  { id: 'Indonesian' },
  { it_IT: 'Italian - Italy' },
  { it_CH: 'Italian - Switzerland' },
  { ja: 'Japanese' },
  { kn: 'Kannada' },
  { ks: 'Kashmiri' },
  { kk: 'Kazakh' },
  { km: 'Khmer' },
  { ko: 'Korean' },
  { lo: 'Lao' },
  { la: 'Latin' },
  { lv: 'Latvian' },
  { lt: 'Lithuanian' },
  { ms_BN: 'Malay - Brunei' },
  { ms_MY: 'Malay - Malaysia' },
  { ml: 'Malayalam' },
  { mt: 'Maltese' },
  { mi: 'Maori' },
  { mr: 'Marathi' },
  { mn: 'Mongolian' },
  { ne: 'Nepali' },
  { no_NO: 'Norwegian - Bokml' },
  { or: 'Oriya' },
  { pl: 'Polish' },
  { pt_BR: 'Portuguese - Brazil' },
  { pt_PT: 'Portuguese - Portugal' },
  { pa: 'Punjabi' },
  { rm: 'Raeto-Romance' },
  { ro_MO: 'Romanian - Moldova' },
  { ro: 'Romanian - Romania' },
  { ru: 'Russian' },
  { ru_MO: 'Russian - Moldova' },
  { sa: 'Sanskrit' },
  { sr_SP: 'Serbian - Cyrillic' },
  { tn: 'Setsuana' },
  { sd: 'Sindhi' },
  { si: 'Sinhala; Sinhalese' },
  { sk: 'Slovak' },
  { sl: 'Slovenian' },
  { so: 'Somali' },
  { sb: 'Sorbian' },
  { es_AR: 'Spanish - Argentina' },
  { es_BO: 'Spanish - Bolivia' },
  { es_CL: 'Spanish - Chile' },
  { es_CO: 'Spanish - Colombia' },
  { es_CR: 'Spanish - Costa Rica' },
  { es_DO: 'Spanish - Dominican Republic' },
  { es_EC: 'Spanish - Ecuador' },
  { es_SV: 'Spanish - El Salvador' },
  { es_GT: 'Spanish - Guatemala' },
  { es_HN: 'Spanish - Honduras' },
  { es_MX: 'Spanish - Mexico' },
  { es_NI: 'Spanish - Nicaragua' },
  { es_PA: 'Spanish - Panama' },
  { es_PY: 'Spanish - Paraguay' },
  { es_PE: 'Spanish - Peru' },
  { es_PR: 'Spanish - Puerto Rico' },
  { es_ES: 'Spanish - Spain (Traditional)' },
  { es_UY: 'Spanish - Uruguay' },
  { es_VE: 'Spanish - Venezuela' },
  { sw: 'Swahili' },
  { sv_FI: 'Swedish - Finland' },
  { sv_SE: 'Swedish - Sweden' },
  { tg: 'Tajik' },
  { ta: 'Tamil' },
  { tt: 'Tatar' },
  { te: 'Telugu' },
  { th: 'Thai' },
  { bo: 'Tibetan' },
  { ts: 'Tsonga' },
  { tr: 'Turkish' },
  { tk: 'Turkmen' },
  { uk: 'Ukrainian' },
  { ur: 'Urdu' },
  { uz_UZ: 'Uzbek - Cyrillic' },
  { vi: 'Vietnamese' },
  { cy: 'Welsh' },
  { xh: 'Xhosa' },
  { yi: 'Yiddish' },
  { zu: 'Zulu' },
];

export const LOCALES = allLocales.map(l => {
  return {
    code: Object.keys(l)[0],
    name: Object.values(l)[0],
  };
});