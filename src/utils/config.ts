import { franc } from "franc";
import ISO6393_3_TO_2 from "iso639-js/alpha3to2mapping.json";
import ISO6393_MACRO_LANGS from "iso639-js/reference/iso639-3-macrolanguages.json";

export interface TranslateService {
  type: "word" | "sentence";
  id: string;
  defaultSecret?: string;
  secretValidator?: (secret: string) => SecretValidateResult;
}

export interface SecretValidateResult {
  secret: string;
  status: boolean;
  info: string;
}

export const SERVICES: Readonly<Readonly<TranslateService>[]> = <const>[
  {
    type: "sentence",
    id: "libretranslate",
    defaultSecret: "",
    secretValidator(secret: string) {
      // API key is optional in LibreTranslate
      return {
        secret,
        status: true,
        info: "",
      };
    },
  },
  {
    type: "sentence",
    id: "googleapi",
  },
  {
    type: "sentence",
    id: "google",
  },
  {
    type: "sentence",
    id: "cnki",
  },
  {
    type: "sentence",
    id: "haici",
  },
  {
    type: "sentence",
    id: "youdao",
  },
  {
    type: "sentence",
    id: "bing",
  },
  {
    type: "sentence",
    id: "pot",
  },
  {
    type: "sentence",
    id: "huoshan",
    defaultSecret: "accessKeyId#accessKeySecret",
    secretValidator(secret: string) {
      const parts = secret?.split("#");
      const flag = parts.length === 2;
      const partsInfo = `AccessKeyId: ${parts[0]}\nAccessKeySecret: ${parts[1]}`;
      const source = getService("huoshan");
      return {
        secret,
        status: flag && secret !== source.defaultSecret,
        info:
          secret === source.defaultSecret
            ? "The secret is not set."
            : flag
              ? partsInfo
              : `The secret format of Huoshan Text Translation is AccessKeyId#AccessKeySecret. The secret must have 2 parts joined by '#', but got ${parts?.length}.\n${partsInfo}`,
      };
    },
  },
  {
    type: "sentence",
    id: "youdaozhiyun",
    defaultSecret: "appid#appsecret#vocabid(optional)",
    secretValidator(secret: string) {
      const parts = secret?.split("#");
      const flag = [2, 3].includes(parts.length);
      const partsInfo = `AppID: ${parts[0]}\nAppKey: ${parts[1]}\nVocabID: ${
        parts[2] ? parts[2] : ""
      }`;
      const source = getService("youdaozhiyun");
      return {
        secret,
        status: flag && secret !== source.defaultSecret,
        info:
          secret === source.defaultSecret
            ? "The secret is not set."
            : flag
              ? partsInfo
              : `The secret format of YoudaoZhiyun is AppID#AppKey#VocabID(optional). The secret must have 2 or 3 parts joined by '#', but got ${parts?.length}.\n${partsInfo}`,
      };
    },
  },
  {
    type: "sentence",
    id: "niutranspro",
    defaultSecret: "",
    secretValidator(secret: string) {
      const flag = secret?.length === 32;
      return {
        secret,
        status: flag,
        info: flag
          ? ""
          : `The secret is your NiuTrans API-KEY. The secret length must be 32, but got ${secret?.length}.`,
      };
    },
  },
  {
    type: "sentence",
    id: "microsoft",
    defaultSecret: "",
    secretValidator(secret: string) {
      const params = secret.split("#");
      const secretKey = params[0];
      const flag = secretKey?.length === 32 || secretKey?.length === 84;
      return {
        secret,
        status: flag,
        info: flag
          ? ""
          : `The secret is your Azure translate serviceKEY#region(required if the region is not global). The secretKEY length must be 32 or 84, but got ${secretKey?.length}.`,
      };
    },
  },
  {
    type: "sentence",
    id: "caiyun",
    defaultSecret: "3975l6lr5pcbvidl6jl2",
    secretValidator(secret: string) {
      return {
        secret,
        status: secret !== "",
        info: "",
      };
    },
  },
  {
    type: "sentence",
    id: "deeplfree",
    defaultSecret: "",
    secretValidator(secret: string) {
      const flag = secret?.length >= 36;
      return {
        secret,
        status: flag,
        info: flag
          ? ""
          : `The secret is your DeepL (free plan) KEY. The secret length must >= 36, but got ${secret?.length}.`,
      };
    },
  },
  {
    type: "sentence",
    id: "deeplpro",
    defaultSecret: "",
    secretValidator(secret: string) {
      const flag = secret?.length >= 36;
      return {
        secret,
        status: flag,
        info: flag
          ? ""
          : `The secret is your DeepL (pro plan) KEY. The secret length must >= 36, but got ${secret?.length}.`,
      };
    },
  },
  {
    type: "sentence",
    id: "deeplcustom",
    defaultSecret: "",
    secretValidator(secret: string) {
      return {
        secret,
        status: true,
        info: "",
      };
    },
  },
  {
    type: "sentence",
    id: "deeplx",
  },
  {
    type: "sentence",
    id: "aliyun",
    defaultSecret: "accessKeyId#accessKeySecret",
    secretValidator(secret: string) {
      const parts = secret?.split("#");
      const flag = parts.length === 2;
      const partsInfo = `AccessKeyId: ${parts[0]}\nAccessKeySecret: ${parts[1]}`;
      const source = getService("aliyun");
      return {
        secret,
        status: flag && secret !== source.defaultSecret,
        info:
          secret === source.defaultSecret
            ? "The secret is not set."
            : flag
              ? partsInfo
              : `The secret format of Aliyun Text Translation is AccessKeyId#AccessKeySecret. The secret must have 2 parts joined by '#', but got ${parts?.length}.\n${partsInfo}`,
      };
    },
  },
  {
    type: "sentence",
    id: "baidu",
    defaultSecret: "appid#key",
    secretValidator(secret: string) {
      const parts = secret?.split("#");
      const flag = [2, 3].includes(parts.length);
      const partsInfo = `AppID: ${parts[0]}\nKey: ${parts[1]}\nAction: ${
        parts[2] ? parts[2] : "0"
      }`;
      const source = getService("baidu");
      return {
        secret,
        status: flag && secret !== source.defaultSecret,
        info:
          secret === source.defaultSecret
            ? "The secret is not set."
            : flag
              ? partsInfo
              : `The secret format of Baidu Text Translation is AppID#Key#Action(optional). The secret must have 2 or 3 parts joined by '#', but got ${parts?.length}.\n${partsInfo}`,
      };
    },
  },
  {
    type: "sentence",
    id: "baidufield",
    defaultSecret: "appid#key#field",
    secretValidator(secret: string) {
      const parts = secret?.split("#");
      const flag = parts.length === 3;
      const partsInfo = `AppID: ${parts[0]}\nKey: ${parts[1]}\nDomainCode: ${parts[2]}`;
      const source = getService("baidufield");
      return {
        secret,
        status: flag && secret !== source.defaultSecret,
        info:
          secret === source.defaultSecret
            ? "The secret is not set."
            : flag
              ? partsInfo
              : `The secret format of Baidu Domain Text Translation is AppID#Key#DomainCode. The secret must have 3 parts joined by '#', but got ${parts?.length}.\n${partsInfo}`,
      };
    },
  },
  {
    type: "sentence",
    id: "openl",
    defaultSecret: "service1,service2,...#apikey",
    secretValidator(secret: string) {
      const parts = secret?.split("#");
      const flag = parts.length === 2;
      const partsInfo = `Services: ${parts[0]}\nAPIKey: ${parts[1]}`;
      const source = getService("openl");
      return {
        secret,
        status: flag && secret !== source.defaultSecret,
        info:
          secret === source.defaultSecret
            ? "The secret is not set."
            : flag
              ? partsInfo
              : `The secret format of OpenL is service1,service2,...#APIKey. The secret must have 2 parts joined by '#', but got ${parts?.length}.\n${partsInfo}`,
      };
    },
  },
  {
    type: "sentence",
    id: "tencent",
    defaultSecret:
      "secretId#SecretKey#Region(default ap-shanghai)#ProjectId(default 0)",
    secretValidator(secret: string | object) {
      const source = getService("tencent");

      // Handle empty or default secret
      if (!secret || secret === source.defaultSecret) {
        return {
          secret: secret as string,
          status: false,
          info: "The secret is not set. Click the button to configure.",
        };
      }

      // Try to parse as JSON first (new object format)
      try {
        let config: any;
        if (typeof secret === "string") {
          config = JSON.parse(secret);
        } else {
          config = secret;
        }

        if (config && typeof config === "object" && config.secretId) {
          // New object format validation
          const hasRequiredFields = config.secretId && config.secretKey;
          const partsInfo = `SecretId: ${config.secretId || "Not set"}
SecretKey: ${config.secretKey ? "Set" : "Not set"}
Region: ${config.region || "ap-shanghai"}
ProjectId: ${config.projectId || "0"}
Term Repo IDs: ${(config.termRepoIDList || []).join(", ") || "None"}
Sent Repo IDs: ${(config.sentRepoIDList || []).join(", ") || "None"}`;

          return {
            secret:
              typeof secret === "string" ? secret : JSON.stringify(secret),
            status: hasRequiredFields,
            info: hasRequiredFields
              ? partsInfo
              : "SecretId and SecretKey are required.",
          };
        }
      } catch {
        // Not JSON, continue to legacy format
      }

      // Handle legacy string format
      const parts = (secret as string)?.split("#");
      const hasRequiredFields =
        parts && parts.length >= 2 && parts[0] && parts[1];
      const partsInfo = `SecretId: ${parts?.[0] || "Not set"}
SecretKey: ${parts?.[1] ? "Set" : "Not set"}
Region: ${parts?.[2] || "ap-shanghai"}
ProjectId: ${parts?.[3] || "0"}`;

      return {
        secret: secret as string,
        status: !!hasRequiredFields,
        info: hasRequiredFields
          ? partsInfo
          : "SecretId and SecretKey are required. Use format: SecretId#SecretKey#Region(optional)#ProjectId(optional) or click button for advanced configuration.",
      };
    },
  },
  {
    type: "sentence",
    id: "xftrans",
    defaultSecret: "AppID#ApiSecret#ApiKey",
    secretValidator(secret: string) {
      const parts = secret?.split("#");
      const flag = parts.length === 3;
      const partsInfo = `AppID: ${parts[0]}\nApiSecret: ${parts[1]}\nApiKey: ${parts[2]}`;
      const source = getService("xftrans");
      return {
        secret,
        status: flag && secret !== source.defaultSecret,
        info:
          secret === source.defaultSecret
            ? "The secret is not set."
            : flag
              ? partsInfo
              : `The secret format of Xftrans Domain Text Translation is AppID#ApiSecret#ApiKey. The secret must have 3 parts joined by '#', but got ${parts?.length}.\n${partsInfo}`,
      };
    },
  },
  {
    type: "sentence",
    id: "chatgpt",
    defaultSecret: "",
    secretValidator(secret: string) {
      const status = /^sk-[A-Za-z0-9_-]{32,}$/.test(secret);
      const empty = secret.length === 0;
      return {
        secret,
        status,
        info: empty
          ? "The secret is not set."
          : status
            ? "Click the button to check connectivity."
            : "The secret key format is invalid.",
      };
    },
  },
  {
    type: "sentence",
    id: "customgpt1",
    defaultSecret: "",
    secretValidator(secret: string) {
      const status = secret.length > 0;
      return {
        secret,
        status,
        info: status
          ? "Click the button to check connectivity."
          : "The secret key format is invalid.",
      };
    },
  },
  {
    type: "sentence",
    id: "customgpt2",
    defaultSecret: "",
    secretValidator(secret: string) {
      const status = secret.length > 0;
      return {
        secret,
        status,
        info: status
          ? "Click the button to check connectivity."
          : "The secret key format is invalid.",
      };
    },
  },
  {
    type: "sentence",
    id: "customgpt3",
    defaultSecret: "",
    secretValidator(secret: string) {
      const status = secret.length > 0;
      return {
        secret,
        status,
        info: status
          ? "Click the button to check connectivity."
          : "The secret key format is invalid.",
      };
    },
  },
  {
    type: "sentence",
    id: "azuregpt",
    defaultSecret: "",
    secretValidator(secret: string) {
      const flag = Boolean(secret);
      return {
        secret,
        status: flag,
        info: flag ? "" : "The secret is not set.",
      };
    },
  },
  {
    type: "sentence",
    id: "gemini",
    defaultSecret: "",
    secretValidator(secret: string) {
      const flag = Boolean(secret);
      return {
        secret,
        status: flag,
        info: flag ? "" : "The secret is not set.",
      };
    },
  },
  {
    type: "sentence",
    id: "qwenmt",
    defaultSecret: "",
    secretValidator(secret: string) {
      const flag = Boolean(secret);
      return {
        secret,
        status: flag,
        info: flag ? "" : "The secret is not set.",
      };
    },
  },
  {
    type: "sentence",
    id: "claude",
    defaultSecret: "",
    secretValidator(secret: string) {
      const status = /^sk-ant-[A-Za-z0-9]{24,}$/.test(secret);
      const empty = secret.length === 0;
      return {
        secret,
        status: status || Boolean(secret),
        info: empty
          ? "The secret is not set."
          : status
            ? "Click the button to check connectivity."
            : "The Claude API key format might be invalid. Typically starts with 'sk-ant-'.",
      };
    },
  },
  {
    type: "sentence",
    id: "mtranserver",
    defaultSecret: "",
    secretValidator(secret: string) {
      // Token is optional in MTranServer
      return {
        secret,
        status: true,
        info: "",
      };
    },
  },
  {
    type: "word",
    id: "bingdict",
  },
  {
    type: "word",
    id: "cambridgedict",
  },
  {
    type: "word",
    id: "haicidict",
  },
  {
    type: "word",
    id: "youdaodict",
  },
  {
    type: "word",
    id: "freedictionaryapi",
  },
  {
    type: "word",
    id: "webliodict",
  },
  {
    type: "word",
    id: "collinsdict",
  },
];

