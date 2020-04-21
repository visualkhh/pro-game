import LocalizedStrings from "localized-strings";
const localizationContent = require("./localization.json");
const localization: any = new LocalizedStrings(localizationContent, {
    customLanguageInterface: () => 'ko'
});
const zip = 100;
export { zip };
export default localization;
