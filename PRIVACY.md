# Privacy Policy

**Last Updated:** August 4, 2026

**Restore YouTube Dislikes & Ratios** ("the Extension") is committed to protecting your privacy. This policy outlines our data practices to ensure complete transparency.

## 1. Zero Data Collection
The Extension does **not** collect, store, transmit, or sell any personally identifiable information (PII). We do not track your browsing history, YouTube account details, analytics, or viewing habits. 

## 2. Local Storage Only
The Extension utilizes your browser's local storage API (`chrome.storage.local`) strictly to maintain functional UI preferences and usage counters for rendering logic. This data never leaves your personal device.

## 3. Third-Party APIs
To fetch community rating data, the Extension sends the current YouTube video ID (a public string of characters) to the public `returnyoutubedislikeapi.com` endpoint. No user data, cookies, or credentials are included in this network request.

## 4. Permissions Justification
* `activeTab` & `*://*.youtube.com/*`: Required to read the public video ID and inject the restored dislike UI directly into the active YouTube player DOM.
* `storage`: Required to save local user preferences and extension state.

## 5. Contact
If you have any questions regarding this privacy policy or the open-source codebase, please open an issue on our GitHub repository or contact the developer via the Chrome Web Store support tab.