export function getService(id: string) {
  return SERVICES[SERVICES.findIndex((service) => service.id === id)];
}

export function inferLanguage(str: string) {
  const langCode = mapISO6393to6391(franc(str, { minLength: 3 }));
  if (!langCode) {
    return {
      code: "",
      name: "Unknown",
    };
  }
  return matchLanguage(langCode);
}

export function matchLanguage(str: string) {
  return (
    LANG_CODE[
      LANG_CODE_INDEX_MAP[str.split("-")[0].split("_")[0].toLowerCase()]
    ] || {
      code: "",
      name: "Unknown",
    }
  );
}

export const LANG_CODE = <const>[
  { code: "af", name: "Afrikaans" },
  { code: "af-ZA", name: "Afrikaans (South Africa)" },
  { code: "sq", name: "Albanian" },
  { code: "sq-AL", name: "Albanian (Albania)" },
  { code: "am", name: "Amharic" },
  { code: "ar", name: "Arabic" },
  { code: "ar-DZ", name: "Arabic (Algeria)" },
  { code: "ar-BH", name: "Arabic (Bahrain)" },
  { code: "ar-EG", name: "Arabic (Egypt)" },
  { code: "ar-IQ", name: "Arabic (Iraq)" },
  { code: "ar-JO", name: "Arabic (Jordan)" },
  { code: "ar-KW", name: "Arabic (Kuwait)" },
  { code: "ar-LB", name: "Arabic (Lebanon)" },
  { code: "ar-LY", name: "Arabic (Libya)" },
  { code: "ar-MA", name: "Arabic (Morocco)" },
  { code: "ar-OM", name: "Arabic (Oman)" },
  { code: "ar-QA", name: "Arabic (Qatar)" },
  { code: "ar-SA", name: "Arabic (Saudi Arabia)" },
  { code: "ar-SY", name: "Arabic (Syria)" },
  { code: "ar-TN", name: "Arabic (Tunisia)" },
  { code: "ar-AE", name: "Arabic (U.A.E.)" },
  { code: "ar-YE", name: "Arabic (Yemen)" },
  { code: "hy", name: "Armenian" },
  { code: "hy-AM", name: "Armenian (Armenia)" },
  { code: "as", name: "Assamese" },
  { code: "ay", name: "Aymara" },
  { code: "az-AZ", name: "Azeri (Cyrillic) (Azerbaijan)" },
  { code: "az", name: "Azeri (Latin)" },
  { code: "az-AZ", name: "Azeri (Latin) (Azerbaijan)" },
  { code: "bm", name: "Bambara" },
  { code: "eu", name: "Basque" },
  { code: "eu-ES", name: "Basque (Spain)" },
  { code: "be", name: "Belarusian" },
  { code: "be-BY", name: "Belarusian (Belarus)" },
  { code: "bn", name: "Bengali" },
  { code: "bho", name: "Bhojpuri" },
  { code: "bs", name: "Bosnian" },
  { code: "bs-BA", name: "Bosnian (Bosnia and Herzegovina)" },
  { code: "bg", name: "Bulgarian" },
  { code: "bg-BG", name: "Bulgarian (Bulgaria)" },
  { code: "ca", name: "Catalan" },
  { code: "ca-ES", name: "Catalan (Spain)" },
  { code: "ceb", name: "Cebuano" },
  { code: "ny", name: "Chichewa" },
  { code: "zh", name: "Chinese" },
  { code: "zh-HK", name: "Chinese (Hong Kong)" },
  { code: "zh-MO", name: "Chinese (Macau)" },
  { code: "zh-CN", name: "Chinese (S)" },
  { code: "zh-SG", name: "Chinese (Singapore)" },
  { code: "zh-TW", name: "Chinese (T)" },
  { code: "co", name: "Corsican" },
  { code: "hr", name: "Croatian" },
  { code: "hr-BA", name: "Croatian (Bosnia and Herzegovina)" },
  { code: "hr-HR", name: "Croatian (Croatia)" },
  { code: "cs", name: "Czech" },
  { code: "cs-CZ", name: "Czech (Czech Republic)" },
  { code: "da", name: "Danish" },
  { code: "da-DK", name: "Danish (Denmark)" },
  { code: "dv", name: "Divehi" },
  { code: "dv-MV", name: "Divehi (Maldives)" },
  { code: "doi", name: "Dogri" },
  { code: "nl", name: "Dutch" },
  { code: "nl-BE", name: "Dutch (Belgium)" },
  { code: "nl-NL", name: "Dutch (Netherlands)" },
  { code: "en", name: "English" },
  { code: "en-AU", name: "English (Australia)" },
  { code: "en-BZ", name: "English (Belize)" },
  { code: "en-CA", name: "English (Canada)" },
  { code: "en-CB", name: "English (Caribbean)" },
  { code: "en-IE", name: "English (Ireland)" },
  { code: "en-JM", name: "English (Jamaica)" },
  { code: "en-NZ", name: "English (New Zealand)" },
  { code: "en-PH", name: "English (Republic of the Philippines)" },
  { code: "en-ZA", name: "English (South Africa)" },
  { code: "en-TT", name: "English (Trinidad and Tobago)" },
  { code: "en-GB", name: "English (United Kingdom)" },
  { code: "en-US", name: "English (United States)" },
  { code: "en-ZW", name: "English (Zimbabwe)" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Estonian" },
  { code: "et-EE", name: "Estonian (Estonia)" },
  { code: "ee", name: "Ewe" },
  { code: "fo", name: "Faroese" },
  { code: "fo-FO", name: "Faroese (Faroe Islands)" },
  { code: "fa", name: "Farsi" },
  { code: "fa-IR", name: "Farsi (Iran)" },
  { code: "fi", name: "Finnish" },
  { code: "fi-FI", name: "Finnish (Finland)" },
  { code: "fr", name: "French" },
  { code: "fr-BE", name: "French (Belgium)" },
  { code: "fr-CA", name: "French (Canada)" },
  { code: "fr-FR", name: "French (France)" },
  { code: "fr-LU", name: "French (Luxembourg)" },
  { code: "fr-MC", name: "French (Principality of Monaco)" },
  { code: "fr-CH", name: "French (Switzerland)" },
  { code: "fy", name: "Frisian" },
  { code: "mk", name: "FYRO Macedonian" },
  {
    code: "mk-MK",
    name: "FYRO Macedonian (Former Yugoslav Republic of Macedonia)",
  },
  { code: "gl", name: "Galician" },
  { code: "gl-ES", name: "Galician (Spain)" },
  { code: "ka", name: "Georgian" },
  { code: "ka-GE", name: "Georgian (Georgia)" },
  { code: "de", name: "German" },
  { code: "de-AT", name: "German (Austria)" },
  { code: "de-DE", name: "German (Germany)" },
  { code: "de-LI", name: "German (Liechtenstein)" },
  { code: "de-LU", name: "German (Luxembourg)" },
  { code: "de-CH", name: "German (Switzerland)" },
  { code: "el", name: "Greek" },
  { code: "el-GR", name: "Greek (Greece)" },
  { code: "gn", name: "Guarani" },
  { code: "gu", name: "Gujarati" },
  { code: "gu-IN", name: "Gujarati (India)" },
  { code: "ht", name: "Haitian Creole" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "Hawaiian" },
  { code: "he", name: "Hebrew" },
  { code: "iw", name: "Hebrew" },
  { code: "he-IL", name: "Hebrew (Israel)" },
  { code: "hi", name: "Hindi" },
  { code: "hi-IN", name: "Hindi (India)" },
  { code: "hmn", name: "Hmong" },
  { code: "hu", name: "Hungarian" },
  { code: "hu-HU", name: "Hungarian (Hungary)" },
  { code: "is", name: "Icelandic" },
  { code: "is-IS", name: "Icelandic (Iceland)" },
  { code: "ig", name: "Igbo" },
  { code: "ilo", name: "Ilocano" },
  { code: "id", name: "Indonesian" },
  { code: "id-ID", name: "Indonesian (Indonesia)" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "it-IT", name: "Italian (Italy)" },
  { code: "it-CH", name: "Italian (Switzerland)" },
  { code: "ja", name: "Japanese" },
  { code: "ja-JP", name: "Japanese (Japan)" },
  { code: "jw", name: "Javanese" },
  { code: "kn", name: "Kannada" },
  { code: "kn-IN", name: "Kannada (India)" },
  { code: "kk", name: "Kazakh" },
  { code: "kk-KZ", name: "Kazakh (Kazakhstan)" },
  { code: "km", name: "Khmer" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "kok", name: "Konkani" },
  { code: "gom", name: "Konkani" },
  { code: "kok-IN", name: "Konkani (India)" },
  { code: "ko", name: "Korean" },
  { code: "ko-KR", name: "Korean (Korea)" },
  { code: "kri", name: "Krio" },
  { code: "ku", name: "Kurdish (Kurmanji)" },
  { code: "ckb", name: "Kurdish (Sorani)" },
  { code: "ky", name: "Kyrgyz" },
  { code: "ky-KG", name: "Kyrgyz (Kyrgyzstan)" },
  { code: "lo", name: "Lao" },
  { code: "la", name: "Latin" },
  { code: "lv", name: "Latvian" },
  { code: "lv-LV", name: "Latvian (Latvia)" },
  { code: "ln", name: "Lingala" },
  { code: "lt", name: "Lithuanian" },
  { code: "lt-LT", name: "Lithuanian (Lithuania)" },
  { code: "lg", name: "Luganda" },
  { code: "lb", name: "Luxembourgish" },
  { code: "mai", name: "Maithili" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay" },
  { code: "ms-BN", name: "Malay (Brunei Darussalam)" },
  { code: "ms-MY", name: "Malay (Malaysia)" },
  { code: "ml", name: "Malayalam" },
  { code: "mt", name: "Maltese" },
  { code: "mt-MT", name: "Maltese (Malta)" },
  { code: "mi", name: "Maori" },
  { code: "mi-NZ", name: "Maori (New Zealand)" },
  { code: "mr", name: "Marathi" },
  { code: "mr-IN", name: "Marathi (India)" },
  { code: "mni-Mtei", name: "Meiteilon (Manipuri)" },
  { code: "lus", name: "Mizo" },
  { code: "mn", name: "Mongolian" },
  { code: "mn-MN", name: "Mongolian (Mongolia)" },
  { code: "my", name: "Myanmar (Burmese)" },
  { code: "ne", name: "Nepali" },
  { code: "ns", name: "Northern Sotho" },
  { code: "ns-ZA", name: "Northern Sotho (South Africa)" },
  { code: "no", name: "Norwegian" },
  { code: "nb", name: "Norwegian (Bokm?l)" },
  { code: "nb-NO", name: "Norwegian (Bokm?l) (Norway)" },
  { code: "nn-NO", name: "Norwegian (Nynorsk) (Norway)" },
  { code: "or", name: "Odia (Oriya)" },
  { code: "om", name: "Oromo" },
  { code: "ps", name: "Pashto" },
  { code: "ps-AR", name: "Pashto (Afghanistan)" },
  { code: "pl", name: "Polish" },
  { code: "pl-PL", name: "Polish (Poland)" },
  { code: "pt", name: "Portuguese" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "pt-PT", name: "Portuguese (Portugal)" },
  { code: "pa", name: "Punjabi" },
  { code: "pa-IN", name: "Punjabi (India)" },
  { code: "qu", name: "Quechua" },
  { code: "qu-BO", name: "Quechua (Bolivia)" },
  { code: "qu-EC", name: "Quechua (Ecuador)" },
  { code: "qu-PE", name: "Quechua (Peru)" },
  { code: "ro", name: "Romanian" },
  { code: "ro-RO", name: "Romanian (Romania)" },
  { code: "ru", name: "Russian" },
  { code: "ru-RU", name: "Russian (Russia)" },
  { code: "se-FI", name: "Sami (Inari) (Finland)" },
  { code: "se-NO", name: "Sami (Lule) (Norway)" },
  { code: "se-SE", name: "Sami (Lule) (Sweden)" },
  { code: "se", name: "Sami (Northern)" },
  { code: "se-FI", name: "Sami (Northern) (Finland)" },
  { code: "se-NO", name: "Sami (Northern) (Norway)" },
  { code: "se-SE", name: "Sami (Northern) (Sweden)" },
  { code: "se-FI", name: "Sami (Skolt) (Finland)" },
  { code: "se-NO", name: "Sami (Southern) (Norway)" },
  { code: "se-SE", name: "Sami (Southern) (Sweden)" },
  { code: "sm", name: "Samoan" },
  { code: "sa", name: "Sanskrit" },
  { code: "sa-IN", name: "Sanskrit (India)" },
  { code: "gd", name: "Scots Gaelic" },
  { code: "nso", name: "Sepedi" },
  { code: "sr", name: "Serbian" },
  { code: "sr-BA", name: "Serbian (Cyrillic) (Bosnia and Herzegovina)" },
  { code: "sr-SP", name: "Serbian (Cyrillic) (Serbia and Montenegro)" },
  { code: "sr-BA", name: "Serbian (Latin) (Bosnia and Herzegovina)" },
  { code: "sr-SP", name: "Serbian (Latin) (Serbia and Montenegro)" },
  { code: "st", name: "Sesotho" },
  { code: "sn", name: "Shona" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhala" },
  { code: "sk", name: "Slovak" },
  { code: "sk-SK", name: "Slovak (Slovakia)" },
  { code: "sl", name: "Slovenian" },
  { code: "sl-SI", name: "Slovenian (Slovenia)" },
  { code: "so", name: "Somali" },
  { code: "es", name: "Spanish" },
  { code: "es-AR", name: "Spanish (Argentina)" },
  { code: "es-BO", name: "Spanish (Bolivia)" },
  { code: "es-ES", name: "Spanish (Castilian)" },
  { code: "es-CL", name: "Spanish (Chile)" },
  { code: "es-CO", name: "Spanish (Colombia)" },
  { code: "es-CR", name: "Spanish (Costa Rica)" },
  { code: "es-DO", name: "Spanish (Dominican Republic)" },
  { code: "es-EC", name: "Spanish (Ecuador)" },
  { code: "es-SV", name: "Spanish (El Salvador)" },
  { code: "es-GT", name: "Spanish (Guatemala)" },
  { code: "es-HN", name: "Spanish (Honduras)" },
  { code: "es-MX", name: "Spanish (Mexico)" },
  { code: "es-NI", name: "Spanish (Nicaragua)" },
  { code: "es-PA", name: "Spanish (Panama)" },
  { code: "es-PY", name: "Spanish (Paraguay)" },
  { code: "es-PE", name: "Spanish (Peru)" },
  { code: "es-PR", name: "Spanish (Puerto Rico)" },
  { code: "es-ES", name: "Spanish (Spain)" },
  { code: "es-UY", name: "Spanish (Uruguay)" },
  { code: "es-VE", name: "Spanish (Venezuela)" },
  { code: "su", name: "Sundanese" },
  { code: "sw", name: "Swahili" },
  { code: "sw-KE", name: "Swahili (Kenya)" },
  { code: "sv", name: "Swedish" },
  { code: "sv-FI", name: "Swedish (Finland)" },
  { code: "sv-SE", name: "Swedish (Sweden)" },
  { code: "syr", name: "Syriac" },
  { code: "syr-SY", name: "Syriac (Syria)" },
  { code: "tl", name: "Tagalog" },
  { code: "tl-PH", name: "Tagalog (Philippines)" },
  { code: "tg", name: "Tajik" },
  { code: "ta", name: "Tamil" },
  { code: "ta-IN", name: "Tamil (India)" },
  { code: "tt", name: "Tatar" },
  { code: "tt-RU", name: "Tatar (Russia)" },
  { code: "te", name: "Telugu" },
  { code: "te-IN", name: "Telugu (India)" },
  { code: "th", name: "Thai" },
  { code: "th-TH", name: "Thai (Thailand)" },
  { code: "ti", name: "Tigrinya" },
  { code: "ts", name: "Tsonga" },
  { code: "tn", name: "Tswana" },
  { code: "tn-ZA", name: "Tswana (South Africa)" },
  { code: "tr", name: "Turkish" },
  { code: "tr-TR", name: "Turkish (Turkey)" },
  { code: "tk", name: "Turkmen" },
  { code: "ak", name: "Twi" },
  { code: "uk", name: "Ukrainian" },
  { code: "uk-UA", name: "Ukrainian (Ukraine)" },
  { code: "ur", name: "Urdu" },
  { code: "ur-PK", name: "Urdu (Islamic Republic of Pakistan)" },
  { code: "ug", name: "Uyghur" },
  { code: "uz-UZ", name: "Uzbek (Cyrillic) (Uzbekistan)" },
  { code: "uz", name: "Uzbek (Latin)" },
  { code: "uz-UZ", name: "Uzbek (Latin) (Uzbekistan)" },
  { code: "vi", name: "Vietnamese" },
  { code: "vi-VN", name: "Vietnamese (Viet Nam)" },
  { code: "cy", name: "Welsh" },
  { code: "cy-GB", name: "Welsh (United Kingdom)" },
  { code: "xh", name: "Xhosa" },
  { code: "xh-ZA", name: "Xhosa (South Africa)" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "zu", name: "Zulu" },
  { code: "zu-ZA", name: "Zulu (South Africa)" },
];

const MACRO_LANG_MAP = Object.entries(ISO6393_MACRO_LANGS).reduce(
  (prev, [curr, items]) => {
    items.forEach((macroLang) => {
      Object.keys(macroLang).forEach((macroLangCode) => {
        prev[macroLangCode] = curr;
      });
    });
    return prev;
  },
  {} as Record<string, string>,
);

const LANG_CODE_INDEX_MAP = LANG_CODE.reduce(
  (acc, cur, index) => {
    const code = cur.code.split("-")[0];
    if (acc[code]) {
      return acc;
    }
    acc[cur.code] = index;
    return acc;
  },
  {} as Record<string, number>,
);

function mapISO6393to6391(code: string) {
  return (
    ISO6393_3_TO_2[code as keyof typeof ISO6393_3_TO_2] ||
    ISO6393_3_TO_2[
      MACRO_LANG_MAP[
        code as keyof typeof MACRO_LANG_MAP
      ] as keyof typeof ISO6393_3_TO_2
    ] ||
    undefined
  );
}

/**
 * Get services sorted by priority (descending) with alphabetical sorting within each priority group
 * @param type - The type of service to filter ("word" or "sentence")
 * @param priorityMap - Optional map of service IDs to priority values (higher = higher priority)
 * @returns Sorted array of services
 */
export function getSortedServicesWithPriorities(
  type: "word" | "sentence",
  priorityMap: Record<string, number> = {},
) {
  // Default priorities
  const defaultPriorities: Record<string, number> = {
    // Custom services get priority 20
    customgpt1: 20,
    customgpt2: 20,
    customgpt3: 20,
    // Free services get priority 120
    google: 120,
    googleapi: 120,
    cnki: 120,
    haici: 120,
    youdao: 120,
    bing: 120,
    deeplx: 120,
    // Services require custom configuration get priority 110
    deeplcustom: 110,
    mtranserver: 110,
    libretranslate: 110,
    pot: 110,
    // All other services default to 100
  };

  return SERVICES.filter((service) => service.type === type).sort((a, b) => {
    // Get priorities (use custom priority if provided, otherwise use default)
    const aPriority = priorityMap[a.id] ?? defaultPriorities[a.id] ?? 100;
    const bPriority = priorityMap[b.id] ?? defaultPriorities[b.id] ?? 100;

    // Sort by priority first (descending - higher priority first)
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    // Within same priority, sort alphabetically by service ID
    return a.id.localeCompare(b.id);
  });
}

export const SVGIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" width="16" height="16" xml:space="preserve">
<style type="text/css">
.st0{fill:#64B5F6;}
.st1{fill:#1E88E5;}
</style>
<g>
<path class="st0" d="M4.4,11.1h1.4c0.1,0,0.2-0.1,0.1-0.2L5.2,8.7c0-0.1-0.2-0.1-0.3,0l-0.7,2.2C4.2,11,4.3,11.1,4.4,11.1L4.4,11.1
 z M4.4,11.1"/>
<path class="st0" d="M8.8,5H1.4C0.6,5,0,5.7,0,6.4v8.2C0,15.4,0.6,16,1.4,16h7.4c0.8,0,1.4-0.6,1.4-1.4V6.4C10.2,5.7,9.5,5,8.8,5
 L8.8,5z M7.9,14.2c-0.1,0.1-0.2,0.2-0.3,0.2c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0C7,14.3,7,14.2,7,14.1l-0.6-1.9
 C6.3,12,6.2,12,6.1,12H4c-0.1,0-0.1,0-0.2,0.1l-0.6,2c-0.1,0.1-0.1,0.2-0.3,0.3c-0.1,0.1-0.3,0.1-0.4,0.1c-0.2,0-0.3-0.1-0.3-0.2
 c0-0.1-0.1-0.2,0-0.4l2.1-6.4c0.1-0.3,0.4-0.5,0.7-0.5h0c0.3,0,0.6,0.2,0.7,0.5l0,0l2.1,6.5C8,14,8,14.1,7.9,14.2L7.9,14.2z
  M7.9,14.2"/>
<path class="st1" d="M14.3,0H7.5C6.6,0,5.8,0.8,5.8,1.7v2.1C5.8,4,6,4.1,6.1,4.1H8c0.3,0,0.5,0,0.7,0.1C8.6,3.9,8.6,3.7,8.5,3.4
 H7.6C7.4,3.4,7.3,3.3,7.3,3c0-0.3,0.1-0.5,0.3-0.5h2.8c-0.1-0.3-0.2-0.5-0.2-0.7c0-0.2,0.1-0.4,0.3-0.5c0.3-0.1,0.4,0,0.6,0.2
 c0,0.1,0.1,0.3,0.2,0.6c0.1,0.2,0.1,0.4,0.1,0.4h2.4c0.3,0,0.4,0.2,0.4,0.5c0,0.3-0.1,0.5-0.4,0.5h-0.6c-0.1,0-0.1,0-0.1,0
 C12.8,4.9,12.3,6,11.6,7c0.6,0.5,1.3,0.9,2.3,1.3c0.3,0.1,0.3,0.3,0.3,0.6c-0.1,0.2-0.3,0.3-0.6,0.2c-0.9-0.3-1.8-0.8-2.5-1.3v2.9
 c0,0.2,0.1,0.3,0.3,0.3h3c0.9,0,1.7-0.8,1.7-1.7V1.7C16,0.8,15.2,0,14.3,0L14.3,0z M14.3,0"/>
<path class="st1" d="M12,3.4H9.6c-0.1,0-0.2,0.1-0.1,0.2C9.6,4,9.7,4.4,9.9,4.8c0,0,0,0,0,0.1c0.4,0.3,0.7,0.8,0.9,1.2
 c0.2,0,0.1,0,0.3,0c0.5-0.8,0.9-1.6,1.1-2.5C12.1,3.5,12.1,3.4,12,3.4L12,3.4z M12,3.4"/>
</g>
</svg>`;
