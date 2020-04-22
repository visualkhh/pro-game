import LocalizedStrings from "localized-strings";
const localizationContent = require("./localization.json");
const localization: any = new LocalizedStrings(localizationContent, {
    customLanguageInterface: () => 'ko'
});
export {localization};
// export default localization;
